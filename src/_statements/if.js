/**
 * #if
 * @author ydr.me
 * @create 2016-05-06 18:43
 */


define(function (require, exports, module) {
    'use strict';

    module.exports = function (vnode) {
        if (vnode.open) {
            return 'if (Boolean(' + vnode.value + ')) {';
        } else {
            return '}';
        }
    };
});