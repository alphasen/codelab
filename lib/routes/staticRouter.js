var fs = require('fs');
var path = require('path')

exports.staticRouter = function staticRouter(req, res, filePath) {
    fs.readFile(filePath, 'binary', function(error, content) {
        if (error) {
            if (error.message.includes('no such file')) {
                // 404
                res.writeHead(404, 'file not found');
                res.end('<h1>Not Found!</h1>');
            } else {
                res.writeHead(501, 'server internal error');
                res.end('<h1>Server internal error!</h1>');
            }
        } else {
            res.writeHead(200, 'OK');
            res.write(content, 'binary');
            res.end();
        }
    });
};
