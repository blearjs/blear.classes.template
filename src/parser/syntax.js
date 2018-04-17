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
    var pushSinppet = function (isExpression, value) {
        snippets.push({
            type: isExpression ? TYPE_EXPRESSION : TYPE_STRING,
            // source: template,
            value: value,
            start: start,
            end: end,
            line: line
        });
    };

    for (var step = 0; step < matches.length; step++) {
        var value = matches[step];
        var expressionMatches = value.match(regular);

        if (expressionMatches) {
            var args = array.from(expressionMatches);
            adapter.apply(null, args);
        }

        end += value.length;
        pushSinppet(expressionMatches, value);
        line += value.split(lineRE).length - 1;
        start += value.length;
    }

    return snippets;
};




