var path = require('path');
var fs = require('fs');
var { dir2tree } = require('../util/dir2tree');
var { ignoreList } = require('../util/ignoreUtil');
var { getParam } = require('../util/urlUtil');
var querystring = require('querystring');
var { clearFilepath,getAllMatchContent,clearAllMatch } = require('../util/mainUtils');
var os = require('os');

exports.apiRouter = function apiRouter(req, res, rootPath) {
    if (req.url.includes('/filelist')) {
        var dir = getParam(req.url, 'dir');
        var list;
        if (dir) {
            var relativePath = path.join(rootPath, dir);
            list = dir2tree(relativePath, {
                ignoreList: ignoreList,
                absolutePath: rootPath
            });
        } else {
            list = dir2tree(rootPath, {
                ignoreList: ignoreList,
                absolutePath: rootPath
            });
        }
        var json = JSON.stringify(list);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200, 'OK');
        res.write(json);
        res.end();
        return;
    } else if (req.url.includes('savefile')) {
        var data = '';
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            data = decodeURI(data);
            var param = querystring.parse(data);
            fs.writeFileSync(
                path.resolve(rootPath, param.filepath),
                param.content
            );
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify({ code: 0 }));
            res.end();
            return;
        });
    } else if (req.url.includes('debugfile')) {
        var debugParam = '';
        req.on('data', function(chunk) {
            debugParam += chunk;
        });
        req.on('end', function() {
            debugParam = decodeURI(debugParam);
            debugParam = querystring.parse(debugParam);
            var htmlTpl = fs.readFileSync(
                path.join(__dirname, '../../public/debug.html'),
                'utf8'
            );
            var content=debugParam.content
            var cssContent=getAllMatchContent(/<css>([\s\S]*)<\/css>/,content),
                jsContent=clearAllMatch([/<tpl>([\s\S]*)<\/tpl>/,/<css>([\s\S]*)<\/css>/],content),
                htmlContent=getAllMatchContent(/<tpl>([\s\S]*)<\/tpl>/,content)

            htmlTpl=htmlTpl.replace(
                /\/\/\$\{replace2filename\}/g,
                debugParam.filepath
            )
            // handle css
            htmlTpl=htmlTpl.replace(
                /\/\* replace2css \*\//g,
                cssContent
            )
            // handle html
            htmlTpl=htmlTpl.replace(
                /<!-- replace2html -->/g,
                htmlContent
            )
            htmlTpl = htmlTpl.replace(
                /\/\/\$\{replace2js\}/g,
                jsContent
            );
            // write to os temp folder
            fs.writeFileSync(
                path.resolve(os.tmpdir(), clearFilepath(debugParam.filepath)),
                htmlTpl
            );
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify({ code: 0 }));
            res.end();
            return;
        });
    }
};
