import Debug from "debug";
import {
    AccountDAO,
    AssetDAO,
    WalletDAO,
    OrderDAO,
    DAOAbstractFactory,
} from "../DAO";
import { ERROR_MESSAGE } from "../service/ErrorService";
import { Subject } from "rxjs";

const debug = Debug("place_order");
export const newOrders = new Subject();

export interface PlaceOrderParam {
    marketId: string;
    accountId: string;
    side: string;
    quantity: number;
    price: number;
}

export class PlaceOrder {
    private readonly account: AccountDAO;
    private readonly asset: AssetDAO;
    private readonly wallet: WalletDAO;
    private readonly order: OrderDAO;

    constructor(factory: DAOAbstractFactory) {
        this.account = factory.createAccountDAO();
        this.asset = factory.createAssetDAO();
        this.wallet = factory.createWalletDAO();
        this.order = factory.createOrderDAO();
    }

    convert(input: any) {
        if (!input) throw new Error(ERROR_MESSAGE.BAD_ORDER_REQUEST);

        if (!input.marketId) throw new Error(ERROR_MESSAGE.BAD_ORDER_REQUEST);

        input.quantity = parseFloat(input.quantity);
        if (isNaN(input.quantity) || input.quantity < 0)
            throw new Error(ERROR_MESSAGE.BAD_ORDER_REQUEST);

        input.price = parseFloat(input.price);
        if (isNaN(input.price) || input.price < 0)
            throw new Error(ERROR_MESSAGE.BAD_ORDER_REQUEST);

        return input as PlaceOrderParam;
    }

    async execute(account_id: string, param: PlaceOrderParam) {
        const account = await this.account.get(account_id);

        const [assetId, paymentAssetId] = (param.marketId ?? "/").split("/");
        debug("Market ID:", assetId, paymentAssetId);

        const paymentAsset = await this.asset.get(paymentAssetId);
        const asset = await this.asset.get(assetId);

        const paymentAssetWallet = await this.wallet.getWallet(
            account,
            paymentAsset
        );
        const assetWallet = await this.wallet.getWallet(account, asset);

        debug(
            "paymentAsset (wallet):",
            paymentAssetWallet.quantity,
            paymentAsset.ticker
        );
        debug("asset (wallet):", assetWallet.quantity, asset.ticker);
        debug(
            `${param.side}: Total = ${param.price} * ${param.quantity} = ${
                param.price * param.quantity
            }`
        );

        const side = (param.side ?? "").toLowerCase();

        if (!["buy", "sell"].includes(side))
            throw new Error(ERROR_MESSAGE.BAD_ORDER_REQUEST);

        if (
            side == "buy" &&
            paymentAssetWallet.quantity < param.quantity * param.price
        )
            throw new Error(ERROR_MESSAGE.INSUFFICIENT_FUNDS);

        if (side == "sell" && assetWallet.quantity < param.quantity)
            throw new Error(ERROR_MESSAGE.INSUFFICIENT_FUNDS);

        let order = await this.order.createOrder(
            account,
            asset,
            paymentAsset,
            side,
            param.quantity,
            param.price
        );

        newOrders.next("");

        return order;
    }
}
