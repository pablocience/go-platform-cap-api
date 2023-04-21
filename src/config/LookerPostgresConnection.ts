/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Pool, QueryResult } from 'pg';

export class LookerPostgresConnection {
  private static instance: LookerPostgresConnection;
  private pool: Pool | undefined;

  private constructor() {
    if (LookerPostgresConnection.instance) {
      return LookerPostgresConnection.instance;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.pool = new Pool({
      user: `${process.env.LOOKER_DB_USER}`,
      host: `${process.env.LOOKER_DB_HOST}`,
      database: `${process.env.LOOKER_DB_DATABASE}`,
      password: `${process.env.LOOKER_DB_PASSWORD}`,
      port: Number(`${process.env.LOOKER_DB_PORT}`),
      max: 500,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    LookerPostgresConnection.instance = this;
  }

  public static getInstance(): LookerPostgresConnection {
    return LookerPostgresConnection.instance ?? new LookerPostgresConnection();
  }

  public async executeQuery(sql: string, params: unknown[] = []): Promise<QueryResult> {
    if (!this.pool) {
      this.pool = new Pool({
        user: `${process.env.PSQL_USER}`,
        host: `${process.env.PSQL_HOST}`,
        database: `${process.env.PSQL_DB}`,
        password: `${process.env.PSQL_PASSWORD}`,
        port: Number(`${process.env.PSQL_PORT}`),
        max: 500,
        ssl: {
          rejectUnauthorized: false,
        },
      });
    }
    const client = await this.pool.connect();
    try {
      // console.log('Executing query: ', sql);
      const result = await client.query(sql, params);
      return result;
    } catch (error) {
      // console.error('Execute query ERRO!', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
