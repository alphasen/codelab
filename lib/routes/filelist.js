var { getFileList } = require('../util/fileUtil');

exports.filelistRoute = function filelistRoute(req, res) {
    var list = getFileList('/Users/hisenjk/development/study/codelab/public');
    var json = JSON.stringify(list);
    res.setHeader("Content-Type", "application/json")
    res.writeHead(200, 'OK');
    res.write(json);
    res.end();
    return;
};
