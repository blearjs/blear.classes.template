/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-18 09:22
 * @update 2018-04-18 09:22
 */


'use strict';

var string = require('blear.utils.string');
var collection = require('blear.utils.collection');
var path = require('blear.utils.path');

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
    var compileOptions = this.options;
    options.dirname = compileOptions.dirname;
    var dest = exports.resolver(file, options);
    return exports.compiler(dest, null, compileOptions);
};
/**
 * 处理器，可以被外部重写
 * @param name
 * @param options
 * @param options.dirname
 * @param options.parent
 * @returns {*}
 */
exports.resolver = function (name, options) {
    if (path.isAbsolute(name)) {
        return path.join(options.dirname, name);
    }

    return path.resolve(path.dirname(options.parent), name);
};

/**
 * 加载器，可以被外部重写
 * 根据运行环境进行特殊处理
 * @param file
 * @returns {String}
 */
exports.loader = function (file) {
    return '未配置文件加载器';
};

exports.compiler = null;


