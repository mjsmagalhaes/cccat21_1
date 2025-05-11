import { AbstractRepositoryFactory, AssetRepository, OrderRepository } from "../../DAO";
import { Order } from "../../entity";

export type OrderBook = { [key: string]: Order[] };

export class GetDepth {
    private readonly asset: AssetRepository;
    private readonly order: OrderRepository;

    constructor(factory: AbstractRepositoryFactory) {
        this.asset = factory.createAssetDAO();
        this.order = factory.createOrderDAO();
    }

    async execute(ticker: string, precision: number = 2): Promise<OrderBook> {
        const asset = await this.asset.get(ticker);
        const orders = await this.order.getAssetOrders(asset);
        return this.groupWithPrecision(orders, precision);
    }

    groupWithPrecision(orders: Order[], precision: number): OrderBook {
        const base = 10 ** precision;
        const lower = (price: number) => price - (price % base);

        const grouped = orders.reduce((acc, order) => {
            let key = lower(order.toVo().price).toString();

            if (!acc[key]) acc[key] = [];
            acc[key].push(order);

            return acc;
        }, {} as OrderBook);

        return grouped;
    }
}
