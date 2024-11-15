import { CollectionConfig } from 'payload'

export const Releases: CollectionConfig = {
  slug: 'releases',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'artists',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'year',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'yyyy',
          maxDate: new Date(),
          overrides: {
            dateFormat: 'yyyy',
            showYearPicker: true,
          },
        },
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            const year = new Date(value).getFullYear()
            return String(year)
          },
        ],
        afterRead: [
          ({ value }) => {
            const year = new Date(value).getUTCFullYear()
            return new Date(year, 0, 1)
          },
        ],
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Álbum', value: 'album' },
        { label: 'Coletânea', value: 'compilation' },
        { label: 'DVD', value: 'dvd' },
        { label: 'EP', value: 'ep' },
        { label: 'Ao vivo', value: 'live' },
        { label: 'Single', value: 'single' },
        { label: 'Split', value: 'split' },
      ],
    },
    {
      name: 'downloadUrl',
      type: 'text',
    },
    {
      name: 'discs',
      type: 'array',
      fields: [
        {
          name: 'tracks',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
