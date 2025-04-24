import axios from "axios";

axios.defaults.validateStatus = () => true;

beforeAll(() => {});

afterAll(() => {});

test("Não deve depositar se a conta não existir", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/deposit", {
        accountId: "123",
    });

    const outputSignup = responseDeposit.data;
    expect(outputSignup.error).toBe("Account not found.");
});

test("Não deve depositar se o asset não existir", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/deposit", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        assetId: "",
    });

    const outputSignup = responseDeposit.data;
    expect(outputSignup.error).toBe("Asset not found.");
});

test("Não deve depositar se a quantidade for menor que zero", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/deposit", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        assetId: "BTC",
        quantity: 0,
    });

    const outputSignup = responseDeposit.data;
    expect(outputSignup.error).toBe("Wrong quantity.");
});

test("Deve criar um deposito", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/deposit", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        assetId: "BTC",
        quantity: 100,
    });

    const outputSignup = responseDeposit.data;
    expect(outputSignup.status).toBe("ok");
});
