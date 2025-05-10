export interface IEntity {
    id: string;
}

export interface AccountVO extends IEntity {
    name: string;
    email: string;
    document: string;
    password: string;
}

export interface AssetVO extends IEntity {
    ticker: string;
}

export interface WalletVO extends IEntity {
    account_id: string;
    asset_id: string;
    quantity: number;
}

export interface OrderVO extends IEntity {
    price: number;
    quantity: number;
    side: string;
    account_id: string;
    asset_id: string;
    asset_payment_id: string;
}

export class Account {
    id: string;
    document: string;
    email: string;
    name: string;
    password: string;

    constructor({ id, document, email, name, password }: AccountVO) {
        this.id = id;
        this.document = document;
        this.email = email;
        this.name = name;
        this.password = password;
    }

    static create(vo: AccountVO): Account {
        return new Account(Object.assign({}, vo, { id: crypto.randomUUID() }));
    }

    toVo(): AccountVO {
        return {
            id: this.id,
            document: this.document,
            email: this.email,
            name: this.name,
            password: this.password,
        };
    }
}
