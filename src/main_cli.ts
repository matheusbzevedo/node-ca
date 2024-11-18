import { Signup } from './application/usecase/Signup';
import { MailerGatewayMemory } from './infra/gateway/MailerGateway';
import { AccountRepositoryMemory } from './infra/repository/AccountRepository';

let input: any = {};

process.stdin.on('data', async function (chunk) {
  const command = chunk.toString().replace(/\n/g, '');

  if (command.startsWith('name')) input.name = command.replace('name ', '');
  if (command.startsWith('email')) input.email = command.replace('email ', '');
  if (command.startsWith('cpf')) input.cpf = command.replace('cpf ', '');

  if (command.startsWith('signup')) {
    const accountDao = new AccountRepositoryMemory();
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountDao, mailerGateway);
    const output = await signup.execute(input);
    console.log(output);
  }
});
