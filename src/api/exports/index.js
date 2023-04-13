const routes = require('./routers');
const ExportsHandler = require('./handler');

module.exports = {
  name: 'export',
  version: '1.0.0',
  register: async (server, {
    pubService, playlistService, validator,
  }) => {
    const exportsHandler = new ExportsHandler(
      pubService, playlistService, validator,
    );
    server.route(routes(exportsHandler));
  },
};
