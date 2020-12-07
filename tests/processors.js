const { test } = require('uvu');
const assert = require('assert').strict;
const postcss = require('postcss');

const css = `
p {
  color: blue;
}`;

const expected = `
p {
  border-color: black;
}`;

function black() {
  return {
    postcssPlugin: 'black',
    Declaration(decl) {
      decl.value = 'black';
    },
  };
}
black.postcss = true;

function colorToBorder() {
  return {
    postcssPlugin: 'colorToBorder',
    Declaration(decl) {
      decl.prop = 'border-color';
    },
  };
}
colorToBorder.postcss = true;

test('shall convert color and border with separate processor', () => {
  return postcss([colorToBorder, postcss([black])])
    .process(css, { from: undefined })
    .then((result) => {
      assert.strictEqual(result.css, expected);
    });
});

test('shall convert color and border with strange plugin', () => {
  function createPlugin() {
    return postcss([black]);
  }
  createPlugin.postcss = true;
  const processor = postcss([colorToBorder, createPlugin]);
  return processor.process(css, { from: undefined }).then((result) => {
    assert.strictEqual(result.css, expected);
  });
});

test.run();
