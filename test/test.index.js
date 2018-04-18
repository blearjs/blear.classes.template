/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('模板引擎单元测试', function () {

    it('纯文本', function () {
        var tpl = new Template('abc');
        var html = tpl.render();

        expect(html).toBe('abc');
    });

    it('基本插值表达式', function () {
        var tpl = new Template('abc{{abc}}');
        var html = tpl.render({
            abc: '123'
        });

        expect(html).toBe('abc123');
    });

});
