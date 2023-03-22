const Hapi = require('@hapi/hapi');
const CatchEvent = require('./extensions/index');
require('dotenv').config();
const albums = require('./api/albums');
const AlbumsServices = require('./services/AlbumsServices');
const { AlbumsValidator, SongsValidator } = require('./validator');
const songs = require('./api/songs');
const SongsServices = require('./services/SongsServices');

const init = async () => {
  const albumsService = new AlbumsServices();
  const songsServices = new SongsServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([{
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  }, {
    plugin: songs,
    options: {
      service: songsServices,
      validator: SongsValidator,
    },
  },
  ]);

  await server.ext('onPreResponse', CatchEvent);

  await server.start();
  console.log(`Server Running on ${server.info.uri}`);
};

init();
