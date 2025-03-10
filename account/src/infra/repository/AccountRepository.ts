import Account from "../../domain/entity/Account";
import type DatabaseConnection from "../database/DatabaseConnection";

export interface AccountRepository {
	getAccountByEmail(email: string): Promise<Account | undefined>;
	getAccountById(accountId: string): Promise<Account | undefined>;
	saveAccount(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
	constructor(readonly databaseConnection: DatabaseConnection) {}

	async getAccountByEmail(email: string): Promise<Account | undefined> {
		const [account] = await this.databaseConnection.query(
			"select * from cccat16.account where email = $1",
			[email],
		);

		if (!account) return;

		return Account.restore(
			account.account_id,
			account.name,
			account.email,
			account.cpf,
			account.car_plate,
			account.is_passenger,
			account.is_driver,
		);
	}

	async getAccountById(accountId: string): Promise<Account | undefined> {
		const [account] = await this.databaseConnection.query(
			"select * from cccat16.account where account_id = $1",
			[accountId],
		);

		return Account.restore(
			account.account_id,
			account.name,
			account.email,
			account.cpf,
			account.car_plate,
			account.is_passenger,
			account.is_driver,
		);
	}

	async saveAccount(account: Account): Promise<void> {
		await this.databaseConnection.query(
			"insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
			[
				account.accountId,
				account.getName(),
				account.getEmail(),
				account.getCpf(),
				account.getCarPlate(),
				!!account.isPassenger,
				!!account.isDriver,
			],
		);
	}
}

export class AccountRepositoryMemory implements AccountRepository {
	accounts: Account[];

	constructor() {
		this.accounts = [];
	}

	async getAccountByEmail(email: string): Promise<Account | undefined> {
		const account = this.accounts.find(
			(ac: Account) => ac.getEmail() === email,
		);

		return account;
	}

	async getAccountById(accountId: string): Promise<Account | undefined> {
		const account = this.accounts.find(
			(ac: Account) => ac.accountId === accountId,
		);

		return account;
	}

	async saveAccount(account: Account): Promise<void> {
		this.accounts.push(account);
	}
}
