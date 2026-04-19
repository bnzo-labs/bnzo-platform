-- purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid,
  email            text NOT NULL,
  product_id       text NOT NULL,
  stripe_session_id text UNIQUE NOT NULL,
  amount_cents     integer NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text UNIQUE NOT NULL,
  source     text NOT NULL CHECK (source IN ('bnzo', 'learn')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS disabled for MVP (service-role writes only)
-- Enable before user auth lands
