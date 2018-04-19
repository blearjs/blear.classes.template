/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var string = require('blear.utils.string');

var Template = require('../src/index.js');


describe('error', function () {

    it('变量', function () {
        var tpl = new Template('{{a}}');
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 1\| /m);
    });

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

    it('内容过长', function () {
        var tpl = new Template(
            '1\n' +
            '2\n' +
            '3\n' +
            '4\n' +
            '5' + string.repeat('0', 40) + '\n' +
            '6{{Date.now()}}' + string.repeat('0', 40) + '{{ a }}'
        );
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 6\| \.\.\./m);
    });

    it('嵌套', function () {
        var tpl = new Template(
            '{{#for a in b}}\n' +
            /**/'{{#for c in a}}\n' +
            /**/'{{c1}}\n' +
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
    });

});
