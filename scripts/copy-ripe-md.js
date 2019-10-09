var fs = require('fs');
var root = __dirname + '\\..\\';
fs.copyFileSync(root + 'src\\ripemd.es5.js', root + 'dist\\ripemd.js');