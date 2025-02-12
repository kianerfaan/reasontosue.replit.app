import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Initialize these as let so we can assign them later
let pool: Pool;
let db: ReturnType<typeof drizzle>;

// Updated database URL for Neon
const DATABASE_URL = 'postgresql://neondb_owner:npg_Gs5uoK7zLvfc@ep-patient-rice-a5l7vuch.us-east-2.aws.neon.tech/neondb?sslmode=require';

try {
  // Validate the DATABASE_URL format
  const dbUrl = new URL(DATABASE_URL);
  if (dbUrl.protocol !== 'postgresql:' && dbUrl.protocol !== 'postgres:') {
    throw new Error('Invalid database URL protocol. Must be postgresql:// or postgres://');
  }

  pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle(pool, { schema });

  // Test the connection
  pool.connect().catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
} catch (error) {
  console.error("Failed to initialize database connection:", error);
  process.exit(1);
}

// Export the initialized instances
export { pool, db };