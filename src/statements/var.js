/**
 * {{#var}}
 * @author ydr.me
 * @create 2018-04-18 09:59
 * @update 2018-04-18 09:59
 */


'use strict';

var varRE = /^var\s/;

// 这里保证每一次编译都是一个新环境
module.exports = function () {
    return function (source, flag, expression) {
        if (flag !== '#') {
            return;
        }

        if (!varRE.test(expression)) {
            return;
        }

        return {
            type: 'var',
            code: expression
        };
    };
};
