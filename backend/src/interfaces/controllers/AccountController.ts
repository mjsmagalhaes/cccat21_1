import Debug from "debug";
import { Application } from "../../application/Application";

export class AccountController {
    static config() {
        const account = Application.getAccountService();

        Application.getHttpServer().route(
            "post",
            "/signup",
            async ({ body, params, query }) => {
                return await account.signup.execute({
                    id: body.id,
                    name: body.name,
                    email: body.email,
                    document: body.document,
                    password: body.password,
                });
            },
            Debug("controller:account")
        );

        Application.getHttpServer().route(
            "post",
            "/account/:accountId",
            async ({ body, params, query }) => {
                return await account.getAccount.execute(params.accountId);
            },
            Debug("controller:account")
        );

        Application.getHttpServer().route(
            "post",
            "/deposit",
            async ({ body, params, query }) => {
                return await account.deposit.execute(
                    params.accountId,
                    params.assetId,
                    params.quantity
                );
            },
            Debug("controller:account")
        );

        Application.getHttpServer().route(
            "post",
            "/withdraw",
            async ({ body, params, query }) => {
                return await account.withdraw.execute(
                    body.accountId,
                    body.assetId,
                    body.quantity
                );
            },
            Debug("controller:account")
        );
    }
}
