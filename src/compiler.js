/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 13:54
 * @update 2018-04-17 13:54
 */


'use strict';

var array = require('blear.utils.array');
var fun = require('blear.utils.function');

var build = require('./build');
var syntaxParser = require('./parsers/syntax');
var roster = require('./roster');
var utils = require('./utils');

var regular = /{{([#=/\\]?)\s*([\w\W]*?)\s*}}/;
var STRING_TYPE = 'string';
var lineRE = /[\n\r]/;

/**
 * 编译
 * @param file
 * @param template
 * @param [options]
 * @param [options.dirname]
 * @param [options.file]
 * @param [options.cache]
 * @returns {Function}
 */
module.exports = function (file, template, options) {
    var caches = options[roster.caches];
    var id = file || template;

    if (caches && id && caches[id]) {
        return caches[id];
    }

    if (template === null) {
        template = utils.loader(file);
    }

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
        // 'debugger;',
        'var ' + outputName + '=[];',
        'var ' + pushName + '=' + utilsName + '.push(' + outputName + ');',
        'with(' + dataName + '){'
    ];
    // 一次编译只使用一个声明实例
    var statements = [
        require('./statements/include')(),
        require('./statements/raw')(),
        require('./statements/if')(),
        require('./statements/for')(),
        require('./statements/var')(),
        require('./statements/print')()
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
            snippet.dirname = options.dirname;
            snippet.file = file;

            try {
                return build.call(snippet, statements, [source, flag, expression]);
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

        // console.log(scripts.join('\n'));

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
    fn = fun.bind(fn, compiled);

    if (caches) {
        caches[id] = fn;
    }

    return fn;
};

// =========================================
function wrap(code) {
    return JSON.stringify(code);
}
