import Account from "../../domain/entity/Account";
import type { MailerGateway } from "../../infra/gateway/MailerGateway";
import type { AccountRepository } from "../../infra/repository/AccountRepository";

export default class Signup {
	constructor(
		readonly accountRepository: AccountRepository,
		readonly mailerGateway: MailerGateway,
	) {}

	async execute(input: Input): Promise<Output> {
		const existingAccount = await this.accountRepository.getAccountByEmail(
			input.email,
		);

		if (existingAccount) throw new Error("Account already exists");
		const account = Account.create(
			input.name,
			input.email,
			input.cpf,
			input.carPlate || "",
			input.isPassenger,
			input.isDriver,
		);

		await this.accountRepository.saveAccount(account);
		await this.mailerGateway.send(account.getEmail(), "Welcome", "");

		return {
			accountId: account.accountId,
		};
	}
}

interface Input {
	name: string;
	email: string;
	cpf: string;
	carPlate?: string;
	isPassenger?: boolean;
	isDriver?: boolean;
}

interface Output {
	accountId: string;
}
