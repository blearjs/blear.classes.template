# blear.classes.template 指令类型模板引擎

[![npm module][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![coverage][coveralls-img]][coveralls-url]

[travis-img]: https://img.shields.io/travis/blearjs/blear.classes.template/master.svg?maxAge=2592000&style=flat-square
[travis-url]: https://travis-ci.org/blearjs/blear.classes.template

[npm-img]: https://img.shields.io/npm/v/blear.classes.template.svg?maxAge=2592000&style=flat-square
[npm-url]: https://www.npmjs.com/package/blear.classes.template

[coveralls-img]: https://img.shields.io/coveralls/blearjs/blear.classes.template/master.svg?maxAge=2592000&style=flat-square
[coveralls-url]: https://coveralls.io/github/blearjs/blear.classes.template?branch=master



## 文本声明

### 变量定义、赋值
```
{{#set abc = 123}}
{{#set abc = 456}}
```

### 忽略编译
```
{{#ignore}}
.....
{{/ignore}}
```

### 判断
```
{{#if exp}}
{{#else if exp}}
{{#else}}
{{/if}}
```

## 循环
```
{{#for index, item in list}}
{{/for}}
```

### 取消编译
```
\\{{exp}} => {{exp}}
```

## 属性指令
属性里的表达式不会进行 escape

### 循环
```
<li @for="key, val in item"></li>
```

### 判断
```
<li @if="exp"></li>
```

### 属性
````
@style="font-size: fontSize + 'px'; width: width + 'px'"
@class="class-a: classA, class-b: classB"
```

## 输出
```
转义输出 {{exp}}
原样输出 {{=exp}}
```
