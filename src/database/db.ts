import dotenv from "dotenv"
import { Pool } from "pg"

dotenv.config()

export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});
