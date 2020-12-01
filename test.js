const { test } = require('uvu');
const assert = require('assert').strict;
const fs = require('fs');
const postcss = require('postcss');
const red = require('./redplugin.js');
const colorToBorder = require('./colorToBorder.js');
const black = require('./blackplugin.js');
const blackInSeparate = require('./separateRoot.js');

const css = `
p {
  color: blue;
}`;

const expected = `
p {
  border-color: black;
}`;

test('shall convert color and border', () => {
  return postcss([colorToBorder, black])
    .process(css, { from: undefined })
    .then((result) => {
      assert.strictEqual(result.css, expected);
    });
});

test('shall not convert color and border with separate traversal', () => {
  return postcss([
    colorToBorder,
    {
      postcssPlugin: 'separate-traversal',
      async Root(root) {
        await postcss([black]).process(root, { from: undefined });
      },
    },
  ])
    .process(css, { from: undefined })
    .then((result) => {
      assert.notStrictEqual(result.css, expected);
    });
});

test('shall convert color and border with separate traversal on exit', () => {
  return postcss([
    colorToBorder,
    {
      postcssPlugin: 'separate-traversal',
      async RootExit(root) {
        await postcss([black]).process(root, { from: undefined });
      },
    },
  ])
    .process(css, { from: undefined })
    .then((result) => {
      assert.strictEqual(result.css, expected);
    });
});

test('shall convert color and border with separate processor', () => {
  return postcss([colorToBorder, postcss([black])])
    .process(css, { from: undefined })
    .then((result) => {
      assert.strictEqual(result.css, expected);
    });
});
test.run();
