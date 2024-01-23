import { DataLoadersScope } from "@pallad/dataloader-manager";
import { ERRORS } from "./errors";

export function assignScopeToContext<TContext, TScope extends DataLoadersScope<any, any>>(
	context: TContext,
	scope: TScope
): TContext & {
	dataLoaders: TScope;
} {
	return {
		...context,
		dataLoaders: scope,
	};
}

export function findScopeInContext<T extends DataLoadersScope<any, any>>(
	context: unknown
): T | undefined {
	// eslint-disable-next-line no-null/no-null
	if (typeof context === "object" && context !== null) {
		if ("dataLoaders" in context && DataLoadersScope.isType((context as any).dataLoaders)) {
			return (context as any).dataLoaders;
		}

		for (const value of Object.values(context)) {
			if (DataLoadersScope.isType(value)) {
				return value as T;
			}
		}
	}
}

export function assertScopeInContext(context: unknown) {
	const scope = findScopeInContext(context);
	if (!scope) {
		throw ERRORS.SCOPE_NOT_FOUND_IN_CONTEXT.create();
	}
	return scope;
}
