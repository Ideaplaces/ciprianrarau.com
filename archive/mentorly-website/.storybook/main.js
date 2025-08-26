const path = require('path')

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: [
    '../components/**/*.stories.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    'storybook-react-intl',
    '@storybook/preset-scss',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-apollo-client',
    'storybook-addon-next-router',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          components: path.join(__dirname, '../components'),
          lib: path.join(__dirname, '../lib'),
          mocks: path.join(__dirname, '../mocks'),
          factories: path.join(__dirname, '../factories'),
          types: path.join(__dirname, '../types'),
        },
      },
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            type: 'javascript/auto',
            test: /\.mjs$/,
            use: [],
          },
          {
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader',
          },
        ],
      },
      // module: {
      //   ...config.module,
      //   rules: [
      //     // Filter out the default .css and .module.css rules and replace them with our own.
      //     ...(config.module.rules = config.module.rules.map((f) => {
      //       if (f.oneOf === undefined) {
      //         return f
      //       }

      //       return {
      //         oneOf: f.oneOf.map((r) => {
      //           if (r.test === undefined) {
      //             return r
      //           }

      //           if (r.test.toString() === '/\\.css$/') {
      //             return {
      //               test: /\.css$/,
      //               exclude: [/\.module\.css$/, /@storybook/],
      //               include: path.resolve(__dirname, '../'),
      //               use: [
      //                 'style-loader',
      //                 {
      //                   loader: 'css-loader',
      //                   options: { importLoaders: 1, sourceMap: false },
      //                 },
      //                 'postcss-loader',
      //               ],
      //             }
      //           }
      //           if (r.test.toString() === '/\\.module\\.css$/') {
      //             return {
      //               test: /\.module\.css$/,
      //               exclude: [/@storybook/],
      //               include: path.resolve(__dirname, '../'),
      //               use: [
      //                 'style-loader',
      //                 {
      //                   loader: 'css-loader',
      //                   options: {
      //                     importLoaders: 1,
      //                     sourceMap: false,
      //                     modules: true,
      //                   },
      //                 },
      //                 'postcss-loader',
      //               ],
      //             }
      //           }
      //           return r
      //         }),
      //       }
      //     })),
      //   ],
      // },
    }
  },
}
