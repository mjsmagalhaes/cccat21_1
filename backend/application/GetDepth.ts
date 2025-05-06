import { AssetDAO, DAOAbstractFactory, OrderDAO } from "../DAO";
import { Order } from "../entity";

export type OrderBook = { [key: string]: number };

export class GetDepth {
    private readonly asset: AssetDAO;
    private readonly order: OrderDAO;

    constructor(factory: DAOAbstractFactory) {
        this.asset = factory.createAssetDAO();
        this.order = factory.createOrderDAO();
    }

    async execute(ticker: string): Promise<OrderBook> {
        const asset = await this.asset.get(ticker);
        const orders = await this.order.getAssetOrders(asset);
        return this.groupWithPrecision(orders, 2);
    }

    groupWithPrecision(orders: Order[], precision: number): OrderBook {
        const base = 10 ** precision;
        const lower = (price: number) => price - (price % base);

        const grouped = orders.reduce((acc, order) => {
            const lowerBound = lower(order.price);
            const upperBound = lowerBound + base;
            const key = `${lowerBound}-${upperBound}`;

            if (!acc[key]) acc[key] = 0;
            acc[key] += order.quantity;

            return acc;
        }, {} as OrderBook);

        return grouped;
    }
}
