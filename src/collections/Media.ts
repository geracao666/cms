import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  fields: [
    {
      name: 'prefix',
      type: 'text',
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
