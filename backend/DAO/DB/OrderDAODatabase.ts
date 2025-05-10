import Debug from "debug";
import { AccountVO, AssetVO, OrderVO } from "../../entity";
import { DAODatabase } from "./DAODatabase";
import { OrderDAO } from "./..";

const debug = Debug("db:order");

export class OrderDAODatabase extends DAODatabase implements OrderDAO {
    async getAssetOrders(asset: AssetVO): Promise<OrderVO[]> {
        const orders = await this.getConnection().query(
            "select * from ccca.order where asset_id = ${asset_id} sort by price desc",
            {
                asset_id: asset.id,
            }
        );

        return orders;
    }

    async createOrder(
        account: AccountVO,
        asset: AssetVO,
        paymentAsset: AssetVO,
        side: string,
        quantity: number,
        price: number
    ): Promise<OrderVO> {
        let order_id = crypto.randomUUID();
        debug("new order", order_id);

        await this.getConnection().query(
            "insert into ccca.order(id,account_id,asset_id,asset_payment_id,side, quantity, price) values (${order_id},${account_id},${asset_id},${asset_payment_id},${side},${quantity},${price})",
            {
                order_id,
                account_id: account.id,
                asset_id: asset.id,
                asset_payment_id: paymentAsset.id,
                side,
                quantity,
                price,
            }
        );

        return await this.get(order_id);
    }

    async get(order_id: string): Promise<OrderVO> {
        const [order] = await this.getConnection().query(
            "select * from ccca.order where id = ${order_id}",
            { order_id }
        );

        debug("get", order_id, order);
        return order;
    }
}
