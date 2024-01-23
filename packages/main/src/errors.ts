import { Domain, formatCodeFactory, ErrorDescriptor } from "@pallad/errors";

const code = formatCodeFactory("E_DATALOADER_MANAGER_%c");
export const errorsDomain = new Domain();
export const ERRORS = errorsDomain.addErrorsDescriptorsMap({
	FACTORY_ALREADY_EXISTS: ErrorDescriptor.useMessageFormatter(
		code(1),
		(factoryName: string | number | symbol) =>
			`Factory "${factoryName.toString()}" already exists`
	),
	DATALOADER_DOES_NOT_EXIST: ErrorDescriptor.useMessageFormatter(
		code(2),
		(dataLoaderName: string | number | symbol) =>
			`Dataloader "${dataLoaderName.toString()}" does not exist`
	),
});
