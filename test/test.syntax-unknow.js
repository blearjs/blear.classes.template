/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('unknow 语法', function () {

    it('未知', function () {
        var template = '{{#  xx   }}';
        var tpl = new Template(template);
        var html = tpl.render();

        expect(html).toBe(template);
    });

});
