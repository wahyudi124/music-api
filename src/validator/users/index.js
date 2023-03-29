const InvarianError = require('../../exceptions/InvariantError');
const { UserPayloadSchema } = require('./schemas');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvarianError(validationResult.error.message);
    }
  },
};
module.exports = UsersValidator;
