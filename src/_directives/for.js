/**
 * @for
 * @author ydr.me
 * @create 2016-05-01 15:49
 */


'use strict';

var utils = require('./utils');


// key,val in list
// val in list
module.exports = function (vnode, directive) {
    var ret = utils.parseFor(directive.value);
    var keyName = ret[0];
    var valName = ret[1];
    var listName = ret[2];
    var beforeList = [
        this.thisName() + '.each(' + listName + ', function (' + keyName + ', ' + valName + ') {'
    ];
    var afterList = [
        '});'
    ];

    directive.keyName = keyName;
    directive.valName = valName;
    directive.listName = listName;

    return [beforeList.join('\n'), afterList.join('\n')];
};
