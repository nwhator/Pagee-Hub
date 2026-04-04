create extension if not exists "pgcrypto";

create table if not exists "Users" (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text,
  country_code text,
  created_at timestamptz not null default now()
);

create table if not exists "BusinessPages" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references "Users" (id) on delete cascade,
  subdomain text unique not null,
  custom_domain text,
  name text not null,
  tagline text,
  whatsapp text,
  phone text,
  instagram text,
  about text,
  services jsonb not null default '[]'::jsonb,
  show_branding boolean not null default true,
  brand_color text not null default '#22C55E',
  accent_color text not null default '#16A34A',
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
  plan text not null check (plan in ('free', 'pro')),
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  provider text not null default 'stripe' check (provider in ('stripe', 'flutterwave')),
  status text not null check (status in ('active', 'canceled', 'past_due')),
  provider_transaction_id text,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists subscriptions_user_id_idx on "Subscriptions" (user_id);

alter table if exists "Users" add column if not exists country_code text;
alter table if exists "BusinessPages" add column if not exists custom_domain text;
alter table if exists "BusinessPages" add column if not exists show_branding boolean not null default true;
alter table if exists "BusinessPages" add column if not exists accent_color text;
alter table if exists "Subscriptions" add column if not exists plan text;
alter table if exists "Subscriptions" add column if not exists billing_cycle text;
alter table if exists "Subscriptions" add column if not exists provider text;
alter table if exists "Subscriptions" add column if not exists provider_transaction_id text;
alter table if exists "Subscriptions" add column if not exists stripe_customer_id text;
alter table if exists "Subscriptions" add column if not exists stripe_subscription_id text;
alter table if exists "Subscriptions" add column if not exists current_period_end timestamptz;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'Subscriptions'
      and column_name = 'plan_type'
  ) then
    execute 'update "Subscriptions"
             set plan = coalesce(plan, case when plan_type = ''pro'' then ''pro'' else ''free'' end)
             where plan is null';
  else
    update "Subscriptions"
    set plan = coalesce(plan, 'free')
    where plan is null;
  end if;
end
$$;

update "Subscriptions"
set billing_cycle = coalesce(billing_cycle, 'monthly')
where billing_cycle is null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'Subscriptions'
      and column_name = 'stripe_id'
  ) then
    execute 'update "Subscriptions"
             set stripe_subscription_id = coalesce(stripe_subscription_id, stripe_id)
             where stripe_subscription_id is null';
  end if;
end
$$;

update "Subscriptions"
set provider = coalesce(provider, 'stripe')
where provider is null;

update "BusinessPages"
set accent_color = coalesce(accent_color, '#16A34A')
where accent_color is null;

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
