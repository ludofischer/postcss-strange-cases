module.exports = () => {
  return {
    postcssPlugin: 'black',
    Declaration(decl) {
      decl.value = 'black';
    },
  };
};
module.exports.postcss = true;
