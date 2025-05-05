import { AccountDAO } from "../DAO/AccountDAO";
import { AssetDAO } from "../DAO/AssetDAO";
import { Wallet } from "../entity/Wallet";
import { ERROR_MESSAGE } from "../service/ErrorService";
import { WalletDAO } from "../DAO/DB/WalletDAODatabase";

export class Deposit {
    constructor(
        private readonly account: AccountDAO,
        private readonly asset: AssetDAO,
        private readonly wallet: WalletDAO
    ) { }

    async execute(
        accountId: string,
        assetId: string,
        quantity: number
    ): Promise<Wallet> {
        const account = await this.account.get(accountId);
        if (account == null)
            throw new Error(ERROR_MESSAGE.ACCOUNT_NOT_FOUND);

        const asset = await this.asset.get(assetId);
        if (asset == null)
            throw new Error(ERROR_MESSAGE.ASSET_NOT_FOUND);

        if (isNaN(quantity) || quantity <= 0)
            throw new Error(ERROR_MESSAGE.BAD_DEPOSIT_REQUEST);

        const new_wallet = await this.wallet.createOrUpdate(
            account,
            asset,
            quantity
        );

        return new_wallet;
    }
}
