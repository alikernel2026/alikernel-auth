import { createAuth } from "../../../lib/auth";
import type { APIRoute } from "astro";

export const ALL: APIRoute = async (ctx) => {
    const env = (ctx.locals as any).runtime.env;
    const auth = createAuth(env);
    return await auth.handler(ctx.request);
};

export const prerender = false;
