import { DataLoadersManager } from "./DataLoadersManager";
import DataLoader = require("dataloader");
import { TypeCheck } from "@pallad/type-check";
import { DataLoaderMap } from "./DataLoaderMap";

const TYPE_CHECK = new TypeCheck<DataLoadersScope<unknown>>(
	"@pallad/dataloader-manager/DataLoadersScope"
);

export class DataLoadersScope<
	TContext,
	TDataLoaderMap extends DataLoaderMap = DataLoaderMap,
> extends TYPE_CHECK.clazz {
	private dataLoaders = new Map<keyof TDataLoaderMap, DataLoader<unknown, unknown>>();

	constructor(
		private manager: DataLoadersManager<TContext, TDataLoaderMap>,
		private context: TContext
	) {
		super();
	}

	/**
	 * Returns dataloader for given type
	 */
	getDataLoader<TType extends keyof TDataLoaderMap>(type: TType) {
		if (this.dataLoaders.has(type)) {
			return this.dataLoaders.get(type)!;
		}

		const dataLoader = this.manager.createDataLoader(type, this.context);
		this.dataLoaders.set(type, dataLoader);
		return dataLoader as DataLoader<
			TDataLoaderMap[TType]["key"],
			TDataLoaderMap[TType]["value"]
		>;
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
