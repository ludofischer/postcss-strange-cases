module.exports = () => {
  return {
    postcssPlugin: 'red',
    Declaration(decl) {
      console.log('In red plugin', decl.toString());
      decl.value = 'red';
    },
  };
};
module.exports.postcss = true;
