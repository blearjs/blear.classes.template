/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 12:58
 * @update 2018-04-17 12:58
 */


'use strict';

var Template = require('../src/index');

var template = require('./base-template.html');
var tpl = new Template(template, {
    file: '/base-template.html'
});

Template.filter('upperCase', function (code) {
    return code.toUpperCase();
});

Template.loader = function (file, options) {
    return {
        file: options.base + file,
        template: '【' + file + ',' + options.base + '】'
    };
};

document.getElementById('template').value = template;

document.getElementById('ret').innerHTML = tpl.render({
    list: [{
        name: '程序员',
        children: ['<h1>A</h1>', 'B', 'C']
    }, {
        name: '教师',
        children: ['甲', '乙', '丙']
    }, {
        name: '公务员',
        children: ['aa', 'bb', 'cc']
    }],
    map: {a: 1, b: 2, c: 3}
});

