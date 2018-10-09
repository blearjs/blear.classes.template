/**
 * {{print}}
 * @author ydr.me
 * @create 2018-04-17 15:47
 * @update 2018-04-17 15:47
 */


'use strict';

var array = require('blear.utils.array');

var parse = require('../parsers/expression');
var invalid = require('../parsers/invalid');
var roster = require('../roster');

// 这里保证每一次编译都是一个新环境
module.exports = function () {
    return function (source, flag, expression) {
        if (flag === '#' || flag === '/') {
            return;
        }

        var snippet = this;
        var unescape = flag === '=';
        var tokens = parse(expression);
        var piping = false;
        var pipes = [];
        var code = '';
        var lastFilterName = '';
        var lastFilterArg = '';
        var startFilter = false;
        var lastFilterArgs = null;
        var pushName = function () {
            pipes.push({
                name: lastFilterName,
                args: lastFilterArgs = []
            });
        };
        var pushArg = function () {
            lastFilterArg = lastFilterArg.trim();

            if (!lastFilterArg) {
                return;
            }

            lastFilterArgs.push(lastFilterArg);
            lastFilterArg = '';
        };

        array.each(tokens, function (index, token) {
            var value = token.value;
            switch (token.type) {
                case 'invalid':
                    throw new SyntaxError('插值表达式语法有误');

                case 'string':
                case 'number':
                case 'keyword':
                case 'regex':
                case 'whitespace':
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
                            startFilter = false;
                            return;

                        case ':':
                            if (piping) {
                                if (startFilter) {
                                    lastFilterArg += value;
                                } else {
                                    startFilter = true;
                                }
                            } else {
                                code += value;
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
            name: 'ify',
            native: true,
            args: []
        });

        if (!unescape) {
            pipes.push({
                name: 'escape',
                native: true,
                args: []
            });
        }

        var err;

        if ((err = invalid(code))) {
            throw err;
        }

        array.each(pipes, function (index, pipe) {
            pipe.args.unshift(code);
            code = (pipe.native ? roster.utils : roster.filters) + '.' + pipe.name + '(' + pipe.args.join(',') + ')';
        });

        return {
            code: code,
            type: 'print',
            entity: true,
            echo: true
        };
    };
};


