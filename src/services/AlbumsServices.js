const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class AlbumsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
      values: [id, name, year, createdAt, updatedAt, null],
    };

    // this._pool.query(query);
    const result = await this._pool.query(query);

    if (result.rows[0].id === 0) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT albums.id, albums.name, albums.year,albums.cover, songs.id AS song_id, songs.title, songs.performer 
      FROM albums 
      LEFT JOIN songs ON albums.id = songs.album_id 
      WHERE albums.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const album = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      year: result.rows[0].year,
      coverUrl: result.rows[0].cover,
      songs: [],
    };

    result.rows.forEach((row) => {
      if (row.song_id && row.title && row.performer) {
        album.songs.push({
          id: row.song_id,
          title: row.title,
          performer: row.performer,
        });
      }
    });

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year= $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addAlbumCover(albumId, url) {
    const query1 = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 ',
      values: [url, albumId],
    };

    const result1 = await this._pool.query(query1);
    if (result1.rowCount === 0) {
      throw new NotFoundError('Gagal memperbarui Cover. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsServices;
