import { Media } from '@/payload-types'
import { BasePayload, File } from 'payload'

export const fetchMediaFile = async ({ media }: { media: Media }): Promise<File> => {
  const response = await fetch(media.url as string)

  return {
    name: media.filename as string,
    mimetype: response.headers.get('Content-Type') || 'application/octet-stream',
    data: Buffer.from(await response.arrayBuffer()),
    size: Number(response.headers.get('Content-Length')),
  }
}

export const renameMedia = async ({
  media,
  prefix,
  filename,
  payload,
}: {
  media: Media
  prefix: string
  filename: string
  payload: BasePayload
}) => {
  const mediaFile = await fetchMediaFile({ media })
  await payload.delete({
    collection: 'media',
    id: media.id,
  })

  return await payload.create({
    collection: 'media',
    file: {
      ...mediaFile,
      name: filename,
    },
    data: {
      ...media,
      prefix,
    },
  })
}
