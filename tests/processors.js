const { suite } = require('uvu');
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

const givenProcessorPlugin = suite('given the plugin is a processor');
givenProcessorPlugin(
  'shall convert color and border with separate processor',
  () => {
    return postcss([colorToBorder, postcss([black])])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, expected);
      });
  }
);

givenProcessorPlugin.run();

const givenPluginReturnsProcessor = suite(
  'given the plugin returns a processor'
);

givenPluginReturnsProcessor(
  'shall apply the plugin together with others',
  () => {
    function createPlugin() {
      return postcss([black]);
    }
    createPlugin.postcss = true;
    const processor = postcss([colorToBorder, createPlugin]);
    return processor.process(css, { from: undefined }).then((result) => {
      assert.strictEqual(result.css, expected);
    });
  }
);

givenPluginReturnsProcessor('the plugin shall remove nodes', () => {
  let plugin = () => {
    return {
      postcssPlugin: 'declaration-remover',
      Declaration: {
        color: (decl) => {
          decl.remove();
        },
      },
    };
  };
  plugin.postcss = true;

  let meta = () => {
    return postcss([plugin]);
  };
  meta.postcss = true;

  const processor = postcss([meta]);
  return processor.process(css, { from: undefined }).then((result) => {
    assert.strictEqual(
      result.css,
      `
p {
}`
    );
  });
});

givenPluginReturnsProcessor.run();
