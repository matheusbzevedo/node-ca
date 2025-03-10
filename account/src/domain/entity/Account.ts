import { randomUUID } from "node:crypto";

import CarPlate from "./../vo/CarPlate";
import Cpf from "./../vo/Cpf";
import Email from "./../vo/Email";
import Name from "./../vo/Name";

export default class Account {
	private constructor(
		readonly accountId: string,
		private name: Name,
		private email: Email,
		private cpf: Cpf,
		private carPlate: CarPlate,
		readonly isPassenger?: boolean,
		readonly isDriver?: boolean,
	) {}

	static create(
		name: string,
		email: string,
		cpf: string,
		carPlate: string,
		isPassenger?: boolean,
		isDriver?: boolean,
	): Account {
		const accountId = randomUUID();

		return new Account(
			accountId,
			new Name(name),
			new Email(email),
			new Cpf(cpf),
			new CarPlate(carPlate),
			isPassenger,
			isDriver,
		);
	}

	static restore(
		accountId: string,
		name: string,
		email: string,
		cpf: string,
		carPlate: string,
		isPassenger?: boolean,
		isDriver?: boolean,
	): Account {
		return new Account(
			accountId,
			new Name(name),
			new Email(email),
			new Cpf(cpf),
			new CarPlate(carPlate),
			isPassenger,
			isDriver,
		);
	}

	public getName(): string {
		return this.name.getValue();
	}

	public getEmail(): string {
		return this.email.getValue();
	}

	public getCpf(): string {
		return this.cpf.getValue();
	}

	public getCarPlate(): string {
		return this.carPlate.getValue();
	}
}
