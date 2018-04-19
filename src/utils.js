/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-18 09:22
 * @update 2018-04-18 09:22
 */


'use strict';

var string = require('blear.utils.string');
var collection = require('blear.utils.collection');

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
exports.each = collection.each;
exports.include = function (file, options) {
    var loaded = exports.loader(file, options);
    var compiler = exports.compiler;
    return compiler(loaded.file, loaded.template, this.options);
};
/**
 * 加载器，可以被外部重写
 * @param file
 * @param options
 * @param options.parent
 * @returns {*}
 */
exports.loader = function (file, options) {
    return {
        file: null,
        template: '未配置文件加载器'
    };
};

exports.compiler = null;


