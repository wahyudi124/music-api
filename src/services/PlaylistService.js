const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../exceptions/AuthorizationError');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class PlayListService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async verifyPlaylistAccess(playlitsId, userId) {
    try {
      await this.verifyPlaylistOwner(playlitsId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlitsId, userId);
      } catch {
        throw error;
      }
    }
  }

  async addPlaylist(name, owner) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlist VALUES($1,$2,$3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal membuat playlist baru.');
    }
    return result.rows[0].id;
  }

  async getAllPlaylist(owner) {
    try {
      await this._collaborationService.verifyAsCollaborator(owner);

      const query = {
        text: `SELECT playlist.id, playlist.name, users.username FROM playlist
              JOIN collaborations ON playlist.id = collaborations.playlist_id
              JOIN users ON collaborations.user_id = $1
              WHERE playlist.owner = users.id
              ORDER BY playlist.id`,
        values: [owner],
      };

      const result = await this._pool.query(query);
      return result.rows;
    } catch (error) {
      const query = {
        text: `SELECT playlist.id, playlist.name, users.username FROM playlist
              LEFT JOIN users ON users.id = playlist.owner
              WHERE users.id = $1`,
        values: [owner],
      };
      const result = await this._pool.query(query);
      return result.rows;
    }
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT playlist.id, playlist.name, users.username FROM playlist
              LEFT JOIN users ON users.id = playlist.owner
              WHERE playlist.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal Menghapus Playlist, Playlist tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlayListService;
