/**
 * 判断是否为合法表达式
 * @author ydr.me
 * @create 2018-04-19 17:34
 * @update 2018-04-19 17:34
 */


'use strict';

var array = require('blear.utils.array');

var expressionParser = require('./expression');

var validType = {
    name: 1,
    string: 2,
    number: 3,
    keyword: 4
};

/**
 * 表达式语法检查
 * @param expression
 * @returns {boolean}
 */
module.exports = function (expression) {
    var tokens = expressionParser(expression);
    var length = tokens.length;

    // 表达式只有一个非name、字符串、数字
    var token0 = tokens[0];
    if (length === 1 && !validType[token0.type]) {
        return false;
    }

    // 判断是否有非法字符
    var foundInvalid = null;
    array.each(tokens, function (index, token) {
        if (token.type === 'invalid') {
            foundInvalid = token;
            return false;
        }
    });

    return !foundInvalid;
};


