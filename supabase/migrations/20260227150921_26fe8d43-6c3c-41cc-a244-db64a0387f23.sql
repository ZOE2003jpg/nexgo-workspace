
-- Admin role management function
CREATE OR REPLACE FUNCTION public.admin_set_user_role(_admin_id uuid, _target_user_id uuid, _new_role app_role)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT has_role(_admin_id, 'admin') THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized');
  END IF;

  -- Prevent admin from demoting themselves
  IF _admin_id = _target_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Cannot change your own role');
  END IF;

  -- Upsert the role
  INSERT INTO user_roles (user_id, role)
  VALUES (_target_user_id, _new_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Delete old roles that aren't the new one
  DELETE FROM user_roles WHERE user_id = _target_user_id AND role != _new_role;

  RETURN jsonb_build_object('success', true, 'message', 'Role updated to ' || _new_role::text);
END;
$$;

-- Admin update platform settings function
CREATE OR REPLACE FUNCTION public.admin_update_setting(_admin_id uuid, _key text, _value integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(_admin_id, 'admin') THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized');
  END IF;

  INSERT INTO platform_settings (key, value, updated_by)
  VALUES (_key, _value, _admin_id)
  ON CONFLICT (key) DO UPDATE SET value = _value, updated_by = _admin_id, updated_at = now();

  RETURN jsonb_build_object('success', true, 'message', 'Setting updated');
END;
$$;

-- Add unique constraint on platform_settings.key if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'platform_settings_key_key') THEN
    ALTER TABLE platform_settings ADD CONSTRAINT platform_settings_key_key UNIQUE (key);
  END IF;
END $$;

-- Clean up test data: order_items, orders, menu_items, restaurants, wallet_transactions, wallets, user_roles, profiles for test users
-- Keep admin@nexgo.test (73b448d0-3d16-49d6-ad55-5ad21d562201)
DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE student_id IN ('1fe957a0-d6db-4d21-b4e7-414738d629ac'));
DELETE FROM orders WHERE student_id = '1fe957a0-d6db-4d21-b4e7-414738d629ac';
DELETE FROM menu_items WHERE restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = 'c3267ffb-9635-4805-8667-7cff4c51df8f');
DELETE FROM restaurants WHERE owner_id = 'c3267ffb-9635-4805-8667-7cff4c51df8f';
DELETE FROM wallet_transactions WHERE user_id IN ('1fe957a0-d6db-4d21-b4e7-414738d629ac','c3267ffb-9635-4805-8667-7cff4c51df8f','a040d57c-bf1a-4502-8a26-b7f921a2ee86');
DELETE FROM wallets WHERE user_id IN ('1fe957a0-d6db-4d21-b4e7-414738d629ac','c3267ffb-9635-4805-8667-7cff4c51df8f','a040d57c-bf1a-4502-8a26-b7f921a2ee86');
DELETE FROM user_roles WHERE user_id IN ('1fe957a0-d6db-4d21-b4e7-414738d629ac','c3267ffb-9635-4805-8667-7cff4c51df8f','a040d57c-bf1a-4502-8a26-b7f921a2ee86');
DELETE FROM profiles WHERE id IN ('1fe957a0-d6db-4d21-b4e7-414738d629ac','c3267ffb-9635-4805-8667-7cff4c51df8f','a040d57c-bf1a-4502-8a26-b7f921a2ee86');

-- Seed default platform settings
INSERT INTO platform_settings (key, value) VALUES ('dispatch_fee', 250) ON CONFLICT (key) DO NOTHING;
INSERT INTO platform_settings (key, value) VALUES ('delivery_fee', 150) ON CONFLICT (key) DO NOTHING;
INSERT INTO platform_settings (key, value) VALUES ('order_rate_limit_seconds', 60) ON CONFLICT (key) DO NOTHING;
