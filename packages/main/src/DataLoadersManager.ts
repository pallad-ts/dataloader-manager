import DataLoader = require("dataloader");
import { ERRORS } from "./errors";
import { DataLoadersScope } from "./DataLoadersScope";
import { DataLoaderMap } from "./DataLoaderMap";

export class DataLoadersManager<TContext, TDataLoaderMap extends DataLoaderMap = DataLoaderMap> {
	private factories = new Map<
		keyof TDataLoaderMap,
		DataLoadersManager.Factory<unknown, unknown, TContext>
	>();

	/**
	 * Registers factory responsible for creating dataloader of given type
	 */
	registerDataLoaderType<TType extends keyof TDataLoaderMap>(
		type: TType,
		factory: DataLoadersManager.Factory<
			TDataLoaderMap[TType]["value"],
			TDataLoaderMap[TType]["key"],
			TContext
		>
	): this {
		if (this.factories.has(type)) {
			throw ERRORS.FACTORY_ALREADY_EXISTS.create(type);
		}
		this.factories.set(type, factory);
		return this;
	}

	/**
	 * Creates dataloader of given type
	 */
	createDataLoader<TType extends keyof TDataLoaderMap>(
		type: TType,
		context: TContext
	): DataLoader<TDataLoaderMap[TType]["key"], TDataLoaderMap[TType]["value"]> {
		this.assertType(type);
		return this.factories.get(type)!(context);
	}

	private assertType(type: keyof TDataLoaderMap) {
		if (!this.factories.has(type)) {
			throw ERRORS.DATALOADER_DOES_NOT_EXIST.create(type);
		}
	}

	/**
	 * Creates new scope of dataloaders
	 */
	createScope(context: TContext) {
		return new DataLoadersScope<TContext, TDataLoaderMap>(this, context);
	}
}

export namespace DataLoadersManager {
	export type Factory<TValue = unknown, TKey = string, TContext = unknown> = (
		context: TContext
	) => DataLoader<TKey, TValue>;
}
