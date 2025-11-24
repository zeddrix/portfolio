# Database Migration Scripts

This directory contains database migration scripts for the Zeddrix Portfolio project.

## Directory Structure

```
scripts/db/
├── README.md                     # This file
├── verify-db.sql                 # Database verification script
├── run-migrations.ts             # TypeScript migration runner
└── migrations/                   # Migration files (run in order)
    ├── 001_initial_schema.sql    # Create tables and schema
    ├── 002_rls_policies.sql      # Configure Row Level Security
    └── 003_seed_data.sql         # Insert initial data
```

## Prerequisites

1. **Supabase Project Setup**
   - Create a Supabase project at https://supabase.com
   - Get your project credentials from Settings > API
   - Get database password from Settings > Database

2. **Environment Variables**
   - Ensure `.env` file exists with the following variables:
     - `PUBLIC_SUPABASE_URL` - Your Supabase project URL
     - `PUBLIC_SUPABASE_ANON_KEY` - Anonymous/public key
     - `PUBLIC_SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep private!)
     - `POSTGRES_URL` - Direct PostgreSQL connection string
     - `SUPABASE_DB_PASSWORD` - Database password

## Running Migrations

### Verify Database Connection

Before running migrations, verify you're connected to the correct database:

```bash
pnpm db:verify
```

This will:

- Check database connection
- Verify Supabase schemas are present
- Display connection information
- Exit without running migrations

### Run All Migrations

To run all migrations in order:

```bash
pnpm db:migrate
```

This will:

1. Verify database connection first
2. Run all migration files in order
3. Provide detailed feedback on each step
4. Display success/error messages

### Migration Order

Migrations run in this order:

1. **001_initial_schema.sql** - Creates all tables, types, indexes, and triggers
2. **002_rls_policies.sql** - Sets up Row Level Security policies
3. **003_seed_data.sql** - Inserts initial/sample data

## Safety Features

### Database Verification

The migration runner includes built-in safety checks:

- ✅ Verifies connection to a Supabase database
- ✅ Checks for required Supabase schemas (auth, storage, etc.)
- ✅ Displays connection information for manual verification
- ✅ Exits immediately if verification fails

### Error Handling

- Each migration runs as a transaction
- If any migration fails, you'll see detailed error messages
- The script exits on first error to prevent partial migrations

## Schema Overview

### Tables Created

1. **site_settings** - Global site configuration (layout, palette, theme)
2. **profile** - Personal profile information
3. **skills** - Technical skills with proficiency levels
4. **projects** - Portfolio projects with rich media
5. **certifications** - Professional certifications
6. **experiences** - Work experience history
7. **social_links** - Social media links
8. **admin_users** - Admin user roles and permissions

### Row Level Security (RLS)

All tables have RLS enabled with these rules:

- **Public users**: Read access to published content only
- **Admin users**: Full CRUD access to all tables
- **Authenticated users**: Can view their own admin record

## After Running Migrations

### 1. Update Seed Data

Edit `migrations/003_seed_data.sql` to add your personal information:

- Profile details (name, bio, contact info)
- Skills and proficiency levels
- Social media links
- Projects (when ready)

Then re-run: `pnpm db:migrate`

### 2. Create Admin User

1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user with your email
3. Copy the User ID (UUID)
4. Insert into `admin_users` table:

```sql
INSERT INTO admin_users (id, email, role)
VALUES ('your-user-uuid', 'your-email@example.com', 'admin');
```

### 3. Verify Setup

Check that everything is working:

```sql
-- View all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check site settings
SELECT * FROM site_settings;

-- Check profile
SELECT * FROM profile;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

## Modifying Migrations

### Adding New Migrations

1. Create a new file in `migrations/` with the next number:
   - Example: `004_add_blog_table.sql`

2. Add it to the `MIGRATIONS` array in `run-migrations.ts`:

```typescript
const MIGRATIONS = [
	'001_initial_schema.sql',
	'002_rls_policies.sql',
	'003_seed_data.sql',
	'004_add_blog_table.sql' // New migration
];
```

3. Run: `pnpm db:migrate`

### Migration Best Practices

- ✅ Always include verification checks in migrations
- ✅ Use transactions for atomic operations
- ✅ Add helpful NOTICE messages for feedback
- ✅ Include rollback instructions in comments
- ✅ Test migrations on a development database first

## Troubleshooting

### Error: "POSTGRES_URL not found"

**Solution**: Check your `.env` file has the `POSTGRES_URL` variable set.

### Error: "This does not appear to be a Supabase database"

**Solution**: Verify you're connecting to the correct database. Check your connection string points to your Supabase project.

### Error: "relation already exists"

**Solution**: The migration has already been run. If you want to re-run it:

1. Drop the existing tables manually, OR
2. The migrations include `DROP TABLE IF EXISTS` statements - re-run should work

### Error: "permission denied"

**Solution**: Ensure you're using the correct database credentials with sufficient permissions.

## Database Connection Strings

Supabase provides different connection strings for different use cases:

- **Transaction pooler** (recommended for migrations): `postgresql://...pooler.supabase.com:6543/...`
- **Session pooler**: `postgresql://...pooler.supabase.com:5432/...`
- **Direct connection**: `postgresql://db....supabase.co:5432/...`

Use the **Transaction pooler** (port 6543) for running migrations.

## Additional Resources

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Questions?

Refer to the main [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) for the complete database schema design and architecture decisions.
