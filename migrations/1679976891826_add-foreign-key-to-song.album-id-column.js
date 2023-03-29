/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql("INSERT INTO albums(id, name, year, created_at,updated_at) VALUES ('old_album', 'old album', 2023, current_timestamp,current_timestamp)");
  pgm.sql("UPDATE songs SET album_id = 'old_album' WHERE album_id IS NULL");
  pgm.addConstraint('songs', 'fk_songs.ablum_id_ablum.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.ablum_id_ablum.id');

  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_album'");

  pgm.sql("DELETE FROM albums WHERE id = 'old_album'");
};
