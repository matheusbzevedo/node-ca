import { expect, test } from "vitest";

import AcceptRide from "../../../src/application/usecase/AcceptRide";
import FinishRide from "../../../src/application/usecase/FinishRide";
import GetRide from "../../../src/application/usecase/GetRide";
import RequestRide from "../../../src/application/usecase/RequestRide";
import StartRide from "../../../src/application/usecase/StartRide";
import UpdatePosition from "../../../src/application/usecase/UpdatePosition";
import {
	PgPromiseAdapter,
	UnitOfWork,
} from "../../../src/infra/database/DatabaseConnection";
import Registry from "../../../src/infra/di/Registry";
import { AccountGatewayHttp } from "../../../src/infra/gateway/AccountGatewayHttp";
import PaymentGatewayHttp from "../../../src/infra/gateway/PaymentGatewayHttp";
import { FetchAdapter } from "../../../src/infra/http/HttClient";
import Mediator from "../../../src/infra/mediator/Mediator";
import { RabbitMQAdapter } from "../../../src/infra/queue/Queue";
import { PositionRepositoryDataBase } from "../../../src/infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../../src/infra/repository/RideRepository";

test("Should be able to finish ride", async (): Promise<void> => {
	const connection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const positionRepository = new PositionRepositoryDataBase(connection);
	const accountGateway = new AccountGatewayHttp(new FetchAdapter());
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputSignup = await accountGateway.signup(inputSignup);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "AAA9999",
		isDriver: true,
	};
	const outPutSignupDriver = await accountGateway.signup(inputSignupDriver);
	const requestRide = new RequestRide(rideRepository, accountGateway);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584_905_257_808_835,
		fromLong: -48.545_022_195_325_124,
		toLat: -27.496_887_588_317_275,
		toLong: -48.522_234_807_851_476,
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const acceptRide = new AcceptRide(rideRepository, accountGateway);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outPutSignupDriver.accountId,
	};

	await acceptRide.execute(inputAcceptRide);
	const startRide = new StartRide(rideRepository);
	const inputStartRide = {
		rideId: outputRequestRide.rideId,
	};

	await startRide.execute(inputStartRide);
	const unitOfWork = new UnitOfWork();
	const rideRepositoryUoW = new RideRepositoryDatabase(unitOfWork);
	const positionRepositoryUoW = new PositionRepositoryDataBase(unitOfWork);
	const updatePosition = new UpdatePosition(
		rideRepositoryUoW,
		positionRepositoryUoW,
	);
	const inputUpdatePosition1 = {
		rideId: outputRequestRide.rideId,
		lat: -27.584_905_257_808_835,
		long: -48.545_022_195_325_124,
		date: new Date("2023-03-01T21:30:00"),
	};

	await updatePosition.execute(inputUpdatePosition1);
	const inputUpdatePosition2 = {
		rideId: outputRequestRide.rideId,
		lat: -27.496_887_588_317_275,
		long: -48.522_234_807_851_476,
		date: new Date("2023-03-01T22:30:00"),
	};

	await updatePosition.execute(inputUpdatePosition2);
	const inputUpdatePosition3 = {
		rideId: outputRequestRide.rideId,
		lat: -27.584_905_257_808_835,
		long: -48.545_022_195_325_124,
		date: new Date("2023-03-01T23:30:00"),
	};

	await updatePosition.execute(inputUpdatePosition3);
	const inputGetRide = {
		rideId: outputRequestRide.rideId,
	};
	const inputFinishRide = {
		rideId: outputRequestRide.rideId,
	};
	const paymentGateway = new PaymentGatewayHttp();

	Registry.getInstance().provide("rideRepository", rideRepository);
	Registry.getInstance().provide("paymentGateway", paymentGateway);
	const mediator = new Mediator();
	const queue = new RabbitMQAdapter();
	await queue.connect();
	// mediator.register('rideCompleted', async (data: any) => {
	//   const processPayment = new ProcessPayment();
	//   await processPayment.execute(data);
	// });
	Registry.getInstance().provide("queue", queue);
	Registry.getInstance().provide("mediator", mediator);
	const finishRide = new FinishRide();

	await finishRide.execute(inputFinishRide);
	const getRide = new GetRide(
		rideRepository,
		positionRepository,
		accountGateway,
	);
	const outputGetRide = await getRide.execute(inputGetRide);

	expect(outputGetRide.passengerId).toEqual(outputSignup.accountId);
	expect(outputGetRide.fare).toBe(63);
	expect(outputGetRide.status).toBe("completed");
	await connection.close();
	await unitOfWork.close();
});
