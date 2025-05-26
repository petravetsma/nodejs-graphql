import { PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { IPost } from './types/Post.js';

export const createLoader = (prisma: PrismaClient) => ({
    memberType: createMemberTypeLoader(prisma),
    post: createPostLoader(prisma),
    profile: createProfileLoader(prisma),
    subscribedToUser: createSubscribedToUserLoader(prisma),
    userSubscribedTo: createUserSubscribedToLoader(prisma),
});

const createMemberTypeLoader = (prisma: PrismaClient) => {

    return new DataLoader(async (ids: readonly string[]) => {
        const res = await prisma.memberType.findMany({
            where: { id: { in: [...ids] } },
        });

        return ids.map((id) =>
            res.find((type) => type.id === id)
        );
    });
};

const createPostLoader = (prisma: PrismaClient) => {

    return new DataLoader(async (authorIds: readonly string[]) => {
        const results = await prisma.post.findMany({
            where: { authorId: { in: [...authorIds] } },
        });

        const postsByAuthorId: Record<string, IPost[]> = {};
        for (const post of results) {
            if (!postsByAuthorId[post.authorId]) {
                postsByAuthorId[post.authorId] = [];
            }
            postsByAuthorId[post.authorId].push(post);
        }

        return authorIds.map((id) => postsByAuthorId[id] || []);
    });
};

const createProfileLoader = (prisma: PrismaClient) => {

    return new DataLoader(async (userIds: readonly string[]) => {
        const results = await prisma.profile.findMany({
            where: { userId: { in: [...userIds] } },
        });

        return userIds.map((id) =>
            results.find((profile) => profile.userId === id)
        );
    });
};

const createSubscribedToUserLoader = (prisma: PrismaClient) => {

    return new DataLoader(async (authorIds: readonly string[]) => {
        const results = await prisma.subscribersOnAuthors.findMany({
            where: { authorId: { in: [...authorIds] } },
            select: {
                authorId: true,
                subscriber: true,
            },
        });

        const subs: Record<string, User[]> = {};

        for (const record of results) {
            if (!subs[record.authorId]) {
                subs[record.authorId] = [];
            }
            subs[record.authorId].push(record.subscriber);
        }

        return authorIds.map((id) => subs[id] || []);
    });
};

const createUserSubscribedToLoader = (prisma: PrismaClient) => {

    return new DataLoader(async (subscriberIds: readonly string[]) => {
        const results = await prisma.subscribersOnAuthors.findMany({
            where: { subscriberId: { in: [...subscriberIds] } },
            select: {
                subscriberId: true,
                author: true,
            },
        });

        const subs: Record<string, User[]> = {};

        for (const record of results) {
            if (!subs[record.subscriberId]) {
                subs[record.subscriberId] = [];
            }
            subs[record.subscriberId].push(record.author);
        }

        return subscriberIds.map((id) => subs[id] || []);
    });
};
