const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postNewPlaylist,
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getAllPlaylist,
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistById,
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongToPlaylist,
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongsOnPlaylist,
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongOnPlaylist,
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getActivityByPlaylistId,
    options: {
      auth: 'musicapi_jwt',
    },
  },
];

module.exports = routes;
