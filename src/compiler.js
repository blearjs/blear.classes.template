/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 13:54
 * @update 2018-04-17 13:54
 */


'use strict';

var build = require('./build');
var syntaxParser = require('./parser/syntax');
var expressionParser = require('./parser/expression');

var regular = /{{([@#]?)\s*?([\w\W]*?)\s*?}}/;

module.exports = function (template) {
    syntaxParser(template, regular, function (source, flag, expression) {
        build([
            require('./adapter/print')
        ], arguments);
    });
};


