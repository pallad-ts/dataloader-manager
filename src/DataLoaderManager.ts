import DataLoader = require("dataloader");

export class DataLoaderManager {
    private factories: Map<string, DataLoaderManager.Factory<any, any>> = new Map();

    registerDataLoaderType<TValue, TKey = string>(type: string, factory: DataLoaderManager.Factory<TValue, TKey>): this {
        this.factories.set(type, factory);
        return this;
    }

    createDataLoader(type: string) {
        this.assertType(type);
        return this.factories.get(type)!();
    }

    private assertType(type: string) {
        if (!this.factories.has(type)) {
            throw new Error(`No DataLoader of type ${type}`);
        }
    }

    createScope() {
        return new DataLoaderManager.Scope(this);
    }
}

export namespace DataLoaderManager {
    export type Factory<TValue = any, TKey = string> = () => DataLoader<TKey, TValue>;

    export class Scope {
        private dataLoaders: Map<string, DataLoader<any, any>> = new Map();

        constructor(private manager: DataLoaderManager) {

        }

        getDataLoader<TValue, TKey = string>(type: string): DataLoader<TKey, TValue> {
            if (this.dataLoaders.has(type)) {
                return this.dataLoaders.get(type)!;
            }

            const dataLoader = this.manager.createDataLoader(type);
            this.dataLoaders.set(type, dataLoader);
            return dataLoader;
        }

        reset() {
            for (const dataLoader of this.dataLoaders.values()) {
                dataLoader.clearAll();
            }
        }
    }
}