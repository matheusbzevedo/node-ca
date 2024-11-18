import { GetAccount } from '../../application/usecase/GetAccount';
import { Signup } from '../../application/usecase/Signup';
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
      async function (_params: any, body: any) {
        const output = await signup.execute(body);
        return output;
      },
    );

    httpServer.register(
      'get',
      '/accounts/{accountId}',
      async function (params: any, _body: any) {
        const output = await getAccount.execute(params.accountId);
        return output;
      },
    );
  }
}
