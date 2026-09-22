-- ANDI ELECTRONICS: ADMIN SETUP
-- Run this entire query once in Supabase SQL Editor.

-- 1. Make the order-status constraint safe to recreate.
alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (
    status in (
      'Order received',
      'Order accepted',
      'Preparing order',
      'Shipped',
      'Out for delivery',
      'Delivered',
      'Order delivered'
    )
  );

-- 2. Public checkout function.
create or replace function public.create_order(order_data jsonb)
returns table (
  order_number text,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if nullif(trim(order_data->>'order_number'),'') is null then
    raise exception 'Order number is required';
  end if;

  if nullif(trim(order_data->>'customer_name'),'') is null then
    raise exception 'Customer name is required';
  end if;

  if nullif(trim(order_data->>'customer_email'),'') is null then
    raise exception 'Customer email is required';
  end if;

  if nullif(trim(order_data->>'customer_phone'),'') is null then
    raise exception 'Customer phone is required';
  end if;

  if order_data->>'fulfilment' not in ('Collection','Delivery') then
    raise exception 'Invalid fulfilment option';
  end if;

  insert into public.orders (
    order_number,
    customer_name,
    customer_email,
    customer_phone,
    fulfilment,
    delivery_area,
    delivery_address,
    products,
    product_total,
    installation_total,
    delivery_fee,
    order_total,
    additional_instructions
  )
  values (
    trim(order_data->>'order_number'),
    trim(order_data->>'customer_name'),
    trim(order_data->>'customer_email'),
    trim(order_data->>'customer_phone'),
    order_data->>'fulfilment',
    coalesce(order_data->>'delivery_area',''),
    coalesce(order_data->>'delivery_address',''),
    coalesce(order_data->'products','[]'::jsonb),
    coalesce((order_data->>'product_total')::numeric,0),
    coalesce((order_data->>'installation_total')::numeric,0),
    coalesce((order_data->>'delivery_fee')::numeric,0),
    coalesce((order_data->>'order_total')::numeric,0),
    coalesce(order_data->>'additional_instructions','')
  );

  return query
  select o.order_number, o.status
  from public.orders o
  where o.order_number = trim(order_data->>'order_number')
  limit 1;
end;
$$;

revoke all on function public.create_order(jsonb) from public;
grant execute on function public.create_order(jsonb) to anon, authenticated;

-- 3. Admin check.
-- Your website admin login must use this email.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt()->>'email','') = 'andisalebese839@gmail.com';
$$;

-- 4. Remove old order policies so they cannot conflict.
drop policy if exists "Admins can view orders" on public.orders;
drop policy if exists "Admins can update orders" on public.orders;
drop policy if exists "Admins can insert orders" on public.orders;

-- 5. Only the authenticated admin can read orders.
create policy "Admins can view orders"
on public.orders
for select
to authenticated
using (public.is_admin());

-- 6. Only the authenticated admin can change order status.
create policy "Admins can update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 7. Ensure RLS is enabled.
alter table public.orders enable row level security;

-- 8. Make sure the public checkout RPC is callable.
grant execute on function public.create_order(jsonb) to anon;
grant execute on function public.create_order(jsonb) to authenticated;
