/**
 * 指令类型模板引擎
 *
 * @author ydr.me
 * @create 2016-05-01 13:20
 */


'use strict';


var Lexer =      require('blear.shims.lexer');
var Events =     require('blear.classes.events');
var object =     require('blear.utils.object');
var array =      require('blear.utils.array');
var collection = require('blear.utils.collection');
var number =     require('blear.utils.number');
var string =     require('blear.utils.string');
var json =       require('blear.utils.json');
var fun =        require('blear.utils.function');
var random =     require('blear.utils.random');


var staticDirectives = {};
var staticStatements = {};
var reOriginal = /^=/;
var rePrivateKey = /^[_$]/;
var reSafeKey = /^[a-z][a-z\d$_]*$/i;
var reUnExp = /\\$/;
var IGNORE_SEP = '•';
var reStatement = /^#/;
var reDirective = /^@/;
var reIgnore = /\{\{#ignore}}([\s\S]*?)\{\{\/ignore}}/;


/**
 * 数组转对象
 * @param list
 * @returns {{}}
 */
var list2Map = function (list) {
    var map = {};
    array.each(list, function (index, item) {
        map[item] = 1;
    });
    return map;
};

var singleTagList = "area base br col embed hr img input keygen link menuitem meta param source track wbr".split(' ');
var booleanAttrList = 'selected checked disabled readonly required open autofocus controls autoplay compact loop defer multiple'.split(' ');
var singleTagMap = list2Map(singleTagList);
var booleanAttrMap = list2Map(booleanAttrList);

/**
 * 生成变量名
 * @returns {string}
 */
var generateVarName = (function () {
    var id = 0;
    return function () {
        return '__' + (id++) + '__';
    };
}());


/**
 * 字符化，双引号
 * @param value
 */
var textify = (function () {
    var reStart = /^.*?:/;
    var reEnd = /}$/;

    return function textify(value) {
        var o = {
            p: String(value)
        };

        return json.stringify(o).replace(reStart, '').replace(reEnd, '');
    };
}());

var STATIC_METHODS = {};

var defaults = {
    /**
     * 方法
     * @type Object
     */
    methods: {},

    /**
     * 是否压缩产出
     * @todo
     * @type Boolean
     */
    compress: true,

    /**
     * 是否调试模式，如果是，将插入 `debugger` 到编译后的函数内
     * @type Boolean
     */
    debug: false
};
var Template = Events.extend({
    className: 'Template',
    constructor: function (template, options) {
        var the = this;

        Template.parent(the);
        the[_options] = options = object.assign(true, {}, defaults, options);
        the[_instanceMethods] = object.assign({}, STATIC_METHODS, options.methods);
        the[_dataName] = generateVarName();
        the[_methodsName] = generateVarName();
        the[_thisName] = generateVarName();
        the[_outputName] = generateVarName();
        the[_protectionName] = generateVarName();
        the[_directives] = object.assign({}, staticDirectives);
        the[_statements] = object.assign({}, staticStatements);
        the[_directivesList] = initDirectives(the[_directives]);
        the[_temporary] = {};
        template = the[_processIgnoreStatement](template);
        the[_tokens] = new Lexer(template).lex();

        if (typeof DEBUG !== 'undefined' && DEBUG === true) {
            console.log('_tokens', the[_tokens]);
        }

        the[_pos] = -1;
        the[_vTemplate] = the[_parse]();

        if (typeof DEBUG !== 'undefined' && DEBUG === true) {
            console.log('_vTemplate', the[_vTemplate]);
        }
    },


    /**
     * 添加实例方法
     * @param name
     * @param fn
     * @returns {Template}
     */
    method: function (name, fn) {
        var the = this;
        the[_instanceMethods][name] = fn;
        return the;
    },


    /**
     * 获取 this 的名称
     * @returns {String}
     */
    thisName: function () {
        return this[_thisName];
    },


    /**
     * 获取 data 的名称
     * @returns {String}
     */
    dataName: function () {
        return this[_dataName];
    },


    /**
     * 获取 protection 的名称
     * @returns {String}
     */
    protectionName: function () {
        return this[_protectionName];
    },


    /**
     * output name
     * @return String
     */
    outputName: function () {
        return this[_outputName];
    },


    /**
     * 生成随机名称
     * @return String
     */
    genVarName: function () {
        return generateVarName();
    },


    /**
     * 编译成函数
     * @returns {Template}
     */
    compile: function () {
        var the = this;
        var compilerStrList = [];
        var compile = function (children) {
            var _compilerStrList = [];

            array.each(children, function (index, child) {
                var directiveRet = ['', ''];
                switch (child.type) {
                    case 'el':
                        var htmlStart = '<' + child.tag;
                        var htmlEnd = '</' + child.tag + '>';
                        directiveRet = the[_compileDirectives](child, _compilerStrList);
                        var htmlAttrs = the[_compileAttrs](child, _compilerStrList);
                        the.emit('beforeCompileElement', _compilerStrList);
                        _compilerStrList.push(directiveRet[0] + '');
                        _compilerStrList.push(the[_outputName] + ' += ' + textify(htmlStart) + ';');
                        _compilerStrList.push(htmlAttrs);
                        _compilerStrList.push(the[_outputName] + ' += ">";');

                        // 非自闭标签
                        if (child.children) {
                            _compilerStrList.push(compile(child.children));
                            _compilerStrList.push(the[_outputName] + ' += ' + textify(htmlEnd) + ';');
                        }

                        the.emit('afterCompileElement', _compilerStrList);
                        break;

                    case 'text':
                        the.emit('beforeCompileText', _compilerStrList);
                        _compilerStrList.push(the[_outputName] + ' += ' + textify(child.value) + ';');
                        the.emit('afterCompileText', _compilerStrList);
                        break;

                    case 'exp':
                        var isOriginal = false;
                        var value = child.value.replace(reOriginal, function () {
                            isOriginal = true;
                            return '';
                        });

                        if (!isOriginal) {
                            value = the[_thisName] + '.escape(' + value + ')';
                        }

                        the.emit('beforeCompileExpression', _compilerStrList);
                        _compilerStrList.push(the[_outputName] + ' += ' + value + ';');
                        the.emit('afterCompileExpression', _compilerStrList);
                        break;

                    case 'statement':
                        _compilerStrList.push(the[_compileStatement](child));
                        break;
                }
                _compilerStrList.push(directiveRet[1]);
            });

            return _compilerStrList.join('\n');
        };

        var evalStr = generateVarName();
        var forKeyName = generateVarName();

        if (the[_options].debug) {
            compilerStrList.push('debugger;');
        }

        // 编译之前
        the.emit('beforeCompile', compilerStrList);

        // 定义变量
        compilerStrList.push('var ' + the[_thisName] + ' = this;');
        compilerStrList.push('var ' + the[_outputName] + ' = "";');
        compilerStrList.push('var ' + evalStr + ' = "";');
        compilerStrList.push('var ' + forKeyName + ' = null;');
        // for in methods
        compilerStrList.push('for (' + forKeyName + ' in ' + the[_methodsName] + ') {');
        compilerStrList.push('  if (' + the[_thisName] + '.isSafeKey(' + the[_methodsName] + ', ' + forKeyName + ')) {');
        compilerStrList.push('    ' + evalStr + ' += "var " + ' + forKeyName + ' + " = ' +
            the[_methodsName] + '[\\"" + ' + forKeyName + ' + "\\"];";');
        compilerStrList.push('  }');
        compilerStrList.push('}');
        // for in data
        compilerStrList.push('for (' + forKeyName + ' in ' + the[_dataName] + ') {');
        compilerStrList.push('  if (' + the[_thisName] + '.isSafeKey(' + the[_dataName] + ', ' + forKeyName + ')) {');
        compilerStrList.push('    ' + evalStr + ' += "var " + ' + forKeyName + ' + " = ' +
            the[_dataName] + '[\\"" + ' + forKeyName + ' + "\\"];";');
        compilerStrList.push('  }');
        compilerStrList.push('}');
        // eval data/methods
        compilerStrList.push('eval(' + evalStr + ');');
        compilerStrList.push(compile(the[_vTemplate]));
        // 编译之后
        the.emit('afterCompile', compilerStrList);
        compilerStrList.push('return ' + the[_outputName] + ';');

        // 编译之前

        var compilerStr = compilerStrList.join('\n');


        try {
            /* jshint evil: true */
            the[_compiler] = new Function(the[_dataName], the[_methodsName], the[_protectionName], compilerStr);

            if (typeof DEBUG !== 'undefined' && DEBUG === true) {
                console.log('_compiler', the[_compiler]);
            }
        } catch (err) {
            if (typeof DEBUG !== 'undefined' && DEBUG === true) {
                console.log('_compiler', compilerStr);
            }

            throw err;
        }

        return the;
    },


    /**
     * 渲染
     * @param data {Object} 渲染数据
     * @param [protection] {object} 外部传来的保护对象
     * @returns {*}
     */
    render: function (data, protection) {
        var the = this;
        var context = {
            isSafeKey: function (obj, key) {
                return object.hasOwn(obj, key) && !rePrivateKey.test(key) && reSafeKey.test(key);
            },
            each: collection.each,
            escape: string.escapeHTML,
            bind: fun.bind
        };

        if (!the[_compiler]) {
            the.compile();
        }

        var html = string.trim(the[_compiler].call(context, data, the[_instanceMethods], protection));

        // recover ignore
        object.each(the[_temporary], function (key, original) {
            html = html.replace(key, original);
        });

        return html;
    },


    /**
     * 增加指令
     * @param name {String} 指令名称
     * @param priority {Number} 优先级
     * @param install {Function} 安装函数
     */
    directive: function (name, priority, install) {
        var the = this;

        the[_directives][name] = {
            name: name,
            priority: priority,
            install: install
        };
        the[_directivesList] = initDirectives(the[_directives]);
    },


    /**
     * 添加实例声明
     * @param name
     * @param install
     * @returns {Template}
     */
    statement: function (name, install) {
        var the = this;
        var statement = {};

        statement[name] = install;
        object.assign(the[_statements], statement);

        return the;
    }
});
var _options = Template.sole();
var _instanceMethods = Template.sole();
var _tokens = Template.sole();
var _parse = Template.sole();
var _program = Template.sole();
var _pos = Template.sole();
var _next = Template.sole();
var _vTemplate = Template.sole();
var _directives = Template.sole();
var _statements = Template.sole();
var _directivesList = Template.sole();
var _TEXT = Template.sole();
var _TAG_OPEN = Template.sole();
var _EXPR_OPEN = Template.sole();
var _STATEMENT_OPEN = Template.sole();
// \{{varible}}
var _inText = Template.sole();
var _compileAttrs = Template.sole();
var _compileDirectives = Template.sole();
var _compileStatement = Template.sole();
var _temporary = Template.sole();
var _processIgnoreStatement = Template.sole();
var _compiler = Template.sole();
var _outputName = Template.sole();
var _thisName = Template.sole();
var _dataName = Template.sole();
var _methodsName = Template.sole();
var _protectionName = Template.sole();
var _parseExpression = Template.sole();
var pro = Template.prototype;


/**
 * 处理 ignore
 * @param template
 * @returns {void|*|string|XML}
 */
pro[_processIgnoreStatement] = function (template) {
    var the = this;

    return template.replace(reIgnore, function (source, original) {
        var key = IGNORE_SEP + random.guid() + IGNORE_SEP;
        the[_temporary][key] = original;
        return key;
    });
};


/**
 * 初始化指令
 */
var initDirectives = function (directives) {
    var directivesList = [];

    object.each(directives, function (index, directive) {
        directivesList.push(directive);
    });

    // 按照优先级排序
    directivesList.sort(function (a, b) {
        return a - b;
    });

    return directivesList
};


/**
 * 解析表达式
 * @param expression
 * @param scape
 * @returns {String}
 */
pro[_parseExpression] = function (expression, scape) {
    var the = this;
    var tokens = new Lexer(expression).lex();
    var index = 0;
    var token = tokens[index++];
    var exp = '';
    var expList = [];
    var inExp = false;
    var expStart = false;
    var isOriginal = false;

    while (token.type !== 'EOF') {
        var value = token.value;

        switch (token.type) {
            case 'EXPR_OPEN':
                inExp = true;
                isOriginal = false;
                expStart = true;
                // 表达式使用括号包裹 开始
                exp = '(';
                break;

            case 'END':
                inExp = false;

                if (!isOriginal && scape) {
                    exp += ')';
                }

                // 表达式使用括号包裹 结束
                exp += ')';
                expList.push(exp);
                break;

            case 'TEXT':
                expList.push(textify(value));
                break;

            case 'STRING':
                exp += textify(value);
                break;

            default:
                if (inExp) {
                    if (expStart) {
                        value = value.replace(reOriginal, function () {
                            isOriginal = true;
                            return '';
                        });

                        if (!isOriginal && scape) {
                            exp += the[_thisName] + '.escape(';
                        }
                    }

                    exp += value;
                    expStart = false;
                } else {
                    expList.push(textify(value));
                }
                break;
        }
        token = tokens[index++];
    }

    return expList.join(' + ');
};


/**
 * 解析碎片
 * @returns {Array}
 */
pro[_parse] = function () {
    var the = this;
    var slices = [];
    var token = the[_next]();

    while (token && token.type !== 'EOF' && token.type !== 'TAG_CLOSE') {
        var slice = the[_program]();

        if (slice.type === 'text' && reUnExp.test(slice.value)) {
            the[_inText] = true;
            slice.value = slice.value.slice(0, -1);
            slices.push(slice);
            token = the[_next]();
            continue;
        }

        if (slice.type === 'exp' && the[_inText]) {
            the[_inText] = false;
            slice.type = 'text';
            slice.value = '{{' + slice.value + '}}';
            slices.push(slice);
            token = the[_next]();
            continue;
        }

        slices.push(slice);
        token = the[_next]();
    }

    return slices;
};

/**
 * 解析片段
 */
pro[_program] = function () {
    var the = this;
    var token = the[_next](0);

    switch (token.type) {
        case 'TEXT':
            return the[_TEXT](token);

        case 'TAG_OPEN':
            return the[_TAG_OPEN](token);

        case 'EXPR_OPEN':
            return the[_EXPR_OPEN](token);

        case 'OPEN':
        case 'CLOSE':
            return the[_STATEMENT_OPEN](token);

        default:
            throw new SyntaxError('未知 token' + token);
    }
};


/**
 * 纯文本
 * @param token
 */
pro[_TEXT] = function (token) {
    return {
        type: 'text',
        value: token.value
    };
};


/**
 * 标签开始
 * @param token
 * @returns {{children: *, attrs: {}, tag: *}}
 */
pro[_TAG_OPEN] = function (token) {
    var the = this;
    var attrs = {};
    var directives = {};
    var classMap = {};
    var styleMap = {};
    var lastName = '';
    var type = token.value;
    var value = token.value;
    var tag = value;
    var isDirective = false;
    var directiveName;

    while (type !== '>') {
        switch (type) {
            case 'NAME':
                if (lastName) {
                    // 布尔值
                    attrs[lastName] = lastName;
                    lastName = '';
                }

                lastName = value;
                // 指令
                directiveName = lastName.replace(reDirective, function () {
                    isDirective = true;
                    return '';
                });

                if (isDirective) {
                    lastName = directiveName;
                }

                break;

            case '=':
                break;

            case 'STRING':
                // 如果是指令的话，则不需要解析属性值
                if (isDirective) {
                    var directiveList = lastName.split('.');
                    directiveName = directiveList.shift();
                    directives[directiveName] = {
                        name: directiveName,
                        value: value,
                        filters: directiveList
                    };
                }
                else {
                    attrs[lastName] = value;
                }

                lastName = '';
                isDirective = false;
                break;
        }

        token = the[_next]();
        type = token.type;
        value = token.value;
    }

    var isSingle = singleTagMap[tag];
    var ret = {
        type: 'el',
        directives: directives,
        attrs: attrs,
        tag: tag,
        classMap: classMap,
        styleMap: styleMap
    };

    if (!isSingle) {
        ret.children = the[_parse]();
    }

    return ret;
};


/**
 * 表达式开始
 * @returns {{type: string, value: String}}
 */
pro[_EXPR_OPEN] = function () {
    var the = this;
    var token = the[_next]();

    // 半个空值表达式，忽略之
    if (token.type === 'EXPR_OPEN') {
        the[_next](-1);
        return {
            type: 'text',
            value: '{{'
        };
    }

    var value = '';

    while (true) {
        if (token.type === 'STRING') {
            token.value = textify(token.value);
        }

        value += token.value;
        token = the[_next]();

        // {{varible
        // 半个有值表达式，忽略之
        if (token.type === 'EXPR_OPEN') {
            the[_next](-1);
            return {
                type: 'text',
                value: '{{' + value
            };
        }

        // 完整表达式
        if (token.type === 'END') {
            break;
        }
    }

    return {
        type: 'exp',
        value: value
    };
};


pro[_STATEMENT_OPEN] = function () {
    var the = this;
    var token = the[_next](0);
    var type = token.type;
    var values = [];
    var statement = {
        type: 'statement',
        open: type === 'OPEN',
        name: token.value,
        value: ''
    };

    if (type === 'CLOSE') {
        return statement;
    }

    token = the[_next]();

    while (token.type !== 'END') {
        values.push(token.value);
        token = the[_next]();
    }

    statement.value = values.join(' ');
    return statement;
};


/**
 * 下一步
 * @param [step]
 */
pro[_next] = function (step) {
    var the = this;
    the[_pos] += number.parseInt(step, 1);
    return the[_tokens][the[_pos]];
};


/**
 * 编译属性
 * @param vnode
 * @returns {string}
 */
pro[_compileAttrs] = function (vnode) {
    var the = this;
    var arttsList = [];
    var attrs = vnode.attrs;

    vnode.attrs['class'] = vnode.attrs['class'];
    // class=" + (class1 ? "class1" : "") + "class2" +"
    //           ^^^                         ^^^
    //           表达式求值                    常量
    object.each(vnode.classMap, function (value, exp) {
        vnode.attrs['class'] += ' {{(Boolean(' + exp + ') ? " ' + value + '" : "")}}';
    });

    // style=" + ("font-size:" + fontSize + "px;")
    object.each(vnode.styleMap, function (value, exp) {
        vnode.attrs.style += ' {{(";' + value + ':" + ' + exp + ' + ";")}}';
    });

    object.each(attrs, function (name, value) {
        value = the[_parseExpression](value, false);

        if (booleanAttrMap[name]) {
            // 说明是表达式
            if (value) {
                arttsList.push(the[_outputName] + ' += " " + (Boolean(' + value + ') ? ' + textify(name) + ' : "");');
            } else {
                arttsList.push(the[_outputName] + ' += " " + ' + textify(name) + ';');
            }

            return;
        }

        if (!value) {
            return;
        }

        arttsList.push(the[_outputName] + ' += " " + ' + textify(name) + ' + "=\\"" + ' + value + ' + "\\"";');
    });

    return arttsList.join('\n');
};


/**
 * 编译指令
 * @param vnode
 */
pro[_compileDirectives] = function (vnode) {
    var the = this;
    var ret = ['', ''];

    array.each(the[_directivesList], function (index, directive) {
        var name = directive.name;
        var value = vnode.directives[name];

        if (value) {
            var _ret = directive.install.call(the, vnode, value) || ret;
            ret[0] += _ret[0];
            ret[1] += _ret[1];
            delete vnode.directives[name];
        }
    });

    var remainList = object.keys(vnode.directives);

    if (typeof DEBUG !== 'undefined' && DEBUG === true) {
        if (remainList.length) {
            console.warn('不支持该指令：@' + remainList.join('/'));
        }
    }

    return ret;
};


/**
 * 编译声明
 * @param vnode
 * @returns {*}
 */
pro[_compileStatement] = function (vnode) {
    var the = this;
    var statementName = vnode.name;
    var statement = the[_statements][statementName];

    if (typeof DEBUG !== 'undefined' && DEBUG === true) {
        if (!statement) {
            console.warn('不支持该声明：#' + statementName);
        }
    }

    if (!statement) {
        return '';
    }

    return statement.call(the, vnode);
};


/**
 * 增加指令
 * @param name {String} 指令名称
 * @param priority {Number} 优先级
 * @param install {Function} 安装函数
 */
Template.directive = function (name, priority, install) {
    staticDirectives[name] = {
        name: name,
        priority: priority,
        install: install
    };
};


/**
 * 添加静态方法
 * @param name
 * @param fn
 */
Template.method = function (name, fn) {
    STATIC_METHODS[name] = fn;
};


/**
 * 添加静态声明
 * @param name
 * @param install
 */
Template.statement = function (name, install) {
    staticStatements[name] = install;
};


Template.directive('if', 10000, require('./_directives/if.js'));
Template.directive('show', 1000, require('./_directives/show.js'));
Template.directive('class', 100, require('./_directives/class.js'));
Template.directive('style', 100, require('./_directives/style.js'));
Template.directive('for', 1, require('./_directives/for.js'));

Template.statement('if', require('./_statements/if.js'));
Template.statement('else', require('./_statements/else.js'));
Template.statement('for', require('./_statements/for.js'));
Template.statement('set', require('./_statements/set.js'));

Template.defaults = defaults;
module.exports = Template;
