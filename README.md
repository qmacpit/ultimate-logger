[![Build Status](https://travis-ci.org/qmacpit/ultimate-logger.svg)](https://travis-ci.org/qmacpit/ultimate-logger)
=======

Ultimate-logger is a extension to javascript console.log. Features:
- adds info about moduleName/methodName/lineNumber to the console.log printout
- simple filtering(i.e. you can include/exclude console.log printouts from modules/methods)
- custom console.log printout format

It simply allows you to have 
```js
//moduleName::methodName():lineNumer message
```
instead of 
```js
//message
```
when calling
```js
console.log("message")
```



## Install

```bash
$ npm install ultimate-logger
```

## Usage

```js
var ultimateLogger = require('ultimate-logger');
ultimateLogger.enable();
```

## Use cases
### Formatting
Let's assume we've got a following module named "foo"....
```js
module.exports = {
	bar: function(){
		return console.log("message");
	}
};
```
Setting up ultimate-logger for logging module and metod name:
```js
var foo = require("foo")
ultimateLogger.setFormat("{{moduleName}}:{{methodName}}() ");
foo.bar();
//console printout is "foo:bar() message"
```

Setting up ultimate-logger for logging module and module's line number:
```js
var foo = require("foo")
ultimateLogger.setFormat("{{moduleName}}::{{lineNumber}} ");
foo.bar();
//console printout is "foo::3 message"
```
### Filtering
Let's assume we've got a following modules named "foo" and "bar"....
```js
//foo
module.exports = {
  foo: function(){
		return console.log("message");
	}
	bar: function(){
		return console.log("message");
	}
};
```
```js
//bar
module.exports = {
  foo: function(){
		return console.log("message");
	}
	bar: function(){
		return console.log("message");
	}
};
```

Setting up ultimate-logger for logging only from "foo" module
```js
var foo = require("foo")
ultimateLogger.setFormat("{{moduleName}} ");
ultimateLogger.setFilter({
  moduleName: "foo"
});
foo.bar();
//console printout is "foo message"
bar.bar();
//there is no console printout here
```

Setting up ultimate-logger for logging only from "foo" method
```js
var foo = require("foo")
ultimateLogger.setFormat("{{moduleName}} ");
ultimateLogger.setFilter({
  methodName: "foo"
});
foo.foo();
//console printout is "foo message"
bar.foo();
//console printout is "bar message"
bar.bar();
//there is no console printout here
```

Filter parameters can be combined. Array type is supported.
Lets set up logging only from "foo" module methods "foo" and "bar"
```js
var foo = require("foo")
ultimateLogger.setFormat("{{moduleName}} ");
ultimateLogger.setFilter({
  moduleName: "foo"
  methodName: ["foo", "bar"]
});
foo.foo();
//console printout is "foo message"
foo.bar();
//console printout is "foo message"
```

Ultimate-logger supports simple negative filtering. This is how to set it up to log all messages except from "foo" module
```js
var foo = require("foo")
ultimateLogger.setFormat("{{moduleName}} ");
ultimateLogger.setFilter({
  moduleName: "!foo"
});
foo.foo();
//console printout is "foo message"
bar.foo();
//console printout is "bar message"
```

## License 

(The MIT License)

Copyright (c) 2014 qmacpit &lt;qmacpit@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
