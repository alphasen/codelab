var path = require('path');
var fs = require('fs');
var { filelistRoute }=require('../routes/filelist')

exports.router = function(req, res) {
    var filePath = path.join(__dirname, '../../public', req.url);
    if(req.url==='/'){
        var indexTplPath=path.join(__dirname,'../../public/index.html')
        fs.readFile(indexTplPath, 'binary', function(error, content) {
            res.writeHead(200, 'OK');
            res.write(content, 'binary');
            res.end();
        })
        return
    }
    if(req.url==='/codelab-api/filelist'){
        filelistRoute(req,res)
        return
    }
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
