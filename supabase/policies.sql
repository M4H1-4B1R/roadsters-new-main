-- Enable Row Level Security on all tables
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_videos enable row level security;
alter table variations enable row level security;
alter table variation_options enable row level security;
alter table variation_combinations enable row level security;
alter table banners enable row level security;
alter table swipers enable row level security;
alter table sections enable row level security;
alter table shipping_options enable row level security;
alter table coupons enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table newsletter_subscribers enable row level security;

-- Public read on all storefront-facing tables
create policy "public read" on categories for select using (true);
create policy "public read" on products for select using (true);
create policy "public read" on product_images for select using (true);
create policy "public read" on product_videos for select using (true);
create policy "public read" on variations for select using (true);
create policy "public read" on variation_options for select using (true);
create policy "public read" on variation_combinations for select using (true);
create policy "public read" on banners for select using (true);
create policy "public read" on swipers for select using (true);
create policy "public read" on sections for select using (true);
create policy "public read" on shipping_options for select using (true);
create policy "public read" on coupons for select using (true);

-- Public insert (anyone can place orders, subscribe to newsletter)
create policy "public insert" on orders for insert with check (true);
create policy "public insert" on order_items for insert with check (true);
create policy "public insert" on newsletter_subscribers for insert with check (true);
