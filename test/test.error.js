/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

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

});
