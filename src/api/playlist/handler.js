const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(playlistService, playlistSongsService, validator) {
    this._playlistService = playlistService;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;
    autoBind(this);
  }

  async postNewPlaylist(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const id = await this._playlistService.addPlaylist(name, credentialId);
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getAllPlaylist(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlist = await this._playlistService.getAllPlaylist(credentialId);
    return {
      status: 'success',
      data: {
        playlists: playlist,
      },
    };
  }

  async deletePlaylistById(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(id, credentialId);
    await this._playlistService.deletePlaylistById(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylist(request, h) {
    const { id } = request.params;
    this._validator.validateSongOnPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    await this._playlistSongsService.verifyPlaylistIdAndSongId(id, songId);
    await this._playlistSongsService.addSongOnPlaylist(id, songId, credentialId);
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getSongsOnPlaylist(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._playlistService.getPlaylistById(id);
    const songs = await this._playlistSongsService.getAllSongOnPlaylist(id);

    playlist.songs = songs;

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongOnPlaylist(request, h) {
    const { id } = request.params;
    this._validator.validateSongOnPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    await this._playlistSongsService.deleteSongOnPlaylist(id, songId, credentialId);
    return {
      status: 'success',
      message: 'Lagu dalam Playlist berhasil dihapus',
    };
  }

  async getActivityByPlaylistId(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    const result = await this._playlistSongsService.getActivityServicebyId(id, credentialId);

    return {
      status: 'success',
      data: result,
    };
  }
}

module.exports = PlaylistHandler;
