/**
 * {{@raw}}
 * @author ydr.me
 * @create 2018-04-18 09:59
 * @update 2018-04-18 09:59
 */


'use strict';


module.exports = function (source, flag, expression) {
    if (flag !== '@') {
        return;
    }

    return {
        type: 'raw',
        code: JSON.stringify('{{' + expression + '}}'),
        echo: true
    };
};
