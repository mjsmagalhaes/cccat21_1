import Debug from "debug";
import { Account } from "../../entity/Account";
import { Asset } from "../../entity/Asset";
import { Order } from "../../entity/Order";
import { DAODatabase } from "./DAODatabase";

const debug = Debug("db:order");

export interface OrderDAO {
    create(account: Account, asset: Asset, paymentAsset: Asset, side: string, quantity: number, price: number): void;
    get(order_id: string): Promise<Order>;
}

export class OrderDAODatabase extends DAODatabase implements OrderDAO {
    async create(account: Account, asset: Asset, paymentAsset: Asset, side: string, quantity: number, price: number): Promise<Order> {
        let order_id = crypto.randomUUID();
        debug("new order", order_id);

        await this.getConnection().query(
            "insert into ccca.order(order_id,account_id,asset_id,asset_payment_id,side, quantity, price) values (${order_id},${account_id},${asset_id},${asset_payment_id},${side},${quantity},${price})",
            {
                order_id,
                account_id: account.account_id,
                asset_id: asset.asset_id,
                asset_payment_id: paymentAsset.asset_id,
                side,
                quantity,
                price,
            }
        )

        return await this.get(order_id);
    }

    async get(order_id: string): Promise<Order> {
        const [order] = await this.getConnection().query("select * from ccca.order where order_id = ${order_id}", { order_id });

        debug("get", order_id, order);
        return order;
    }
}