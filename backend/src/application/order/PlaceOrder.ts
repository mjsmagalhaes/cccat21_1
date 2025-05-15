import Debug from "debug";

import { Subject } from "rxjs";
import {
    AbstractRepositoryFactory,
    AccountRepository,
    AssetRepository,
    OrderRepository,
    WalletRepository,
} from "../../DAO";
import { OrderDTO } from "../../domain/entity";
import { ERROR_MESSAGE } from "../../service/ErrorService";
import { ExecuteOrder } from "./ExecuteOrder";

const debug = Debug("place_order");
export const channelNewOrders = new Subject<OrderDTO>();

export interface PlaceOrderInput {
    marketId: string;
    accountId: string;
    side: string;
    quantity: string;
    price: string;
}

export class PlaceOrder {
    private readonly account: AccountRepository;
    private readonly asset: AssetRepository;
    private readonly wallet: WalletRepository;
    private readonly order: OrderRepository;

    constructor(private readonly factory: AbstractRepositoryFactory) {
        this.account = factory.createAccountDAO();
        this.asset = factory.createAssetDAO();
        this.wallet = factory.createWalletDAO();
        this.order = factory.createOrderDAO();
    }

    async execute(param: PlaceOrderInput) {
        let price = parseFloat(param.price);
        let quantity = parseFloat(param.quantity);

        if (isNaN(price) || price <= 0)
            throw new Error(ERROR_MESSAGE.BAD_ORDER_REQUEST);

        if (isNaN(quantity) || quantity <= 0)
            throw new Error(ERROR_MESSAGE.BAD_ORDER_REQUEST);

        const account = await this.account.get(param.accountId);

        const [assetId, paymentAssetId] = (param.marketId ?? "/").split("/");
        debug("Market ID:", assetId, paymentAssetId);

        const paymentAsset = await this.asset.get(paymentAssetId);
        const asset = await this.asset.get(assetId);

        const paymentAssetWallet = await this.wallet.get(
            account.getId(),
            paymentAsset.getId()
        );
        const assetWallet = await this.wallet.get(
            account.getId(),
            asset.getId()
        );

        debug(
            "paymentAsset (wallet):",
            paymentAssetWallet.toDto().quantity,
            paymentAsset.toDto().ticker
        );
        debug(
            "asset (wallet):",
            assetWallet.toDto().quantity,
            asset.toDto().ticker
        );
        debug(
            `${param.side}: Total = ${param.price} * ${param.quantity} = ${
                price * quantity
            }`
        );

        const side = (param.side ?? "").toLowerCase();

        if (!["buy", "sell"].includes(side))
            throw new Error(ERROR_MESSAGE.BAD_ORDER_REQUEST);

        if (
            side == "buy" &&
            paymentAssetWallet.toDto().quantity < quantity * price
        )
            throw new Error(ERROR_MESSAGE.INSUFFICIENT_FUNDS);

        if (side == "sell" && assetWallet.toDto().quantity < quantity)
            throw new Error(ERROR_MESSAGE.INSUFFICIENT_FUNDS);

        let order = await this.order.create({
            account_id: account.getId(),
            asset_id: asset.getId(),
            asset_payment_id: paymentAsset.getId(),
            side,
            quantity,
            price,
            status: "open",
            filled_quantity: 0,
            filled_price: 0,
        });

        new ExecuteOrder(this.factory).execute({ order });

        channelNewOrders.next(order.toDto());

        return order;
    }

    getChannel() {
        return channelNewOrders;
    }
}
