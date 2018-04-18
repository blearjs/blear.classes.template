/**
 * 构建
 * @author ydr.me
 * @create 2018-04-17 15:50
 * @update 2018-04-17 15:50
 */


'use strict';

var array = require('blear.utils.array');
var object = require('blear.utils.object');

var ignored = false;
var ignoreStr = 'ignore';

module.exports = function (adapters, args) {
    var snippet = this;
    var built = {
        // 自身代码
        code: '',
        // 关闭代码
        closeCode: '',
        // 实体符
        entity: true,
        // 是否输出
        echo: false,
        opened: true,
        closed: true
    };
    var raw = args[0];
    var flag = args[1];
    var exp = args[2];

    if (flag === '#' && exp === ignoreStr) {
        ignored = true;
        return;
    }

    if (flag === '/' && exp === 'ignore') {
        ignored = false;
    }

    if (ignored) {
        built.code = JSON.stringify(raw);
        built.echo = true;
        built.entity = false;
        return built;
    }

    var found = null;

    array.each(adapters, function (index, adapter) {
        var ret = adapter.apply(snippet, args);

        if (ret) {
            found = ret;
            object.assign(built, ret);
            return false;
        }
    });

    return found ? built : null;
};


