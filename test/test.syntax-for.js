/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('for 语法', function () {

    var data = {
        list: [
            {room: '11', students: ['A', 'B']},
            {room: '22', students: ['a', 'b']}
        ],
        map: {
            a: 11,
            b: 22
        }
    };

    it('for item in list', function () {
        var tpl = new Template(
            '{{#for item in   list}}' +
            '{{item.room}}' +
            '{{/for}}'
        );
        var html = tpl.render(data);
        expect(html).toBe('1122');
    });

    it('for index, item in list', function () {
        var tpl = new Template(
            '{{#for index,item in   list}}' +
            '{{index}}{{item.room}}' +
            '{{/for}}'
        );
        var html = tpl.render(data);
        expect(html).toBe('011122');
    });

    it('for index, item in list 两级', function () {
        var tpl = new Template(
            '{{#for index,item in   list}}' +
            /**/'{{index}}{{item.room}}' +
            /**/'{{#for i, j in item.students}}' +
            /**/'{{i}}{{j}}' +
            /**/'{{/for}}' +
            '{{/for}}'
        );
        var html = tpl.render(data);
        expect(html).toBe('0110A1B1220a1b');
    });

    it('for val in map', function () {
        var tpl = new Template(
            '{{#for val in map}}' +
            '{{val}}' +
            '{{/for}}'
        );
        var html = tpl.render(data);
        expect(html).toBe('1122');
    });

    it('for key,val in map', function () {
        var tpl = new Template(
            '{{#for key , val in map}}' +
            '{{key}}{{val}}' +
            '{{/for}}'
        );
        var html = tpl.render(data);
        expect(html).toBe('a11b22');
    });

});
