import type ProcessPayment from "../../application/usecase/ProcessPayment";
import type HttpServer from "./HttpServer";

export default class PaymentController {
	constructor(
		readonly httpServer: HttpServer,
		readonly processPayment: ProcessPayment,
	) {
		httpServer.register(
			"post",
			"/process_payment",
			async (_parameters: any, body: any): Promise<void> => {
				await processPayment.execute(body);
			},
		);
	}
}
