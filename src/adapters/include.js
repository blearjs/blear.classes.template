/**
 * {{#include}}
 * @author ydr.me
 * @create 2018年04月19日09:22:06
 * @update 2018年04月19日09:22:06
 */


'use strict';

var roster = require('../roster');

var includeRE = /^include\s+([\s\S]+)$/;

// 这里保证每一次编译都是一个新环境
module.exports = function () {
    return function (source, flag, expression) {
        if (flag !== '#') {
            return;
        }

        var matches = expression.match(includeRE);
        var snippet = this;

        if (!matches) {
            return;
        }

        var file = snippet.file;
        var code = roster.utils + '.include.call(' +
            roster.the + ',' +
            matches[1] + ', ' +
            JSON.stringify({
                parent: file
            }) + ')(' + [
                roster.data,
                roster.utils,
                roster.filter,
                roster.accident
            ].join(',') +
            ')';

        return {
            type: 'inlcude',
            entity: false,
            echo: true,
            code: code
        };
    };
};
