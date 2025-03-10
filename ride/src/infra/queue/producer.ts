import amqp from "amqplib";

(async (): Promise<void> => {
	const connection = await amqp.connect("amqp://localhost");
	const channel = await connection.createChannel();
	await channel.assertExchange("rideCompleted", "direct", { durable: true });
	await channel.assertQueue("rideCompleted.processPayment", { durable: true });
	await channel.assertQueue("rideCompleted.sendReceipt", { durable: true });
	await channel.bindQueue("rideCompleted.processPayment", "rideCompleted", "");
	const input = {
		rideId: "abc",
		amout: 1000,
	};
	channel.publish("rideCompleted", "", Buffer.from(JSON.stringify(input)));
})();
