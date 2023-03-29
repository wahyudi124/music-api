const InvarianError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema } = require('./schemas');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvarianError(validationResult.error.message);
    }
  },
};
module.exports = AlbumsValidator;
