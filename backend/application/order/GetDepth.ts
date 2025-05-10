import { AssetDAO, DAOAbstractFactory, OrderDAO } from "../../DAO";
import { OrderVO } from "../../entity";

export type OrderBook = { [key: string]: OrderVO[] };

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

    groupWithPrecision(orders: OrderVO[], precision: number): OrderBook {
        const base = 10 ** precision;
        const lower = (price: number) => price - (price % base);

        const grouped = orders.reduce((acc, order) => {
            let key = lower(order.price).toString();

            if (!acc[key]) acc[key] = [];
            acc[key].push(order);

            return acc;
        }, {} as OrderBook);

        return grouped;
    }
}
