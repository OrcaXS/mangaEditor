const { join } = require('path');
const createResolver = require('postcss-import-resolver');
// const tailwindcss = require('tailwindcss');
// const bemLinter = require('postcss-bem-linter');

module.exports = () => ({
  sourceMap: true,
  plugins: {
    'postcss-import': {
      resolve: createResolver({
        alias: {
          '~': join(__dirname),
          // '~~': join(__dirname),
          '@': join(__dirname, 'src'),
          // '@@': join(__dirname),
        },
      }),
    },
    'postcss-url': {},
    tailwindcss: './tailwind.js',
    'postcss-cssnext': {
      browserslist: [
        '> 1%',
      ],
      features: {
        customProperties: false,
      },
    },
    'postcss-hexrgba': {},
    'postcss-bem-linter': {
      preset: 'suit',
      // implicitComponents: 'src/components/**/*.vue',
      // presetOptions: { namesace: 'twt' },
      ignoreSelectors: [
        /^\[v-cloak\]$/,
      ],
    },
    'postcss-reporter': {},
  },
});
