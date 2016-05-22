/**
 * utils
 * @author ydr.me
 * @create 2016-05-02 17:14
 */


'use strict';

var typeis = require('blear.utils.typeis');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var string = require('blear.utils.string');

var reSeperator = /[,;]/g;
var reColon = /:/g;


/**
 * 转换特定字符串为 obj `a:1, b: 2`
 * @returns {{}}
 */
exports.str2Obj = function (str) {
    var items = str.split(reSeperator);
    var obj = {};

    array.each(items, function (index, item) {
        var keyVal = item.split(reColon);
        var key = string.trim(keyVal[0]);
        var val = string.trim(keyVal[1]);

        if (key && val) {
            // a: b, a: c
            if (obj[key]) {
                if (!typeis.Array(obj[key])) {
                    obj[key] = [obj[key]];
                }

                obj[key].push(val);
                return;
            }

            obj[key] = val;
        }
    });

    return object.map(obj, function (val) {
        if (typeis.Array(val)) {
            return val.join(' || ')
        }

        return val;
    });
};
