import { PlaceOrder } from "./../backend/application/PlaceOrder";
import { ConfigService } from "../backend/service/ConfigService";
import { GetDepth } from "../backend/application/GetDepth";
import {
    AccountDAOMemory,
    AssetDAOMemory,
    DAOMemoryFactory,
    OrderDAOMemory,
    WalletDAOMemory,
} from "../backend/DAO/Memory/DAOMemory";
import { Signup } from "../backend/application/account/Signup";
import { Deposit } from "../backend/application/Deposit";

import Debug from "debug";

Debug.disable();
Debug.enable("place_order,withdraw,deposit,db:*,error");

const testAccount = ConfigService.getTestAccount();
const btc = ConfigService.getTestAsset("btc");
const usd = ConfigService.getTestAsset("usd");

const factory = new DAOMemoryFactory();
const account = new Signup(factory);
const deposit = new Deposit(factory);
const placeOrder = new PlaceOrder(factory);
const markets = new GetDepth(factory);

beforeAll(() => {
    factory.createAssetDAO().create(btc);
    factory.createAssetDAO().create(usd);
});

afterAll(() => {});

test("Retorna book de um asset", async () => {
    const { accountId } = await account.execute(testAccount);
    await deposit.execute(accountId, btc.ticker, 100);
    await deposit.execute(accountId, usd.ticker, 1000000);
    await placeOrder.execute(accountId, {
        accountId,
        marketId: "BTC/USD",
        side: "buy",
        quantity: 10,
        price: 10000,
    });

    await placeOrder.execute(accountId, {
        accountId,
        marketId: "BTC/USD",
        side: "buy",
        quantity: 10,
        price: 10001,
    });

    const orderBook = await markets.execute("BTC");
    expect(orderBook).toBeDefined();
    expect(orderBook["10000-10100"]).toBeDefined();
    expect(orderBook["10000-10100"]).toEqual(20);
});
