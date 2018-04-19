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

    var file = snippet.file;

    return {
        type: 'inlcude',
        entity: false,
        echo: true,
        code: roster.utils + '.include.call(' + roster.the + ',' + matches[1] + ', ' + JSON.stringify({
            parent: file
        }) + ')(' + [
            roster.data,
            roster.utils,
            roster.filter,
            roster.accident
        ].join(',') + ')'
    };
};
