var zTreeObj, folderTree;
var zTreeSeting = {
    async: {
        enable: true
    },
    callback: {
        onClick: zTreeOnClick
    }
};
var previewFileTypes = [
    '.html',
    '.htm',
    '.jpg',
    '.png',
    '.gif',
    '.ico',
    '.svg'
];
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
        showContainers(['folder_container']);
    } else {
        if (isFileCanPreview(treeNode.path)) {
            // 如果是可以预览的
            $('#preview').attr('src', '/codelab/truelink/' + treeNode.path);
            treeNode.path
                ? history.pushState(
                      null,
                      'codelab|' + treeNode.name,
                      '/' + treeNode.path
                  )
                : '';
            $('#edit_btn').attr('data-nodes', JSON.stringify(treeNode));
            $('#edit_btn').on('click', function() {
                var nodeAttr = $('#edit_btn').attr('data-nodes');
                var node = JSON.parse(nodeAttr || '');
                $.get('/codelab/truelink/' + node.path, function(res) {
                    editor.setValue(res);
                    showContainers(['editor', 'save_btn']);
                });
            });
            showContainers(['preview', 'edit_btn']);
        } else {
            $.get('/codelab/truelink/' + treeNode.path, function(res) {
                editor.setValue(res);
            });
            $('#save_btn').on('click', function(e) {
                e.preventDefault();
                $('#save_btn').text('...');
                $.ajax({
                    type: 'POST',
                    url: '/codelab-api/savefile',
                    data: {
                        filepath: treeNode.path,
                        content: editor.getValue()
                    },
                    success: function(data) {
                        // TODO 回调函数未执行
                        $('#save_btn').text('Save');
                        if (data.code !== 0) {
                            $('<span>error</span>').appendTo($('#save_btn'));
                        }
                    },
                    error: function(error) {
                        console.log('error :', error);
                    }
                });
            });
            if (treeNode.path.endsWith('.js')) {
                // js file can debug
                showContainers([
                    'editor',
                    'debug_btn',
                    'save_btn',
                    'sidebar_tree'
                ]);
                $('#debug_btn').on('click', function(e) {
                    e.preventDefault();
                    $('#debug_btn').text('...');
                    $.ajax({
                        type: 'POST',
                        url: '/codelab-api/debugfile',
                        data: {
                            filepath: treeNode.path,
                            content: editor.getSelection() || editor.getValue()
                        },
                        success: function(data) {
                            // TODO 回调函数未执行
                            $('#debug_btn').text('Debug');
                            $('#sidebar_tree').css('display', 'none');
                            $('#editor_preview').attr(
                                'src',
                                '/codelab-statics/debugjs/' + treeNode.path
                            );
                            $('.CodeMirror-wrap').addClass('debug');
                            showContainers([
                                'editor',
                                'debug_btn',
                                'save_btn',
                                'editor_preview',
                                'stop_btn',
                                'refresh_debug_btn'
                            ]);
                            $('#stop_btn').on('click', function() {
                                $('.CodeMirror-wrap').removeClass('debug');
                                showContainers([
                                    'editor',
                                    'debug_btn',
                                    'save_btn',
                                    'sidebar_tree'
                                ]);
                            });
                            $('#refresh_debug_btn').on('click', function() {
                                $('#editor_preview').attr(
                                    'src',
                                    '/codelab-statics/debugjs/' + treeNode.path
                                );
                            });
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });
                });
            } else {
                showContainers(['editor', 'save_btn']);
            }
        }
    }
}

function showContainers(containers) {
    !containers ? (containers = []) : '';
    $('#preview').css(
        'display',
        containers.includes('preview') ? 'unset' : 'none'
    );
    $('#folder_container').css(
        'display',
        containers.includes('folder_container') ? 'unset' : 'none'
    );
    $('#editor').css(
        'display',
        containers.includes('editor') ? 'unset' : 'none'
    );
    $('#save_btn').css(
        'display',
        containers.includes('save_btn') ? 'unset' : 'none'
    );
    $('#run_btn').css(
        'display',
        containers.includes('run_btn') ? 'unset' : 'none'
    );
    $('#debug_btn').css(
        'display',
        containers.includes('debug_btn') ? 'unset' : 'none'
    );
    $('#edit_btn').css(
        'display',
        containers.includes('edit_btn') ? 'unset' : 'none'
    );
    $('#stop_btn').css(
        'display',
        containers.includes('stop_btn') ? 'unset' : 'none'
    );
    $('#editor_preview').css(
        'display',
        containers.includes('editor_preview') ? 'unset' : 'none'
    );
    $('#sidebar_tree').css(
        'display',
        containers.includes('sidebar_tree') ? 'unset' : 'none'
    );
    $('#refresh_debug_btn').css(
        'display',
        containers.includes('refresh_debug_btn') ? 'unset' : 'none'
    );
}

function initTree() {
    $.get('/codelab-api/filelist', function(json) {
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
        $.get('/codelab-api/filelist?dir=' + dir, function(json) {
            folderTree = $.fn.zTree.init($('#folder_tree'), zTreeSeting, json);
            folderTree.expandAll(true);
        });
    }
}

function isFileCanPreview(path) {
    if (!path || !(path + '')) {
        return;
    }
    return previewFileTypes.some(fileType => path.endsWith(fileType));
}

/**
 * debugger marker element generate
 */
function makeMarker() {
    var marker = document.createElement('div');
    marker.style.color = '#822';
    marker.innerHTML = '●';
    return marker;
}

function toggleDebugger(cm, line, gutterMarkers) {
    var doc = cm.getDoc();
    var text = line.text; //
    var pos = {};
    if (gutterMarkers && gutterMarkers.breakpoints) {
        if (text && text.trim() === 'debugger') {
            doc.replaceRange(
                '',
                { line: line.line, ch: 0 },
                { line: line.line + 1, ch: 0 }
            );
        }
    } else {
        pos = {
            // create a new object to avoid mutation of the original selection
            line: line.line,
            ch: 0 // set the character position to the end of the line
        };
        doc.replaceRange(getAllSpacing(text) + 'debugger\n', pos); // adds a new line
    }
}

function getAllSpacing(text) {
    if (!text) {
        return '';
    }
    var tabspaceNum = text.match(/^\t+/);
    tabspaceNum = tabspaceNum && tabspaceNum[0].length;
    var spacingNum = text.match(/^ +/);
    spacingNum = spacingNum && spacingNum[0].length;
    var spacing = '';
    if (tabspaceNum) {
        for (var i = 0; i < tabspaceNum; i++) {
            spacing += '\t';
        }
    }
    if (spacingNum) {
        for (var i = 0; i < spacingNum; i++) {
            spacing += ' ';
        }
    }
    return spacing;
}
