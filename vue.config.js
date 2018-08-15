const path = require('path');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob-all');

const resolveConf = {
  resolve: {
    modules: [path.resolve(__dirname, 'lib'), 'node_modules'],
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '~': path.resolve(__dirname),
      '@': path.resolve(__dirname, 'src'),
      // your aliases go here.
    },
  },
};

// purgecssPluginConf() {
//   return {
//     plugins: {
//       // Remove unused CSS using purgecss. See https://github.com/FullHuman/purgecss
//       // for more information about purgecss.
//       new PurgecssPlugin({
//         paths: glob.sync([
//           path.join(__dirname, './../src/index.html'),
//           path.join(__dirname, './../**/*.vue'),
//           path.join(__dirname, './../src/**/*.js')
//         ])
//       }),
//     }
//   }
// }

module.exports = {
  baseUrl: process.env.CONF_BASE_URL || '/',
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          // Remove unused CSS using purgecss. See https://github.com/FullHuman/purgecss
          // for more information about purgecss.
          new PurgecssPlugin({
            paths: glob.sync([
              path.join(__dirname, './../src/index.html'),
              path.join(__dirname, './../**/*.vue'),
              path.join(__dirname, './../src/**/*.js'),
            ]),
          }),
        ],
        ...resolveConf,
      };
    }
    return resolveConf;
  },
  pwa: {
    workboxPluginMode: 'GenerateSW',
    name: 'Manga Editor',
    themeColor: '#e198b4',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'no',
    iconPaths: {
      favicon32: 'img/icons/icon-32x32.png',
      favicon16: 'img/icons/icon-16x16.png',
      appleTouchIcon: 'img/icons/icon-152x152.png',
      msTileImage: 'img/icons/icon-144x144.png',
    },
  },
};
