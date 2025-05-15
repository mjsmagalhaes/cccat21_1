import { AssetRepository, OrderRepository } from "./../../DAO/index";
import { AbstractRepositoryFactory } from "../../DAO";
import { Asset, Order } from "../../domain/entity";
import Debug from "debug";
import { Trade } from "../../domain/entity/Trade";

const debug = Debug("uc:execute_order");

type ExecuteOrderInput = {
    order: Order;
};

export class ExecuteOrder {
    private readonly order: OrderRepository = this.factory.createOrderDAO();
    private readonly asset: AssetRepository = this.factory.createAssetDAO();

    constructor(private readonly factory: AbstractRepositoryFactory) {}

    async execute({ order }: ExecuteOrderInput): Promise<void> {
        let asset = await this.asset.get(order.toDto().asset_id);
        const orders = await this.order.getAssetOrders(asset);

        const buys = orders
            .filter((order) => order.toDto().side === "buy")
            .sort((a, b) => b.toDto().price - a.toDto().price);
        const sells = orders
            .filter((order) => order.toDto().side === "sell")
            .sort((a, b) => b.toDto().price - a.toDto().price);

        while (true) {
            const highestBid = buys.at(-1);
            const lowestAsk = sells.at(0);

            if (!highestBid || !lowestAsk) return;
            if (highestBid.toDto().price < lowestAsk.toDto().price) return;

            debug("Match!");

            new Trade({});

            const filled_quantity = Math.min(
                highestBid.toDto().quantity,
                lowestAsk.toDto().quantity
            );

            highestBid.toDto().quantity -= filled_quantity;
            lowestAsk.toDto().quantity -= filled_quantity;

            const filled_price = Math.max(
                highestBid.toDto().price,
                lowestAsk.toDto().price
            );

            if (highestBid.toDto().quantity === 0) {
                buys.pop();
            }

            if (lowestAsk.toDto().quantity === 0) {
                sells.shift();
            }
        }
    }
}
