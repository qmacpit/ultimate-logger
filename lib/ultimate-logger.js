/*!
 * ultimate-logger - lib/ultimate-logger.js
 * Copyright(c) 2014 fengmk2 <qmacpit@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var callerId = require('caller-id'),
	S = require('string');

var _colorsMap = {
    RED: "1;31m",
    YELLOW: "1;33m",
    LIME: "1;32m",
    CYAN: "1;36m",
    PINK: "1;35m",
    BLUE: "1;34m",
    BROWN: "33m"
},
_format = {},
_filter,
_loggingMethod;

function _justLog(msg) {
    if (!_loggingMethod)
        return console.log(msg)
    return _loggingMethod(msg);
}

(function(){    

// { 
//     typeName: 'Object',
//     functionName: 'module.exports.info',
//     methodName: 'info',
//     filePath: '/Users/qmacpit/development/projects/ultimate-logger/test/testModule.js',
//     lineNumber: 3,
//     topLevelFlag: false,
//     nativeFlag: false,
//     evalFlag: false,
//     evalOrigin: '/Users/qmacpit/development/projects/ultimate-logger/test/testModule.js' 
// }

    function _formatLog(msg, callerData) {

        if (!_format.f)
            return msg;

        if (_filter) {                        
            //apply filters
            var current, matching = true;
            for (current in _filter) {
                if (current === "moduleName") {

                    var lastSlash = callerData.filePath.lastIndexOf("/"),
                        dot = callerData.filePath.lastIndexOf(".");
                        
                    callerData[current] =  _filter[current];
                    if (_filter[current] !== callerData.filePath.substring(++lastSlash, dot)) {
                        console.log("not matching")
                        matching = false;
                        break;                                
                    }                    
                } else {
                    if (_filter[current] !== callerData[current]) {
                        matching = false;
                        break;
                    }
                }
            }

            if (!matching)
                return;
        }

        var prefix = S(_format.f).template(callerData).s;
        msg = prefix + msg;

        return matching ? msg : "";
    }

    function _logIt(msg, color, callerData) {    	
    	if (!callerData) 
    		callerData = callerId.getData()

        if (typeof msg == "object") {
            try {
                msg = JSON.stringify(msg, null, 4);
            } catch (e) {}
        }

        msg = _formatLog(msg, callerData);

        if (!msg)
            return;

        if (!color || !_colorsMap[color])
            return _justLog(msg);

        if (_colorsMap[color])
            color = _colorsMap[color];

        return _justLog("\033[" + color + msg +"\033[0m");
    }

    /**
     * Different logging levels used to filter messages by systemd journal.
     * Numeric values taken from sys/syslog.h
     */

    /* Critical condition. Used when system is unusable. Eg. prior to application
     * retart */
    console.crit = function(msg, color) { return _logIt(msg, color ? color : _colorsMap.RED, callerId.getData()); }

    /* Error condition. Used when breaking function calls, catching an exception
     * that prevents normal function return. */
    console.error = function(msg, color) { return _logIt(msg, color ? color : _colorsMap.RED, callerId.getData()); }

    /* Warning condition. Used when for example invalid parameters are passed to
     * function. */
    console.warn = function(msg, color) { return _logIt(msg, color ? color : _colorsMap.YELLOW, callerId.getData());  }

    /* Notice condition. Used when providing normal, but significant condition */
    console.notice = _logIt;

    /* Informational condition. Normal, expected messages */
    console.info = _logIt;

    /* Debug condition. Debug, low-level messages */
    console.debug = _logIt;

})();

module.exports = {
	COLORS: _colorsMap,
	setFormat: function(format) {
        _format.f = format;		
	},    
    setLoggingMethod: function(loggingMethod) {
        _loggingMethod = loggingMethod;
    },
    /*
     * parameters:
     *  - filer [Object]:
     *      lineNumber 
     *      methodName
     *      filePath
     *      moduleName
     */
    setFilter: function(filter) {
        _filter = filter;
    }
};
