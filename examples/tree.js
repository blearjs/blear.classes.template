/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 12:58
 * @update 2018-04-17 12:58
 */


'use strict';


var Tree = require('../src/tree');

var tree = new Tree();

tree.first('1');
tree.next('2');
tree.end();
tree.first('3');
tree.next('4');


console.log(JSON.stringify(tree.siblings(), null, 4));
