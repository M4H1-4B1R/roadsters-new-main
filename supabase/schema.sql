-- Categories
create table categories (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  name_ar text,
  description text,
  description_ar text,
  image_url text,
  parent_id bigint references categories(id),
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Products
create table products (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  name_ar text,
  description text,
  description_ar text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  category_id bigint references categories(id),
  stock int default 0,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- Product images
create table product_images (
  id bigserial primary key,
  product_id bigint references products(id) on delete cascade,
  image_url text not null,
  is_primary boolean default false,
  sort_order int default 0
);

-- Product videos
create table product_videos (
  id bigserial primary key,
  product_id bigint references products(id) on delete cascade,
  video_url text not null,
  thumbnail_url text,
  sort_order int default 0
);

-- Variations (e.g. "Size", "Color")
create table variations (
  id bigserial primary key,
  product_id bigint references products(id) on delete cascade,
  name text not null,
  name_ar text
);

-- Variation options (e.g. "Small", "Medium", "Large" for Size)
create table variation_options (
  id bigserial primary key,
  variation_id bigint references variations(id) on delete cascade,
  value text not null,
  value_ar text
);

-- Variation combinations (specific SKUs, e.g. "Small + Red")
create table variation_combinations (
  id bigserial primary key,
  product_id bigint references products(id) on delete cascade,
  option_ids bigint[] not null,
  price numeric(10,2),
  stock int default 0,
  sku text
);

-- Banners (homepage hero)
create table banners (
  id bigserial primary key,
  title text,
  title_ar text,
  subtitle text,
  subtitle_ar text,
  image_url text not null,
  link_url text,
  sort_order int default 0,
  is_active boolean default true
);

-- Swipers (homepage carousel)
create table swipers (
  id bigserial primary key,
  image_url text not null,
  link_url text,
  sort_order int default 0,
  is_active boolean default true
);

-- Sections (homepage grouped products)
create table sections (
  id bigserial primary key,
  title text not null,
  title_ar text,
  product_ids bigint[],
  sort_order int default 0,
  is_active boolean default true
);

-- Shipping options
create table shipping_options (
  id bigserial primary key,
  name text not null,
  name_ar text,
  price numeric(10,2) not null,
  delivery_time text,
  is_active boolean default true
);

-- Coupons
create table coupons (
  id bigserial primary key,
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null,
  min_order_amount numeric(10,2) default 0,
  usage_limit int,
  used_count int default 0,
  expires_at timestamptz,
  is_active boolean default true
);

-- Orders
create table orders (
  id bigserial primary key,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_address text not null,
  shipping_option_id bigint references shipping_options(id),
  shipping_fee numeric(10,2) default 0,
  coupon_code text,
  discount numeric(10,2) default 0,
  subtotal numeric(10,2) not null,
  total numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method text default 'cod',
  notes text,
  created_at timestamptz default now()
);

-- Order items
create table order_items (
  id bigserial primary key,
  order_id bigint references orders(id) on delete cascade,
  product_id bigint references products(id),
  product_name text not null,
  variation_label text,
  unit_price numeric(10,2) not null,
  quantity int not null,
  subtotal numeric(10,2) not null
);

-- Newsletter
create table newsletter_subscribers (
  id bigserial primary key,
  email text unique not null,
  created_at timestamptz default now()
);
