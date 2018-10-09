/**
 * 判断是否为合法表达式
 * @author ydr.me
 * @create 2018-04-19 17:34
 * @update 2018-04-19 17:34
 * @update 2018年10月09日17:05:50
 */


'use strict';

/**
 * 表达式语法检查
 * @param expression
 * @returns {null | Error}
 */
module.exports = function (expression) {
    try {
        new Function(expression);
        return null;
    } catch (err) {
        return err;
    }
};


