import { Asset } from "./../entity/Asset";
import { AccountDAO } from "../DAO/AccountDAO";
import { AssetDAO } from "../DAO/AssetDAO";
import { Wallet } from "../entity/Wallet";
import { ErrorService, ERROR_MESSAGE } from "../service/ErrorService";
import { WalletDAO } from "../DAO/DB/WalletDAODatabase";

export class Deposit {
    constructor(
        private readonly account: AccountDAO,
        private readonly asset: AssetDAO,
        private readonly wallet: WalletDAO
    ) {}

    async execute(
        accountId: string,
        assetId: string,
        quantity: number
    ): Promise<Wallet> {
        const account = await this.account.getAccount(accountId);
        if (account == null)
            return ErrorService.throwError(ERROR_MESSAGE.ACCOUNT_NOT_FOUND);

        const asset = await this.asset.getAsset(assetId);
        if (asset == null)
            return ErrorService.throwError(ERROR_MESSAGE.ASSET_NOT_FOUND);

        if (quantity < 0)
            return ErrorService.throwError(ERROR_MESSAGE.BAD_DEPOSIT_REQUEST);

        const new_wallet = await this.wallet.createOrUpdate(
            account,
            asset,
            quantity
        );

        return new_wallet;
    }
}
