/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('include 语法', function () {

    it('include 变量', function () {
        Template.loader = function (file, options) {
            return {
                file: file,
                template: file + '{{def}}'
            };
        };
        var tpl = new Template('{{#include abc}}');
        var html = tpl.render({
            abc: 'xxx',
            def: 'def'
        });

        expect(html).toBe('xxxdef');
    });

    it('include 常量', function () {
        Template.loader = function (file, options) {
            return {
                file: file,
                template: file + '{{def}}'
            };
        };
        var tpl = new Template('{{#include "abc"}}');
        var html = tpl.render({
            abc: 'xxx',
            def: 'def'
        });

        expect(html).toBe('abcdef');
    });

});
