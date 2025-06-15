import mysql from 'mysql2/promise';
import 'dotenv/config';

// Debug: Log environment variables
console.log('Database Configuration:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '92lottery',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default connection;
