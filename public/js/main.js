var zTreeObj, folderTree;
var zTreeSeting = {
    async: {
        enable: true
    },
    callback: {
        onClick: zTreeOnClick
    }
};
function zTreeOnClick(e, treeId, treeNode, clickFlag) {
    if (treeNode.type === 'folder') {
        if (folderTree) {
            // clear nodes start
            var nodes = folderTree.getNodes();
            for (var i = nodes.length - 1; i >= 0; i--) {
                folderTree.removeNode(nodes[i]);
            }
            // clear nodes end

            folderTree.addNodes(null, treeNode.children);
        }
        treeNode.path
            ? history.pushState(
                  null,
                  'codelab|' + treeNode.name,
                  '/' + treeNode.path
              )
            : '';
        $('#preview').css('display', 'none');
        $('#folder_container').css('display', 'block');
    } else {
        $('#preview').attr('src', '/codelab/truelink/' + treeNode.path);
        treeNode.path
            ? history.pushState(
                  null,
                  'codelab|' + treeNode.name,
                  '/' + treeNode.path
              )
            : '';
        $('#preview').css('display', 'block');
        $('#folder_container').css('display', 'none');
    }
}
function initTree() {
    $.get('/codelab-api/filelist', function(json) {
        zTreeObj = $.fn.zTree.init($('#treeDemo'), zTreeSeting, json);
        zTreeObj.expandAll(true);
        if (!isDirRequest) {
            folderTree = $.fn.zTree.init($('#folder_list'), zTreeSeting, json);
            folderTree.expandAll(true);
        }
    });
    if (isDirRequest) {
        var dir = location.pathname;
        $.get('/codelab-api/filelist?dir=' + dir, function(json) {
            folderTree = $.fn.zTree.init($('#folder_list'), zTreeSeting, json);
            folderTree.expandAll(true);
        });
    }
}
