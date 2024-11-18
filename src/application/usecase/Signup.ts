import Account from '../../domain/Account';
import { MailerGateway } from '../../infra/gateway/MailerGateway';
import { AccountRepository } from '../../infra/repository/AccountRepository';

export class Signup {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly mailerGateway: MailerGateway,
  ) {}

  async execute(input: any): Promise<Output> {
    const existingAccount = await this.accountRepository.getAccountByEmail(
      input.email,
    );
    if (existingAccount) throw new Error('Account already exists');
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      input.isPassenger,
      input.isDriver,
    );
    await this.accountRepository.saveAccount(account);
    await this.mailerGateway.send(account.email, `Welcome`, '');
    return {
      accountId: account.accountId,
    };
  }
}

interface Output {
  accountId: string;
}
