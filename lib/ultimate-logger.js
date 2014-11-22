/*!
 * ultimate-logger - lib/ultimate-logger.js
 * Copyright(c) 2014 qmacpit <qmacpit@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var callerId = require('caller-id'),
	S = require('string');

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

var UltimateLogger = function(_logger) {

    var _console = _logger ? _logger : console,
        _format = {}, _filter;

    _console._log = _console.log;
    _console.log = _logIt;

    function _logIt(msg) {       
        var callerData = callerId.getData()

        if (typeof msg == "object") {
            try {
                msg = JSON.stringify(msg, null, 4);
            } catch (e) {}
        }

        msg = _formatLog(msg, callerData);
        return _console._log(msg);
    }   

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
        return prefix + msg;
    } 

    this.setFormat = function(format) {
        _format.f = format;     
    };

    /*
     * parameters:
     *  - filer [Object]:
     *      lineNumber 
     *      methodName
     *      filePath
     *      moduleName
     */
    this.setFilter = function(filter) {
        _filter = filter;
    }    

};


module.exports = function(_logger){
    return new UltimateLogger(_logger);
};

// module.exports = {
// 	COLORS: _colorsMap,
// 	setFormat: function(format) {
//         _format.f = format;		
// 	},    
//     intialize: function(loggingMethod) {
//         _loggingMethod = loggingMethod;
//         if (!_loggingMethod) {
//             console.__log = console.log;
//             console.log = function() {
//                 console.__log.apply(console, arguments);
//                 return arguments[0];
//             }    
//         }
            
//     },
    
// };
