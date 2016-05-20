/**
 * @style
 * @author ydr.me
 * @create 2016-05-02 17:00
 */


define(function (require, exports, module) {
    'use strict';

    var utils = require('./utils.js');
    var object = require('blear.utils.object');

    module.exports = function (vnode, directive) {
        object.assign(vnode.styleMap, utils.str2Obj(directive.value));
    };
});