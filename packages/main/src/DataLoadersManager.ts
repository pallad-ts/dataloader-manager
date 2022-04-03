import DataLoader = require("dataloader");
import {ERRORS} from "./errors";
import {DataLoadersScope} from "./DataLoadersScope";

export class DataLoadersManager {
	private factories = new Map<string, DataLoadersManager.Factory<unknown, unknown>>();

	/**
	 * Registers factory responsible for creating dataloader of given type
	 */
	registerDataLoaderType<TValue = unknown, TKey = string>(type: string, factory: DataLoadersManager.Factory<TValue, TKey>): this {
		if (this.factories.has(type)) {
			throw ERRORS.FACTORY_ALREADY_EXISTS.format(type);
		}
		this.factories.set(type, factory);
		return this;
	}

	/**
	 * Creates dataloader of given type
	 */
	createDataLoader(type: string) {
		this.assertType(type);
		return this.factories.get(type)!();
	}

	private assertType(type: string) {
		if (!this.factories.has(type)) {
			throw ERRORS.DATALOADER_DOES_NOT_EXIST.format(type);
		}
	}

	/**
	 * Creates new scope of dataloaders
	 */
	createScope() {
		return new DataLoadersScope(this);
	}
}

export namespace DataLoadersManager {
	export type Factory<TValue = unknown, TKey = string> = () => DataLoader<TKey, TValue>;
}
