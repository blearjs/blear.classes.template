/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('raw 语法', function () {

    it('行内', function () {
        var main = '#   include abc';
        var tpl = new Template('{{\\   ' + main + '   }}');
        var html = tpl.render();

        expect(html).toBe('{{' + main + '}}');
    });

});
