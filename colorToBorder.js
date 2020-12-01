/** 
Changes color to border-color 
*/
module.exports = () => {
  return {
    postcssPlugin: 'colorToBorder',
    Declaration(decl) {
      decl.prop = 'border-color';
    },
  };
};
module.exports.postcss = true;
