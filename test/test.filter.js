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

    it('无参', function () {
        var filer1 = 'f' + Date.now();
        Template.filter(filer1, function (code) {
            return filer1 + code;
        });
        var tpl = new Template('{{a | ' + filer1 + '}}');
        var html = tpl.render({
            a: 'aa',
            b: 'bb'
        });

        expect(html).toBe(filer1 + 'aa');
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

    it('三目表达式', function () {
        var filer1 = 'f' + Date.now();
        var tpl = new Template('{{ a ' +
            ' | ' + filer1 + ': c ? d : e, f ? g : h' +
            ' | ' + filer1 + ': c ? d : e, f ? g : h' +
            '}}');
        Template.filter(filer1, function (code, anther1, anther2) {
            return code + anther1 + anther2;
        });
        // 1 | f: 3 ? 4 : 5, 6 ? 7 : 8
        // 1 + 4 + 7
        // 11 | f: 3 ? 4 : 5, 6 ? 7 : 8
        // 12 + 4 + 7
        var html = tpl.render({
            a: 1,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7,
            h: 8
        });

        expect(html).toBe('23');
    });

    it('instance filter and static filter', function () {
        var staticFilter1 = 'f1' + Date.now();
        var staticFilter2 = 'f2' + Date.now();
        // 与静态相同名字
        var instanceFilter3 = staticFilter1;
        var instanceFilter4 = 'f4' + Date.now();

        Template.filter(staticFilter1, function () {
            return '1';
        });
        Template.filter(staticFilter2, function () {
            return '2';
        });
        var tpl = new Template(
            // 3
            '{{a | ' + staticFilter1 + '}}' +
            // 2
            '{{a | ' + staticFilter2 + '}}' +
            // 3
            '{{a | ' + instanceFilter3 + '}}' +
            // 4
            '{{a | ' + instanceFilter4 + '}}' +
            ''
        );
        tpl.filter(instanceFilter3, function () {
            return '3';
        });
        tpl.filter(instanceFilter4, function () {
            return '4';
        });
        var html = tpl.render({
            a: ''
        });

        expect(html).toEqual('3234');
    });

});
