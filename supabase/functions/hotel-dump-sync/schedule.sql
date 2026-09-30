-- Run in Supabase SQL Editor to schedule the hotel dump sync
-- Requires pg_cron extension (enabled by default in Supabase)

-- Enable pg_cron if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Daily incremental dump at 03:00 UTC
SELECT cron.schedule(
  'hotel-dump-incremental',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://lmmhzqrulehhwgklkahw.supabase.co/functions/v1/hotel-dump-sync?type=incremental',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Weekly full dump at 02:00 UTC on Sundays
SELECT cron.schedule(
  'hotel-dump-full',
  '0 2 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://lmmhzqrulehhwgklkahw.supabase.co/functions/v1/hotel-dump-sync?type=full',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
