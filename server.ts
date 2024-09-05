import { createRequestHandler } from '@remix-run/express'
import express from 'express'
import morgan from 'morgan'
import compression from 'compression'
import payload from 'payload'
import sourceMapSupport from 'source-map-support'
import { env } from './env'

sourceMapSupport.install()

void start()

async function start() {
  const app = express()

  app.use(compression())

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable('x-powered-by')

  const viteDevServer =
    process.env.NODE_ENV === 'production'
      ? undefined
      : await import('vite').then((vite) =>
          vite.createServer({
            server: { middlewareMode: true },
          })
        )

  // handle asset requests
  if (viteDevServer) {
    app.use(viteDevServer.middlewares)
  } else {
    // Vite fingerprints its assets so we can cache forever.
    app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }))
  }

  await payload.init({
    secret: env.PAYLOAD_SECRET,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  app.use(payload.authenticate)

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static('build/client', { maxAge: '1h' }))

  app.use(morgan('tiny'))

  const remixHandler = createRequestHandler({
    // @ts-ignore -- For now we need this: https://github.com/remix-run/remix/issues/8343#issuecomment-1866494414
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
      : // @ts-ignore -- The path will exist after build
        await import('./build/server/index.js'),
    getLoadContext(req, res) {
      return {
        // @ts-ignore -- payload & user is added to the request by payload middleware
        payload: req.payload,
        // @ts-ignore -- payload & user is added to the request by payload middleware
        user: req?.user,
        res,
      }
    },
  })

  // handle SSR requests
  app.all('*', remixHandler)

  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Express server listening at http://localhost:${port}`))
}
