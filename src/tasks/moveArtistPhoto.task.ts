import { renameArtistPhoto } from '@/services/artist.service'
import { TaskConfig } from 'payload'

export const moveArtistPhoto: TaskConfig<any> = {
  slug: 'moveArtistPhoto',
  retries: 0,

  inputSchema: [
    {
      name: 'mediaId',
      type: 'number',
      required: true,
    },
  ],

  handler: async ({ input, req: { payload } }) => {
    try {
      const renamedPhoto = await renameArtistPhoto({
        photoId: input.mediaId,
        payload,
      })

      if (renamedPhoto === null) {
        return {
          output: { status: 'skipped' },
        }
      }

      return {
        output: { status: 'success' },
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          output: {
            status: 'error',
            reason: error.message,
          },
        }
      }

      throw error
    }
  },
}
