import { randomUUID } from 'node:crypto';
import { validate } from './validateCpf';

export default class Account {
  private constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly carPlate?: string,
    readonly isPassenger?: boolean,
    readonly isDriver?: boolean,
  ) {
    if (!RegExp(/[a-zA-Z] [a-zA-Z]+/).exec(this.name))
      throw new Error('Invalid name');
    if (!RegExp(/^(.+)@(.+)$/).exec(this.email))
      throw new Error('Invalid email');
    if (!validate(this.cpf)) throw new Error('Invalid cpf');
    if (
      this.isDriver &&
      this.carPlate &&
      !RegExp(/[A-Z]{3}[0-9]{4}/).exec(this.carPlate)
    )
      throw new Error('Invalid car plate');
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    carPlate?: string,
    isPassenger?: boolean,
    isDriver?: boolean,
  ) {
    const accountId = randomUUID();
    return new Account(
      accountId,
      name,
      email,
      cpf,
      carPlate,
      isPassenger,
      isDriver,
    );
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate?: string,
    isPassenger?: boolean,
    isDriver?: boolean,
  ) {
    return new Account(
      accountId,
      name,
      email,
      cpf,
      carPlate,
      isPassenger,
      isDriver,
    );
  }
}
