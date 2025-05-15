import { Entity, IEntity } from "./__core";

export interface OrderDTO extends IEntity {
    price: number;
    quantity: number;
    side: string;
    account_id: string;
    asset_id: string;
    asset_payment_id: string;
    status: string;
    filled_quantity: number;
    filled_price: number;
}

export class Order extends Entity<OrderDTO> {}
