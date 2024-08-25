import { useMatches } from '@remix-run/react'
import { useMemo } from 'react'

const DEFAULT_REDIRECT = '/'

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== 'string') {
    return defaultRedirect
  }
  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect
  }
  return to
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(id: string): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches()
  const route = useMemo(() => matchingRoutes.find((route) => route.id === id), [matchingRoutes, id])
  return route?.data as Record<string, unknown>
}

/*
 * Parse a number from a string, throwing an error if the string is not a number.
 */
export function parseNumberOrThrow(numberString: string): number {
  const parsed = parseInt(numberString, 10)
  if (isNaN(parsed)) {
    throw new Error(`Could not parse number string: ${numberString}`)
  }
  return parsed
}

/**
 * Parse a number from a string, returning undefined if the string is not a number.
 * @param numberString
 */
export function parseNumberOrUndefined(numberString: string): number | undefined {
  const parsed = parseInt(numberString, 10)
  if (isNaN(parsed)) {
    return undefined
  }
  return parsed
}

/**
 * Generate a random id. Note that it's not cryptographically secure so don't use it for secrets.
 */
export function generateId(): string {
  const length = 24
  let result = ''
  const characters = 'abcdef0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
