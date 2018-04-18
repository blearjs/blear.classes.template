/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 12:58
 * @update 2018-04-17 12:58
 */


'use strict';

var Template = require('../src/index');

var template = require('./base-template.html');
var tpl = new Template(template);

document.getElementById('template').value = template;

document.getElementById('ret').innerHTML = tpl.render({
    list: ['a', 'b']
});

