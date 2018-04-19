/**
 * {{\raw}}
 * @author ydr.me
 * @create 2018-04-18 09:59
 * @update 2018-04-18 09:59
 */


'use strict';


// 这里保证每一次编译都是一个新环境
module.exports = function () {
    return function (source, flag, expression) {
        if (flag !== '\\') {
            return;
        }

        return {
            type: 'string',
            value: '{{' + expression + '}}'
        };
    };
};
