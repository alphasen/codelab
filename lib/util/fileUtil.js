var fs = require('fs');
var path = require('path')

/**
 * traverse folder
 * @param {string} folderPath path to traverse
 */
exports.getFileList = function getFileList(folderPath) {
    var filesList = [];
    var targetObj = {};
    readFile(folderPath, filesList, targetObj,folderPath);
    return filesList;
};

/**
 * traverse folder
 * @param {string} folderPath
 * @param {array} filesList traverse result
 * @param {object} targetObj
 */
function readFile(folderPath, filesList, targetObj,absolutePath) {
    files = fs.readdirSync(folderPath);
    files.forEach(walk);
    function walk(file) {
        states = fs.statSync(folderPath + '/' + file);
        if (states.isDirectory()) {
            var item;
            if (targetObj['children']) {
                item = { name: file, children: [] };
                targetObj['children'].push(item);
            } else {
                item = { name: file, children: [] };
                filesList.push(item);
            }

            readFile(folderPath + '/' + file, filesList, item,absolutePath);
        } else {
            var obj = new Object();
            obj.size = states.size;
            obj.name = file;
            obj.path = folderPath + '/' + file;

            if (targetObj['children']) {
                var item = { name: file, path: path.relative(absolutePath, obj.path) };

                targetObj['children'].push(item);
            } else {
                var item = { name: file, path: path.relative(absolutePath, obj.path) };
                filesList.push(item);
            }
        }
    }
}

// test
// function writeFile(fileName, data) {
//     fs.writeFile(fileName, data, 'utf-8', complete);
//     function complete() {
//         console.log('complete');
//     }
// }

// var filesList = getFileList('Users/development/codelab/public');
// var str = JSON.stringify(filesList);
// str = "var data ={name:'Egret',children:#1}".replace('#1', str);
// writeFile('tree.js', str);
