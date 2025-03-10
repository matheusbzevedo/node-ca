import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { HapiAdapter } from "./infra/http/HttpServer";

const httpServer = new HapiAdapter();
const pgpAdapter = new PgPromiseAdapter();

httpServer.listen(3000);
