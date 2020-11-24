const fs = require('fs');
const postcss = require('postcss');
const red = require('./redplugin.js');
const black = require('./blackplugin.js');
const separate = require('./separate_root.js');

fs.readFile('test.css', (err, css) => {
  postcss([red, black])
    .process(css, { from: 'test.css', to: 'dest.css' })
    .then((result) => {
      console.log('result', result.css);
    });
});
