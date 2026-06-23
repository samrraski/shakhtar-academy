// Run each statement individually via Supabase RPC
// Uses the admin.ts pattern with @supabase/supabase-js

const { createClient } = await import('@supabase/supabase-js');

const supabase = createClient(
  'https://fhkgirnpfmphzsoohthf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoa2dpcm5wZm1waHpzb29odGhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg4MDMxMiwiZXhwIjoyMDk2NDU2MzEyfQ.zZusFkF134haKaSeYrNLCFw_k08xacZBJdPGZkmR9-w',
  { auth: { persistSession: false } }
);

// Create a helper RPC function to run arbitrary SQL
const createRpcSql = `
CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN EXECUTE sql; END;
$$;
`;

// We can't run arbitrary SQL via REST unless we have an RPC function.
// Instead, apply RLS via the management API
const MGMT_SQL = `
ALTER TABLE players   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices  ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS parents_select_own_players ON players;
DROP POLICY IF EXISTS parents_select_sessions    ON sessions;
DROP POLICY IF EXISTS parents_select_attendance  ON attendance;
DROP POLICY IF EXISTS parents_insert_attendance  ON attendance;
DROP POLICY IF EXISTS parents_update_attendance  ON attendance;
DROP POLICY IF EXISTS parents_select_invoices    ON invoices;
DROP POLICY IF EXISTS auth_select_posts          ON posts;
DROP POLICY IF EXISTS auth_select_programs       ON programs;
DROP POLICY IF EXISTS auth_select_workers        ON workers;
DROP POLICY IF EXISTS auth_insert_inquiries      ON inquiries;

CREATE POLICY parents_select_own_players ON players
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY parents_select_sessions ON sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM players WHERE user_id = auth.uid() AND program_id = sessions.program_id)
  );

CREATE POLICY parents_select_attendance ON attendance
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM players WHERE user_id = auth.uid() AND id = attendance.player_id)
  );
CREATE POLICY parents_insert_attendance ON attendance
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM players WHERE user_id = auth.uid() AND id = attendance.player_id)
  );
CREATE POLICY parents_update_attendance ON attendance
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM players WHERE user_id = auth.uid() AND id = attendance.player_id)
  );

CREATE POLICY parents_select_invoices ON invoices
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM players WHERE user_id = auth.uid() AND id = invoices.player_id)
  );

CREATE POLICY auth_select_posts ON posts
  FOR SELECT USING (is_published = true AND auth.role() = 'authenticated');

CREATE POLICY auth_select_programs ON programs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY auth_select_workers ON workers
  FOR SELECT USING (is_active = true AND auth.role() = 'authenticated');

CREATE POLICY auth_insert_inquiries ON inquiries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
`;

// Use Supabase Management API to run SQL
const response = await fetch(
  'https://api.supabase.com/v1/projects/fhkgirnpfmphzsoohthf/database/query',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Management API needs personal access token, not service role
      // Fall back to direct approach
    },
    body: JSON.stringify({ query: MGMT_SQL }),
  }
);
console.log(response.status, await response.text());
