import { auth } from "../../../lib/auth";
import type { APIRoute } from "astro";

export const ALL: APIRoute = async (ctx) => {
    const db = (ctx.locals as any).runtime.env.DB;
    return await auth(db).handler(ctx.request);
};

export const prerender = false;
