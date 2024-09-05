/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import type { Response } from 'express'
import type { User } from './cms/types'
import { Payload } from 'payload'

export interface RemixRequestContext {
  payload: Payload
  user: {
    user?: User
    token?: string
    exp?: number
  }
  res: Response
}

declare module '@remix-run/node' {
  interface AppLoadContext extends RemixRequestContext {}
}
