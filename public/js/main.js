var zTreeObj;
var zTreeSeting = {
    async: {
        enable: true
    },
    callback: {
        onClick: zTreeOnClick
    }
};
function zTreeOnClick(e, treeId, treeNode, clickFlag) {
    $('#preview').attr('src', '/codelab/truelink/' + treeNode.path);
}
function getRouteList() {
    $.get('/codelab-api/filelist', function(json) {
        zTreeObj = $.fn.zTree.init($('#treeDemo'), zTreeSeting, json);
        zTreeObj.expandAll(true);
    });
}
$(document).ready(function() {
    getRouteList();
});
