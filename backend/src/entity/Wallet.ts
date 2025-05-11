import { Entity, IEntity } from "./core";

export interface WalletVO extends IEntity {
    account_id: string;
    asset_id: string;
    quantity: number;
}

export class Wallet extends Entity<WalletVO> {
    constructor(vo: WalletVO) {
        vo.quantity = parseFloat(vo.quantity as unknown as string);
        super(vo)
    }
}