import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
});

// Pastikan fungsi 'query' ini di-export agar bisa dipakai di folder API
export const query = (text: string, params?: any[]) => pool.query(text, params);
