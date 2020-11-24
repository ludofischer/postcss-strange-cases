module.exports = () => {
  return {
    postcssPlugin: 'black',
    Declaration(decl) {
      console.log('In black plugin', decl.toString());
      decl.value = 'black';
    },
  };
};
module.exports.postcss = true;
