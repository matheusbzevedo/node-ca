import amqp from "amqplib";

(async (): Promise<void> => {
	const connection = await amqp.connect("amqp://localhost");
	const channel = await connection.createChannel();
	channel.consume("rideCompleted.processPayment", (msg) => {
		const input = JSON.parse(msg?.content.toString() || "");
		console.log("Processing payment: ", input);
		channel.ack(msg as amqp.Message);
	});
})();
