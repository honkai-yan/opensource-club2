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
    return rows as T[];
  }

  async runTransaction<T>(callback: (conn: mysql.Connection) => Promise<T>) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const res = await callback(conn);
      await conn.commit();
      return res;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
