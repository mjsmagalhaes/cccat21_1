import Debug from "debug";
import { WalletDAO } from "../DAO/DB";
import { AccountDAO, AssetDAO } from "../DAO";
import { ERROR_MESSAGE } from "../service/ErrorService";

const debug = Debug("withdraw");

export class Withdraw {
    constructor(private readonly account: AccountDAO, private readonly asset: AssetDAO, private readonly wallet: WalletDAO) { }
    async execute(account_id: string, asset_id: string, quantity: number) {
        const account = await this.account.get(account_id)
        const asset = await this.asset.get(asset_id);

        if (isNaN(quantity) || quantity <= 0)
            throw new Error(ERROR_MESSAGE.BAD_WITHDRAW_REQUEST);

        const new_wallet = await this.wallet.createOrUpdate(account, asset, -quantity);

        return {
            status: "ok",
            quantity: new_wallet.quantity,
            asset_id: new_wallet.asset_id,
        };
    }
}
