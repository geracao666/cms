import { DEFAULT_PREFIX } from '@/collections/Media'
import { Artist, Media } from '@/payload-types'
import { BasePayload } from 'payload'
import { renameMedia } from './media.service'
import { getArtistMediaDir } from './artist.service'
import createSlug from '@/utils/createSlug'

export const renameReleaseArtwork = async ({
  artworkId,
  payload,
}: {
  artworkId: number
  payload: BasePayload
}) => {
  const {
    docs: [release],
  } = await payload.find({
    collection: 'releases',
    depth: 1,
    limit: 1,
    pagination: false,
    where: {
      artwork: { equals: artworkId },
    },
  })

  // artwork doesn't belong to a release anymore
  // or the release doesn't have an artist
  if (!release || !release.artists || release.artists.length === 0) {
    return null
  }

  const artist = release.artists.at(0) as Artist
  const artwork = release.artwork as Media

  // artwork is already in the desired directory
  if (!artwork.url || (artwork.prefix && artwork.prefix !== DEFAULT_PREFIX)) {
    return null
  }

  const renamedArtwork = await renameMedia({
    media: artwork,
    prefix: getArtistMediaDir(artist.slug),
    filename: `${artist.slug}-${createSlug(release.name)}-artwork.jpg`,
    payload,
  })

  await payload.update({
    collection: 'releases',
    id: release.id,
    data: {
      artwork: renamedArtwork.id,
    },
  })

  return renamedArtwork
}
