/**
 * {{#include}}
 * @author ydr.me
 * @create 2018年04月19日09:22:06
 * @update 2018年04月19日09:22:06
 */


'use strict';

var roster = require('../roster');

var includeRE = /^include\s+([\s\S]+)$/;

module.exports = function (source, flag, expression) {
    if (flag !== '#') {
        return;
    }

    var matches = expression.match(includeRE);
    var snippet = this;

    if (!matches) {
        return;
    }

    return {
        type: 'inlcude',
        entity: false,
        echo: true,
        code: roster.utils + '.include(' + matches[1] + ', ' + JSON.stringify({
            parent: snippet.options.file
        }) + ').call(' + [
            roster.data,
            roster.data,
            roster.utils,
            roster.filter,
            roster.accident
        ].join(',') + ')'
    };
};
