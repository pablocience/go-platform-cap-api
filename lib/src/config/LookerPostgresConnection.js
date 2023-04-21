import { Pool } from 'pg';
export class LookerPostgresConnection {
    constructor() {
        if (LookerPostgresConnection.instance) {
            return LookerPostgresConnection.instance;
        }
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
    static getInstance() {
        return LookerPostgresConnection.instance ?? new LookerPostgresConnection();
    }
    async executeQuery(sql, params = []) {
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
            const result = await client.query(sql, params);
            return result;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
}
//# sourceMappingURL=LookerPostgresConnection.js.map