import Debug from "debug";
import { AccountRepository, AssetRepository, AbstractRepositoryFactory, WalletRepository } from "../../DAO";
import { ERROR_MESSAGE } from "../../service/ErrorService";

const debug = Debug("withdraw");

export class Withdraw {
    private readonly account: AccountRepository;
    private readonly asset: AssetRepository;
    private readonly wallet: WalletRepository;

    constructor(factory: AbstractRepositoryFactory) {
        this.account = factory.createAccountDAO();
        this.asset = factory.createAssetDAO();
        this.wallet = factory.createWalletDAO();
    }

    async execute(account_id: string, asset_id: string, quantity: number) {
        const account = await this.account.get(account_id);
        const asset = await this.asset.get(asset_id);

        if (isNaN(quantity) || quantity <= 0)
            throw new Error(ERROR_MESSAGE.BAD_WITHDRAW_REQUEST);

        const new_wallet = await this.wallet.createOrUpdate(
            account,
            asset,
            -quantity
        );

        return {
            status: "ok",
            quantity: new_wallet.toVo().quantity,
            asset_id: new_wallet.toVo().asset_id,
        };
    }
}
