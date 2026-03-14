
-- Add status column to menu_items
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- Add payment_type and pickup_time to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_type text NOT NULL DEFAULT 'cash';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pickup_time integer NOT NULL DEFAULT 20;

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_timer_minutes integer NOT NULL DEFAULT 20,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for settings (public read, public write for admin)
CREATE POLICY "Anyone can view settings" ON public.settings FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can update settings" ON public.settings FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can insert settings" ON public.settings FOR INSERT TO public WITH CHECK (true);

-- Create storage bucket for food images
INSERT INTO storage.buckets (id, name, public) VALUES ('food-images', 'food-images', true) ON CONFLICT DO NOTHING;

-- Storage RLS for food-images bucket
CREATE POLICY "Anyone can view food images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'food-images');
CREATE POLICY "Anyone can upload food images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'food-images');
CREATE POLICY "Anyone can update food images" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'food-images');
CREATE POLICY "Anyone can delete food images" ON storage.objects FOR DELETE TO public USING (bucket_id = 'food-images');
