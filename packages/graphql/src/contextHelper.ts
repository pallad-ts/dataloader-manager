import {DataLoadersScope} from '@pallad/dataloader-manager';
import {ERRORS} from "./errors";

export function assignScopeToContext<TContext, TDataloadersContext>(context: TContext, scope: DataLoadersScope<TDataloadersContext>): TContext & { dataLoaders: DataLoadersScope<TDataloadersContext> } {
	return {
		...context,
		dataLoaders: scope
	};
}

export function findScopeInContext<T>(context: unknown): DataLoadersScope<T> | undefined {
	// eslint-disable-next-line no-null/no-null
	if (typeof context === 'object' && context !== null) {
		if ('dataLoaders' in context && DataLoadersScope.isType((context as any).dataLoaders)) {
			return (context as any).dataLoaders;
		}

		for (const value of Object.values(context)) {
			if (DataLoadersScope.isType(value)) {
				return value;
			}
		}
	}
}

export function assertScopeInContext(context: unknown) {
	const scope = findScopeInContext(context);
	if (!scope) {
		throw ERRORS.SCOPE_NOT_FOUND_IN_CONTEXT();
	}
	return scope;
}
