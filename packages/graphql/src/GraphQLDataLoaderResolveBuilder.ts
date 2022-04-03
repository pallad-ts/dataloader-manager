import {Builder} from "@pallad/builder";
import {ERRORS} from "./errors";
import * as is from 'predicates'
import {GraphQLID, GraphQLNonNull, GraphQLFieldConfigArgumentMap, GraphQLObjectType} from 'graphql';
import {ObjectTypeComposer, ObjectTypeComposerFieldConfigAsObjectDefinition, ResolverResolveParams} from "graphql-compose";
import {GraphQLFieldResolver} from "graphql/type/definition";
import {assertScopeInContext} from "./contextHelper";
import {ObjectTypeComposerArgumentConfigMapDefinition} from "graphql-compose/lib/ObjectTypeComposer";

const assertDataLoaderName = is.assert(is.notBlank, 'Dataloader name cannot be empty');
const assertEntityTypeDefined = is.assert(is.defined, 'Entity type has to be defined in order to create query field');
const assertEntityTypeIsObjectTypeComposer = is.assert(is.instanceOf(ObjectTypeComposer), 'Entity type must be a type of ObjectTypeComposer');

export class GraphQLDataLoaderResolveBuilder<TArgs = any> extends Builder {
	private keyGetter: (args: TArgs) => any;
	private entityType?: GraphQLObjectType | ObjectTypeComposer;

	private argsFields: ObjectTypeComposerArgumentConfigMapDefinition<any> = {
		id: {
			type: new GraphQLNonNull(GraphQLID)
		}
	};

	constructor(private dataLoaderName: string) {
		super();

		assertDataLoaderName(this.dataLoaderName);

		this.keyGetter = (args: TArgs) => {
			const argsKeys = Object.keys(args);
			if (argsKeys.length >= 2) {
				throw ERRORS.COULD_NOT_FIND_KEY_FOR_DATALOADER.format(this.dataLoaderName);
			}

			return argsKeys.length === 0 ? undefined : (args as any)[argsKeys[0]];
		};
	}

	argNameAsKey(keyName: string | symbol): this {
		this.keyGetter = (args: TArgs) => (args as any)[keyName];
		return this;
	}

	keyFactory(factory: (args: TArgs) => any): this {
		this.keyGetter = factory;
		return this;
	}

	args<TNewArgs>(args: ObjectTypeComposerArgumentConfigMapDefinition<TNewArgs>): GraphQLDataLoaderResolveBuilder<TNewArgs> {
		this.argsFields = args;
		return this as unknown as GraphQLDataLoaderResolveBuilder<TNewArgs>;
	}

	resultType(entityType: GraphQLObjectType | ObjectTypeComposer): this {
		this.entityType = entityType;
		return this;
	}

	getResolve<TSource, TContext, TResult>(): GraphQLFieldResolver<TSource, TContext, TArgs, unknown> {
		return (source, args, context) => {
			const key = this.keyGetter(args);

			if (is.empty(key)) {
				return;
			}
			return assertScopeInContext(context).getDataLoader(this.dataLoaderName).load(key) as any;
		}
	}

	getQueryField<TSource, TContext>(): ObjectTypeComposerFieldConfigAsObjectDefinition<TSource, TContext, TArgs> {
		this.assertQueryConfig();
		return {
			type: this.entityType instanceof GraphQLObjectType ? this.entityType! : this.entityType!.getType(),
			args: this.argsFields,
			resolve: this.getResolve()
		};
	}

	private assertQueryConfig() {
		assertEntityTypeDefined(this.entityType);
	}

	getResolver(name: string = 'findById') {
		this.assertResolverConfig();

		const entityType = this.entityType as ObjectTypeComposer;

		const resolve = this.getResolve();
		entityType.addResolver({
			name,
			type: this.entityType instanceof GraphQLObjectType ? this.entityType! : this.entityType!.getType(),
			args: this.argsFields,
			resolve: (rp: ResolverResolveParams<any, any>) => {
				return resolve(rp.source, rp.args, rp.context, rp.info);
			}
		});

		return entityType.getResolver(name);
	}

	private assertResolverConfig() {
		assertEntityTypeDefined(this.entityType);
		assertEntityTypeIsObjectTypeComposer(this.entityType);
	}

}
