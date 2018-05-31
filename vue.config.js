const { resolve } = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      modules: [resolve(__dirname, 'lib'), 'node_modules'],
      extensions: ['.js', '.vue'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '~': resolve(__dirname),
        '@': resolve(__dirname, 'src'),
        // your aliases go here.
      },
    },
  },
};
