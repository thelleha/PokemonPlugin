module.exports = {
    entry: {
      content_add_players: './src/content_add_players.mjs',
      content_my_tournaments: './src/content_my_tournaments.mjs',
    },
    output: {
      filename: '[name].mjs',
      path: __dirname + '/dist',
    },
  };