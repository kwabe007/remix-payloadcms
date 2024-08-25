import { buildConfig } from "payload/config";
import { viteBundler } from "@payloadcms/bundler-vite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import path from "path";
import Users from "./collections/Users.ts";
import env from "./app/env.ts";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
  },
  editor: lexicalEditor(),
  db: mongooseAdapter({
    url: env.MONGODB_URI
  }),
  collections: [Users],
  typescript: { outputFile: path.resolve(__dirname, "collection/types.ts") },
})