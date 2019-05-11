var path = require('path');
var fs = require('fs');

exports.router = function(req, res) {
    var filePath = path.join(__dirname, '../../public', req.url);
    try {
        fs.readFile(filePath, 'binary', function(error, content) {
            if (error) {
                if (error.errno === -2) {
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
    } catch (error) {}
};