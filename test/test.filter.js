/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Template = require('../src/index.js');


describe('filter', function () {

    it('1级', function () {
        var filer1 = 'f' + Date.now();
        Template.filter(filer1, function (code) {
            return filer1 + code;
        });
        var tpl = new Template('{{a | ' + filer1 + '}}');
        var html = tpl.render({
            a: 'aa'
        });

        expect(html).toBe(filer1 + 'aa');
    });

    it('2级', function () {
        var filer1 = 'f1' + Date.now();
        var filer2 = 'f2' + Date.now();
        Template.filter(filer1, function (code) {
            return filer1 + code;
        });
        Template.filter(filer2, function (code) {
            return filer2 + code;
        });
        var tpl = new Template('{{a | ' + filer1 + ' | ' + filer2 + '}}');
        var html = tpl.render({
            a: 'aa'
        });

        expect(html).toBe(filer2 + filer1 + 'aa');
    });

    it('单参', function () {
        var filer1 = 'f' + Date.now();
        Template.filter(filer1, function (code, a1) {
            return filer1 + a1 + code;
        });
        var tpl = new Template('{{a | ' + filer1 + ': b}}');
        var html = tpl.render({
            a: 'aa',
            b: 'bb'
        });

        expect(html).toBe(filer1 + 'bbaa');
    });

    it('多参', function () {
        var filer1 = 'f' + Date.now();
        Template.filter(filer1, function (code, a1, a2) {
            return filer1 + a1 + a2 + code;
        });
        var tpl = new Template('{{a | ' + filer1 + ': b, "x"}}');
        var html = tpl.render({
            a: 'aa',
            b: 'bb'
        });

        expect(html).toBe(filer1 + 'bbxaa');
    });

    it('参数类型', function () {
        var filer1 = 'f' + Date.now();
        Template.filter(filer1, function (code, a1, a2, a3) {
            console.log(a3);
            return (a1 + a2 + code).replace(a3, '-');
        });
        var tpl = new Template('{{a | ' + filer1 + ': 1, "2" + "3", /\\d/g/*注释*/}}');
        var html = tpl.render({
            a: 'aa',
            b: 'bb'
        });

        expect(html).toBe('---aa');
    });

    it('连续冒号', function () {
        var filer1 = 'f' + Date.now();
        Template.filter(filer1, function (code, a1) {
            return code + a1;
        });
        var tpl = new Template(
            '{{a | ' + filer1 + '::b}}'
        );
        var html = tpl.render({
            a: 'aa',
            b: 'bb'
        });

        expect(html).toBe('aabb');
    });
});
