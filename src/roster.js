/**
 * 配置
 * @author ydr.me
 * @create 2018-04-17 18:08
 * @update 2018-04-17 18:08
 */


'use strict';

var gid = 0;

/**
 * 输出数据代码变量
 */
exports.data = gen();

/**
 * 输出代码变量
 */
exports.utils = gen();

/**
 * 过滤器代码名称
 */
exports.filter = gen();

/**
 * 输出意外信息代码变量
 */
exports.accident = gen();

/**
 * 输出代码变量
 */
exports.output = gen();

exports.gen = gen;

// ================================

function gen() {
    // gid++;
    return '_$_' + gid++;
}