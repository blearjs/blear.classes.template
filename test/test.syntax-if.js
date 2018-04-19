/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('if 语法', function () {

    it('if', function () {
        var tpl = new Template(
            '{{#if true}}true{{/if}}'
        );
        var html = tpl.render();

        expect(html).toBe('true');
    });

    it('if + else', function () {
        var tpl = new Template(
            '{{#if false}}false{{#else}}true{{/if}}'
        );
        var html = tpl.render();

        expect(html).toBe('true');
    });

    it('if + else if', function () {
        var tpl = new Template(
            '{{#if false}}false{{#else if  1}}true{{/if}}'
        );
        var html = tpl.render();

        expect(html).toBe('true');
    });

    it('if + else if + else', function () {
        var tpl = new Template(
            '{{#if false}}false{{#else if  0}}1{{#  else  }}true{{/if}}'
        );
        var html = tpl.render();

        expect(html).toBe('true');
    });

    it('if > if 嵌套', function () {
        var tpl = new Template(
            '{{#if 1}}' +
            /**/'1' +
            /**/'{{#if 2}}' +
            /**/'2' +
            /**/'{{/if}}' +
            '{{/if}}'
        );
        var html = tpl.render();
        expect(html).toBe('12');
    });

    it('if + else if > if 嵌套', function () {
        var tpl = new Template(
            '{{#if 0}}' +
            /**/'1' +
            '{{#else if 1}}' +
            /**/'2' +
            /**/'{{#if 3}}' +
            /**/'3' +
            /**/'{{/if}}' +
            '{{/if}}'
        );
        var html = tpl.render();
        expect(html).toBe('23');
    });

});
