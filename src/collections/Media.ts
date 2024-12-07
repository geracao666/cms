import type { CollectionConfig } from 'payload'

/**
 * Default media prefix (directory).
 */
export const DEFAULT_PREFIX = '.tmp'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    /**
     * This helps /api/media/file route become available
     * in jobs ran locally for now.
     *
     * I can do something like the Vercel Cron Example
     * once this goes live:
     *
     * @see https://payloadcms.com/docs/jobs-queue/queues#endpoint
     */
    read: ({ req }) => {
      if (req.user) {
        return true
      }

      const { payload } = req
      return req.origin === payload.config.serverURL
    },
  },
  fields: [
    {
      name: 'prefix',
      type: 'text',
      defaultValue: DEFAULT_PREFIX,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'type',
      type: 'select',
      admin: {
        readOnly: true,
      },
      options: [
        {
          label: 'Foto',
          value: 'artist_photo',
        },
        {
          label: 'Capa',
          value: 'release_artwork',
        },
      ],
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    formatOptions: {
      format: 'jpeg',
    },
    resizeOptions: {
      fit: 'cover',
      width: 400,
      height: 400,
    },
  },
}
