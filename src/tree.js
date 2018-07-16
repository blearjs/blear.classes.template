/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-18 13:52
 * @update 2018-04-18 13:52
 */


'use strict';

var Class = require('blear.classes.class');
var array = require('blear.utils.array');

var Tree = Class.extend({
    constructor: function () {
        var the = this;
        the[_children] = [];
        the[_currentChildren] = the[_children];
    },

    /**
     * 获取兄弟
     * @returns {*}
     */
    siblings: function () {
        return array.map(this[_currentChildren], function (child) {
            return child.item;
        });
    },

    /**
     * 第一个节点
     * @param item
     */
    first: function (item) {
        var the = this;

        // 当前已有项目，说明是新开层级
        if (the[_currentChildren].length) {
            var newChildren = [];
            newChildren.parent = the[_currentChildren];
            the[_currentChildren] = newChildren;
        }

        the[_put](item);
    },

    /**
     * 接下来的节点
     * @param item
     */
    next: function (item) {
        var the = this;

        the[_put](item);
    },

    /**
     * 节点结束
     */
    end: function () {
        var the = this;
        var parent = the[_currentChildren].parent;

        if (parent) {
            the[_currentChildren] = parent;
        } else {
            the[_currentChildren] = [];
        }
    },

    /**
     * 获取前一个
     * @returns {*}
     */
    current: function () {
        var the = this;
        return the[_currentChildren][the[_currentChildren].length - 1].item;
    }
});
var sole = Tree.sole;
var _children = sole();
var _currentChildren = sole();
var _put = sole();
var prop = Tree.prototype;

prop[_put] = function (item) {
    var the = this;

    the[_currentChildren].push({
        item: item
    });
};

module.exports = Tree;

