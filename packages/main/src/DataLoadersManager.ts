import DataLoader = require("dataloader");
import {ERRORS} from "./errors";
import {DataLoadersScope} from "./DataLoadersScope";

export class DataLoadersManager<TContext> {
	private factories = new Map<string, DataLoadersManager.Factory<unknown, unknown, TContext>>();

	/**
	 * Registers factory responsible for creating dataloader of given type
	 */
	registerDataLoaderType<TValue = unknown, TKey = string>(type: string, factory: DataLoadersManager.Factory<TValue, TKey, TContext>): this {
		if (this.factories.has(type)) {
			throw ERRORS.FACTORY_ALREADY_EXISTS.format(type);
		}
		this.factories.set(type, factory);
		return this;
	}

	/**
	 * Creates dataloader of given type
	 */
	createDataLoader(type: string, context: TContext) {
		this.assertType(type);
		return this.factories.get(type)!(context);
	}

	private assertType(type: string) {
		if (!this.factories.has(type)) {
			throw ERRORS.DATALOADER_DOES_NOT_EXIST.format(type);
		}
	}

	/**
	 * Creates new scope of dataloaders
	 */
	createScope(context: TContext) {
		return new DataLoadersScope<TContext>(this, context);
	}
}

export namespace DataLoadersManager {
	export type Factory<TValue = unknown, TKey = string, TContext = unknown> = (context: TContext) => DataLoader<TKey, TValue>;
}
