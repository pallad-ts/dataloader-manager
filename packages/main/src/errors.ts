import {Domain, generators} from 'alpha-errors';

export const ERRORS = Domain.create({
	codeGenerator: generators.formatCode('E_DATALOADER_MANAGER_%d')
}).createErrors(create => {
	return {
		FACTORY_ALREADY_EXISTS: create('Factory "%s" already exists'),
		DATALOADER_DOES_NOT_EXIST: create('Dataloader "%s" does not exist'),
	};
});
