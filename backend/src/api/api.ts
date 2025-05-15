import Debug from "debug";

Debug.disable();
// Debug.enable("place_order,withdraw,deposit,db:*,error:*,controller:*");
Debug.enable("controller:*");

import { Application } from "../application";
import { DatabaseRepositoryFactory } from "../DAO";
import { AccountController, OrderController } from "../interfaces/controllers";
import { PgpPromiseAdapter } from "../interfaces/database";
import { ExpressServer, WSServerAdapter } from "../interfaces/httpServer";

new Application(
    new PgpPromiseAdapter(),
    new ExpressServer(),
    new WSServerAdapter(),
    new DatabaseRepositoryFactory()
);

AccountController.config();
OrderController.config();

Application.getHttpServer().listen();
