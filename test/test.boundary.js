/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('边界', function () {

    it('多行空白', function () {
        var tpl = new Template(
            '\n' +
            '\n' +
            'abc' +
            '\n' +
            '\n' +
            ''
        );
        var html = tpl.render();
        expect(html).toBe('abc');
    });

    it('render 传其他类型参数', function () {
        var tpl = new Template(
            '\n' +
            '\n' +
            'abc' +
            '\n' +
            '\n' +
            ''
        );
        var html = tpl.render(1);
        expect(html).toBe('abc');
    });

    it('半边', function () {
        var tpl = new Template('{{');
        var html = tpl.render();
        console.log(html);
        expect(html).toEqual('{{');
    });

    it('大半边', function () {
        var tpl = new Template('{{aa');
        var html = tpl.render();
        console.log(html);
        expect(html).toEqual('{{aa');
    });

    it('不完整', function () {
        var tpl = new Template('{{aa}}{{bb}');
        var html = tpl.render({
            aa: 1,
            bb: 2
        });
        console.log(html);
        expect(html).toEqual('1{{bb}');
    });

});
