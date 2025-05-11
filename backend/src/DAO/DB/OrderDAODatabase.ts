import Debug from "debug";
import { Account, AccountVO, Asset, Order, OrderVO } from "../../entity";
import { DatabaseRepository } from "./DAODatabase";
import { OrderRepository } from "..";

const debug = Debug("db:order");

export class OrderDAODatabase extends DatabaseRepository implements OrderRepository {
    async getAssetOrders(asset: Asset): Promise<Order[]> {
        const orders = await this.getConnection().query(
            "select * from ccca.order where asset_id = ${asset_id} sort by price desc",
            {
                asset_id: asset.getId(),
            }
        );

        return orders;
    }

    async create(vo: OrderVO): Promise<Order> {
        let order_id = crypto.randomUUID();
        debug("new order", order_id);

        await this.getConnection().query(
            "insert into ccca.order(id,account_id,asset_id,asset_payment_id,side, quantity, price) values (${id},${account_id},${asset_id},${asset_payment_id},${side},${quantity},${price})",
            vo
        );

        return await this.get(order_id);
    }

    async get(order_id: string): Promise<Order> {
        const [order] = await this.getConnection().query(
            "select * from ccca.order where id = ${order_id}",
            { order_id }
        );

        debug("get", order_id, order);
        return new Order(order);
    }
}
