/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('模板引擎单元测试', function () {

    it('语法：纯文本', function () {
        var tpl = new Template('abc');
        var html = tpl.render();

        expect(html).toBe('abc');
    });

    it('语法：基本插值表达式：转义', function () {
        var tpl = new Template('abc{{text}}{{html}}');
        var html = tpl.render({
            text: 'a',
            html: '<a>'
        });

        expect(html).toBe('abca&lt;a&gt;');
    });

    it('语法：基本插值表达式：不转义', function () {
        var tpl = new Template('abc{{text}}{{=html}}');
        var html = tpl.render({
            text: 'a',
            html: '<a>'
        });

        expect(html).toBe('abca<a>');
    });

    it('语法：if', function () {
        var tpl = new Template(
            '{{#if true}}true{{/if}}'
        );
        var html = tpl.render();

        expect(html).toBe('true');
    });

    it('语法：if + else', function () {
        var tpl = new Template(
            '{{#if false}}false{{#else}}true{{/if}}'
        );
        var html = tpl.render();

        expect(html).toBe('true');
    });

    it('语法：if + else if', function () {
        var tpl = new Template(
            '{{#if false}}false{{#else if  1}}true{{/if}}'
        );
        var html = tpl.render();

        expect(html).toBe('true');
    });

    it('语法：if + else if + else', function () {
        var tpl = new Template(
            '{{#if false}}false{{#else if  0}}1{{#  else  }}true{{/if}}'
        );
        var html = tpl.render();

        expect(html).toBe('true');
    });

});
