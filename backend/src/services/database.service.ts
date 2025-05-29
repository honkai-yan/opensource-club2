import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async query<T>(sql: string, values?: any[]) {
    const [rows] = await this.pool.query(sql, values);
    return rows as T;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
