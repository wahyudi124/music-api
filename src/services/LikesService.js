const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async veryfyAlbumId(albumId) {
    const query1 = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result1 = await this._pool.query(query1);
    if (!result1.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async verifyAlbumAlreadyLikes(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Album sudah di sukai');
    }
  }

  async verifyUserIdAndAlbumId(userId, albumId) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('User tidak di temukan');
    }
    const query1 = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result1 = await this._pool.query(query1);
    if (!result1.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async likeAlbum(albumId, userId) {
    const id = `albusr-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Tidak dapat menyukai album');
    }
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async unlikeAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal untuk tidak menyukai album');
    }
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getAlbumTotalLike(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);

      const data = {
        totalLike: parseInt(result, 10),
        from: 'cache',
      };

      return data;
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`likes:${albumId}`, result.rowCount);
      const data = {
        totalLike: result.rowCount,
        from: 'db',
      };
      return data;
    }
  }
}

module.exports = LikesService;
