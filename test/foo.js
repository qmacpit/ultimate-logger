var _console;
module.exports = {
	setConsole: function(logger){
		_console = logger;
	},
	foo: function(msg){
		return _console.log(msg);
	},
	fooBar: function(msg){
		return _console.log(msg);
	},
	bar: function(msg){
		return _console.log(msg);
	}
};