import { Domain, formatCodeFactory, ErrorDescriptor } from "@pallad/errors";

const code = formatCodeFactory("E_DATALOADER_MANAGER_GQL_%c");
export const errorsDomain = new Domain();

export const ERRORS = errorsDomain.addErrorsDescriptorsMap({
	SCOPE_NOT_FOUND_IN_CONTEXT: ErrorDescriptor.useDefaultMessage(
		code(1),
		"DataLoaders scope not found in context. Ensure you have enriched context"
	),
	COULD_NOT_FIND_KEY_FOR_DATALOADER: ErrorDescriptor.useMessageFormatter(
		code(2),
		(dataLoaderName: string | number | symbol) =>
			`Could not find key for dataloader: ${dataLoaderName.toString()}. Configure key factory by calling "argNameAsKey" or "keyFactory".`
	),
});
