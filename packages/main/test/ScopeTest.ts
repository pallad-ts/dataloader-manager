import { Placeholder } from "@src/Placeholder";
import * as sinon from "sinon";
import DataLoader = require("dataloader");
import { Scope } from "@src/Scope";
import "@pallad/errors-dev";
import { ERRORS } from "@src/errors";

describe("Scope", () => {
	const CONTEXT = {
		some: "context",
	};

	type ScopeContext = typeof CONTEXT;

	let scope: Scope<ScopeContext>;

	beforeEach(() => {
		scope = new Scope(CONTEXT);
	});

	describe("getDataLoader", () => {
		it("creates a new instance of dataloader if does not already exists", () => {
			const placeholder = new Placeholder<ScopeContext, DataLoader<any, number>>("foo");

			const factory = sinon.stub().returns(new DataLoader(() => Promise.resolve([1])));
			placeholder.useFactory(factory);

			const dataLoader = scope.getDataLoader(placeholder);
			const dataLoader2 = scope.getDataLoader(placeholder);

			expect(dataLoader).toBeInstanceOf(DataLoader);
			expect(dataLoader2).toBe(dataLoader);

			sinon.assert.calledOnce(factory);
		});

		it("throws an error if factory is not defined", () => {
			const placeholder = new Placeholder<ScopeContext, DataLoader<any, number>>("foo");
			expect(() => {
				scope.getDataLoader(placeholder);
			}).toThrowErrorWithCode(ERRORS.UNDEFINED_DATALOADER_FACTORY);
		});
	});
});
