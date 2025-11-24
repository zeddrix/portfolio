-- verify-db.sql
-- This script verifies we are connected to the correct Supabase project database
-- before running any migrations or modifications

-- Check current database connection
SELECT
  current_database() as database_name,
  current_schema() as schema_name,
  inet_server_addr() as server_ip,
  version() as postgres_version;

-- Verify this is a Supabase project by checking for Supabase-specific schemas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.schemata
    WHERE schema_name IN ('auth', 'storage', 'realtime', 'supabase_functions')
  ) THEN
    RAISE EXCEPTION 'ERROR: This does not appear to be a Supabase database. Missing Supabase schemas.';
  END IF;

  RAISE NOTICE 'SUCCESS: Connected to Supabase database';
END $$;

-- Display current database info for manual verification
SELECT
  'Database verification complete' as status,
  current_database() as connected_to,
  count(*) as supabase_schemas_found
FROM information_schema.schemata
WHERE schema_name IN ('auth', 'storage', 'realtime', 'supabase_functions');
