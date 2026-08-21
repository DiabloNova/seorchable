import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/aeo_saas",
  max: 20,
});

export const authDb = {
  async query(text: string, params?: any[]) {
    return pool.query(text, params);
  }
};
