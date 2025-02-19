import { Pool } from 'pg'; // Import PostgreSQL client
import dotenv from 'dotenv'; // Load environment variables

dotenv.config(); // Load .env file into process.env

// Create a connection pool using the DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Log when connected to the database
pool.on('connect', () => console.log('Connected to PostgreSQL'));

export default pool; // Export the connection pool for use in other files
