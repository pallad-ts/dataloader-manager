import {DataLoadersManager} from "@src/DataLoadersManager";
import DataLoader = require("dataloader");
import * as sinon from 'sinon';

describe('DataLoadersManager', () => {
	let manager: DataLoadersManager;

	beforeEach(() => {
		manager = new DataLoadersManager();
	});

	describe('registering dataloaders', () => {
		it('success', () => {
			const stub = sinon.stub().callsFake(() => {
				return new DataLoader(async () => []);
			});

			manager.registerDataLoaderType('typeA', stub);

			const dataLoader = manager.createDataLoader('typeA');
			expect(dataLoader)
				.toBeInstanceOf(DataLoader);

			sinon.assert.calledOnce(stub);
		});

		it('fails if already exists', () => {
			manager.registerDataLoaderType('typeA', () => new DataLoader(async () => []))
			expect(() => {
				manager.registerDataLoaderType('typeA', () => new DataLoader(async () => []))
			});
		});
	});
});
