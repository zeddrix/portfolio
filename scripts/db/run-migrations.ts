/**
 * run-migrations.ts
 * Database migration runner with verification
 *
 * This script:
 * 1. Verifies connection to the correct Supabase database
 * 2. Runs migration files in order
 * 3. Provides detailed feedback on success/failure
 *
 * Usage:
 *   pnpm db:migrate           - Run all migrations
 *   pnpm db:migrate:verify    - Only verify database connection
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import pg from 'pg';

const { Pool } = pg;

// ANSI color codes for terminal output
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	bold: '\x1b[1m'
};

// Migration files in order
const MIGRATIONS = ['001_initial_schema.sql', '002_rls_policies.sql', '003_seed_data.sql'];

/**
 * Print formatted message to console
 */
function log(message: string, color: keyof typeof colors = 'reset'): void {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print error message and exit
 */
function error(message: string): never {
	log(`\n❌ ERROR: ${message}`, 'red');
	process.exit(1);
}

/**
 * Print success message
 */
function success(message: string): void {
	log(`✅ ${message}`, 'green');
}

/**
 * Print info message
 */
function info(message: string): void {
	log(`ℹ️  ${message}`, 'cyan');
}

/**
 * Get database URL from environment
 */
function getDatabaseUrl(): string {
	const dbUrl = process.env.POSTGRES_URL;

	if (!dbUrl) {
		error('POSTGRES_URL not found in environment variables. Check your .env file.');
	}

	return dbUrl;
}

/**
 * Create database connection pool
 */
function createPool(connectionString: string): pg.Pool {
	return new Pool({
		connectionString,
		ssl: {
			rejectUnauthorized: false // Supabase uses self-signed certificates
		}
	});
}

/**
 * Verify database connection and Supabase setup
 */
async function verifyDatabase(pool: pg.Pool): Promise<void> {
	log('\n' + '='.repeat(70), 'cyan');
	log('DATABASE VERIFICATION', 'bold');
	log('='.repeat(70) + '\n', 'cyan');

	try {
		const verifyScriptPath = join(process.cwd(), 'scripts', 'db', 'verify-db.sql');
		const verifyScript = await readFile(verifyScriptPath, 'utf-8');

		const result = await pool.query(verifyScript);

		// Display verification results
		if (result && Array.isArray(result)) {
			// Multiple result sets from the verification script
			for (const res of result) {
				if (res.rows && res.rows.length > 0) {
					log('\nVerification Results:', 'cyan');
					res.rows.forEach((row: Record<string, unknown>) => {
						Object.entries(row).forEach(([key, value]) => {
							info(`  ${key}: ${value}`);
						});
					});
				}
			}
		}

		success('\nDatabase verification passed!');
		info('Connected to correct Supabase database\n');
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error';
		error(`Database verification failed: ${errorMessage}`);
	}
}

/**
 * Run a single migration file
 */
async function runMigration(pool: pg.Pool, filename: string): Promise<void> {
	log(`\n${'─'.repeat(70)}`, 'cyan');
	log(`Running migration: ${filename}`, 'bold');
	log('─'.repeat(70), 'cyan');

	try {
		const migrationPath = join(process.cwd(), 'scripts', 'db', 'migrations', filename);
		const migrationSql = await readFile(migrationPath, 'utf-8');

		// Execute migration
		const result = await pool.query(migrationSql);

		// Display any notices from the migration
		if (Array.isArray(result)) {
			// Multiple statements executed
			success(`\n✓ Migration completed: ${filename}`);
		} else {
			success(`\n✓ Migration completed: ${filename}`);
		}
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error';
		error(`Migration failed (${filename}): ${errorMessage}`);
	}
}

/**
 * Run all migrations
 */
async function runAllMigrations(pool: pg.Pool): Promise<void> {
	log('\n' + '='.repeat(70), 'cyan');
	log('RUNNING MIGRATIONS', 'bold');
	log('='.repeat(70) + '\n', 'cyan');

	for (const migration of MIGRATIONS) {
		await runMigration(pool, migration);
	}

	log('\n' + '='.repeat(70), 'green');
	success('ALL MIGRATIONS COMPLETED SUCCESSFULLY!');
	log('='.repeat(70) + '\n', 'green');

	info('Database schema is now set up and ready to use.');
	info('Next steps:');
	info('  1. Update seed data with your personal information');
	info('  2. Create your first admin user in Supabase Auth');
	info('  3. Add the admin user to the admin_users table\n');
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const verifyOnly = args.includes('--verify-only');

	log('\n' + '═'.repeat(70), 'blue');
	log('  ZEDDRIX PORTFOLIO - DATABASE MIGRATION TOOL', 'bold');
	log('═'.repeat(70) + '\n', 'blue');

	// Get database URL and create connection
	const dbUrl = getDatabaseUrl();
	const pool = createPool(dbUrl);

	try {
		// Always verify database first
		await verifyDatabase(pool);

		if (verifyOnly) {
			info('Verification only mode. Skipping migrations.\n');
		} else {
			// Run all migrations
			await runAllMigrations(pool);
		}
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error';
		error(`Migration process failed: ${errorMessage}`);
	} finally {
		// Close database connection
		await pool.end();
	}
}

// Run the script
main().catch((err) => {
	error(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
});
