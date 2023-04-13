const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, likeService, storageService, validator, uploadValidator) {
    this._service = service;
    this._likeService = likeService;
    this._storageService = storageService;
    this._validator = validator;
    this._uploadValidator = uploadValidator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  // eslint-disable-next-line no-unused-vars
  async getAlbumByIdHandler(request, _) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  // eslint-disable-next-line no-unused-vars
  async putAlbumByIdHandler(request, _) {
    const { id } = request.params;
    this._validator.validateAlbumPayload(request.payload);
    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  // eslint-disable-next-line no-unused-vars
  async deleteAlbumByIdHandler(request, _) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._likeService.verifyUserIdAndAlbumId(credentialId, id);
    await this._likeService.verifyAlbumAlreadyLikes(credentialId, id);
    await this._likeService.likeAlbum(id, credentialId);
    const response = h.response({
      status: 'success',
      message: 'Album telah disukai',
    });
    response.code(201);
    return response;
  }

  async deleteLikeAlbumHanlder(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._likeService.verifyUserIdAndAlbumId(credentialId, id);
    await this._likeService.unlikeAlbum(id, credentialId);
    return {
      status: 'success',
      message: 'Album tidak disukai',
    };
  }

  async getTotalLikeAlbumsHandler(request, h) {
    const { id } = request.params;

    await this._likeService.veryfyAlbumId(id);
    const likes = await this._likeService.getAlbumTotalLike(id);
    const response = h.response({
      status: 'success',
      data: { likes: likes.totalLike },
    });
    response.header('X-Data-Source', likes.from);
    return response;
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._uploadValidator.validateImageHeaders(cover.hapi.headers);
    const replasefilename = cover.hapi.filename.replace(/\s+/g, '-');
    cover.hapi.filename = replasefilename;
    const filename = await this._storageService.writeFile(cover, cover.hapi);

    // Using  local Storege
    // const pathfile = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;

    await this._service.addAlbumCover(id, filename);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
