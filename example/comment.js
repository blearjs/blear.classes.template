/**
 * 文件描述
 * @author ydr.me
 * @create 2017-11-16 18:09
 * @update 2017-11-16 18:09
 */


'use strict';

var Template = require('../src/index');


var demoEl = document.getElementById('demo');
var template = demoEl.innerHTML;

var tpl = new Template(template);

var data = {};

console.log(tpl.render(data));



