import axios from "axios";

axios.defaults.validateStatus = () => true;

beforeAll(async () => { });

afterAll(async () => { });

test("Não deve retirar se a conta não existir", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/withdraw", {
        accountId: "123",
    });

    const outputWithdraw = responseDeposit.data;
    expect(outputWithdraw.error).toBe("Account not found.");
});

test("Não deve retirar se o asset não existir", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/withdraw", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        assetId: "",
    });

    const outputWithdraw = responseDeposit.data;
    expect(outputWithdraw.error).toBe("Asset not found.");
});

test("Não deve retirar se a quantidade for menor que zero", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/withdraw", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        assetId: "BTC",
        quantity: 0,
    });

    const outputWithdraw = responseDeposit.data;
    expect(outputWithdraw.error).toBe("Bad Withdraw request.");
});

test("Não deve retirar se a quantidade for maior que o disponível", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/withdraw", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        assetId: "BTC",
        quantity: 12000,
    });

    const outputWithdraw = responseDeposit.data;
    expect(outputWithdraw.error).toBe("Insufficient funds.");
});

test("Deve fazer uma retirada", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/withdraw", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        assetId: "BTC",
        quantity: 1,
    });

    const outputWithdraw = responseDeposit.data;
    console.log(outputWithdraw);
    expect(outputWithdraw.status).toBe("ok");
});