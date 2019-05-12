var fs = require('fs');
var path = require('path')

exports.truelinkRoute = function filelistRoute(req, res, rootPath) {
    var filePath = req.url.substring('/codelab/truelink/'.length);
    filePath = path.join(rootPath, filePath);
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
};
