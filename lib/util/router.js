var path = require('path');
var fs = require('fs');
var { apiRouter } = require('../routes/apiRouter');
var { serveRouter } = require('../routes/serveRouter');
var { staticRouter } = require('../routes/staticRouter');
var { clearFilepath } =require('../util/mainUtils')
var os = require('os');

exports.router = function(req, res, option) {
    // var filePath = path.join(__dirname, '../../public', req.url);
    req.url=decodeURI(req.url)
    if (option.logger) {
        option.logger.request(req, res); // log
    }
    if (req.url === '/') {
        var indexTplPath = path.join(__dirname, '../../public/index.html');
        fs.readFile(indexTplPath, 'binary', function(error, content) {
            res.writeHead(200, 'OK');
            res.write(content, 'binary');
            res.end();
        });
        return;
    }
    if (req.url.startsWith('/codelab-api')) {
        // xhr request
        apiRouter(req, res, option.rootPath);
        return;
    }
    if (req.url.startsWith('/codelab/truelink/')) {
        // iframe request
        serveRouter(req, res, option.rootPath);
        return;
    }
    if(req.url.startsWith('/codelab-statics/debugjs/')){
        var truePath = req.url.substring('/codelab-statics/debugjs/'.length);
            truePath=clearFilepath(truePath)
        var staticPath = path.resolve(os.tmpdir(), truePath);
        staticRouter(req, res, staticPath);
        return;
    }
    if (req.url.startsWith('/codelab-statics/')) {
        // static request
        var truePath = req.url.substring('/codelab-statics/'.length);
        var staticPath = path.join(__dirname, '../../public', truePath);
        staticRouter(req, res, staticPath);
        return;
    }
    try {
        var realPath = path.join(option.rootPath, req.url);
        if (!fs.existsSync(realPath)) {
            // 404
            res.writeHead(404, 'file not found');
            res.end('<h1>Not Found!</h1>');
        } else if (fs.lstatSync(realPath).isDirectory()) {
            var indexTplPath = path.join(__dirname, '../../public/index.html');
            var htmlTpl = fs.readFileSync(indexTplPath,"utf8");
            var html=htmlTpl.replace('isDirRequest=false','isDirRequest=true')
            res.writeHead(200, 'OK');
            res.write(html, 'binary');
            res.end();
            return;
        } else {
            var indexTplPath = path.join(__dirname, '../../public/index.html');
            var htmlTpl = fs.readFileSync(indexTplPath,"utf8");
            var html = htmlTpl.replace(
                '#previewSrc#',
                '/codelab/truelink' + req.url
            );
            html=html.replace('containerattrtoreplace','style="display: none;"')
            html=html.replace('previewattrtoreplace','style="display: block;"')
            res.writeHead(200, 'OK');
            res.write(html, 'binary');
            res.end();
            return;
        }
    } catch (error) {
        res.writeHead(200, 'OK');
        res.write(error.message, 'binary');
        res.end();
    }
};
