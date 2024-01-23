import { DataLoadersManager } from "@src/DataLoadersManager";
import DataLoader = require("dataloader");
import * as sinon from "sinon";

describe("DataLoadersManager", () => {
	let manager: DataLoadersManager<unknown>;

	const CONTEXT = { some: "context" };
	beforeEach(() => {
		manager = new DataLoadersManager();
	});

	describe("registering dataloaders", () => {
		it("success", () => {
			const stub = sinon.stub().callsFake(() => {
				return new DataLoader(() => Promise.resolve([]));
			});

			manager.registerDataLoaderType("typeA", stub);

			const dataLoader = manager.createDataLoader("typeA", CONTEXT);
			expect(dataLoader).toBeInstanceOf(DataLoader);

			sinon.assert.calledOnce(stub);
			sinon.assert.calledWith(stub, CONTEXT);
		});

		it("fails if already exists", () => {
			manager.registerDataLoaderType("typeA", () => new DataLoader(async () => []));
			expect(() => {
				manager.registerDataLoaderType("typeA", () => new DataLoader(async () => []));
			});
		});

		it("strongly typed map", () => {
			const manager = new DataLoadersManager<
				unknown,
				{ foo: { key: "foo_key"; value: "value" } }
			>();

			manager.registerDataLoaderType("foo", context => {
				// eslint-disable-next-line @typescript-eslint/require-await
				return new DataLoader<"foo_key", "value">(async () => {
					return [];
				});
			});
		});
	});
});
