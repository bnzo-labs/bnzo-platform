-- CMS tables: projects, resources, guides
-- Service-role writes only. Public SELECT restricted to published rows.

CREATE TABLE IF NOT EXISTS cms_projects (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  title         text NOT NULL,
  description   text NOT NULL DEFAULT '',
  body          text NOT NULL DEFAULT '',
  status        text NOT NULL DEFAULT 'In Progress' CHECK (status IN ('Live', 'Beta', 'In Progress')),
  hero_image    text NOT NULL DEFAULT '',
  problem       text NOT NULL DEFAULT '',
  architecture  jsonb NOT NULL DEFAULT '{"stack":[],"decisions":[]}'::jsonb,
  agents        text[] NOT NULL DEFAULT '{}',
  result        jsonb NOT NULL DEFAULT '{"metrics":[],"outcomes":[]}'::jsonb,
  learnings     jsonb NOT NULL DEFAULT '{"went_well":[],"didnt":[]}'::jsonb,
  published     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_resources (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  title         text NOT NULL,
  description   text NOT NULL DEFAULT '',
  body          text NOT NULL DEFAULT '',
  price_cents   integer NOT NULL DEFAULT 0,
  price_id      text,
  tier          text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'paid')),
  tags          text[] NOT NULL DEFAULT '{}',
  download_url  text,
  published     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_guides (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  title            text NOT NULL,
  description      text NOT NULL DEFAULT '',
  body             text NOT NULL DEFAULT '',
  hero_image       text NOT NULL DEFAULT '',
  tags             text[] NOT NULL DEFAULT '{}',
  reading_minutes  integer NOT NULL DEFAULT 5,
  published        boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Indexes for public list queries
CREATE INDEX IF NOT EXISTS idx_cms_projects_published ON cms_projects (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_resources_published ON cms_resources (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_guides_published ON cms_guides (published, created_at DESC);

-- updated_at trigger
CREATE OR REPLACE FUNCTION cms_touch_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cms_projects_touch ON cms_projects;
CREATE TRIGGER cms_projects_touch BEFORE UPDATE ON cms_projects
  FOR EACH ROW EXECUTE FUNCTION cms_touch_updated_at();

DROP TRIGGER IF EXISTS cms_resources_touch ON cms_resources;
CREATE TRIGGER cms_resources_touch BEFORE UPDATE ON cms_resources
  FOR EACH ROW EXECUTE FUNCTION cms_touch_updated_at();

DROP TRIGGER IF EXISTS cms_guides_touch ON cms_guides;
CREATE TRIGGER cms_guides_touch BEFORE UPDATE ON cms_guides
  FOR EACH ROW EXECUTE FUNCTION cms_touch_updated_at();

-- RLS: public can read only published rows; writes require service role (bypasses RLS)
ALTER TABLE cms_projects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_guides    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cms_projects_public_read  ON cms_projects;
DROP POLICY IF EXISTS cms_resources_public_read ON cms_resources;
DROP POLICY IF EXISTS cms_guides_public_read    ON cms_guides;

CREATE POLICY cms_projects_public_read  ON cms_projects
  FOR SELECT USING (published = true);
CREATE POLICY cms_resources_public_read ON cms_resources
  FOR SELECT USING (published = true);
CREATE POLICY cms_guides_public_read    ON cms_guides
  FOR SELECT USING (published = true);
