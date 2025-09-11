import { Injectable } from '@nestjs/common';
import mysql, { ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private pool: mysql.Pool;

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

  async query<T>(sql: string, values?: any[], conn?: mysql.Connection) {
    let rows = null;
    if (conn) {
      rows = (await conn.query(sql, values))[0];
    } else {
      rows = (await this.pool.query(sql, values))[0];
    }
    return rows as T[];
  }

  async execute(sql: string, values?: any[], conn?: mysql.Connection) {
    let results = null;
    if (conn) {
      results = await conn.execute(sql, values);
    } else {
      results = await this.pool.execute(sql, values);
    }
    return results as ResultSetHeader;
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
