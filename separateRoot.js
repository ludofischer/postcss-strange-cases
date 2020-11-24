const redPlugin = require('./redplugin.js');
const blackPlugin = require('./blackplugin.js');
const postcss = require('postcss');

module.exports = function () {
  return {
    postcssPlugin: 'separate-traversal',
    async RootExit(root) {
      await postcss([blackPlugin]).process(root);
    },
  };
};

module.exports.postcss = true;
