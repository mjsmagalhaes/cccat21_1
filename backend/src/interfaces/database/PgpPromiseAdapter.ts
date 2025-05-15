import pgp from "pg-promise";
import { ConfigService } from "../../service/ConfigService";
import { IDBConnection } from "./DatabaseConnection";

export class PgpPromiseAdapter implements IDBConnection {
    connection: pgp.IDatabase<{}>;

    constructor() {
        this.connection = pgp()(ConfigService.getConnectionString());
    }

    async query(statement: string, params: Record<string, any>): Promise<any> {
        return this.connection.any(statement, params);
    }

    close(): void {
        this.connection.$pool.end();
    }
}
