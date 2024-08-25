import { z } from 'zod'

export const coercedBooleanSchema = z
  .union([z.boolean(), z.literal('true'), z.literal('false')])
  .transform((value) => value === true || value === 'true')
