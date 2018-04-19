/**
 * 语法解析器
 * @link https://github.com/aui/art-template
 * @author ydr.me
 * @create 2018-04-17 13:52
 * @update 2018-04-17 13:52
 */


'use strict';

var array = require('blear.utils.array');

var TYPE_STRING = 'string';
var TYPE_EXPRESSION = 'expression';
var lineRE = /[\n\r]/;

module.exports = function (template, regular, adapter) {
    var snippets = [];
    var flags = regular.ignoreCase ? 'ig' : 'g';
    var pattern = regular.source + '|^$|[\\w\\W]';
    var snippetRE = new RegExp(pattern, flags);
    var matches = template.match(snippetRE);
    var line = 0;
    var start = 0;
    var end = 0;
    var pushSinppet = function (isExpression, value, expression) {
        var snippet = {
            index: snippets.length,
            type: isExpression ? TYPE_EXPRESSION : TYPE_STRING,
            file: null,
            value: value,
            expression: expression,
            start: start,
            end: end,
            line: line
        };
        snippets.push(snippet);
        return snippet;
    };

    for (var step = 0; step < matches.length; step++) {
        var value = matches[step];
        var expressionMatches = value.match(regular);
        end += value.length;
        var snippet = pushSinppet(expressionMatches, value);

        if (expressionMatches) {
            snippet.expression = adapter.apply(snippet, array.from(expressionMatches));
        }

        line += value.split(lineRE).length - 1;
        start += value.length;
    }

    return snippets;
};




