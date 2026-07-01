create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'driver', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  label text not null default 'Home',
  address text not null,
  city text,
  pincode text,
  phone text,
  latitude numeric(10, 7) default 22.5726,
  longitude numeric(10, 7) default 88.3639,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  original_id integer unique,
  name text not null,
  rating numeric(2, 1) default 4.0,
  delivery_time text,
  address text,
  image text,
  cuisine text,
  cost_for_two integer,
  latitude numeric(10, 7) default 22.5726,
  longitude numeric(10, 7) default 88.3639,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  original_id integer unique,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price integer not null check (price >= 0),
  original_price integer,
  image text,
  rating numeric(2, 1) default 4.2,
  add_ons jsonb not null default '[]'::jsonb,
  is_veg boolean default false,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  name text not null,
  phone text,
  vehicle_number text,
  current_status text not null default 'available' check (current_status in ('available', 'assigned', 'delivering', 'offline')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.users(id) on delete set null,
  restaurant_id uuid references public.restaurants(id) on delete set null,
  driver_id uuid references public.drivers(id) on delete set null,
  status text not null default 'placed' check (status in ('placed', 'accepted', 'preparing', 'picked_up', 'on_the_way', 'delivered', 'cancelled')),
  payment_method text,
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  gst integer not null default 0,
  platform_fee integer not null default 0,
  discount integer not null default 0,
  total integer not null default 0,
  delivery_address jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  item_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null default 0,
  add_ons jsonb not null default '[]'::jsonb,
  line_total integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.driver_locations (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.drivers(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  latitude numeric(10, 7) not null,
  longitude numeric(10, 7) not null,
  heading numeric(5, 2) default 0,
  updated_at timestamptz not null default now(),
  unique (driver_id)
);

create table if not exists public.delivery_assignments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  driver_id uuid not null references public.drivers(id) on delete cascade,
  status text not null default 'assigned' check (status in ('assigned', 'accepted', 'picked_up', 'on_the_way', 'delivered', 'cancelled')),
  assigned_at timestamptz not null default now(),
  accepted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, driver_id)
);

create table if not exists public.order_status_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at before update on public.users for each row execute function public.set_updated_at();
drop trigger if exists user_addresses_set_updated_at on public.user_addresses;
create trigger user_addresses_set_updated_at before update on public.user_addresses for each row execute function public.set_updated_at();
drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists restaurants_set_updated_at on public.restaurants;
create trigger restaurants_set_updated_at before update on public.restaurants for each row execute function public.set_updated_at();
drop trigger if exists menu_items_set_updated_at on public.menu_items;
create trigger menu_items_set_updated_at before update on public.menu_items for each row execute function public.set_updated_at();
drop trigger if exists drivers_set_updated_at on public.drivers;
create trigger drivers_set_updated_at before update on public.drivers for each row execute function public.set_updated_at();
drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();
drop trigger if exists order_items_set_updated_at on public.order_items;
create trigger order_items_set_updated_at before update on public.order_items for each row execute function public.set_updated_at();
drop trigger if exists delivery_assignments_set_updated_at on public.delivery_assignments;
create trigger delivery_assignments_set_updated_at before update on public.delivery_assignments for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.user_addresses enable row level security;
alter table public.categories enable row level security;
alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.drivers enable row level security;
alter table public.driver_locations enable row level security;
alter table public.delivery_assignments enable row level security;
alter table public.order_status_logs enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'users', 'user_addresses', 'categories', 'restaurants', 'menu_items', 'orders', 'order_items',
    'drivers', 'driver_locations', 'delivery_assignments', 'order_status_logs'
  ]
  loop
    execute format('drop policy if exists "dev anon read %1$s" on public.%1$I', table_name);
    execute format('drop policy if exists "dev anon write %1$s" on public.%1$I', table_name);
    execute format('create policy "dev anon read %1$s" on public.%1$I for select to anon, authenticated using (true)', table_name);
    execute format('create policy "dev anon write %1$s" on public.%1$I for all to anon, authenticated using (true) with check (true)', table_name);
  end loop;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.orders;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.order_items;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.driver_locations;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.delivery_assignments;
exception when duplicate_object then null;
end $$;
