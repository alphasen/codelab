var fs = require('fs'),
    path = require('path');

/**
 * dir a folder as tree
 * @param {string} filename
 * @param {object} option config options { ignoreList: [], absolutePath: '' }
 */
function dir2tree(filename, option = { ignoreList: [], absolutePath: '' }) {
    var stats = fs.lstatSync(filename),
        info = {
            path: path.relative(option.absolutePath, filename),
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        var ignoreList = option.ignoreList;
        if (ignoreList.includes(info.name)) {
            // skip ignore files
            return false;
        }
        info.type = 'folder';
        info.children = fs.readdirSync(filename).map(function(child) {
            return dir2tree(filename + '/' + child, option);
        });
        info.children = info.children.filter(function(item) {
            return item;
        });
    } else {
        info.type = 'file';
    }
    return info;
}

exports.dir2tree = dir2tree;
