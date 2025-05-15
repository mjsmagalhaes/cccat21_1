import { AbstractRepositoryFactory } from "../DAO";
import { IDBConnection } from "../interfaces/database";
import { HttpServer, WSServer } from "../interfaces/httpServer";
import { AccountService } from "./account";
import { OrderService } from "./order";

export class Application {
    private static instance: Application;

    static getConnection() {
        return this.instance.getConnection();
    }

    static getHttpServer() {
        return this.instance.getHttpServer();
    }

    static getWSServer() {
        return this.instance.getWSServer();
    }

    static getAccountService() {
        return new AccountService(this.instance.factory);
    }

    static getOrderService() {
        return new OrderService(this.instance.factory);
    }

    constructor(
        private readonly db: IDBConnection,
        private readonly httpServer: HttpServer,
        private readonly wsServer: WSServer,
        private readonly factory: AbstractRepositoryFactory
    ) {
        if (Application.instance) {
            throw Error("Application is already initialized");
        }

        Application.instance = this;
    }

    private getConnection(): IDBConnection {
        return this.db;
    }

    private getHttpServer() {
        return this.httpServer;
    }

    private getWSServer() {
        return this.wsServer;
    }
}
