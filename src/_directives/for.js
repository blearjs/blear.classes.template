/**
 * @for
 * @author ydr.me
 * @create 2016-05-01 15:49
 */


define(function (require, exports, module) {
    'use strict';

    // key,val in list
    // val in list
    module.exports = function (vnode, directive) {
        var forInList = directive.value.split(' in ');
        var keyValName = forInList[0];
        var keyValList = keyValName.split(',');
        var valName = keyValList.pop();
        var keyName = keyValList.pop() || this.genVarName();
        var listName = forInList[1];
        var beforeList = [
            this.thisName() + '.each(' + listName + ', function (' + keyName + ', ' + valName + ') {'
        ];
        var afterList = [
            '});'
        ];

        return [beforeList.join('\n'), afterList.join('\n')];
    };
});