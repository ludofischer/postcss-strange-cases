/** 
Changes color to border-color 
*/
function colorToBorder() {
  return {
    postcssPlugin: 'colorToBorder',
    Declaration(decl) {
      decl.prop = 'border-color';
    },
  };
}
colorToBorder.postcss = true;

function colorToBorderOnce() {
  return {
    postcssPlugin: 'colorToBorderOnce',
    OnceExit(css) {
      css.walkDecls((decl) => {
        decl.prop = 'border.color';
      });
    },
  };
}

colorToBorderOnce.postcss = true;

module.exports = {
  colorToBorder,
  colorToBorderOnce,
};
