var path=require('path')
var { dir2tree } = require('../util/dir2tree');
var { ignoreList } = require('../util/ignoreUtil');
var { getParam } = require('../util/urlUtil');

exports.apiRouter = function apiRouter(req, res, rootPath) {
    if (req.url.includes('/filelist')) {
        var dir = getParam(req.url, 'dir');
        var list
        if(dir){
            var relativePath=path.join(rootPath,dir)
            list = dir2tree(relativePath, {
                ignoreList: ignoreList,
                absolutePath: rootPath
            });
        }else{
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
    }
};
