import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType, GraphQLResolveInfo,
} from 'graphql';
import { FieldsByTypeName, parseResolveInfo } from 'graphql-parse-resolve-info';
import { Context } from './types/Context.js';
import { MemberType, MemberTypeIdEnum } from './types/MemberType.js';
import { PostResp } from './types/Post.js';
import { ProfileResp } from './types/Profile.js';
import { UserResp } from './types/User.js';
import { UUIDType } from './types/uuid.js';

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: (_: unknown, __: unknown, { prisma }: Context) => {
                return prisma.memberType.findMany();
            }
        },
        memberType: {
            type: MemberType,
            args: {
                id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
            },
            resolve: (_, { id }: { id: string }, { prisma }: Context) => {
                return prisma.memberType.findUnique({ where: { id } });
            }
        },

        posts: {
            type: new GraphQLList(PostResp),
            resolve: (_, __, { prisma }: Context) => {
                return prisma.post.findMany();
            }
        },
        post: {
            type: PostResp,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: (_, { id }: { id: string }, { prisma }: Context) => {
                return prisma.post.findUnique({ where: { id } });
            }
        },

        profiles: {
            type: new GraphQLList(ProfileResp),
            resolve: (_, __, { prisma }: Context) => {
                return prisma.profile.findMany();
            }
        },
        profile: {
            type: ProfileResp,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: (_, { id }: { id: string }, { prisma }: Context) => {
                return prisma.profile.findUnique({ where: { id } });
            }
        },

        users: {
            type: new GraphQLList(UserResp),
            resolve: (_, __, { prisma }: Context, info: GraphQLResolveInfo) => {
                const parsedInfo = parseResolveInfo(info);
                const fields = parsedInfo?.fieldsByTypeName.User as FieldsByTypeName['User'];

                const include = {
                    subscribedToUser: !!fields.subscribedToUser,
                    userSubscribedTo: !!fields.userSubscribedTo
                };

                return prisma.user.findMany({ include });
            }
        },
        user: {
            type: UserResp,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: (_, { id }: { id: string }, { prisma }: Context) => {
                return prisma.user.findUnique({ where: { id } });
            }
        },
    },
});