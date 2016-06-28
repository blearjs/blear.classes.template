/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-28 18:03
 */


'use strict';

var Template = require('../src/index');
var el = document.getElementById('demo');
var template = el.innerHTML;
var tpl = new Template(template);

console.log(tpl.render({
    item: {
        remark: '【】'
    }
}));
console.log('<p>【】</p><p>{{item.remark}}</p><p>\\【】</p><span a="冻结原因：【】" b="冻结原因：{{item.remark}}" c="冻结原因：\\【】"></span>');
