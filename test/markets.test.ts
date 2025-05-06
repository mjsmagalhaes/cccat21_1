import { PlaceOrder } from "./../backend/application/PlaceOrder";
import { ConfigService } from "../backend/service/ConfigService";
import { GetDepth } from "../backend/application/GetDepth";
import {
    AccountDAOMemory,
    AssetDAOMemory,
    OrderDAOMemory,
    WalletDAOMemory,
} from "../backend/DAO/Memory/DAOMemory";
import { Signup } from "../backend/application/Signup";
import { Deposit } from "../backend/application/Deposit";

import Debug from "debug";

Debug.disable();
Debug.enable("place_order,withdraw,deposit,db:*,error");

const testAccount = ConfigService.getTestAccount();
const btc = ConfigService.getTestAsset("btc");
const usd = ConfigService.getTestAsset("usd");

const accoutDao = new AccountDAOMemory();
const assetDao = new AssetDAOMemory();
const walletDao = new WalletDAOMemory();
const orderDao = new OrderDAOMemory();

const account = new Signup(accoutDao);
const deposit = new Deposit(accoutDao, assetDao, walletDao);
const placeOrder = new PlaceOrder(accoutDao, assetDao, walletDao, orderDao);
const markets = new GetDepth(assetDao, orderDao);

beforeAll(() => {
    assetDao.create(btc);
    assetDao.create(usd);
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
