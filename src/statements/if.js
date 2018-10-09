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
var invalid = require('../parsers/invalid');

// 这里保证每一次编译都是一个新环境
module.exports = function () {
    var tree = new Tree();

    return function (source, flag, expression) {
        if (flag !== '#' && flag !== '/') {
            return;
        }

        var matches = expression.match(/^(\/?if|else\s+?if|else)\b([\s\S]*)$/);

        if (!matches) {
            return;
        }

        var snippet = this;
        var closed = flag === '/';

        if (!closed) {
            var method = matches[1].replace(/\s+/, ' ');
            var condition = string.trim(matches[2]);
            var err;

            if (method !== 'else' && (err = invalid('if(' + condition + '){}'))) {
                throw err;
            }
        }

        var openCode = '';
        var closeCode = '}';
        var token = {
            type: 'if'
        };

        switch (method) {
            case 'if':
                openCode = 'if(' + condition + '){';
                closeCode = '';
                // 树的第一个节点
                tree.first({
                    snippet: snippet,
                    condition: condition
                });
                break;

            case 'else if':
                openCode = 'if(' + condition + '&&' + dumpConditions(tree) + '){';
                token.begin = tree.current().snippet;
                tree.next({
                    snippet: snippet,
                    condition: condition
                });
                break;

            case 'else':
                openCode = 'if(' + dumpConditions(tree) + '){';
                token.begin = tree.current().snippet;
                break;

            // 最后闭合
            default:
                token.begin = tree.current().snippet;
                tree.end();
                break;
        }

        var scripts = [];

        // 先闭合上一个条件判断
        if (closeCode) {
            scripts.push({code: closeCode, type: 'close'});
        }

        // 再开始本次条件判断
        if (openCode) {
            scripts.push({code: openCode, type: 'open'});
        }

        token.scripts = scripts;
        return token;
    };
};

// ====================================
function dumpConditions(tree) {
    return array.map(tree.siblings(), function (node) {
        return '!(' + node.condition + ')';
    }).join('&&');
}


