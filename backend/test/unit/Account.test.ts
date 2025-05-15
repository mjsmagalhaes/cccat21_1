import { Account } from "../../src/domain/entity";
import { ConfigService } from "../../src/service/ConfigService";

const testAccount = ConfigService.getTestAccount();

test("Deve criar uma conta válida", async () => {
    const account = Account.create(testAccount);

    expect(account).toBeDefined();
    expect(account.toDto().name).toBe(testAccount.name);
    expect(account.toDto().email).toBe(testAccount.email);
    expect(account.toDto().document).toBe(testAccount.document);
});
