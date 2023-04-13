exports.up = (pgm) => {
  // Add new column before existing_column_name
  pgm.addColumn('albums', {
    cover: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  // Drop the new column
  pgm.dropColumn('albums', 'cover');
};
