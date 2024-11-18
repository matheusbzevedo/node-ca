import { AccountRepository } from '../../infra/repository/AccountRepository';

export class GetAccount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<any> {
    const account = await this.accountRepository.getAccountById(accountId);
    return account;
  }
}
