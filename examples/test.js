/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 12:58
 * @update 2018-04-17 12:58
 */


'use strict';

// var expression = require('../src/parser/expression');
//
// console.log(expression('a | b'));

var print = require('../src/adapter/print');
var regular = /{{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}}/;
var adapter = function (source, flag, expression, close) {
    console.log(source);
    console.log(flag);
    console.log(expression);
    console.log(close);
    print(flag, expression, close);
};
var syntax = require('../src/parser/syntax');

console.log(syntax('a{{a}}\nb{{@ b }}',regular, adapter));
