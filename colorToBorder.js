/** 
Changes color to border-color 
*/
module.exports = () => {
  return {
    postcssPlugin: 'colorToBorder',
    Declaration(decl) {
      console.log('In border plugin', decl.toString());
      decl.prop = 'border-color';
    },
  };
};
module.exports.postcss = true;
