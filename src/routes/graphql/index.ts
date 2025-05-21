import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    const { prisma } = fastify;

    fastify.route({
        url: '/',
        method: 'POST',
        schema: {
            ...createGqlResponseSchema,
            response: {
                200: gqlResponseSchema,
            },
        },
        async handler(req) {
            const { query, variables } = req.body;
            const parsedQuery = parse(query);
            const errorsValidation = validate(schema, parsedQuery, [depthLimit(5)]);

            if (errorsValidation && errorsValidation.length > 0) {
                return { errors: errorsValidation }
            }

            const response = await graphql({
                schema: schema,
                source: query,
                variableValues: variables,
                contextValue: { prisma }
            });
            return response;
        },
    });


};

export default plugin;