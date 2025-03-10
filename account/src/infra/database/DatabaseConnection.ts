import pgp from "pg-promise";

export default interface DatabaseConnection {
	close(): Promise<void>;
	commit(): Promise<void>;
	query(
		statement: string,
		parameters: any,
		transactional?: boolean,
	): Promise<any>;
}

export class PgPromiseAdapter implements DatabaseConnection {
	connection: any;

	constructor() {
		this.connection = pgp()(
			"postgres://matheusbzevedo@localhost:5432/matheusbzevedo",
		);
	}

	async close(): Promise<void> {
		return this.connection.$pool.end();
	}

	async commit(): Promise<void> {
		//
	}

	async query(statement: string, parameters: any): Promise<any> {
		return this.connection.query(statement, parameters);
	}
}

export class UnitOfWork implements DatabaseConnection {
	connection: any;
	statements: { statement: string; parameters: any }[];

	constructor() {
		this.connection = pgp()(
			"postgres://matheusbzevedo@localhost:5432/matheusbzevedo",
		);
		this.statements = [];
	}

	async close(): Promise<void> {
		return this.connection.$pool.end();
	}

	async commit(): Promise<void> {
		await this.connection.tx(async (t: any) => {
			const transactions = [];

			for (const statement of this.statements) {
				transactions.push(
					await t.query(statement.statement, statement.parameters),
				);
			}

			return t.batch(transactions);
		});
	}

	async query(
		statement: string,
		parameters: any,
		transactional = false,
	): Promise<any> {
		if (!transactional) return this.connection.query(statement, parameters);

		this.statements.push({ statement, parameters });
	}
}
