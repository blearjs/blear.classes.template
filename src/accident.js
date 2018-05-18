/**
 * 意外处理
 * @author ydr.me
 * @create 2018-04-18 08:33
 * @update 2018-04-18 08:33
 */


'use strict';

var string = require('blear.utils.string');
var path = require('blear.utils.path');

var roster = require('./roster');

var more = '...';
var lineNoSeparator = '| ';
var errorLine = '>> ';
var eachLineMaxLength = 30;
var filterNameRE = new RegExp(string.escapeRegExp(roster.filters + '.'));
var errorFlag = roster.error;
var lineRE = /[\n\r]/;

/**
 * 意外处理
 * @param err
 * @param snippetIndex
 * @returns {*}
 */
module.exports = function (err, snippetIndex) {
    // 已经是修正过的 error，因为嵌套 try catch 会层层捕获的
    if (err[errorFlag]) {
        return err;
    }

    var compiled = this;
    var snippet = compiled.snippets[snippetIndex];
    var lines = compiled.lines;
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
        var contentLength = content.length;
        var lineNo = min + 1 + '';

        // 当前行
        if (line === min) {
            lineNo = errorLine + lineNo;
            var valueInThisLine = snippet.value.split(lineRE)[0];
            var begin = snippet.begin;
            var errContent = content.slice(begin, begin + valueInThisLine.length);
            var remainLength = eachLineMaxLength - errContent.length;
            var prefixStart = begin - remainLength;
            var prefix = content.slice(Math.max(prefixStart, 0), begin);
            content = (prefixStart < 0 ? '' : more) + prefix + content.slice(begin, begin + valueInThisLine.length)
        } else if (contentLength > eachLineMaxLength) {
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

    msgList.push(
        '',
        msg
    );

    var file = snippet.file;
    var dirname = snippet.dirname;

    if (file) {
        var filename = dirname ? path.relative(dirname, file) : file;
        msgList.push('file: ' + filename);
    }

    err[errorFlag] = true;
    err.message = msgList.join('\n');
    return err;
};


