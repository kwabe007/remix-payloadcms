import qs from 'qs'
import { z } from 'zod'
import { Params } from '@remix-run/react'
import { Validator } from 'remix-validated-form'
import { parseNumberOrThrow } from '~/utils'
import { json } from '@remix-run/node'

export async function validateRequestData<T>(request: Request, validator: Validator<T>) {
  const formData = await request.formData()
  return validator.validate(formData)
}

export function getParamOr400(params: Params, key: string): string {
  const result = z.string().safeParse(params[key])
  if (!result.success) {
    throw json({ message: `Missing parameter ${key}` }, { status: 400 })
  }
  return result.data
}

export function getNumberParam400(params: Params, key: string): number {
  const stringParam = getParamOr400(params, key)
  try {
    return parseNumberOrThrow(stringParam)
  } catch (e) {
    throw json(
      {
        message: `Invalid parameter ${key}. ${stringParam} can not be read as number`,
      },
      { status: 400 }
    )
  }
}

export async function parseIntentOr400<const T extends readonly [string, ...string[]]>(
  request: Request,
  intents: T
): Promise<[T[number], Record<string, unknown>]> {
  const qsData = qs.parse(await request.text())
  const intentSchema = z.object({ intent: z.enum(intents) }).passthrough()

  const result = intentSchema.safeParse(qsData)
  if (!result.success) {
    throw json({ message: `Invalid intent: ${result.error.message}` }, { status: 400 })
  }
  const { intent, ...data } = result.data
  return [intent as T[number], data]
}

export function getOr404<T>(value: T | null | undefined): T {
  if (!value) {
    throw json({ message: 'Not found' }, { status: 404 })
  }
  return value
}
