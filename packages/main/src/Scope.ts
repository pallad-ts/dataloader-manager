import DataLoader = require("dataloader");
import { TypeCheck } from "@pallad/type-check";
import { Placeholder } from "./Placeholder";
import { ERRORS } from "./errors";

const TYPE_CHECK = new TypeCheck<Scope<unknown>>("@pallad/dataloader-manager/DataLoadersScope");

export class Scope<TContext> extends TYPE_CHECK.clazz {
	private dataLoaderInstance = new Map<string, DataLoader<unknown, unknown, unknown>>();

	constructor(private context: TContext) {
		super();
	}

	getDataLoader<T extends DataLoader<any, any, any>>(placeholder: Placeholder<TContext, T>): T {
		const factory = placeholder.factory;
		if (!factory) {
			throw ERRORS.UNDEFINED_DATALOADER_FACTORY.create(placeholder.name);
		}

		let instance = this.dataLoaderInstance.get(placeholder.name);
		if (!instance) {
			instance = factory(this.context);
			this.dataLoaderInstance.set(placeholder.name, instance!);
		}
		return instance as T;
	}

	/**
	 * Reset state of all created dataloaders
	 */
	reset() {
		for (const dataLoader of this.dataLoaderInstance.values()) {
			dataLoader.clearAll();
		}
	}
}
