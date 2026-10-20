create type "public"."InquiryKind" as enum ('CONTACT', 'INQUIRY');

create table "public"."Inquiry" (
  "id" text not null,
  "kind" "public"."InquiryKind" not null,
  "name" text not null,
  "email" text not null,
  "phone" text,
  "message" text not null,
  "payload" jsonb,
  "created_at" timestamp(3) with time zone not null default now(),
  constraint "Inquiry_pkey" primary key ("id")
);

create index "Inquiry_created_at_idx" on "public"."Inquiry" ("created_at" desc);
