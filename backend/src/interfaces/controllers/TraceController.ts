import Debug from "debug";
import { Application } from "../../application/Application";

export class TraderController {
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
            Debug("controller:trade")
        );
    }
}
