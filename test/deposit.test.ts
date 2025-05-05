import axios from "axios";
import { ConfigService } from "../backend/service/ConfigService";
import { Deposit } from "../backend/application/Deposit";
import { AccountDAODatabase, WalletDAODatabase } from "../backend/DAO/DB";
import { AssetDAODatabase } from "../backend/DAO/DB/AssetDAODatabase";

axios.defaults.validateStatus = () => true;

const account = ConfigService.getTestAccount();
const btc = ConfigService.getTestAsset("btc");
const deposit = new Deposit(
    new AccountDAODatabase(),
    new AssetDAODatabase(),
    new WalletDAODatabase()
);

beforeAll(() => {});

afterAll(() => {});

test("Não deve depositar se a conta não existir", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/deposit", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f92",
        assetId: "BTC",
        quantity: 1,
    });

    const outputDeposit = responseDeposit.data;
    expect(outputDeposit.error).toBe("Account not found.");
});

test("Não deve depositar se o asset não existir", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/deposit", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        assetId: "",
        quantity: 1,
    });

    const outputDeposit = responseDeposit.data;
    expect(outputDeposit.error).toBe("Asset not found.");
});

test("Não deve depositar se a quantidade for menor que zero", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/deposit", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        assetId: "BTC",
        quantity: 0,
    });

    const outputDeposit = responseDeposit.data;
    expect(outputDeposit.error).toBe("Bad Deposit request.");
});

test("Deve criar um deposito", async () => {
    const responseDeposit = await axios.post("http://localhost:3000/deposit", {
        accountId: "1fb6e901-f4de-4653-80e7-07c207073f61",
        assetId: "BTC",
        quantity: 100,
    });

    const outputDeposit = responseDeposit.data;
    console.log(outputDeposit);
    expect(outputDeposit.status).toBe("ok");
});
