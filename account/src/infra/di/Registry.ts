export default class Registry {
	dependecies: { [name: string]: any };
	static instance: Registry;

	private constructor() {
		this.dependecies = {};
	}

	provide(name: string, dependecy: any): void {
		this.dependecies[name] = dependecy;
	}

	inject(name: string) {
		return this.dependecies[name];
	}

	static getInstance(): Registry {
		if (!Registry.instance) Registry.instance = new Registry();

		return Registry.instance;
	}
}

export function inject(name: string) {
	return (target: any, propertyKey: string) => {
		target[propertyKey] = new Proxy(
			{},
			{
				get(_target: any, pk: string) {
					const dependecy = Registry.getInstance().inject(name);

					return dependecy[pk];
				},
			},
		);
	};
}
