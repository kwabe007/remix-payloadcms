import { buildConfig } from 'payload/config'
import { viteBundler } from '@payloadcms/bundler-vite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import Users from './cms/collections/Users'

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
    vite: (incomingViteConfig) => ({
      ...incomingViteConfig,
      build: {
        ...incomingViteConfig.build,
        emptyOutDir: false,
      },
    }),
    meta: {
      favicon: '/favicon.ico',
    },
  },
  editor: lexicalEditor(),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),
  collections: [Users],
  typescript: { outputFile: path.resolve(__dirname, 'cms/types.ts') },
})
