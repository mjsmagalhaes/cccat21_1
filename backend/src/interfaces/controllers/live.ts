import Debug from "debug";
import { Router } from "websocket-express";
import { createController } from "./core";
import { OrderService } from "../../application/order";
import { DatabaseRepositoryFactory } from "../../DAO";

const router = new Router();
const debug = Debug("controller:live");
const orderService = new OrderService(new DatabaseRepositoryFactory())

router.ws("/", createController(async (req, res: any) => {
    const ws = await res.accept();

    ws.on("open", () => {
        debug("New WS Client connected!");
    });

    orderService.placeOrder.getChannel().subscribe(() => {
        debug("New Event: New Order!");
        ws.send(JSON.stringify({ message: "New Order!" }));
    });
}, debug));

export default router;
