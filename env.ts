// Note: Can't seem to import this file from payload.config.ts, env vars just end up being undefined.
// Probably has to do with the fact that payload.config.ts is loaded by the Payload package.

import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const schema = z.object({
  PAYLOAD_SECRET: z.string().min(1),
  MONGODB_URI: z.string().min(1),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 4))
  process.exit(1)
}

export const env = parsed.data
