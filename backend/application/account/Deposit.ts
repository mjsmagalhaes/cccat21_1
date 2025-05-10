import { AccountDAO, AssetDAO, DAOAbstractFactory, WalletDAO } from "../../DAO";
import { WalletVO } from "../../entity";
import { ERROR_MESSAGE } from "../../service/ErrorService";

export class Deposit {
    private readonly account: AccountDAO;
    private readonly asset: AssetDAO;
    private readonly wallet: WalletDAO;

    constructor(factory: DAOAbstractFactory) {
        this.account = factory.createAccountDAO();
        this.asset = factory.createAssetDAO();
        this.wallet = factory.createWalletDAO();
    }

    async execute(
        accountId: string,
        assetTicker: string,
        quantity: number
    ): Promise<WalletVO> {
        const account = await this.account.get(accountId);
        const asset = await this.asset.get(assetTicker);

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
