var bar = require("./bar");

module.exports = {
	setConsole: bar.setConsole,
	foo: function(msg){
		return bar.foo(msg);
	},
	bar: function(msg){
		return far.bar(msg);
	}
};