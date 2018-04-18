/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 13:54
 * @update 2018-04-17 13:54
 */


'use strict';

var array = require('blear.utils.array');
var object = require('blear.utils.object');

var build = require('./build');
var syntaxParser = require('./parser/syntax');
var roster = require('./roster');

var regular = /{{([@#=/]?)\s*?([\w\W]*?)\s*?}}/;

module.exports = function (template) {
    var outputName = roster.output;
    var dataName = roster.data;
    var utilsName = roster.utils;
    var filterName = roster.filter;
    var accidentName = roster.accident;
    var pushName = roster.push;
    var scripts = [
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
    var snippets = syntaxParser(template, regular, function (source, flag, expression) {
        return build.call(this, [
            require('./adapter/print'),
            require('./adapter/if'),
            require('./adapter/for')
        ], [source, flag, expression]);
    });
    var pushScript = function (script) {
        scripts.push(script);
    };
    var dumpExpression = function (expression, key) {
        var script = expression[key];

        if (!script) {
            return script;
        }

        return expression.echo ? pushName + '(' + script + ');' : script + ';'
    };
    var wrapTry = function (expression) {
        if (!expression.opened) {
            return;
        }

        pushScript('try{');
        pushScript(dumpExpression(expression, 'code'));
    };
    var wrapCatch = function (expression, snippet) {
        if (!expression.closed) {
            return;
        }

        var errorName = roster.gen();
        pushScript(dumpExpression(expression, 'closeCode'));
        pushScript('}catch(' + errorName + '){');
        pushScript('throw ' + accidentName + '(' + errorName + ', ' + wrap(object.filter(snippet, [
            'file', 'line', 'start', 'end'
        ])) + ');');
        pushScript('}');
    };

    array.each(snippets, function (index, snippet) {
        switch (snippet.type) {
            case 'string':
                pushScript(pushName + '(' + wrap(snippet.value) + ');');
                break;

            case 'expression':
                var expression = snippet.expression;

                if (!expression) {
                    return;
                }

                wrapTry(expression);
                wrapCatch(expression, expression.begin || snippet);
                break;
        }
    });
    pushScript('}');
    pushScript('return ' + utilsName + '.trim(' + outputName + '.join(""));');

    console.log(scripts.join('\n'));
    var fn = new Function(dataName, utilsName, filterName, accidentName, scripts.join('\n'));
    fn.snippets = snippets;
    return fn;
};

// =========================================
function wrap(code) {
    return JSON.stringify(code);
}
