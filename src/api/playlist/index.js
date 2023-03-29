const PlaylistsHandler = require('./handler');
const routes = require('./routers');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { playlistService, playlistSongsService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistService,
      playlistSongsService,
      validator,
    );
    server.route(routes(playlistsHandler));
  },
};
