# blear.classes.template 指令类型模板引擎

[![npm module][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![coverage][coveralls-img]][coveralls-url]

[travis-img]: https://img.shields.io/travis/blearjs/blear.classes.template/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/blearjs/blear.classes.template

[npm-img]: https://img.shields.io/npm/v/blear.classes.template.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/blear.classes.template

[coveralls-img]: https://img.shields.io/coveralls/blearjs/blear.classes.template/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/blearjs/blear.classes.template?branch=master



## 入门
```
var tpl = new Template(template);
tpl.render(data);
```


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
<li @for="val in list"></li>
<li @for="key, val in list"></li>
```

### 循环过滤
```
<li @for="key, val in list" @filter="val > 2"></li>
```

### 循环排序
```
<li @for="key, val in list" @order="val">正序</li>
<li @for="key, val in list" @order="val -1">倒序</li>
```

### 循环选段
```
<li @for="key, val in list" @limit="10">从 0 开始，连续取 10 个</li>
<li @for="key, val in list" @limit="10 20">从 20 开始，连续取 10 个</li>
```

### 判断
```
<li @if="exp"></li>
<li @else-if="exp"></li>
<li @else></li>
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

