/**
 * get a param from url
 * @param  {string} search [url]
 * @return {string}      [param name]
 */
exports.getParam= function getParam(search, name) {
    let reg = new RegExp('[?&]' + name + '=([^&]*)(&|$)', 'i')
    let r = search.match(reg)
    if (r != null) return unescape(r[1]); return null
}

/**
 * param to obj
 * @return {string} [url]
 */
exports.url2obj= function url2obj(search) {
    let reg = /([^?&=]+)=([^?&=]+)/g, obj = {}
    search.replace(reg, function () {
        obj[arguments[1]] = arguments[2]
    })
    return obj
}
