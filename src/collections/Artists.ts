import { CollectionConfig } from 'payload'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      unique: true,
    },
    {
      name: 'origin',
      type: 'text',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      unique: true,
      displayPreview: false,
      admin: {
        disableListColumn: true,
      },
      hooks: {
        afterChange: [
          async ({ value, previousValue, req: { payload } }) => {
            if (previousValue && previousValue !== value) {
              await payload.delete({
                collection: 'media',
                id: previousValue,
              })
            }

            if (value) {
              await payload.update({
                collection: 'media',
                id: value,
                data: {
                  type: 'artist_photo',
                },
              })
            }
          },
        ],
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: ['tags'],
      hasMany: true,
    },
    {
      name: 'releases',
      type: 'join',
      collection: 'releases',
      on: 'artists',
      admin: {
        allowCreate: false,
        disableListColumn: true,
      },
    },
  ],
}
