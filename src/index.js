/**
 * 字符串型模板引擎
 * @author ydr.me
 * @create 2018-04-17 12:38
 * @update 2018年04月19日19:01:45
 */


'use strict';

var Class = require('blear.classes.class');
var object = require('blear.utils.object');

var compiler = require('./compiler');
var accident = require('./accident');
var utils = require('./utils');
var roster = require('./roster');

var defaults = {
    /**
     * 根目录
     * @type String
     */
    dirname: '',

    /**
     * 当前文件
     * @type String
     */
    file: '',

    /**
     * 是否缓存
     * @type Boolean
     */
    cache: true,

    /**
     * 是否抛出错误
     * @type Boolean
     */
    error: false
};
var staticFilters = {};
var Template = Class.extend({
    constructor: function (template, options) {
        var the = this;

        Template.parent(the);
        the[_filters] = {};
        the[_options] = object.assign({}, defaults, options);
        the[_options][roster.caches] = the[_options].cache ? Object.create(null) : null;
        the[_tpl] = compiler(the[_options].file, template, the[_options]);
    },

    /**
     * 添加过滤器【实例】
     * @param name
     * @param filter
     * @returns {Template}
     */
    filter: function (name, filter) {
        var the = this;
        the[_filters][name] = filter;
        return the;
    },

    /**
     * 渲染
     * @param [data]
     * @returns {*}
     */
    render: function (data) {
        var the = this;
        var options = the[_options];
        // 合并静态 filter 和 实例 filter
        var filters = object.assign({}, staticFilters, the[_filters]);

        data = data || {};
        try {
            return the[_tpl](data, utils, filters, accident);
        } catch (err) {
            if (options.error) {
                throw err;
            }

            return err.message;
        }
    }
});
var sole = Template.sole;
var _filters = sole();
var _options = sole();
var _tpl = sole();

Template.defaults = defaults;

/**
 * 添加过滤器【静态】
 * @param name
 * @param filter
 */
Template.filter = function (name, filter) {
    staticFilters[name] = filter;
};

/**
 * 自定义路径解决器【静态】
 * @param loader
 */
object.define(Template, 'resolver', {
    get: function () {
        return utils.resolver;
    },
    set: function (resolver) {
        utils.resolver = resolver;
    }
});

/**
 * 自定义加载器【静态】
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
utils.compiler = compiler;

module.exports = Template;


