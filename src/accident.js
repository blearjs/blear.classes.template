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
var lineNoSeparator = ' | ';
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
    var max = Math.min(line + 3, lines.length - 1);
    var lineNoLength = (max + 1 + '').length + 1;
    var msgList = [];

    msg = msg.replace(filterNameRE, 'filter ');

    for (; min < max; min++) {
        var content = lines[min];
        var whitespace = '';
        var indication = '';
        var startMoreLength = 0;

        // 当前行
        if (line === min) {
            var snippetContent = snippets.template.slice(snippet.start, snippet.end);

            if (snippetContent !== content) {
                content = more + snippetContent + more;
                startMoreLength = more.length;
            }

            whitespace = repeat(' ', lineNoLength) + lineNoSeparator + repeat(' ', startMoreLength);
            indication = repeat(indicator, snippetContent.length);
        } else if (content.length > eachLineMaxLength) {
            content = content.slice(0, eachLineMaxLength) + more;
        }

        msgList.push(
            // 行号
            string.padEnd(min + 1, lineNoLength) +
            // 分隔线
            lineNoSeparator +
            // 行内容
            content
        );

        if (indication) {
            msgList.push(whitespace + indication);
            msgList.push(whitespace + msg);
        }
    }

    err.message = msgList.join('\n');
    return err;
};


