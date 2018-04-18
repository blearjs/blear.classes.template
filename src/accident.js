/**
 * 意外处理
 * @author ydr.me
 * @create 2018-04-18 08:33
 * @update 2018-04-18 08:33
 */


'use strict';

var string = require('blear.utils.string');

var roster = require('./roster');

var repeat = string.repeat;
var more = '...';
var indicator = '^';
var lineNoSeparator = '| ';
var errorLine = '>> ';
var eachLineMaxLength = 40;
var filterNameRE = new RegExp(string.escapeRegExp(roster.filter + '.'));

/**
 * 意外处理
 * @param err
 * @param snippet
 * @returns {*}
 */
module.exports = function (err, snippet) {
    var snippets = this;
    var lines = snippets.lines;
    var msg = err.message;
    var line = snippet.line;
    var min = Math.max(line - 2, 0);
    var max = Math.min(line + 2, lines.length - 1);
    var lineNoLength = (max + 1 + '').length + 1;
    var msgList = [];
    var eachLinePadLength = errorLine.length + lineNoLength;

    msg = (err.type || err.name) + ': ' + msg.replace(filterNameRE, 'filter ');

    for (; min <= max; min++) {
        var content = lines[min];
        var lineNo = min + 1 + '';

        // 当前行
        if (line === min) {
            lineNo = errorLine + lineNo;
        } else if (content.length > eachLineMaxLength) {
            content = content.slice(0, eachLineMaxLength) + more;
        }

        msgList.push(
            // 行号
            string.padStart(lineNo, eachLinePadLength) +
            // 分隔线
            lineNoSeparator +
            // 行内容
            content
        );
    }

    msgList.push('');
    msgList.push(msg);

    err.message = msgList.join('\n');
    return err;
};


