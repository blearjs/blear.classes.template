/**
 * 表达式解析器
 * @author ydr.me
 * @create 2018-04-17 12:43
 * @update 2018-04-17 12:43
 */


'use strict';

var array = require('blear.utils.array');

// @ref https://github.com/crissdev/is-keyword-js
// List extracted from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords
var reservedKeywords = array.reduce('abstract await boolean break byte case catch char class const continue debugger default delete do double else enum export extends false final finally float for function goto if implements import in instanceof int interface let long native new null package private protected public return short static super switch synchronized this throw transient true try typeof var void volatile while with yield'.split(/\s/), function (prev, curr, arr) {
    prev[curr] = true;
    return prev;
}, {});

// @ref https://github.com/lydell/js-tokens
var tokenRE = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyus]{1,6}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g
var whitespaceType = 'whitespace';
var nameType = 'name';
var punctuatorType = 'punctuator';
var commentType = 'comment';
var regexType = 'regex';
var numberType = 'number';
var stringType = 'string';
var invalidType = 'invalid';
var keywordType = 'keyword';


module.exports = tokenizer;


// =========================================
function matchToToken(match) {
    var token = {
        type: invalidType,
        value: match[0],
        closed: undefined
    };

    if (match[1]) {
        token.type = stringType;
        token.closed = !!(match[3] || match[4]);
    } else {
        if (match[5]) {
            token.type = commentType;
        } else if (match[6]) {
            token.type = commentType;
            token.closed = !!match[7];
        } else if (match[8]) {
            token.type = regexType;
        } else if (match[9]) {
            token.type = numberType;
        } else if (match[10]) {
            token.type = nameType;
        } else if (match[11]) {
            token.type = punctuatorType;
        } else if (match[12]) {
            token.type = whitespaceType;
        }
    }

    return token;
}

/**
 * 将逻辑表达式解释为 Tokens
 * @param {string} expression
 * @return {[]}
 */
function tokenizer(expression) {
    var tokenMatches = expression.match(tokenRE);

    var tokens = array.map(tokenMatches, function (value) {
        tokenRE.lastIndex = 0;
        return matchToToken(tokenRE.exec(value));
    });

    return array.map(tokens, function (token) {
        if (token.type === nameType && reservedKeywords[token.value]) {
            token.type = keywordType;
        }

        return token;
    });
}
