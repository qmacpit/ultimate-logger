var _console;
module.exports = {
	setConsole: function(logger){
		_console = logger;
	},
	info: function(msg){
		return _console.log(msg);
	},
	error: function(msg){
		return _console.log(msg);
	},
	warn: function(msg){
		return _console.log(msg);
	}
};