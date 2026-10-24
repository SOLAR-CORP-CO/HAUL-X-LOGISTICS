-- HAUL X initial schema sketch. Review and test before production use.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','operator','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  customer_id uuid references public.profiles(id),
  pickup_address text not null,
  delivery_address text not null,
  cargo_description text not null,
  status text not null default 'request_received',
  created_at timestamptz not null default now()
);

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  event_label text not null,
  event_location text,
  notes text,
  occurred_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.shipments enable row level security;
alter table public.tracking_events enable row level security;

-- Intentionally no permissive client policies are added here.
-- Add tested customer/admin policies before connecting a client application.
