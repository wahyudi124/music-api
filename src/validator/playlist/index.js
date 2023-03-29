const InvarianError = require('../../exceptions/InvariantError');
const { PlaylistPayloadSchema, SongOnPlaylistSchema } = require('./schemas');

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvarianError(validationResult.error.message);
    }
  },
  validateSongOnPlaylistPayload: (payload) => {
    const validationResult = SongOnPlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvarianError(validationResult.error.message);
    }
  },
};
module.exports = PlaylistValidator;
