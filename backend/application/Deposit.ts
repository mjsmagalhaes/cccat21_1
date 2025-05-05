import { AccountDAO, AssetDAO, WalletDAO } from "../DAO";
import { Wallet } from "../entity";
import { ERROR_MESSAGE } from "../service/ErrorService";

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
        const account = await this.account.get(accountId);
        const asset = await this.asset.get(assetId);

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
