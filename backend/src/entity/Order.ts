import { Entity, IEntity } from "./core";

export interface OrderVO extends IEntity {
    price: number;
    quantity: number;
    side: string;
    account_id: string;
    asset_id: string;
    asset_payment_id: string;
}

export class Order extends Entity<OrderVO> { }