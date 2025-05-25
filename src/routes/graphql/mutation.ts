import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Context } from './types/Context.js';
import { ChangePostInput, CreatePostInput, IPost, PostResp } from './types/Post.js';
import { ChangeProfileInput, CreateProfileInput, IProfile, ProfileResp } from './types/Profile.js';
import { ChangeUserInput, CreateUserInput, IUserParent, UserResp } from './types/User.js';
import { UUIDType } from './types/uuid.js';

export const Mutation = new GraphQLObjectType({
    
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostResp,
      args: {
        dto: { type: CreatePostInput },
      },
      resolve: (_, { dto }: { dto: IPost }, { prisma }: Context) => {
        return prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: PostResp,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: (
        _,
        { id, dto }: { id: string; dto: Omit<IPost, 'id' | 'authorId'> },
        { prisma }: Context,
      ) => {
        return prisma.post.update({ where: { id }, data: dto });
      },
    },
    deletePost: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
        await prisma.post.delete({ where: { id } });
        return null;
      },
    },

    createProfile: {
      type: ProfileResp,
      args: {
        dto: { type: CreateProfileInput },
      },
      resolve: (_, { dto }: { dto: IProfile }, { prisma }: Context) => {
        return prisma.profile.create({ data: dto });
      },
    },
    changeProfile: {
      type: ProfileResp,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: (
        _,
        { id, dto }: { id: string; dto: Omit<IProfile, 'id' | 'userId'> },
        { prisma }: Context,
      ) => {
        return prisma.profile.update({ where: { id }, data: dto });
      },
    },
    deleteProfile: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
        await prisma.profile.delete({ where: { id } });
        return null;
      },
    },

    createUser: {
      type: UserResp,
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: (
        _,
        { dto }: { dto: Omit<IUserParent, 'id'> },
        { prisma }: Context,
      ) => {
        return prisma.user.create({ data: dto });
      },
    },
    changeUser: {
      type: UserResp,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: (
        _,
        { id, dto }: { id: string; dto: Omit<IUserParent, 'id'> },
        { prisma }: Context,
      ) => {
        return prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
        await prisma.user.delete({ where: { id } });
        return null;
      },
    },

    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma }: Context,
      ) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        });

        return null;
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma }: Context,
      ) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });

        return null;
      },
    },
  },
});