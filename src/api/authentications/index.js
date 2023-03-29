const AuthenticationsHandler = require('./handler');
const routes = require('./routers');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authService, userService, tokenManager, validator,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authService,
      userService,
      tokenManager,
      validator,
    );
    server.route(routes(authenticationsHandler));
  },
};
