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
        showContainers(['folder_container'])
    } else {
        if (treeNode.path.endsWith('html') || treeNode.path.endsWith('htm')) {// 如果是可以预览的
            $('#preview').attr('src', '/codelab/truelink/' + treeNode.path);
            treeNode.path
                ? history.pushState(
                    null,
                    'codelab|' + treeNode.name,
                    '/' + treeNode.path
                )
                : '';
            showContainers(['preview'])
        } else {
            // editor.setValue("");    //给代码框赋值
            // editor.getValue();    //获取代码框的值
            $.get('/codelab/truelink/' + treeNode.path, function (res) {
                editor.setValue(res);
            })
            $('#save_btn').on('click', function (e) {
                e.preventDefault()
                $('#save_btn').text('...')
                $.ajax({
                    type: "POST",
                    url: '/codelab-api/savefile',
                    data: {
                        filepath: treeNode.path,
                        content: editor.getValue()
                    },
                    success: function (data) { // TODO 回调函数未执行
                        console.log(data)
                        $('#save_btn').text('Save')
                        if (data.code !== 0) {
                            $('<span>error</span>').appendTo($('#save_btn'))
                        }
                    },
                });
            })
            showContainers(['editor', 'save_btn'])
        }
    }
}

function showContainers(containers) {
    !containers ? containers = [] : ''
    $('#preview').css('display', containers.includes('preview') ? 'block' : 'none');
    $('#folder_container').css('display', containers.includes('folder_container') ? 'block' : 'none');
    $('#editor').css('display', containers.includes('editor') ? 'block' : 'none');
    $('#save_btn').css('display', containers.includes('save_btn') ? 'block' : 'none');
}

function initTree() {
    $.get('/codelab-api/filelist', function (json) {
        zTreeObj = $.fn.zTree.init($('#nav_tree'), zTreeSeting, json);
        zTreeObj.expandAll(true);
        zTreeObj = $.fn.zTree.init($('#sidebar_tree'), zTreeSeting, json);
        zTreeObj.expandAll(true);
        if (!isDirRequest) {
            folderTree = $.fn.zTree.init($('#folder_tree'), zTreeSeting, json);
            folderTree.expandAll(true);
        }
    });
    if (isDirRequest) {
        var dir = location.pathname;
        $.get('/codelab-api/filelist?dir=' + dir, function (json) {
            folderTree = $.fn.zTree.init($('#folder_tree'), zTreeSeting, json);
            folderTree.expandAll(true);
        });
    }
}
