export default class Mediator {
	handlers: { eventName: string; callback: Function }[];

	constructor() {
		this.handlers = [];
	}

	register(eventName: string, callback: Function): void {
		this.handlers.push({ eventName, callback });
	}

	async publish(eventName: string, data: any): Promise<void> {
		for (const handler of this.handlers) {
			if (handler.eventName === eventName) {
				await handler.callback(data);
			}
		}
	}
}
