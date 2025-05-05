import axios from "axios";

axios.defaults.validateStatus = () => true;

beforeAll(async () => { });

afterAll(async () => { });

test("Não deve criar a ordem se a conta não existir", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/place_order", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f62",
        marketId: "BTC/USD",
        quantity: 1,
        price: 200
    });

    const outputDeposit = responseDeposit.data;
    expect(outputDeposit.error).toBe("Account not found.");
});

test("Não deve criar a ordem se o asset não existir", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/place_order", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        marketId: "BTç/USD",
        side: "sell",
        quantity: 1,
        price: 200
    });

    const outputWithdraw = responseDeposit.data;
    expect(outputWithdraw.error).toBe("Asset not found.");
});

test("Não deve criar a ordem se não informação de side", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/place_order", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        marketId: "BTC/USD",
        quantity: 1,
    });

    const outputWithdraw = responseDeposit.data;
    expect(outputWithdraw.error).toBe("Order missing information.");
});

test("Não deve criar a ordem se não informação de preço", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/place_order", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        marketId: "BTC/USD",
        quantity: 1,
    });

    const outputWithdraw = responseDeposit.data;
    expect(outputWithdraw.error).toBe("Order missing information.");
});

test("Não deve criar a ordem se não informação de quantidade", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/place_order", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        marketId: "BTC/USD",
    });

    const outputWithdraw = responseDeposit.data;
    expect(outputWithdraw.error).toBe("Order missing information.");
});

test("Não deve criar a ordem se não há saldo disponível BUY", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/place_order", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        marketId: "BTC/USD",
        side: 'buy',
        quantity: 1,
        price: 200
    });

    const outputWithdraw = responseDeposit.data;
    expect(outputWithdraw.error).toBe("Insufficient funds.");
});

test("Não deve criar a ordem se não há saldo disponível SELL", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/place_order", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        marketId: "BTC/USD",
        side: 'sell',
        quantity: 1200,
        price: 200
    });

    const outputWithdraw = responseDeposit.data;
    expect(outputWithdraw.error).toBe("Insufficient funds.");
});