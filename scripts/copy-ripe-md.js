var fs = require('fs');
var path = require('path');
var root = __dirname.replace('scripts', '');

if(!fs.existsSync(path.join(root + 'dist')))
    fs.mkdirSync(path.join(root + 'dist'));

fs.copyFileSync(path.join(root + 'src/ripemd.es5.js'), path.join(root + 'dist/ripemd.js'));