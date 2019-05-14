

exports.clearFilepath=function clearFilepath(path) {
    path=path.replace(/\//g,'')
    path=path.replace(/\\/g,'')
    return path
}
