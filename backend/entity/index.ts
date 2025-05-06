export interface IEntity {
    id: string;
}

export interface Account extends IEntity {
    name: string;
    email: string;
    document: string;
    password: string;
}

export interface Asset extends IEntity {
    ticker: string;
}

export interface Wallet extends IEntity {
    account_id: string;
    asset_id: string;
    quantity: number;
}

export interface Order extends IEntity {
    price: number;
    quantity: number;
    side: string;
    account_id: string;
    asset_id: string;
    asset_payment_id: string;
}
