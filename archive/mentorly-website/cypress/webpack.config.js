// cypress/webpack.config.js
module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  node: false,
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
      },
    ],
  },
}
