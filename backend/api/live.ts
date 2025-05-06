import Debug from "debug";
import { Router } from "websocket-express";
import { newOrders } from "../application/PlaceOrder";

const router = new Router();
const debug = Debug("live");
const reportError = Debug("error");

router.ws("/", async (req, res) => {
    const ws = await res.accept();

    ws.on("open", () => {
        debug("New WS Client connected!");
    });

    newOrders.subscribe(() => {
        debug("New Event: New Order!");
        ws.send(JSON.stringify({ message: "New Order!" }));
    });
});

export default router;
