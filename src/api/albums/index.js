const AlbumsHandler = require('./handler');
const routes = require('./routers');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    service, likeService, storageService, validator, uploadValidator,
  }) => {
    const albumsHandler = new AlbumsHandler(
      service,
      likeService,
      storageService,
      validator,
      uploadValidator,
    );
    server.route(routes(albumsHandler));
  },
};
