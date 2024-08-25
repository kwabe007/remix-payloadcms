import { z } from 'zod'

const schema = z.object({
  SESSION_SECRET: z.string().min(1),
  MONGODB_URI: z.string(),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 4))
  process.exit(1)
}

export default parsed.data
