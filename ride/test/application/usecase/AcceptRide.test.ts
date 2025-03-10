import { expect, test } from "vitest";

import AcceptRide from "../../../src/application/usecase/AcceptRide";
import GetRide from "../../../src/application/usecase/GetRide";
import RequestRide from "../../../src/application/usecase/RequestRide";
import { PgPromiseAdapter } from "../../../src/infra/database/DatabaseConnection";
import { AccountGatewayHttp } from "../../../src/infra/gateway/AccountGatewayHttp";
import { FetchAdapter } from "../../../src/infra/http/HttClient";
import { PositionRepositoryDataBase } from "../../../src/infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../../src/infra/repository/RideRepository";

test("Should be able to accept a ride", async () => {
	const databaseConnection = new PgPromiseAdapter();
	const accountGateway = new AccountGatewayHttp(new FetchAdapter());
	const positionRepository = new PositionRepositoryDataBase(databaseConnection);
	const inputSignup = {
		name: "John Doe",
		email: `joh.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const inputSignupDriver = {
		name: "John Doe",
		email: `joh.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "AAA9999",
		isDriver: true,
	};
	const outputSignup = await accountGateway.signup(inputSignup);
	const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
	const rideRepository = new RideRepositoryDatabase(databaseConnection);
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
		driverId: outputSignupDriver.accountId,
	};

	await acceptRide.execute(inputAcceptRide);
	const inputGetRide = {
		rideId: outputRequestRide.rideId,
	};
	const getRide = new GetRide(
		rideRepository,
		positionRepository,
		accountGateway,
	);
	const outputGetRide = await getRide.execute(inputGetRide);

	expect(outputGetRide.passengerId).toEqual(outputSignup.accountId);
	expect(outputGetRide.status).toEqual("accepted");
	expect(outputGetRide.driverName).toEqual(inputSignupDriver.name);
	await databaseConnection.close();
});
