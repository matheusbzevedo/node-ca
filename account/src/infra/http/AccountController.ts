import type Signup from "../../application/usecase/Signup";
import type { GetAccount } from "./../../application/usecase/GetAccount";
import type HttpServer from "./HttpServer";

export default class AccountController {
	constructor(
		readonly httpServer: HttpServer,
		readonly signup: Signup,
		readonly getAccount: GetAccount,
	) {
		httpServer.register(
			"post",
			"/signup",
			async (_parameters: any, body: any) => {
				const output = await signup.execute(body);

				return output;
			},
		);

		httpServer.register(
			"get",
			"/accounts/{accountId}",
			async (parameters: any, _body: any) => {
				const output = await getAccount.execute(parameters.accountId);

				return output;
			},
		);
	}
}
