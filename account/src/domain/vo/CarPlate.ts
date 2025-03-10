export default class CarPlate {
	private value: string;

	constructor(carPlate: string) {
		if (carPlate && !new RegExp(/[A-Z]{3}[0-9]{4}/).test(carPlate))
			throw new Error("Invalid car plate");

		this.value = carPlate;
	}

	getValue() {
		return this.value;
	}
}
