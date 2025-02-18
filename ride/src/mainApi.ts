import { GetAccount } from './application/usecase/GetAccount';
import Signup from './application/usecase/Signup';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { MailerGatewayMemory } from './infra/gateway/MailerGateway';
import AccountController from './infra/http/AccountController';
import { HapiAdapter } from './infra/http/HttpServer';
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';

const httpServer = new HapiAdapter();
const pgpAdapter = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(pgpAdapter);
const mailerGateway = new MailerGatewayMemory();
const signup = new Signup(accountRepository, mailerGateway);
const getAccount = new GetAccount(accountRepository);

new AccountController(httpServer, signup, getAccount);

httpServer.listen(3000);
