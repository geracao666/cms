import { DEFAULT_PREFIX } from '@/collections/Media'
import { Media } from '@/payload-types'
import { BasePayload } from 'payload'
import { renameMedia } from './media.service'
import path from 'node:path'

export const getArtistMediaDir = (artistSlug: string) => {
  const firstChar = artistSlug.charAt(0)
  const dir = /[a-z]/.test(firstChar) ? firstChar : '0-9'

  return path.join(dir, artistSlug)
}

export const renameArtistPhoto = async ({
  photoId,
  payload,
}: {
  photoId: number
  payload: BasePayload
}) => {
  const {
    docs: [artist],
  } = await payload.find({
    collection: 'artists',
    depth: 1,
    limit: 1,
    pagination: false,
    where: {
      photo: { equals: photoId },
    },
  })

  // photo doesn't belong to an artist anymore
  if (!artist) {
    return null
  }

  const photo = artist.photo as Media

  // photo is already in the desired directory
  if (!photo.url || (photo.prefix && photo.prefix !== DEFAULT_PREFIX)) {
    return null
  }

  const renamedPhoto = await renameMedia({
    media: photo,
    prefix: getArtistMediaDir(artist.slug),
    filename: `${artist.slug}-photo.jpg`,
    payload,
  })

  await payload.update({
    collection: 'artists',
    id: artist.id,
    data: {
      photo: renamedPhoto.id,
    },
  })

  return renamedPhoto
}
