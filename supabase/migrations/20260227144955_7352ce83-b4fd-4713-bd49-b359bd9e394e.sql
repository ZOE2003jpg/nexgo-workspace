-- Drop dangerous policy that allows users to directly update their wallet balance
DROP POLICY IF EXISTS "Users update own wallet" ON public.wallets;

-- Add updated_at auto-update trigger for orders table
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_orders_updated_at();

-- Make dispatch fee configurable via platform_settings
INSERT INTO public.platform_settings (key, value)
VALUES ('dispatch_fee', 250)
ON CONFLICT (key) DO NOTHING;