const ClientError = require('../exceptions/ClientError');

const CatchEvent = (request, h) => {
  const { response } = request;
  if (response instanceof Error) {
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    if (!response.isServer) {
      return h.continue;
    }
    const newResponse = h.response({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
    newResponse.code(500);
    return newResponse;
  }
  return h.continue;
};

module.exports = CatchEvent;
