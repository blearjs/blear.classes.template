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

    it('表达式', function () {
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

    it('语法', function () {
        var tpl = new Template('{{#if -}}');
        var html = tpl.render();

        console.log(html);
        expect(html).toMatch(/^ >> 1\| /m);
    });

});
