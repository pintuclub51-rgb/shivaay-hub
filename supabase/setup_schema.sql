-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns to menu_items if they don't exist (assuming the table might exist based on types.ts)
-- Or create it if it doesn't exist.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'menu_items') THEN
        CREATE TABLE public.menu_items (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            category_id UUID REFERENCES public.categories(id),
            name TEXT NOT NULL,
            description TEXT,
            price NUMERIC NOT NULL,
            image_url TEXT,
            is_available BOOLEAN DEFAULT true,
            prep_time_minutes INTEGER DEFAULT 15,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    ELSE
        -- Alter existing table to add missing columns from the plan
        -- The existing table has: id, category (text), name, price, status (text), image (text), created_at
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' and column_name='description') THEN
            ALTER TABLE public.menu_items ADD COLUMN description TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' and column_name='image_url') THEN
            ALTER TABLE public.menu_items ADD COLUMN image_url TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' and column_name='is_available') THEN
            ALTER TABLE public.menu_items ADD COLUMN is_available BOOLEAN DEFAULT true;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' and column_name='prep_time_minutes') THEN
            ALTER TABLE public.menu_items ADD COLUMN prep_time_minutes INTEGER DEFAULT 15;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' and column_name='category_id') THEN
            ALTER TABLE public.menu_items ADD COLUMN category_id UUID REFERENCES public.categories(id);
        END IF;
    END IF;
END $$;

-- Orders table create or update
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
        CREATE TABLE public.orders (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            total_amount NUMERIC NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' and column_name='total_amount') THEN
            ALTER TABLE public.orders ADD COLUMN total_amount NUMERIC NOT NULL DEFAULT 0;
        END IF;
    END IF;
END $$;

-- Order items
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items') THEN
        CREATE TABLE public.order_items (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
            menu_item_id UUID REFERENCES public.menu_items(id),
            quantity INTEGER NOT NULL,
            price_at_time NUMERIC NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' and column_name='price_at_time') THEN
            ALTER TABLE public.order_items ADD COLUMN price_at_time NUMERIC NOT NULL DEFAULT 0;
        END IF;
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories." ON public.categories FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update categories." ON public.categories FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete categories." ON public.categories FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Menu Items Policies
CREATE POLICY "Menu items are viewable by everyone." ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Admins can insert menu items." ON public.menu_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update menu items." ON public.menu_items FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete menu items." ON public.menu_items FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Orders Policies
CREATE POLICY "Anyone can insert an order." ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all orders." ON public.orders FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update orders." ON public.orders FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Order Items Policies
CREATE POLICY "Anyone can insert order items." ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all order items." ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Set up Storage for food images
INSERT INTO storage.buckets (id, name, public) VALUES ('food-images', 'food-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Food images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'food-images');
CREATE POLICY "Admins can upload food images." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'food-images' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update food images." ON storage.objects FOR UPDATE USING (bucket_id = 'food-images' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete food images." ON storage.objects FOR DELETE USING (bucket_id = 'food-images' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
