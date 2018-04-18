/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-18 09:22
 * @update 2018-04-18 09:22
 */


'use strict';

var string = require('blear.utils.string');

exports.escape = string.escapeHTML;
exports.ify = string.ify;
exports.trim = string.trim;
exports.push = function (output) {
    var lastSlice = null;
    return function (slice) {
        // 忽略连续换行
        if (slice === lastSlice && slice === '\n') {
            return;
        }

        output.push(slice);
        lastSlice = slice;
    };
};


