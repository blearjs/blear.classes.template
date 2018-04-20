/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-19 12:46
 * @update 2018-04-19 12:46
 */


'use strict';

var fs = require('fs');
var path = require('path');

var Template = require('../src/index');

var root = path.join(__dirname, '1.html');
var template = fs.readFileSync(root, 'utf8');

Template.loader = function (file) {
    return fs.readFileSync(file, 'utf8');
};

var tpl = new Template(template, {
    dirname: __dirname,
    file: root
});

console.log(tpl.render({
    name: '云'
}));
