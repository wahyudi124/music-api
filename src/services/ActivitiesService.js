const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../exceptions/InvariantError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity(playlist_id, song_id, user_id, action) {
    const id = nanoid(16);
    const actionTime = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
      values: [id, playlist_id, song_id, user_id, action, actionTime],
    };
    const result = await this._pool.query(query);

    if (result.rows[0].id === 0) {
      throw new InvariantError('Aktifitas gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getActivityById(playlistId) {
    const query = {
      text: `SELECT playlist_song_activities.playlist_id, users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
            FROM playlist_song_activities
            JOIN users ON playlist_song_activities.user_id = users.id
            JOIN songs ON playlist_song_activities.song_id = songs.id
            WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ActivitiesService;
