import { renameReleaseArtwork } from '@/services/release.service'
import { TaskConfig } from 'payload'

export const moveReleaseArtwork: TaskConfig<any> = {
  slug: 'moveReleaseArtwork',
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
      const renamedArtwork = await renameReleaseArtwork({
        artworkId: input.mediaId,
        payload,
      })

      if (renamedArtwork === null) {
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
