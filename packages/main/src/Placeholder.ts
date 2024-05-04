import DataLoader = require("dataloader");
import { Scope } from "./Scope";
import { randomDataLoaderName } from "./randomDataLoaderName";
import { ERRORS } from "./errors";

export class Placeholder<TContext, TDataLoader extends DataLoader<any, any, any>> {
	factory?: Placeholder.Factory<TContext, any>;

	constructor(readonly name: string = randomDataLoaderName()) {}

	/**
	 * Defines factory to use for dataloader
	 *
	 * Throws an error if factory is already defined
	 */
	useFactory(factory: Placeholder.Factory<TContext, TDataLoader>) {
		if (this.factory) {
			throw ERRORS.FACTORY_ALREADY_EXISTS.create(this.name);
		}
		this.factory = factory;
	}

	/**
	 * Defines factory to use for dataloader
	 *
	 * Contrary to `useFactory` this method does not throw an error if factory is already defined
	 */
	overrideFactory(factory: Placeholder.Factory<TContext, TDataLoader>) {
		this.factory = factory;
	}

	get(scope: Scope<TContext>) {
		return scope.getDataLoader(this);
	}
}

export namespace Placeholder {
	export type Factory<TContext, TDataLoader extends DataLoader<any, any, any>> = (
		context: TContext
	) => TDataLoader;
}
