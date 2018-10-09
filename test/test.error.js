/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var string = require('blear.utils.string');

var Template = require('../src/index.js');


describe('error', function () {

    it('插值语法', function () {
        var tpl = new Template(
            '1\n' +
            '2\n' +
            '3\n' +
            '4\n' +
            '5\n' +
            '{{ @ }}'
        );
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 6\| /m);
    });

    it('if 语法', function () {
        var tpl = new Template(
            '1\n' +
            '2\n' +
            '3\n' +
            '4\n' +
            '5\n' +
            '{{#if -}}'
        );
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 6\| /m);
    });

    it('for 语法', function () {
        var tpl = new Template(
            '1\n' +
            '2\n' +
            '3\n' +
            '4\n' +
            '5\n' +
            '{{#for - in -}}'
        );
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 6\| /m);
    });

    it('include 语法', function () {
        var tpl = new Template(
            '1\n' +
            '2\n' +
            '3\n' +
            '4\n' +
            '5\n' +
            '{{#include  @ + @}}'
        );
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 6\| /m);
    });

    it('if 空', function () {
        var tpl = new Template(
            '1\n' +
            '2\n' +
            '3\n' +
            '4\n' +
            '5\n' +
            '{{#if }}'
        );
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 6\| /m);
    });

    it('else if 空', function () {
        var tpl = new Template(
            '1\n' +
            '2\n' +
            '3\n' +
            '4\n' +
            '5\n' +
            '6{{#if 1}}\n'+
            '7{{#else if}}{{}}\n'
        );
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 7\| /m);
    });

    it('内容过长', function () {
        var tpl = new Template(
            '1\n' +
            '2\n' +
            '3\n' +
            '4\n' +
            '5' + string.repeat('0', 40) + '\n' +
            '6{{Date.now()}}' + string.repeat('0', 40) + '{{ a b }}'
        );
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 6\| \.\.\./m);
    });

    it('嵌套', function () {
        var tpl = new Template(
            '{{#for a in b}}\n' +
            /**/'{{#for c in a}}\n' +
            /**/'{{c 1}}\n' +
            /**/'{{/for}}\n' +
            '{{/for}}\n'
        );
        var html = tpl.render({
            b: [[1]]
        });

        console.log(html);
        expect(html).toMatch(/^ >> 3\| /m);
    });

    it('编译', function () {
        var tpl = new Template(
            '1\n' +
            '2\n' +
            '3\n' +
            '4\n' +
            '5{{#if true}}'
        );
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^SyntaxError/m);
    });

    it('file', function () {
        var tpl = new Template(
            '1\n' +
            '2\n' +
            '3\n' +
            '4\n' +
            '5{{#if a}}{{/if}}'
        ,{
                file: 'file'
            });
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 5\|/m);
        expect(html).toMatch(/^ReferenceError/m);
        expect(html).toMatch(/^file: file/m);
    });

    it('throw', function () {
        var tpl  = new Template('{{a b}}', {
            error: true
        });
        var err = null;

        try {
            tpl.render();
        } catch (_err) {
            err = _err;
        }

        expect(err.name).toBe('SyntaxError');
        expect(err.message).toMatch(/^ >> 1 |/m);
    });

});
