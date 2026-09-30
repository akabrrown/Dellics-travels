# hotel-dump-sync Edge Function

## Deploy
```bash
supabase functions deploy hotel-dump-sync --project-ref lmmhzqrulehhwgklkahw
```

## Secrets (set once in Supabase dashboard or via CLI)
```bash
supabase secrets set RATEHAWK_KEY_ID=<your_id> --project-ref lmmhzqrulehhwgklkahw
supabase secrets set RATEHAWK_API_KEY=<your_key> --project-ref lmmhzqrulehhwgklkahw
supabase secrets set RATEHAWK_BASE_URL=https://api.ratehawk.com/api/b2b/v3 --project-ref lmmhzqrulehhwgklkahw
```

## Schedule via pg_cron (run in Supabase SQL Editor)
See: supabase/functions/hotel-dump-sync/schedule.sql

## Manual trigger (incremental)
```bash
curl -X POST "https://lmmhzqrulehhwgklkahw.supabase.co/functions/v1/hotel-dump-sync?type=incremental" \
  -H "Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>"
```
