/**
 * {{#for}}
 * @author ydr.me
 * @create 2018-04-18 09:59
 * @update 2018-04-18 09:59
 */


'use strict';

var roster = require('../roster');
var Tree = require('../tree');

var forRE = /^for\s+?([\s\S]*?)\s+?in\s+?([\s\S]*?)$/;
var keyRE = /\s*,\s*/;
var tree = new Tree();

var lastFor = null;
module.exports = function (source, flag, expression) {
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
    }

    var snippet = this;
    var opened = false;
    var token = {
        type: 'for'
    };

    // 循环闭合
    if (closed) {
        token.begin = tree.current();
        tree.end();
        token.closeCode = '});';
    }
    // 循环开启
    else {
        token.code = roster.utils + '.each(' + listName + ', function(' + keyName + ', ' + itemName + '){';
        opened = true;
        tree.first(snippet);
    }

    token.opened = opened;
    token.closed = closed;
    return token;
};
