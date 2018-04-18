/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 15:47
 * @update 2018-04-17 15:47
 */


'use strict';

var array = require('blear.utils.array');

var expressionParser = require('../parser/expression');
var roster = require('../roster');

module.exports = function (source, flag, expression) {
    var tokens = expressionParser(expression);
    var piping = false;
    var pipes = [];
    var code = '';
    var lastFilterName = '';
    var lastFilterArg = '';
    var pushName = function () {
        if (!lastFilterName) {
            return;
        }

        pipes.push({
            name: lastFilterName,
            args: []
        });
    };
    var pushArg = function () {
        if (!lastFilterArg) {
            return;
        }

        pipes[pipes.length - 1].args.push(lastFilterArg);
        lastFilterArg = '';
    };

    array.each(tokens, function (index, token) {
        var value = token.value;
        switch (token.type) {
            case 'invalid':
                throw new Error('表达式含有非法字符');

            case 'string':
            case 'number':
                if (piping) {
                    lastFilterArg += value;
                } else {
                    code += value;
                }
                break;

            case 'name':
                if (piping) {
                    if (lastFilterName) {
                        lastFilterArg += value;
                    } else {
                        lastFilterName = value;
                        pushName();
                    }
                } else {
                    code += value;
                }
                break;

            case 'punctuator':
                switch (value) {
                    case '|':
                        pushArg();
                        lastFilterName = '';
                        piping = true;
                        return;

                    case ':':
                        if (!lastFilterArg) {
                            return;
                        }
                        break;

                    case ',':
                        pushArg();
                        break;

                    default:
                        if (piping) {
                            lastFilterArg += value;
                        } else {
                            code += value;
                        }
                        break;
                }
                break;
        }
    });
    pushArg();

    pipes.push({
        name: roster.entity,
        single: true,
        args: []
    });

    array.each(pipes, function (index, pipe) {
        pipe.args.unshift(code);
        code = (pipe.single ? '' : roster.filter + '.') + pipe.name + '(' + pipe.args.join(',') + ')';
    });

    return {
        code: roster.output + '+=' + code + ';',
        type: 'print',
        entity: true
    };
};


