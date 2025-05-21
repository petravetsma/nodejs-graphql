import { GraphQLList, GraphQLObjectType } from "graphql";
import { MemberTypes } from "./types/member-type.js";
import { PrismaClient } from "@prisma/client";

export const query = new GraphQLObjectType({
    name: 'query',
    fields: {
        memberTypes: {
            type: new GraphQLList(MemberTypes),
            resolve: async (_: unknown, __: unknown, { prisma }: PrismaContext) => {
                return await prisma.memberType.findMany();
            },
        }

    }
});


type PrismaContext = {
    prisma: PrismaClient;
};