create extension if not exists "pgcrypto";

create table if not exists "Users" (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text,
  created_at timestamptz not null default now()
);

create table if not exists "BusinessPages" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references "Users" (id) on delete cascade,
  subdomain text unique not null,
  name text not null,
  tagline text,
  whatsapp text,
  phone text,
  instagram text,
  about text,
  services jsonb not null default '[]'::jsonb,
  brand_color text not null default '#22C55E',
  logo_url text,
  media_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists "Reviews" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references "BusinessPages" (id) on delete cascade,
  user_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

create table if not exists "Analytics" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references "BusinessPages" (id) on delete cascade,
  event_type text not null,
  source text not null default 'direct',
  created_at timestamptz not null default now()
);

create table if not exists "Subscriptions" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references "Users" (id) on delete cascade,
  plan_type text not null check (plan_type in ('free', 'pro', 'enterprise')),
  status text not null,
  stripe_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists business_pages_updated_at on "BusinessPages";
create trigger business_pages_updated_at
before update on "BusinessPages"
for each row execute function update_updated_at_column();

drop trigger if exists subscriptions_updated_at on "Subscriptions";
create trigger subscriptions_updated_at
before update on "Subscriptions"
for each row execute function update_updated_at_column();
