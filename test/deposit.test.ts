import { Signup } from "./../backend/application/account/Signup";
import { ConfigService } from "../backend/service/ConfigService";
import { Deposit } from "../backend/application/Deposit";
import { DAOMemoryFactory } from "../backend/DAO/Memory/DAOMemory";

const account = ConfigService.getTestAccount();
const btc = ConfigService.getTestAsset("btc");
const factory = new DAOMemoryFactory();
const deposit = new Deposit(factory);
const signup = new Signup(factory);

beforeAll(() => {
    factory.createAssetDAO().create(btc);
});

afterAll(() => {});

test("Não deve depositar se a conta não existir", async () => {
    expect(async () => {
        await deposit.execute(account.id, btc.ticker, 1);
    }).rejects.toThrow("Entity not found.");

    signup.execute(account);

    // expect(outputDeposit.error).toBe("Account not found.");
});

test("Não deve depositar se o asset não existir", async () => {
    expect(async () => {
        await deposit.execute(account.id, "", 1);
    }).rejects.toThrow("Asset not found.");
});

test("Não deve depositar se a quantidade for menor que zero", async () => {
    expect(async () => {
        await deposit.execute(account.id, btc.ticker, 0);
    }).rejects.toThrow("Bad Deposit request.");
});

test("Deve criar um deposito", async () => {
    const outputDeposit = await deposit.execute(account.id, btc.ticker, 1);

    expect(outputDeposit).toBeDefined();
    expect(outputDeposit).toHaveProperty("id");
    expect(outputDeposit).toHaveProperty("account_id", account.id);
    expect(outputDeposit).toHaveProperty("asset_id", btc.id);
    expect(outputDeposit).toHaveProperty("quantity", 1);
});
