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
        code: '',
        closeCode: ';',
        entity: true,
        snippet: snippet,
        begin: snippet
    };

    array.each(adapters, function (index, adapter) {
        var ret = adapter.apply(snippet, args);

        if (ret) {
            object.assign(built, ret);
            return false;
        }
    });

    return built;
};


