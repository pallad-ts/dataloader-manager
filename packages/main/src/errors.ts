import { Domain, formatCodeFactory, ErrorDescriptor } from "@pallad/errors";

const code = formatCodeFactory("E_DATALOADER_MANAGER_%c");
export const errorsDomain = new Domain();
export const ERRORS = errorsDomain.addErrorsDescriptorsMap({
	FACTORY_ALREADY_EXISTS: ErrorDescriptor.useMessageFormatter(
		code(1),
		(factoryName: string | number | symbol) =>
			`Factory for dataloader "${factoryName.toString()}" already exists`
	),
	UNDEFINED_DATALOADER_FACTORY: ErrorDescriptor.useMessageFormatter(
		code(2),
		(dataLoaderName: string | number | symbol) =>
			`Factory for dataloader "${dataLoaderName.toString()}" is not defined. Have you forgotten to call 'useFactory' or 'overrideFactory'?`
	),
	SCOPE_NOT_FOUND_IN_CONTEXT: ErrorDescriptor.useDefaultMessage(
		code(3),
		"DataLoaders scope not found in context. Ensure you have enriched context"
	),
});
