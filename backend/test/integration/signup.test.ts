import { AccountService } from "../../src/application/account";
import { MemoryRepositoryFactory } from "../../src/DAO";
import { ConfigService } from "../../src/service/ConfigService";

const account = ConfigService.getTestAccount();
const accountService = new AccountService(new MemoryRepositoryFactory())

test("Deve criar uma conta válida", async () => {
    const outputSignup = await accountService.signup.execute(Object.assign({}, account));
    expect(outputSignup.accountId).toBeDefined();

    const outputGetAccount = await accountService.getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(account.name);
    expect(outputGetAccount.email).toBe(account.email);
    expect(outputGetAccount.document).toBe(account.document);
});

test("Não deve criar uma conta com nome inválido", async () => {
    let testData = Object.assign({}, account);
    testData.name = "John";

    expect(async () => {
        const outputSignup = await accountService.signup.execute(testData);
    }).rejects.toThrow("Invalid name")
});

test("Não deve criar uma conta com email inválido", async () => {
    let testData = Object.assign({}, account);
    testData.email = "john.gmail.com";

    expect(async () => {
        const outputSignup = await accountService.signup.execute(testData);
    }).rejects.toThrow("Invalid email")
});

test.each(["111", "abc", "7897897897"])(
    "Não deve criar uma conta com cpf inválido",
    async (document: string) => {
        let testData = Object.assign({}, account);
        testData.document = document;

        expect(async () => {
            const outputSignup = await accountService.signup.execute(testData);
        }).rejects.toThrow("Invalid document")
    }
);

test("Não deve criar uma conta com senha inválida", async () => {
    let testData = Object.assign({}, account);
    testData.password = "1234";

    expect(async () => {
        const outputSignup = await accountService.signup.execute(testData);
    }).rejects.toThrow("Invalid password")
});
