import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLFloat, GraphQLInputObjectType } from 'graphql/index.js';
import { ProfileResp, IProfile } from './Profile.js';
import { Context } from './Context.js';
import { IPost, PostResp } from './Post.js';

export const UserResp = new GraphQLObjectType<IUserBase, Context>({
    name: 'UserResp',
    fields: () => ({
        id: { type: UUIDType },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
        posts: {
            type: new GraphQLList(PostResp),
        },
        profile: {
            type: ProfileResp,
        },
        subscribedToUser: {
            type: new GraphQLList(UserResp),
        },
        userSubscribedTo: {
            type: new GraphQLList(UserResp),
        },
    })
}) as unknown as GraphQLObjectType<IUserBase>;

export const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
    },
});

export const ChangeUserInput = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    },
});

export interface IUserParent {
    id: string;
    name: string;
    balance: number;
}

export interface IUserBase {
    id: string;
    name: string;
    balance: number;
    profile: IProfile;
    posts: IPost[];
    userSubscribedTo: IUserBase[];
    subscribedToUser: IUserBase[];
}