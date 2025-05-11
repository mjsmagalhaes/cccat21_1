import { Account } from "../../src/entity";
import { ConfigService } from "../../src/service/ConfigService";

const testAccount = ConfigService.getTestAccount();

test("Deve criar uma conta válida", async () => {
    const account = Account.create(testAccount);

    expect(account).toBeDefined()
    expect(account.toVo().name).toBe(testAccount.name);
    expect(account.toVo().email).toBe(testAccount.email);
    expect(account.toVo().document).toBe(testAccount.document);
});
