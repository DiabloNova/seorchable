CREATE TABLE IF NOT EXISTS competitive_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_url TEXT NOT NULL,
  competitor_urls TEXT[] NOT NULL,
  overall_score INTEGER NOT NULL,
  market_position TEXT NOT NULL,
  comparison_data JSONB NOT NULL,
  advantages JSONB NOT NULL,
  gaps JSONB NOT NULL,
  opportunities JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
