module.exports = () => {
  return {
    postcssPlugin: 'red',
    Declaration(decl) {
      decl.value = 'red';
    },
  };
};
module.exports.postcss = true;
