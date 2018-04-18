/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-17 13:54
 * @update 2018-04-17 13:54
 */


'use strict';

var array = require('blear.utils.array');

var build = require('./build');
var syntaxParser = require('./parser/syntax');
var roster = require('./roster');

var regular = /{{([@#]?)\s*?([\w\W]*?)\s*?}}/;

module.exports = function (template) {
    var outputName = roster.output;
    var dataName = roster.data;
    var entityName = roster.entity;
    var filterName = roster.filter;
    var accidentName = roster.accident;
    var scripts = [
        // // 参数0: data
        // 'var ' + dataName + '=arguments[0]||{};',
        // // 参数1: entity
        // 'var ' + entityName + '=arguments[1];',
        // // 参数2: filters
        // 'var ' + filterName + '=arguments[2];',
        // // 参数3: error
        // 'var ' + errorName + '=arguments[3];',
        'var ' + outputName + '="";',
        'with(' + dataName + '){'
    ];
    var snippets = syntaxParser(template, regular, function (source, flag, expression) {
        return build([
            require('./adapter/print')
        ], [source, flag, expression]);
    });
    var pushScript = function (script) {
        scripts.push(script);
    };
    var wrapTry = function (snippet) {
        var errorName = roster.gen();
        pushScript('try{');
        pushScript(snippet.expression.code);
        pushScript('}catch(' + errorName + '){');
        pushScript(errorName + '.snippet=' + JSON.stringify(snippet) + ';');
        pushScript('throw ' + accidentName + '(' + errorName + ');');
        pushScript('}');
    };

    array.each(snippets, function (index, snippet) {
        switch (snippet.type) {
            case 'string':
                pushScript(outputName + '+=' + wrap(snippet.value) + ';');
                break;

            case 'expression':
                wrapTry(snippet);
                break;
        }
    });
    pushScript('}');
    pushScript('return ' + outputName + ';');

    var fn = new Function(dataName, entityName, filterName, accidentName, scripts.join('\n'));
    fn.snippets = snippets;
    return fn;
};

// =========================================
function wrap(code) {
    return JSON.stringify(code);
}

function beautyError(snippet) {
    var lineNo = snippet.line + 1;
    var msgs = [
        '错误在第' + lineNo + '行表达式：',
        snippet.value,
        ''
    ];
    return wrap(msgs.join('\n'));
}
