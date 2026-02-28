import { betterAuth } from "better-auth";
import { d1Adapter } from "better-auth/adapters/d1";

export function createAuth(env: any) {
    return betterAuth({
        database: d1Adapter(env.DB), 
        secret: env.BETTER_AUTH_SECRET,
        baseURL: "https://www.alikernel.com",
        trustedOrigins: [
            "https://www.alikernel.com",
            "https://alikernel-auth.pages.dev"
        ],
        socialProviders: {
            google: {
                clientId: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
            }
        }
    });
}
