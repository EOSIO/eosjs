var fs = require('fs');
var root = __dirname.replace('scripts', '');

if(!fs.existsSync(root + 'dist'))
    fs.mkdirSync(root + 'dist');

fs.copyFileSync(root + 'src\\ripemd.es5.js', root + 'dist\\ripemd.js');