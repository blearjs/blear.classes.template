/**
 * {{#if}}
 * @author ydr.me
 * @create 2018-04-18 09:59
 * @update 2018-04-18 09:59
 */


'use strict';

var string = require('blear.utils.string');

var conditionList = [];
var beginSnippet = null;

module.exports = function (source, flag, expression) {
    if (flag !== '#' && flag !== '/') {
        return;
    }

    var snippet = this;
    var closed = flag === '/';
    var code = '';

    if (!closed) {
        var matches = expression.match(/^(if|else\s+?if|else)\b(.*)$/);
        var method = matches[1].replace(/\s+/, ' ');
        var condition = string.trim(matches[2]);
    }

    var token = {
        single: false,
        snippet: snippet,
        closeCode: '}',
        type: 'if',
        entity: false,
        begin: beginSnippet
    };

    switch (method) {
        case 'if':
            conditionList = [];
            code = 'if(' + condition + '){';
            token.closeCode = '';
            beginSnippet = snippet;
            break;

        case 'else if':
            code = 'if(' + condition + '&&!(' + conditionList.join('&&') + ')' + '){';
            beginSnippet = snippet;
            break;

        case 'else':
            code = 'if(!(' + conditionList.join('&&') + ')' + '){';
            break;

        // 最后闭合
        default:
            break;
    }

    token.code = code;
    conditionList.push(condition);
    return token;
};


// ===============================
function buildToken(snippet, begin, code) {
    return {
        snippet: snippet,
        // list: conditionList,
        code: code,
        type: 'if',
        entity: false,
        open: open,
        closed: closed,
        begin: beginSnippet
    };
}
