/**
 * 构建
 * @author ydr.me
 * @create 2018-04-17 15:50
 * @update 2018-04-17 15:50
 */


'use strict';

var array = require('blear.utils.array');
var object = require('blear.utils.object');
var typeis = require('blear.utils.typeis');

var ignored = false;
var ignoreStr = 'ignore';

module.exports = function (adapters, args) {
    var snippet = this;
    var built = {
        // 实体符
        entity: true,
        // 是否输出
        echo: false
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

    if (found && !typeis.Array(built.scripts)) {
        built.scripts = [
            {code: built.code, type: 'open'},
            {code: '', type: 'close'}
        ];
    }

    return found ? built : null;
};


