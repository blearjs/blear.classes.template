/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('var 语法', function () {

    it('变量', function () {
        var tpl = new Template('{{#var a = 1}}{{a}}');
        var html = tpl.render();

        expect(html).toBe('1');
    });

});
