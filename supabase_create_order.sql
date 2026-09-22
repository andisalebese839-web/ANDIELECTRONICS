-- Secure public checkout function for ANDI ELECTRONICS
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


-- Status workflow fix
-- Allows the admin to move an order through the full customer-facing workflow.
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


-- Admin security for the order dashboard.
-- Only the authenticated owner account may read/update orders.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt()->>'email','') = 'andisalebese839@gmail.com';
$$;

drop policy if exists "Admins can view orders" on public.orders;
drop policy if exists "Admins can update orders" on public.orders;
drop policy if exists "Admins can insert orders" on public.orders;

create policy "Admins can view orders"
on public.orders
for select
to authenticated
using (public.is_admin());

create policy "Admins can update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Public checkout continues to use the security-definer create_order() RPC,
-- so no public INSERT policy is needed.
