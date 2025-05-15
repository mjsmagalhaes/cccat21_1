export interface IDBConnection {
    query(statement: string, params: Record<string, any>): Promise<any>;
    close(): void;
}
