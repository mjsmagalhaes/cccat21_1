import Debug from "debug";
import { Application } from "../../application/Application";

export class OrderController {
    static config() {
        const orderService = Application.getOrderService();

        Application.getHttpServer().route(
            "post",
            "/markets/:marketId/info",
            async ({ body, params, query }) => {},
            Debug("controller:order")
        );

        Application.getHttpServer().route(
            "post",
            "/markets/:marketId/trades",
            async ({ body, params, query }) => {},
            Debug("controller:order")
        );

        Application.getHttpServer().route(
            "post",
            "/markets/:marketId/depth",
            async ({ body, params, query }) => {
                return await orderService.getDepth.execute(params.marketId);
            },
            Debug("controller:order")
        );

        Application.getHttpServer().route(
            "post",
            "/place_order/",
            async ({ body, params, query }) => {
                await orderService.placeOrder.execute(body);
            },
            Debug("controller:order")
        );
        return;
    }
}
