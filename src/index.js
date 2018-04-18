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

var defaults = {};
var filters = {};
var Template = Events.extend({
    constructor: function (template, options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        the[_tpl] = compiler(template);
    },

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
Template.filter = function (name, filter) {
    filters[name] = filter;
};
module.exports = Template;


