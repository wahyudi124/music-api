const InvarianError = require('../../exceptions/InvariantError');
const { SongPayloadSchema } = require('./schemas');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvarianError(validationResult.error.message);
    }
  },
};
module.exports = SongsValidator;
