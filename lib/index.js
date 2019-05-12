var http = require('http');
var { router } = require('./util/router');

function Codelab(options) {
    this.server = http.createServer(function(req,res){
        router(req,res,options)
    });
}

Codelab.prototype.listen = function() {
    this.server.listen.apply(this.server, arguments || 3333);
    console.log('CodeLab is running at http://127.0.0.1:3333');
};

Codelab.prototype.close = function() {
    return this.server.close();
};

exports.createServer = function(options) {
    return new Codelab(options);
};

exports.Codelab = Codelab;
