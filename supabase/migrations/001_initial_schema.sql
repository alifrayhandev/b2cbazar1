-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
create table if not exists products (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  slug                text not null unique,
  description         text,
  price               numeric(10,2) not null check (price >= 0),
  sale_price          numeric(10,2) check (sale_price >= 0),
  stock_quantity      integer not null default 0 check (stock_quantity >= 0),
  category            text,
  image_url           text,
  is_featured         boolean not null default false,
  is_active           boolean not null default true,
  is_draft            boolean not null default false,
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists products_slug_idx on products(slug);
create index if not exists products_category_idx on products(category);
create index if not exists products_is_active_idx on products(is_active);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  order_reference   text not null unique,
  customer_name     text not null,
  customer_phone    text not null,
  delivery_address  text not null,
  delivery_area     text not null check (delivery_area in ('inside_dhaka','outside_dhaka')),
  order_notes       text,
  subtotal          numeric(10,2) not null check (subtotal >= 0),
  delivery_fee      numeric(10,2) not null check (delivery_fee >= 0),
  total_amount      numeric(10,2) not null check (total_amount >= 0),
  payment_method    text not null default 'cod' check (payment_method = 'cod'),
  status            text not null default 'pending'
                      check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','returned')),
  admin_notes       text,
  courier_name      text,
  tracking_number   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists orders_reference_idx on orders(order_reference);

-- ─── ORDER ITEMS ─────────────────────────────────────────────────────────────
create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid references products(id) on delete set null,
  product_name  text not null,
  product_price numeric(10,2) not null check (product_price >= 0),
  quantity      integer not null check (quantity > 0),
  line_total    numeric(10,2) not null check (line_total >= 0)
);

create index if not exists order_items_order_id_idx on order_items(order_id);

-- ─── STORE SETTINGS ──────────────────────────────────────────────────────────
create table if not exists store_settings (
  id                              uuid primary key default gen_random_uuid(),
  whatsapp_number                 text not null default '8801350526254',
  delivery_charge_inside_dhaka    numeric(10,2) not null default 60,
  delivery_charge_outside_dhaka   numeric(10,2) not null default 120,
  low_stock_threshold             integer not null default 5,
  store_name                      text not null default 'B2C Bazar',
  store_email                     text,
  store_phone                     text,
  announcement                    text,
  currency_symbol                 text not null default '৳',
  updated_at                      timestamptz not null default now()
);

-- Insert default settings row (only one row ever)
insert into store_settings (id) values (gen_random_uuid())
on conflict do nothing;

-- ─── INVENTORY ADJUSTMENTS ───────────────────────────────────────────────────
create table if not exists inventory_adjustments (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  adjustment  integer not null,
  reason      text,
  created_at  timestamptz not null default now()
);

create index if not exists inv_adj_product_idx on inventory_adjustments(product_id);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

create trigger store_settings_updated_at before update on store_settings
  for each row execute function update_updated_at();

-- ─── ATOMIC ORDER CREATION RPC ───────────────────────────────────────────────
-- Creates order + items + deducts stock atomically with row locking
create or replace function create_order(
  p_order_reference   text,
  p_customer_name     text,
  p_customer_phone    text,
  p_delivery_address  text,
  p_delivery_area     text,
  p_order_notes       text,
  p_items             jsonb  -- [{product_id, quantity}]
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_product         record;
  v_item            jsonb;
  v_subtotal        numeric(10,2) := 0;
  v_delivery_fee    numeric(10,2);
  v_total           numeric(10,2);
  v_order_id        uuid;
  v_settings        record;
  v_effective_price numeric(10,2);
begin
  -- Load settings
  select * into v_settings from store_settings limit 1;

  -- Determine delivery fee
  if p_delivery_area = 'inside_dhaka' then
    v_delivery_fee := v_settings.delivery_charge_inside_dhaka;
  else
    v_delivery_fee := v_settings.delivery_charge_outside_dhaka;
  end if;

  -- Lock products and validate stock
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product
    from products
    where id = (v_item->>'product_id')::uuid
      and is_active = true
      and is_draft = false
    for update;

    if not found then
      raise exception 'Product not found or unavailable: %', v_item->>'product_id';
    end if;

    if v_product.stock_quantity < (v_item->>'quantity')::integer then
      raise exception 'Insufficient stock for product: %', v_product.name;
    end if;

    v_effective_price := coalesce(v_product.sale_price, v_product.price);
    v_subtotal := v_subtotal + v_effective_price * (v_item->>'quantity')::integer;
  end loop;

  v_total := v_subtotal + v_delivery_fee;

  -- Create order
  insert into orders (
    order_reference, customer_name, customer_phone,
    delivery_address, delivery_area, order_notes,
    subtotal, delivery_fee, total_amount, payment_method, status
  ) values (
    p_order_reference, p_customer_name, p_customer_phone,
    p_delivery_address, p_delivery_area, p_order_notes,
    v_subtotal, v_delivery_fee, v_total, 'cod', 'pending'
  ) returning id into v_order_id;

  -- Insert items and deduct stock
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products
    where id = (v_item->>'product_id')::uuid for update;

    v_effective_price := coalesce(v_product.sale_price, v_product.price);

    insert into order_items (order_id, product_id, product_name, product_price, quantity, line_total)
    values (
      v_order_id,
      v_product.id,
      v_product.name,
      v_effective_price,
      (v_item->>'quantity')::integer,
      v_effective_price * (v_item->>'quantity')::integer
    );

    update products
    set stock_quantity = stock_quantity - (v_item->>'quantity')::integer
    where id = v_product.id;
  end loop;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_reference', p_order_reference,
    'total_amount', v_total,
    'delivery_fee', v_delivery_fee,
    'subtotal', v_subtotal
  );
end;
$$;

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table store_settings enable row level security;
alter table inventory_adjustments enable row level security;

-- Products: public read of active non-draft products
create policy "public_read_active_products" on products
  for select using (is_active = true and is_draft = false);

-- Products: admin full access
create policy "admin_all_products" on products
  for all using (auth.role() = 'authenticated');

-- Orders: no public read (customers get confirmation via order_reference only)
create policy "admin_all_orders" on orders
  for all using (auth.role() = 'authenticated');

-- Order items: admin only
create policy "admin_all_order_items" on order_items
  for all using (auth.role() = 'authenticated');

-- Store settings: public read, admin write
create policy "public_read_settings" on store_settings
  for select using (true);

create policy "admin_write_settings" on store_settings
  for all using (auth.role() = 'authenticated');

-- Inventory adjustments: admin only
create policy "admin_all_inventory" on inventory_adjustments
  for all using (auth.role() = 'authenticated');
