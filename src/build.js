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
var IGNORE = 'ignore';

module.exports = function (statements, args) {
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

    if (flag === '#' && exp === IGNORE) {
        ignored = true;
        return;
    }

    if (flag === '/' && exp === IGNORE) {
        ignored = false;
        return;
    }

    if (ignored) {
        built.type = 'string';
        built.value = raw;
        return built;
    }

    var found = null;

    array.each(statements, function (index, statement) {
        var ret = statement.apply(snippet, args);

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

    return found ? built : {
        type: 'string',
        value: raw
    };
};


