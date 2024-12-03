import { GetAccount } from '../../application/usecase/GetAccount';
import Signup from '../../application/usecase/Signup';
import HttpServer from './HttpServer';

export default class AccountController {
  constructor(
    readonly httpServer: HttpServer,
    readonly signup: Signup,
    readonly getAccount: GetAccount,
  ) {
    httpServer.register(
      'post',
      '/signup',
      async function (_parameters: any, body: any) {
        const output = await signup.execute(body);

        return output;
      },
    );

    httpServer.register(
      'get',
      '/accounts/{accountId}',
      async function (parameters: any, _body: any) {
        const output = await getAccount.execute(parameters.accountId);

        return output;
      },
    );
  }
}
