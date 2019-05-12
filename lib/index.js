var http = require('http');
var { router } = require('./util/router');

var server = http.createServer(router);

server.listen(3333);
console.log('CodeLab is running at http://127.0.0.1:3333')
