const ClientError = require('./ClientError');

class InvarianError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvarianError;
