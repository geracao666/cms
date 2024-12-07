// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, TaskConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { githubStorage } from 'payload-storage-github'
import { Artists } from './collections/Artists'
import { Tags } from './collections/Tags'
import { Releases } from './collections/Releases'
import { moveArtistPhoto } from './tasks/moveArtistPhoto.task'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.SERVER_URL || '',
  secret: process.env.PAYLOAD_SECRET || '',

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media, Artists, Tags, Releases],

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
      authToken: process.env.DATABASE_AUTH_TOKEN || '',
    },
  }),

  jobs: {
    tasks: [moveArtistPhoto],
  },

  sharp,
  editor: lexicalEditor(),

  plugins: [
    githubStorage({
      collections: {
        [Media.slug]: true,
      },

      options: {
        auth: process.env.GITHUB_ACCESS_TOKEN || '',
      },

      owner: process.env.GITHUB_CDN_REPOSITORY_OWNER || '',
      repo: process.env.GITHUB_CDN_REPOSITORY_NAME || '',
    }),
  ],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
