exports.clearFilepath = function clearFilepath(path) {
    path = path.replace(/\//g, '');
    path = path.replace(/\\/g, '');
    return path;
};

/**
 * get all mathchs to a string
 * @param {Regexp} regex [regex]
 * @param {string} str [content to find]
 */
function getAllMatchContent(regex, str) {
    var m = regex.exec(str),
        matches = '';
    // m && m.forEach((match, groupIndex) => {
    //         matches += match;
    //         console.log(`Found match, group ${groupIndex}: ${match}`);
    //     });
    matches = m && m[1];
    return matches||'';
}

exports.getAllMatchContent = getAllMatchContent;

/**
 * replace all match regexp to ''
 * @param {array} regexpArr [regexp]
 * @param {string} str [content to replace]
 */
function clearAllMatch(regexpArr, str) {
    regexpArr.forEach(function(regexp) {
        str = str.replace(regexp, '');
    });
    return str;
}

exports.clearAllMatch = clearAllMatch;
