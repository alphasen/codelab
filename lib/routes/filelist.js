var { dir2tree } = require('../util/dir2tree');
var {ignoreList}=require('../util/ignoreUtil')

exports.filelistRoute = function filelistRoute(req, res,rootPath) {
    var list = dir2tree(rootPath,{
        ignoreList:ignoreList,
        absolutePath:rootPath
    });
    var json = JSON.stringify(list);
    res.setHeader("Content-Type", "application/json")
    res.writeHead(200, 'OK');
    res.write(json);
    res.end();
    return;
};
