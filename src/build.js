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
    var built = {
        code: '',
        entity: true
    };

    array.each(adapters, function (index, adapter) {
        var ret = adapter.apply(null, args);

        if (ret) {
            object.assign(built, ret);
            return false;
        }
    });

    return built;
};


