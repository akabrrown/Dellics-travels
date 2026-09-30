import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const BATCH_SIZE = 500;

// Sanitize RateHawk image URL template placeholder
function sanitizeImageUrl(url: string): string {
  return url.replace('{size}', '1024x768').replace('%7Bsize%7D', '1024x768');
}

// Map a raw dump record to a hotel_static_cache row
function mapRecord(record: Record<string, unknown>): Record<string, unknown> | null {
  const id = record['id'];
  if (!id || typeof id !== 'string') return null;

  const images: string[] = [];
  const rawImages = record['images'];
  if (Array.isArray(rawImages)) {
    for (const img of rawImages) {
      const url = typeof img === 'string' ? img : (img as any)?.url ?? '';
      if (url) images.push(sanitizeImageUrl(url));
    }
  }
  const rawImagesExt = record['images_ext'];
  if (Array.isArray(rawImagesExt)) {
    for (const img of rawImagesExt) {
      const url = typeof img === 'string' ? img : (img as any)?.url ?? '';
      if (url && !images.includes(url)) images.push(sanitizeImageUrl(url));
    }
  }

  const amenities: string[] = [];
  const amenityGroups = record['amenity_groups'];
  if (Array.isArray(amenityGroups)) {
    for (const group of amenityGroups) {
      if (Array.isArray((group as any)?.amenities)) {
        for (const item of (group as any).amenities) {
          if (typeof item === 'string' && item.trim() && !amenities.includes(item)) {
            amenities.push(item);
          }
          if (amenities.length >= 8) break;
        }
      }
      if (amenities.length >= 8) break;
    }
  }

  const region = record['region'] as Record<string, unknown> | undefined;
  const descStruct = record['description_struct'];
  const description =
    (Array.isArray(descStruct) && Array.isArray((descStruct[0] as any)?.paragraphs))
      ? (descStruct[0] as any).paragraphs[0] ?? null
      : (typeof record['description'] === 'string' ? record['description'] : null);

  return {
    id,
    name: String(record['name'] ?? record['title'] ?? id),
    star_rating: Number(record['star_rating'] ?? 0),
    address: record['address'] ? String(record['address']) : null,
    city: region?.['name'] ? String(region['name']) : null,
    country_code: region?.['country_code'] ? String(region['country_code']) : null,
    latitude: record['latitude'] != null ? Number(record['latitude']) : null,
    longitude: record['longitude'] != null ? Number(record['longitude']) : null,
    images,
    amenities,
    description,
    synced_at: new Date().toISOString(),
  };
}

Deno.serve(async (req: Request) => {
  // Allow Supabase cron scheduler (service role secret in Authorization header)
  const authHeader = req.headers.get('Authorization') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const dumpType = url.searchParams.get('type') === 'full' ? 'full' : 'incremental';

  const ratehawkBase = (Deno.env.get('RATEHAWK_BASE_URL') ?? 'https://api.ratehawk.com/api/b2b/v3')
    .replace(/\/api\/b2b\/v3.*$/, '');
  const apiId = Deno.env.get('RATEHAWK_KEY_ID') ?? Deno.env.get('RATEHAWK_API_ID') ?? '';
  const apiKey = Deno.env.get('RATEHAWK_API_KEY') ?? '';
  const authB64 = btoa(`${apiId}:${apiKey}`);

  const endpoint = dumpType === 'full' ? '/hotel/info/dump/' : '/hotel/info/incremental_dump/';
  const dumpUrl = `${ratehawkBase}/api/b2b/v3${endpoint}`;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    serviceKey,
  );

  let upserted = 0;
  let errors = 0;

  try {
    const dumpRes = await fetch(dumpUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authB64}`,
        'Content-Type': 'application/json',
        Accept: 'application/octet-stream',
      },
      body: JSON.stringify({ language: 'en' }),
    });

    if (!dumpRes.ok) {
      return new Response(
        JSON.stringify({ error: `RateHawk dump HTTP ${dumpRes.status}` }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!dumpRes.body) {
      return new Response(JSON.stringify({ error: 'Empty dump response' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const decoder = new TextDecoder();
    let buffer = '';
    const batch: Record<string, unknown>[] = [];

    const flushBatch = async (rows: Record<string, unknown>[]) => {
      if (rows.length === 0) return;
      const { error } = await supabase
        .from('hotel_static_cache')
        .upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error('Upsert error:', error.message);
        errors += rows.length;
      } else {
        upserted += rows.length;
      }
    };

    const reader = dumpRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const record = JSON.parse(line);
          const row = mapRecord(record);
          if (row) {
            batch.push(row);
            if (batch.length >= BATCH_SIZE) {
              await flushBatch(batch.splice(0, BATCH_SIZE));
            }
          }
        } catch {
          errors++;
        }
      }
    }

    // Flush remaining buffer line
    if (buffer.trim()) {
      try {
        const record = JSON.parse(buffer);
        const row = mapRecord(record);
        if (row) batch.push(row);
      } catch { /* ignore */ }
    }

    if (batch.length > 0) {
      await flushBatch(batch);
    }

    return new Response(
      JSON.stringify({ type: dumpType, upserted, errors }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
