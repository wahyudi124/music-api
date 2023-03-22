const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;
    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  // eslint-disable-next-line no-unused-vars
  async getSongsHandler(request, _) {
    const { title, performer } = request.query;

    let songs;
    if (title !== undefined || performer !== undefined) {
      songs = await this._service.getSongsbyFilter({ title, performer });
    } else {
      songs = await this._service.getSongs();
    }
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  // eslint-disable-next-line no-unused-vars
  async getSongByIdHandler(request, _) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  // eslint-disable-next-line no-unused-vars
  async putSongByIdHandler(request, _) {
    const { id } = request.params;
    this._validator.validateSongPayload(request.payload);
    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  // eslint-disable-next-line no-unused-vars
  async deleteSongByIdHandler(request, _) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
