/**
 * {{#if}}
 * @author ydr.me
 * @create 2018-04-18 09:59
 * @update 2018-04-18 09:59
 */


'use strict';

var string = require('blear.utils.string');
var array = require('blear.utils.array');

var Tree = require('../tree');

var tree = new Tree();

module.exports = function (source, flag, expression) {
    if (flag !== '#' && flag !== '/') {
        return;
    }

    var matches = expression.match(/^(\/?if|else\s+?if|else)\b([\s\S]*)$/);

    if (!matches) {
        return;
    }

    var snippet = this;
    var closed = flag === '/';
    var code = '';

    if (!closed) {

        var method = matches[1].replace(/\s+/, ' ');
        var condition = string.trim(matches[2]);
    }

    var token = {
        single: false,
        closeCode: '}',
        type: 'if',
        entity: false
    };

    switch (method) {
        case 'if':
            code = 'if(' + condition + '){';
            token.closeCode = null;
            // 树的第一个节点
            tree.first({
                snippet: snippet,
                condition: condition
            });
            break;

        case 'else if':
            code = 'if(' + condition + '&&' + dumpConditions(tree) + '){';
            token.begin = tree.current().snippet;
            tree.next({
                snippet: snippet,
                condition: condition
            });
            break;

        case 'else':
            token.begin = tree.current().snippet;
            code = 'if(' + dumpConditions(tree) + '){';
            break;

        // 最后闭合
        default:
            token.begin = tree.current().snippet;
            tree.end();
            break;
    }

    token.code = code;
    return token;
};

// ====================================
function dumpConditions(tree) {
    return array.map(tree.siblings(), function (node) {
        return '!(' + node.condition + ')';
    }).join('&&');
}


