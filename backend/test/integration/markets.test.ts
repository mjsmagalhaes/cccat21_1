import { AccountService } from "../../src/application/account/index";
import { ConfigService } from "../../src/service/ConfigService";
import { MemoryRepositoryFactory } from "../../src/DAO/Memory/DAOMemory";

import Debug from "debug";
import { OrderService } from "../../src/application/order";

Debug.disable();
Debug.enable("place_order,withdraw,deposit,db:*,error");

const testAccount = ConfigService.getTestAccount();
const btc = ConfigService.getTestAsset("btc");
const usd = ConfigService.getTestAsset("usd");

const factory = new MemoryRepositoryFactory();
const accountService = new AccountService(factory);
const orderService = new OrderService(factory);

beforeAll(() => {
    factory.createAssetDAO().create(btc);
    factory.createAssetDAO().create(usd);
});

afterAll(() => { });

test("Retorna book de um asset", async () => {
    const { accountId } = await accountService.signup.execute(testAccount);
    await accountService.getAccount.execute(accountId);
    await accountService.deposit.execute(accountId, btc.ticker, 100);
    await accountService.deposit.execute(accountId, usd.ticker, 1000000);

    await orderService.placeOrder.execute(accountId, {
        accountId,
        marketId: "BTC/USD",
        side: "buy",
        quantity: 10,
        price: 10000,
    });

    await orderService.placeOrder.execute(accountId, {
        accountId,
        marketId: "BTC/USD",
        side: "buy",
        quantity: 10,
        price: 10001,
    });

    const orderBook = await orderService.getDepth.execute("BTC");
    expect(orderBook).toBeDefined();
    expect(orderBook["10000"]).toBeDefined();
    expect(orderBook["10000"]).toHaveLength(2);
});
