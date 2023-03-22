const mapDBtoAlbumModel = ({
  // eslint-disable-next-line camelcase
  id, name, year, created_at, updated_at,
}) => ({
  id,
  name,
  year,
  createAt: created_at,
  upadateAt: updated_at,
});

const mapDBtoSongsModel = ({
  // eslint-disable-next-line camelcase
  id, title, year, genre, performer, duration, album_id, created_at, updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  createAt: created_at,
  upadateAt: updated_at,
});

module.exports = { mapDBtoAlbumModel, mapDBtoSongsModel };
