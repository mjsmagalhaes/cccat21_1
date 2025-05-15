import Debug from "debug";
import { OrderRepository } from "..";
import { Asset, Order, OrderDTO } from "../../domain/entity";
import { DatabaseRepository } from "./DAODatabase";

const debug = Debug("db:order");

export class OrderDAODatabase
    extends DatabaseRepository
    implements OrderRepository
{
    async getAssetOrders(asset: Asset): Promise<Order[]> {
        const orders = await this.getConnection().query(
            "select * from ccca.order where asset_id = ${asset_id} sort by price desc",
            {
                asset_id: asset.getId(),
            }
        );

        return orders;
    }

    async create(vo: OrderDTO): Promise<Order> {
        let order_id = crypto.randomUUID();
        debug("new order", order_id);

        await this.getConnection().query(
            "insert into ccca.order(${this:name}) values (${this:csv})",
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
