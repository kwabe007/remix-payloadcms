import { buildConfig } from "payload/config";
import { viteBundler } from "@payloadcms/bundler-vite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import path from "path";
import Users from "./collections/Users.ts";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
    meta: {
      favicon: '/favicon.ico',
    },
  },
  editor: lexicalEditor(),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!
  }),
  collections: [Users],
  typescript: { outputFile: path.resolve(__dirname, "collection/types.ts") },
})