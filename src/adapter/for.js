/**
 * {{#for}}
 * @author ydr.me
 * @create 2018-04-18 09:59
 * @update 2018-04-18 09:59
 */


'use strict';

var string = require('blear.utils.string');

var forRE = /^(for)\s+?([\s\S]*?)\s+?in\s+?([\s\S]*?)$/;

var lastFor = null;
module.exports = function (source, flag, expression) {
    if (flag !== '#' && flag !== '/') {
        return;
    }


    return null;
};
