import { ConfigService } from "../../src/service/ConfigService";
import { MemoryRepositoryFactory } from "../../src/DAO";
import { AccountService } from "../../src/application/account";
import debug from "debug";
debug.enable('dao:*')

const factory = new MemoryRepositoryFactory();
const accountService = new AccountService(factory);

// Test Data
const account = ConfigService.getTestAccount();
const btc = ConfigService.getTestAsset("btc");

beforeAll(() => {
    factory.createAssetDAO().create(btc);
});

test("Não deve retirar se a conta não existir", async () => {
    expect(async () => {
        await accountService.withdraw.execute(account.id, btc.ticker, 1);
    }).rejects.toThrow("Account not found.");
});

test("Não deve retirar se o asset não existir", async () => {
    accountService.signup.execute(account);

    expect(async () => {
        await accountService.withdraw.execute(account.id, "", 1);
    }).rejects.toThrow("Asset not found.");
});

test("Não deve retirar se a quantidade for menor ou igual a zero", async () => {
    accountService.signup.execute(account);
    expect(async () => {
        await accountService.withdraw.execute(account.id, btc.ticker, 0);
    }).rejects.toThrow("Bad Withdraw request.");
});

test("Não deve retirar se a quantidade for maior que o disponível", async () => {
    accountService.signup.execute(account);

    expect(async () => {
        await accountService.withdraw.execute(account.id, btc.ticker, 12000);
    }).rejects.toThrow("Insufficient funds.");
});

test("Deve fazer uma retirada", async () => {
    accountService.signup.execute(account);
    accountService.deposit.execute(account.id, btc.ticker, 10);

    const output = await accountService.withdraw.execute(account.id, btc.ticker, 1);

    expect(output.status).toBe('ok');
});