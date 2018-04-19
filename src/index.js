/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 12:38
 * @update 2018-04-17 12:38
 */


'use strict';

var Events = require('blear.classes.events');
var fun = require('blear.utils.function');
var object = require('blear.utils.object');

var compiler = require('./compiler');
var accident = require('./accident');
var utils = require('./utils');

var defaults = {
    file: null
};
var filters = {};
var Template = Events.extend({
    constructor: function (template, options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        the[_tpl] = compiler(template, the[_options]);
    },

    /**
     * 渲染
     * @param data
     * @returns {*}
     */
    render: function (data) {
        var the = this;

        data = data || {};
        try {
            return the[_tpl].call(data, data, utils, filters, fun.bind(accident, the[_tpl].snippets));
        } catch (err) {
            return err.message;
        }
    }
});
var sole = Template.sole;
var _options = sole();
var _tpl = sole();

Template.defaults = defaults;

/**
 * 添加过滤器【全局】
 * @param name
 * @param filter
 */
Template.filter = function (name, filter) {
    filters[name] = filter;
};

/**
 * 自定义加载器【全局】
 * @param loader
 */
object.define(Template, 'loader', {
    get: function () {
        return utils.loader;
    },
    set: function (loader) {
        utils.loader = loader;
    }
});

module.exports = Template;


