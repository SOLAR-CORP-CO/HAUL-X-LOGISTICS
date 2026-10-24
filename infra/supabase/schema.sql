create extension if not exists pgcrypto;
create table if not exists public.enquiries (
 id uuid primary key default gen_random_uuid(), reference text not null unique,
 customer_name text not null check(char_length(customer_name) between 2 and 120),
 email text not null,pickup text not null,delivery text not null,
 cargo_category text not null,transport_mode text not null,shipment_type text not null,packaging_type text not null,
 quantity integer not null check(quantity>0),weight_kg numeric(14,2) not null check(weight_kg>0),
 length_cm numeric(14,2),width_cm numeric(14,2),height_cm numeric(14,2),notes text not null default '',
 status text not null default 'new' check(status in('new','under_review','quoted','confirmed','completed','cancelled')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index if not exists enquiries_created_idx on public.enquiries(created_at desc);
create index if not exists enquiries_status_idx on public.enquiries(status);
alter table public.enquiries enable row level security;
-- No public or authenticated policies. Access only through the server-side service role.
