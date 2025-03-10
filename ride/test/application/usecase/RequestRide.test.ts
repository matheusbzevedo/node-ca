import { expect, test } from "vitest";

import GetRide from "../../../src/application/usecase/GetRide";
import RequestRide from "../../../src/application/usecase/RequestRide";
import { PgPromiseAdapter } from "../../../src/infra/database/DatabaseConnection";
import { AccountGatewayHttp } from "../../../src/infra/gateway/AccountGatewayHttp";
import { AxiosAdapter, FetchAdapter } from "../../../src/infra/http/HttClient";
import { PositionRepositoryDataBase } from "../../../src/infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../../src/infra/repository/RideRepository";

test("Should be able to request ride", async () => {
	const databaseConnection = new PgPromiseAdapter();
	const accountGateway = new AccountGatewayHttp(new AxiosAdapter());
	const inputSignup = {
		name: "John Doe",
		email: `joh.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputSignup = await accountGateway.signup(inputSignup);
	const rideDAO = new RideRepositoryDatabase(databaseConnection);
	const positionRepository = new PositionRepositoryDataBase(databaseConnection);
	const requestRide = new RequestRide(rideDAO, accountGateway);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584_905_257_808_835,
		fromLong: -48.545_022_195_325_124,
		toLat: -27.496_887_588_317_275,
		toLong: -48.522_234_807_851_476,
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide);

	expect(outputRequestRide.rideId).toBeDefined();
	const inputGetRide = {
		rideId: outputRequestRide.rideId,
	};
	const getRide = new GetRide(rideDAO, positionRepository, accountGateway);
	const outputGetRide = await getRide.execute(inputGetRide);
	expect(outputGetRide.passengerId).toEqual(outputSignup.accountId);
	expect(outputGetRide.status).toEqual("requested");
	expect(outputGetRide.fromLat).toEqual(inputRequestRide.fromLat);
	expect(outputGetRide.fromLong).toEqual(inputRequestRide.fromLong);
	expect(outputGetRide.toLat).toEqual(inputRequestRide.toLat);
	expect(outputGetRide.toLong).toEqual(inputRequestRide.toLong);
	expect(outputGetRide.passengerName).toEqual(inputSignup.name);
	expect(outputGetRide.passengerEmail).toEqual(inputSignup.email);
	await databaseConnection.close();
});

test("Should not be able to request ride if account is not from passenger", async () => {
	const databaseConnection = new PgPromiseAdapter();
	const accountGateway = new AccountGatewayHttp(new AxiosAdapter());
	const rideDAO = new RideRepositoryDatabase(databaseConnection);
	const inputSignup = {
		name: "John Doe",
		email: `joh.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
	};
	const outputSignup = await accountGateway.signup(inputSignup);
	const requestRide = new RequestRide(rideDAO, accountGateway);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584_905_257_808_835,
		fromLong: -48.545_022_195_325_124,
		toLat: -27.496_887_588_317_275,
		toLong: -48.522_234_807_851_476,
	};

	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
		new Error("Account is not from a passenger"),
	);
	await databaseConnection.close();
});

test("Should not be able to request ride if passenger already has another ride in progress", async () => {
	const databaseConnection = new PgPromiseAdapter();
	const accountGateway = new AccountGatewayHttp(new FetchAdapter());
	const inputSignup = {
		name: "John Doe",
		email: `joh.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputSignup = await accountGateway.signup(inputSignup);
	const rideDAO = new RideRepositoryDatabase(databaseConnection);
	const requestRide = new RequestRide(rideDAO, accountGateway);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584_905_257_808_835,
		fromLong: -48.545_022_195_325_124,
		toLat: -27.496_887_588_317_275,
		toLong: -48.522_234_807_851_476,
	};

	await requestRide.execute(inputRequestRide);
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
		new Error("Passenger has an active ride"),
	);
	await databaseConnection.close();
});
