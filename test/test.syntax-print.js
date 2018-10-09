/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('print 语法', function () {

    it('纯文本', function () {
        var tpl = new Template('abc');
        var html = tpl.render();

        expect(html).toBe('abc');
    });

    it('基本插值表达式：转义', function () {
        var tpl = new Template('abc{{text}}{{html}}');
        var html = tpl.render({
            text: 'a',
            html: '<a>'
        });

        expect(html).toBe('abca&lt;a&gt;');
    });

    it('基本插值表达式：不转义', function () {
        var tpl = new Template('abc{{text}}{{=html}}');
        var html = tpl.render({
            text: 'a',
            html: '<a>'
        });

        expect(html).toBe('abca<a>');
    });

    it('关键字', function () {
        var tpl = new Template('{{typeof Date}}');
        var html = tpl.render();

        expect(html).toBe('function');
    });

    it('行内注释', function () {
        var tpl = new Template('{{1//1}}');
        var html = tpl.render();

        expect(html).toBe('1');
    });

    it('块级注释', function () {
        var tpl = new Template('{{1/*1*/}}');
        var html = tpl.render();

        expect(html).toBe('1');
    });

    it('三目', function () {
        var tpl = new Template('{{ a ? b : c }}');
        var html = tpl.render({
            a: 1,
            b: 2,
            c: 3
        });

        expect(html).toBe('2');
    });

    it('undefined', function () {
        var tpl = new Template('{{a}}');
        var html = tpl.render();

        expect(html).toMatch(/^\s+>>\s1\|/m);
    });

});
