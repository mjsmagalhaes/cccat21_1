import { Entity, IEntity } from "./__core";

export interface WalletDTO extends IEntity {
    account_id: string;
    asset_id: string;
    quantity: number;
}

export class Wallet extends Entity<WalletDTO> {
    constructor(vo: WalletDTO) {
        vo.quantity = parseFloat(vo.quantity as unknown as string);
        super(vo);
    }
}
