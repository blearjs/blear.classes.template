/**
 * 构建
 * @author ydr.me
 * @create 2018-04-17 15:50
 * @update 2018-04-17 15:50
 */


'use strict';

var array = require('blear.utils.array');
var object = require('blear.utils.object');

module.exports = function (adapters, args) {
    var snippet = this;
    var built = {
        // 独立
        single: true,
        // 自身代码
        code: '',
        // 关闭代码
        closeCode: '',
        // 实体符
        entity: true,
        // 是否输出
        echo: false
    };
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


