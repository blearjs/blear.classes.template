/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 12:58
 * @update 2018-04-17 12:58
 */


'use strict';

var Template = require('../src/index');

var tpl = new Template(require('./base-template.html'));

Template.filter('b', function (code) {
    return 'bbb' + code + 'bbb';
});

Template.filter('c', function (code, d, e, f) {
    return e + f + d + code + d + f + e;
});

document.getElementById('ret').innerHTML = tpl.render({
    a: 'Hello',
    d: 'dddd',
    html: '<h1>h1 标题</h1>'
});

