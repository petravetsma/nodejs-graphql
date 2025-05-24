import { PrismaClient } from "@prisma/client";
import { createLoader } from "../createLoader.js";
        
export type Context = {
    prisma: PrismaClient;
    loader: ReturnType<typeof createLoader>;
};