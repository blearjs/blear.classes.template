/**
 * {{#for}}
 * @author ydr.me
 * @create 2018-04-18 09:59
 * @update 2018-04-18 09:59
 */


'use strict';

var roster = require('../roster');
var Tree = require('../tree');
var invalid = require('../parsers/invalid');

var forRE = /^for\s+?([\s\S]*?)\s+?in\s+?([\s\S]*?)$/;
var keyRE = /\s*,\s*/;

// 这里保证每一次编译都是一个新环境
module.exports = function () {
    var tree = new Tree();

    return function (source, flag, expression) {
        if (flag !== '#' && flag !== '/') {
            return;
        }

        var closed = flag === '/' && expression === 'for';
        var matches = expression.match(forRE);

        if (!closed && !matches) {
            return;
        }

        if (matches) {
            var leftNames = matches[1].split(keyRE);
            var listName = matches[2];
            var itemName = leftNames.pop();
            var keyName = leftNames.pop() || roster.gen();
            var err;

            if ((err = invalid(keyName))) {
                throw err;
            }

            if ((err = invalid(itemName))) {
                throw err;
            }

            if ((err = invalid(listName))) {
                throw err;
            }
        }

        var snippet = this;
        var token = {
            type: 'for'
        };
        var openCode = '';
        var closeCode = '';

        // 循环闭合
        if (closed) {
            token.begin = tree.current();
            tree.end();
            closeCode = '});';
        }
        // 循环开启
        else {
            openCode = roster.utils + '.each(' + listName + ', function(' + keyName + ', ' + itemName + '){';
            tree.first(snippet);
        }

        var scripts = [];

        if (openCode) {
            scripts.push({type: 'open', code: openCode});
        }
        // 不可能同时关闭和打开一个 for
        else if (closeCode) {
            scripts.push({type: 'close', code: closeCode});
        }

        token.scripts = scripts;
        return token;
    };
};