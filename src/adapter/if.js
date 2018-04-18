/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-18 09:59
 * @update 2018-04-18 09:59
 */


'use strict';


'use strict';

var array = require('blear.utils.array');

var roster = require('../roster');

module.exports = function (source, flag, expression) {
    if (flag !== '#' && flag !== '/') {
        return;
    }

    var expressionList = expression.split(/\s+/);
    var con = expressionList.shift();
    var exp = expressionList.join(' ');
    var closed = flag === '/';
    var code = '';
    var open = false;

    switch (con) {
        case 'if':
            code = closed
                ? '}'
                : 'if(' + exp + '){';
            open = !closed;
            break;
        case 'else if':
            code = '}else if(' + exp + '){';
            break;
        case 'else':
            code = '}else{';
            break;
        default:
            return;
    }

    return {
        code: code,
        type: 'if',
        entity: false,
        open: open,
        closed: closed
    };
};


