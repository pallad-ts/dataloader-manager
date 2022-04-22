import {DataLoadersManager} from "./DataLoadersManager";
import DataLoader = require("dataloader");
import {TypeCheck} from "@pallad/type-check";

const TYPE_CHECK = new TypeCheck<DataLoadersScope<unknown>>('@pallad/dataloader-manager/DataLoadersScope');

export class DataLoadersScope<TContext> extends TYPE_CHECK.clazz {
	private dataLoaders = new Map<string, DataLoader<any, any>>();

	constructor(private manager: DataLoadersManager<TContext>,
				private context: TContext) {
		super();
	}

	/**
	 * Returns dataloader for given type
	 */
	getDataLoader<TValue = unknown, TKey = unknown>(type: string): DataLoader<TKey, TValue> {
		if (this.dataLoaders.has(type)) {
			return this.dataLoaders.get(type)!;
		}

		const dataLoader = this.manager.createDataLoader(type, this.context);
		this.dataLoaders.set(type, dataLoader);
		return dataLoader as DataLoader<TKey, TValue>;
	}

	/**
	 * Reset state of all created dataloaders
	 */
	reset() {
		for (const dataLoader of this.dataLoaders.values()) {
			dataLoader.clearAll();
		}
	}
}
