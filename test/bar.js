var _console;
module.exports = {
	setConsole: function(logger){
		_console = logger;
	},
	bar: function(msg){
		return _console.log(msg);
	},
	foo: function(msg){
		return _console.log(msg);
	}
};