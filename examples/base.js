/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 12:58
 * @update 2018-04-17 12:58
 */


'use strict';

// var Template = require('../src/index');
var invalid = require('../src/parsers/invalid');


window.invalid = invalid;

// var template = require('./base-template.html');
// var tpl = new Template(template, {
//     file: '/base-template.html'
// });
//
// Template.filter('upperCase', function (code) {
//     return code.toUpperCase();
// });
//
// Template.loader = function (file, options) {
//     return {
//         file: options.parent + file,
//         template: '【'+ file + ',' + options.parent + '】'
//     };
// };
//
// document.getElementById('ret').innerText = tpl.render({
//     a: 1,
//     b: 2,
//     c: 3,
//     d: 4
// });

