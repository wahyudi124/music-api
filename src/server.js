const Hapi = require('@hapi/hapi');
const CatchEvent = require('./extensions/index');
require('dotenv').config();
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');

// albums
const albums = require('./api/albums');
const AlbumsServices = require('./services/AlbumsServices');
const AlbumsValidator = require('./validator/albums');
const LikesService = require('./services/LikesService');

// Using Local Storage
// const StorageService = require('./services/StorageService');

const UploadsValidator = require('./validator/uploads');
const CacheService = require('./services/CacheService');

const StorageServiceS3 = require('./services/AWSS3Service');

// song
const SongsValidator = require('./validator/songs');
const songs = require('./api/songs');
const SongsServices = require('./services/SongsServices');

// user
const UsersValidator = require('./validator/users');
const users = require('./api/users');
const UsersServices = require('./services/UsersService');

// auth
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlist
const playlist = require('./api/playlist');
const PlayListService = require('./services/PlaylistService');
const PlaylistValidator = require('./validator/playlist');

// export
const exportsApi = require('./api/exports');
const ProducerService = require('./services/ProducerService');
const ExportsValidator = require('./validator/exports');

// colab
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Playlist Song
const PlaylistSongsService = require('./services/PlaylistSongsService');

const ActivitiessService = require('./services/ActivitiesService');

const init = async () => {
  const usersService = new UsersServices();
  const collaborationsService = new CollaborationsService();
  const albumsService = new AlbumsServices();
  const songsServices = new SongsServices();
  const activitiessService = new ActivitiessService();
  const authService = new AuthenticationsService();
  const playlistService = new PlayListService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService(
    activitiessService,
    usersService,
    collaborationsService,
  );
  const cacheService = new CacheService();
  const likeService = new LikesService(cacheService);
  // const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/images'));
  const storageService = new StorageServiceS3();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('musicapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([{
    plugin: albums,
    options: {
      service: albumsService,
      likeService,
      storageService,
      validator: AlbumsValidator,
      uploadValidator: UploadsValidator,
    },
  }, {
    plugin: songs,
    options: {
      service: songsServices,
      validator: SongsValidator,
    },
  },
  {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    },
  },
  {
    plugin: playlist,
    options: {
      playlistService,
      playlistSongsService,
      validator: PlaylistValidator,
    },
  },
  {
    plugin: collaborations,
    options: {
      collaborationsService,
      playlistService,
      usersService,
      validator: CollaborationsValidator,
    },
  },
  {
    plugin: authentications,
    options: {
      authService,
      userService: usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },

  },
  {
    plugin: exportsApi,
    options: {
      pubService: ProducerService,
      playlistService,
      validator: ExportsValidator,
    },
  },
  ]);

  await server.ext('onPreResponse', CatchEvent);

  await server.start();
  console.log(`Server Running on ${server.info.uri}`);
};

init();
