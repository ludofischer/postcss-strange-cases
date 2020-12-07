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

const metaOnlyOutput = `
p {
  color: black;
}`;

function blackPlugin() {
  return {
    postcssPlugin: 'black',
    Declaration(decl) {
      decl.value = 'black';
    },
  };
}
blackPlugin.postcss = true;

const metaWithRoot = suite('given the meta-plugin uses Root');

metaWithRoot(
  'when the other plugins use a visitor, then only the meta-plugin runs',
  () => {
    return postcss([
      {
        postcssPlugin: 'colorToBorder',
        Declaration(decl) {
          decl.prop = 'border-color';
        },
      },
      {
        postcssPlugin: 'meta-plugin',
        async Root(root, helper) {
          await helper
            .postcss([blackPlugin])
            .process(root, { from: undefined });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, metaOnlyOutput);
      });
  }
);

metaWithRoot(
  'when the other plugin uses OnceExit, then both plugins run',
  () => {
    return postcss([
      {
        postcssPlugin: 'colorToBorderOnce',
        OnceExit(css) {
          css.walkDecls((decl) => {
            decl.prop = 'border-color';
          });
        },
      },
      {
        postcssPlugin: 'meta-plugin',
        async Root(root, helper) {
          await helper
            .postcss([blackPlugin])
            .process(root, { from: undefined });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, expected);
      });
  }
);

metaWithRoot('when the other plugin uses Once, then both plugins run', () => {
  return postcss([
    {
      postcssPlugin: 'colorToBorderOnce',
      Once(css) {
        css.walkDecls((decl) => {
          decl.prop = 'border-color';
        });
      },
    },
    {
      postcssPlugin: 'meta-plugin',
      async Root(root, helper) {
        await helper.postcss([blackPlugin]).process(root, { from: undefined });
      },
    },
  ])
    .process(css, { from: undefined })
    .then((result) => {
      assert.strictEqual(result.css, expected);
    });
});

metaWithRoot.run();

const metaWithOnce = suite('given the meta-plugin uses Once');

metaWithOnce(
  'when the other plugin uses a visitor, then only the meta-plugin runs',
  () => {
    return postcss([
      {
        postcssPlugin: 'colorToBorder',
        Declaration(decl) {
          decl.prop = 'border-color';
        },
      },
      {
        postcssPlugin: 'meta-plugin',
        async Once(root) {
          await postcss([blackPlugin]).process(root, { from: undefined });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, metaOnlyOutput);
      });
  }
);

metaWithOnce('when the other plugin uses Once, then both plugins run', () => {
  return postcss([
    {
      postcssPlugin: 'colorToBorderOnce',
      Once(css) {
        css.walkDecls((decl) => {
          decl.prop = 'border-color';
        });
      },
    },
    {
      postcssPlugin: 'meta-plugin',
      async Once(root) {
        await postcss([blackPlugin]).process(root, { from: undefined });
      },
    },
  ])
    .process(css, { from: undefined })
    .then((result) => {
      assert.strictEqual(result.css, expected);
    });
});

metaWithOnce(
  'when the other plugin uses OnceExit, then both plugins run',
  () => {
    return postcss([
      {
        postcssPlugin: 'colorToBorderOnce',
        OnceExit(css) {
          css.walkDecls((decl) => {
            decl.prop = 'border-color';
          });
        },
      },
      {
        postcssPlugin: 'meta-plugin',
        async Once(root) {
          await postcss([blackPlugin]).process(root, { from: undefined });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, expected);
      });
  }
);

metaWithOnce.run();

const metaWithOnceExit = suite('given the meta-plugin uses OnceExit');

metaWithOnceExit(
  'when the other plugin uses a a visitor, then both plugins run',
  () => {
    return postcss([
      {
        postcssPlugin: 'colorToBorder',
        Declaration(decl) {
          decl.prop = 'border-color';
        },
      },
      {
        postcssPlugin: 'meta-plugin',
        async OnceExit(root, helper) {
          await helper
            .postcss([blackPlugin])
            .process(root, { from: undefined });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, expected);
      });
  }
);

metaWithOnceExit(
  'when the other plugin uses Once, then both plugins also run',
  () => {
    return postcss([
      {
        postcssPlugin: 'meta-plugin',
        async OnceExit(root, helper) {
          await helper
            .postcss([blackPlugin])
            .process(root, { from: undefined });
        },
      },
      {
        postcssPlugin: 'colorToBorderOnce',
        Once(css) {
          css.walkDecls((decl) => {
            decl.prop = 'border-color';
          });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, expected);
      });
  }
);

metaWithOnceExit(
  'when the other plugin uses OnceExit, then both plugins run',
  () => {
    return postcss([
      {
        postcssPlugin: 'meta-plugin',
        async OnceExit(root, helper) {
          await helper
            .postcss([blackPlugin])
            .process(root, { from: undefined });
        },
      },
      {
        postcssPlugin: 'colorToBorderOnce',
        OnceExit(css) {
          css.walkDecls((decl) => {
            decl.prop = 'border-color';
          });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, expected);
      });
  }
);

metaWithOnceExit(
  'when the other plugin is also a meta-plugin, then both plugins run',
  () => {
    return postcss([
      {
        postcssPlugin: 'meta-plugin',
        async OnceExit(root, helper) {
          await helper
            .postcss([blackPlugin])
            .process(root, { from: undefined });
        },
      },
      {
        postcssPlugin: 'other-meta-plugin',
        async OnceExit(css) {
          await postcss([
            {
              postcssPlugin: 'colorToBorder',
              Declaration(decl) {
                decl.prop = 'border-color';
              },
            },
          ]).process(css, { from: undefined });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, expected);
      });
  }
);

metaWithOnceExit.run();

const metaWithRootExit = suite('given the meta-plugin uses RootExit');

metaWithRootExit(
  'when the other plugin uses a visitor, then both plugins run',
  () => {
    return postcss([
      {
        postcssPlugin: 'colorToBorder',
        Declaration(decl) {
          decl.prop = 'border-color';
        },
      },
      {
        postcssPlugin: 'meta-plugin',
        async RootExit(root) {
          await postcss([blackPlugin]).process(root, { from: undefined });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, expected);
      });
  }
);

metaWithRootExit(
  'when the other plugin uses RootExit, then only the meta-plugin runs',
  () => {
    return postcss([
      {
        postcssPlugin: 'colorToBorder',
        RootExit(decl) {
          decl.prop = 'border-color';
        },
      },
      {
        postcssPlugin: 'meta-plugin',
        async RootExit(root) {
          await postcss([blackPlugin]).process(root, { from: undefined });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, metaOnlyOutput);
      });
  }
);

metaWithRootExit(
  'when the other plugin uses OnceExit, then only the meta-plugin runs',
  () => {
    return postcss([
      {
        postcssPlugin: 'colorToBorder',
        OnceExit(decl) {
          decl.prop = 'border-color';
        },
      },
      {
        postcssPlugin: 'meta-plugin',
        async RootExit(root) {
          await postcss([blackPlugin]).process(root, { from: undefined });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, metaOnlyOutput);
      });
  }
);

metaWithRootExit(
  'when the other plugin uses Once, then only the meta-plugin runs',
  () => {
    return postcss([
      {
        postcssPlugin: 'colorToBorder',
        Once(decl) {
          decl.prop = 'border-color';
        },
      },
      {
        postcssPlugin: 'meta-plugin',
        async RootExit(root) {
          await postcss([blackPlugin]).process(root, { from: undefined });
        },
      },
    ])
      .process(css, { from: undefined })
      .then((result) => {
        assert.strictEqual(result.css, metaOnlyOutput);
      });
  }
);

metaWithRootExit.run();
