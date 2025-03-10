export default class Cpf {
	private FACTOR_FIRST_DIGIT = 10;
	private FACTOR_SECOND_DIGIT = 11;
	private value: string;

	constructor(cpf: string) {
		if (!this.validate(cpf)) throw new Error("Invalid cpf");

		this.value = cpf;
	}

	private validate(rawCpf: string) {
		if (!rawCpf) return false;
		const cpf = this.clean(rawCpf);

		if (!this.isValidLength(cpf)) return false;
		if (this.allDigitsAreTheSame(cpf)) return false;
		const firstDigit = this.calculateDigit(cpf, this.FACTOR_FIRST_DIGIT);
		const secondDigit = this.calculateDigit(cpf, this.FACTOR_SECOND_DIGIT);

		return this.extractDigit(cpf) === `${firstDigit}${secondDigit}`;
	}

	private clean(cpf: string) {
		return cpf.replaceAll(/\D/g, "");
	}

	private isValidLength(cpf: string) {
		return cpf.length === 11;
	}

	private allDigitsAreTheSame(cpf: string) {
		const [firstDigit] = cpf;

		return [...cpf].every((c) => c === firstDigit);
	}

	private calculateDigit(cpf: string, factor: number) {
		let total = 0;
		let fact = factor;

		for (const digit of cpf) {
			if (fact > 1) total += Number.parseInt(digit) * fact--;
		}
		const remainder = total % 11;

		return remainder < 2 ? 0 : 11 - remainder;
	}

	private extractDigit(cpf: string) {
		return cpf.slice(9);
	}

	public getValue() {
		return this.value;
	}
}
