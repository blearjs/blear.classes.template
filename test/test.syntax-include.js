/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('include 语法', function () {

    it('批量', function () {
        // 1：未配置 loader
        var tpl1 = new Template('{{#include "2"}}', {
            file: '/1',
            dirname: '/'
        });
        var html1 = tpl1.render();
        expect(html1).toEqual('未配置文件加载器');


        // 2：已配置 loader
        var loader = function (file) {
            return file;
        };
        Template.loader = loader;
        var tpl2 = new Template(
            '{{#include "2"}}' +
            '{{#include "/2"}}', {
            file: '/a/b/c',
            dirname: '/a'
        });
        var html2 = tpl2.render();
        expect(html2).toEqual('/a/b/2/a/2');
        expect(loader).toBe(Template.loader);


        // 3：已自定义 resolver
        var resolver = function (name, options) {
            return name;
        };
        Template.resolver = resolver;
        var tpl3 = new Template('{{#include "2"}}', {
            file: '/1',
            dirname: '/'
        });
        var html3 = tpl3.render();
        expect(html3).toEqual('2');
        expect(resolver).toBe(Template.resolver);


        // 4：缓存检查
        var times4 = 0;
        Template.loader = function (file) {
            times4++;
            return 'x';
        };
        var tpl4 = new Template('{{#include "4"}}{{#include "4"}}', {
            file: '/1',
            dirname: '/'
        });
        var html4 = tpl4.render();
        expect(html4).toEqual('xx');
        expect(times4).toBe(1);
    });

});
