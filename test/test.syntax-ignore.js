/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('ignore 语法', function () {

    it('块级', function () {
        var main = '{{@#   include abc }}"\'{{abc}}';
        var tpl = new Template(
            '{{#ignore}}' +
            main +
            '{{/ignore}}'
        );
        var html = tpl.render();

        expect(html).toBe(main);
    });

});
