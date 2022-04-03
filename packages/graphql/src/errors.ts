import {Domain, generators} from 'alpha-errors';

export const ERRORS = Domain.create({
	codeGenerator: generators.formatCode('E_DATALOADER_MANAGER_GQL_%d')
}).createErrors(create => {
	return {
		SCOPE_NOT_FOUND_IN_CONTEXT: create('DataLoaders scope not found in context. Ensure you have enriched'),
		COULD_NOT_FIND_KEY_FOR_DATALOADER: create('Could not find key for dataloader: %s. Configure key factory by calling `argNameAsKey` or `keyFactory`.')
	};
});
