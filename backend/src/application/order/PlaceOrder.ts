import Debug from "debug";

import { Subject } from "rxjs";
import {
    AbstractRepositoryFactory,
    AccountRepository,
    AssetRepository,
    OrderRepository,
    WalletRepository,
} from "../../DAO";
import { OrderVO } from "../../entity";
import { ERROR_MESSAGE } from "../../service/ErrorService";

const debug = Debug("place_order");
export const channelNewOrders = new Subject<OrderVO>();

export interface PlaceOrderParam {
    marketId: string;
    accountId: string;
    side: string;
    quantity: number;
    price: number;
}

export class PlaceOrder {
    private readonly account: AccountRepository;
    private readonly asset: AssetRepository;
    private readonly wallet: WalletRepository;
    private readonly order: OrderRepository;

    constructor(factory: AbstractRepositoryFactory) {
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

        const paymentAssetWallet = await this.wallet.get(
            account.getId(),
            paymentAsset.getId()
        );
        const assetWallet = await this.wallet.get(account.getId(), asset.getId());

        debug(
            "paymentAsset (wallet):",
            paymentAssetWallet.toVo().quantity,
            paymentAsset.toVo().ticker
        );
        debug("asset (wallet):", assetWallet.toVo().quantity, asset.toVo().ticker);
        debug(
            `${param.side}: Total = ${param.price} * ${param.quantity} = ${param.price * param.quantity
            }`
        );

        const side = (param.side ?? "").toLowerCase();

        if (!["buy", "sell"].includes(side))
            throw new Error(ERROR_MESSAGE.BAD_ORDER_REQUEST);

        if (
            side == "buy" &&
            paymentAssetWallet.toVo().quantity < param.quantity * param.price
        )
            throw new Error(ERROR_MESSAGE.INSUFFICIENT_FUNDS);

        if (side == "sell" && assetWallet.toVo().quantity < param.quantity)
            throw new Error(ERROR_MESSAGE.INSUFFICIENT_FUNDS);

        let order = await this.order.create(
            {
                account_id: account.getId(),
                asset_id: asset.getId(),
                asset_payment_id: paymentAsset.getId(),
                side,
                quantity: param.quantity,
                price: param.price
            }
        );

        channelNewOrders.next(order.toVo());

        return order;
    }

    getChannel() {
        return channelNewOrders;
    }
}
