import zod from "zod"

const envSchema = zod.object({
    API_URL: zod.string(),
})

export const env = envSchema.parse({
    API_URL: process.env.NEXT_PUBLIC_API_URL
})