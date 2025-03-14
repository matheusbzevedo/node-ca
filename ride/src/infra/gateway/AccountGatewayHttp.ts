import type AccountGateway from "../../application/gateway/AccountGateway";
import type { OutputSignup } from "../../application/gateway/AccountGateway";
import type HttpClient from "../http/HttClient";

export class AccountGatewayHttp implements AccountGateway {
	constructor(readonly httpClient: HttpClient) {}

	async signup(input: any): Promise<OutputSignup> {
		const response = await this.httpClient.post(
			"http://localhost:3002/signup",
			input,
		);

		return response;
	}

	async getAccountById(accountId: string): Promise<any> {
		const response = await this.httpClient.get(
			`http://localhost:3002/accounts/${accountId}`,
		);

		return response;
	}
}
