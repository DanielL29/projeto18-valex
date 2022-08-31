import pg from 'pg'
import dotenv from "dotenv";
dotenv.config();

interface ConfigDatabase {
    connectionString: string,
    ssl?: object
}

const { Pool } = pg;
const configDatabase: ConfigDatabase = {
    connectionString: process.env.DATABASE_URL
}

if (process.env.MODE === "PROD") {
    configDatabase.ssl = {
        rejectUnauthorized: false
    }
}

const connection = new Pool(configDatabase)

export default connection