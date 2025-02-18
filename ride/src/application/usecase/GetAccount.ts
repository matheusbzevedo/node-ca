import { AccountRepository } from '../../infra/repository/AccountRepository';

export class GetAccount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getAccountById(accountId);

    return {
      accountId: account!.accountId,
      carPlate: account!.getCarPlate(),
      cpf: account!.getCpf(),
      email: account!.getEmail(),
      isDriver: account?.isDriver,
      isPassenger: account?.isPassenger,
      name: account!.getName(),
    };
  }
}

type Output = {
  accountId: string;
  carPlate: string;
  cpf: string;
  email: string;
  isDriver?: boolean;
  isPassenger?: boolean;
  name: string;
};
