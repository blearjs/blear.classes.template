/**
 * @show
 * @author ydr.me
 * @create 2016-05-01 15:49
 */


define(function (require, exports, module) {
    'use strict';

    // @show="exp"
    module.exports = function (vnode, directive) {
        vnode.styleMap.display = '(Boolean(' + directive.value + ') ? "block": "none")';
    };
});