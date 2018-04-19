/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 13:54
 * @update 2018-04-17 13:54
 */


'use strict';

var array = require('blear.utils.array');
var fun = require('blear.utils.function');
var object = require('blear.utils.object');

var build = require('./build');
var syntaxParser = require('./parsers/syntax');
var roster = require('./roster');

var regular = /{{([#=/\\]?)\s*([\w\W]*?)\s*}}/;
var caches = {};
var STRING_TYPE = 'string';
var lineRE = /[\n\r]/;

/**
 * 编译
 * @param file
 * @param template
 * @param [options]
 * @param [options.cache]
 * @returns {Function}
 */
module.exports = function (file, template, options) {
    var theName = roster.the;
    var dataName = roster.data;
    var utilsName = roster.utils;
    var filtersName = roster.filters;
    var accidentName = roster.accident;
    var outputName = roster.output;
    var pushName = roster.push;
    var scripts = [
        // this
        'var ' + theName + '=this;',
        // // 参数0: data
        // 'var ' + dataName + '=arguments[0]||{};',
        // // 参数1: entity
        // 'var ' + entityName + '=arguments[1];',
        // // 参数2: filters
        // 'var ' + filterName + '=arguments[2];',
        // // 参数3: error
        // 'var ' + errorName + '=arguments[3];',
        'debugger;',
        'var ' + outputName + '=[];',
        'var ' + pushName + '=' + utilsName + '.push(' + outputName + ');',
        'with(' + dataName + '){'
    ];
    // 一次编译只使用一个适配器
    var adapters = [
        require('./adapters/include')(),
        require('./adapters/raw')(),
        require('./adapters/if')(),
        require('./adapters/for')(),
        require('./adapters/print')()
    ];
    var errSnippet = null;
    var compiled = {
        file: file,
        template: template,
        options: options,
        lines: template.split(lineRE)
    };
    var fn;
    try {
        var snippets = syntaxParser(template, regular, function (source, flag, expression) {
            var snippet = this;
            snippet.file = file;

            try {
                return build.call(snippet, adapters, [source, flag, expression]);
            } catch (err) {
                errSnippet = snippet;
                throw err;
            }
        });

        var pushScript = function (script) {
            scripts.push(script);
        };
        var dumpExpression = function (expression, code) {
            return expression.echo ? pushName + '(' + code + ');' : code + ';'
        };
        var wrapTry = function (expression, code) {
            pushScript('try{');
            pushScript(dumpExpression(expression, code));
        };
        var wrapCatch = function (expression, code, snippet) {
            var errorName = roster.gen();
            pushScript(dumpExpression(expression, code));
            pushScript('}catch(' + errorName + '){');
            pushScript('throw ' + accidentName + '.call(' + theName + ',' + errorName + ',' + snippet.index + ');');
            pushScript('}');
        };

        array.each(snippets, function (index, snippet) {
            switch (snippet.type) {
                case STRING_TYPE:
                    pushScript(pushName + '(' + wrap(snippet.value) + ');');
                    break;

                case 'expression':
                    var expression = snippet.expression;

                    if (!expression) {
                        return;
                    }

                    if (expression.type === STRING_TYPE) {
                        return pushScript(pushName + '(' + wrap(expression.value) + ');');
                    }

                    array.each(expression.scripts, function (index, script) {
                        var code = script.code;
                        switch (script.type) {
                            case 'open':
                                wrapTry(expression, code);
                                break;

                            case 'close':
                                wrapCatch(expression, code, expression.begin || snippet);
                                break;
                        }
                    });
                    break;
            }
        });
        pushScript('}');
        pushScript('return ' + utilsName + '.trim(' + outputName + '.join(""));');

        console.log(scripts.join('\n'));

        try {
            fn = new Function(dataName, utilsName, filtersName, accidentName, scripts.join('\n'));
        } catch (err) {
            fn = function (data, utils, filers, accident) {
                throw accident.call(this, err, 0);
            };
        }
    } catch (err) {
        snippets = [errSnippet];
        fn = function (data, utils, filers, accident) {
            throw accident.call(this, err, 0);
        };
    }

    compiled.snippets = snippets;
    return fun.bind(fn, compiled);
};

// =========================================
function wrap(code) {
    return JSON.stringify(code);
}
