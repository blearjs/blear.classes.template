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

var defaults = {
    start: '{{',
    end: '}}'
};
var Template = Events.extend({
    constructor: function (template, options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        the[_tpl] = compiler(template);
    },

    render: function (data) {
        var the = this;

        try {
            return the[_tpl].call(data, data, function (code) {
                return code;
            }, {
                c: function (code) {
                    return code;
                }
            }, fun.bind(accident, the[_tpl].snippets));
        } catch (err) {
            return '<pre>' + err.message + '</pre>';
        }
    }
});
var sole = Template.sole;
var _options = sole();
var _tpl = sole();

Template.defaults = defaults;
module.exports = Template;


