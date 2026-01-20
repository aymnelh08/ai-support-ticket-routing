-- Create the support_tickets table
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT,
  priority TEXT,
  summary TEXT,
  route_to TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) is recommended in production,
-- but for this demo, we will allow public read/write or handle it via API service key if needed.
-- For simplicity in this demo environment accessing via server-side client:
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON support_tickets FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON support_tickets FOR UPDATE USING (true);
