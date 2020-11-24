Some PostCSS edge cases.

`infiniteLoop.js` demonstrate how plugins can create infinite loop by undoing each other's work.

`test.js` demonstrates that when a plugin calls creates a new `postcss()` instance gets called first, 
other plugins do not get called.
