import WebSocket from "ws";
import sinon from "sinon";
import Debug from "debug";

import { OrderService } from "../../src/application/order";
import { MemoryRepositoryFactory } from "../../src/DAO";
import { ConfigService } from "../../src/service/ConfigService";
import { AccountService } from "../../src/application/account";
import { OrderDTO } from "../../src/domain/entity";

const testAccount = ConfigService.getTestAccount();
const btc = ConfigService.getTestAsset("btc");
const usd = ConfigService.getTestAsset("usd");

const debug = Debug("test");
Debug.enable("error:*");

test("Não deve criar a ordem se a conta não existir", async () => {
    const factory = new MemoryRepositoryFactory();
    const orderService = new OrderService(factory);

    expect(
        async () =>
            await orderService.placeOrder.execute({
                accountId: testAccount.id,
                marketId: "BTC/USD",
                price: "200",
                quantity: "1",
                side: "buy",
            })
    ).rejects.toThrow("Account not found.");
});

test("Não deve criar a ordem se o asset não existir", async () => {
    const factory = new MemoryRepositoryFactory();
    const orderService = new OrderService(factory);
    const accountService = new AccountService(factory);

    accountService.signup.execute(testAccount);

    expect(
        async () =>
            await orderService.placeOrder.execute({
                accountId: testAccount.id,
                marketId: "BTÇ/USD",
                side: "buy",
                price: "200",
                quantity: "1",
            })
    ).rejects.toThrow("Asset not found.");
});

test("Não deve criar a ordem se não informação de side", async () => {
    const factory = new MemoryRepositoryFactory();
    const orderService = new OrderService(factory);
    const accountService = new AccountService(factory);

    factory.createAssetDAO().create(btc);
    factory.createAssetDAO().create(usd);
    accountService.signup.execute(testAccount);

    expect(
        async () =>
            await orderService.placeOrder.execute({
                accountId: testAccount.id,
                marketId: "BTC/USD",
                // side: "buy",
                price: 200,
                quantity: 1,
            } as any)
    ).rejects.toThrow("Order missing information.");
});

test("Não deve criar a ordem se não informação de preço", async () => {
    const factory = new MemoryRepositoryFactory();
    const orderService = new OrderService(factory);
    const accountService = new AccountService(factory);

    factory.createAssetDAO().create(btc);
    factory.createAssetDAO().create(usd);
    accountService.signup.execute(testAccount);

    expect(
        async () =>
            await orderService.placeOrder.execute({
                accountId: testAccount.id,
                marketId: "BTC/USD",
                side: "buy",
                // price: 200,
                quantity: 1,
            } as any)
    ).rejects.toThrow("Order missing information.");
});

test("Não deve criar a ordem se não informação de quantidade", async () => {
    const factory = new MemoryRepositoryFactory();
    const orderService = new OrderService(factory);
    const accountService = new AccountService(factory);

    factory.createAssetDAO().create(btc);
    factory.createAssetDAO().create(usd);
    accountService.signup.execute(testAccount);

    expect(
        async () =>
            await orderService.placeOrder.execute({
                accountId: testAccount.id,
                marketId: "BTC/USD",
                side: "buy",
                price: 200,
                // quantity: 1,
            } as any)
    ).rejects.toThrow("Order missing information.");
});

test("Não deve criar a ordem se não há saldo disponível BUY", async () => {
    const factory = new MemoryRepositoryFactory();
    const orderService = new OrderService(factory);
    const accountService = new AccountService(factory);

    factory.createAssetDAO().create(btc);
    factory.createAssetDAO().create(usd);
    accountService.signup.execute(testAccount);

    expect(
        async () =>
            await orderService.placeOrder.execute({
                accountId: testAccount.id,
                marketId: "BTC/USD",
                side: "buy",
                quantity: 10000,
                price: 2000000,
            } as any)
    ).rejects.toThrow("Insufficient funds.");
});

test("Não deve criar a ordem se não há saldo disponível SELL", async () => {
    const factory = new MemoryRepositoryFactory();
    const orderService = new OrderService(factory);
    const accountService = new AccountService(factory);

    factory.createAssetDAO().create(btc);
    factory.createAssetDAO().create(usd);
    accountService.signup.execute(testAccount);

    expect(
        async () =>
            await orderService.placeOrder.execute({
                accountId: testAccount.id,
                marketId: "BTC/USD",
                side: "sell",
                quantity: 10000,
                price: 2000000,
            } as any)
    ).rejects.toThrow("Insufficient funds.");
});

test("Deve criar a ordem", async () => {
    const factory = new MemoryRepositoryFactory();
    const orderService = new OrderService(factory);
    const accountService = new AccountService(factory);

    factory.createAssetDAO().create(btc);
    factory.createAssetDAO().create(usd);

    accountService.signup.execute(testAccount);
    accountService.deposit.execute(testAccount.id, btc.ticker, "1");

    const handler = {
        message: function (obj: OrderDTO) {
            debug(obj);
            return obj;
        },
    };

    let spy = sinon.spy(handler);

    orderService.placeOrder.getChannel().subscribe(handler.message);

    await accountService.deposit.execute(testAccount.id, btc.ticker, "10");

    const output = await orderService.placeOrder.execute({
        accountId: testAccount.id,
        marketId: "BTC/USD",
        side: "sell",
        quantity: 1,
        price: 1000,
    } as any);

    expect(spy.message.calledOnce).toBe(true);
    expect(spy.message.returnValues[0].asset_id).toEqual(btc.id);
    expect(spy.message.returnValues[0].asset_payment_id).toEqual(usd.id);
    spy.message.restore();
});

// test("Deve criar a ordem", async () => {
//     const factory = new MemoryRepositoryFactory()
//     const orderService = new OrderService(factory);
//     const accountService = new AccountService(factory);

//     factory.createAssetDAO().create(btc);
//     accountService.signup.execute(testAccount);
//     accountService.deposit.execute(testAccount.id, btc.ticker, 1)

//     const handler = {
//         message: function (ws2: Buffer) {
//             let obj = JSON.parse(ws2.toString());
//             debug(obj);
//             return obj.message;
//         },
//     };

//     let spy = sinon.spy(handler);

//     const ws = new WebSocket("http://localhost:3000/live");
//     ws.on("message", handler.message);

//     ws.on("open", () => {
//         debug("New WS Client connected!");
//     });

//     const responseDeposit = await axios.post("http://localhost:3000/deposit", {
//         accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
//         assetId: "USD",
//         side: "buy",
//         quantity: 1000000,
//         price: 1,
//     });

//     const outputDeposit = responseDeposit.data;
//     expect(outputDeposit.status).toBe("ok");

//     const responsePlaceOrder = await axios.post(
//         "http://localhost:3000/place_order",
//         {
//             accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
//             marketId: "BTC/USD",
//             side: "buy",
//             quantity: 1,
//             price: 200,
//         }
//     );

//     expect(responsePlaceOrder.status).toBe(200);
//     expect(spy.message.calledOnce).toBe(true);
//     expect(spy.message.returnValues[0]).toEqual("New Order!");
//     spy.message.restore();
//     ws.close();
// });
