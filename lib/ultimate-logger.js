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

var UltimateLogger = function(_logger) {

    var _console = _logger ? _logger : console,
        _format = {}, _filter;
   
    function _logIt(msg) {       
        var callerData = callerId.getData();

        if (typeof msg == "object") {
            try {
                msg = JSON.stringify(msg, null, 4);
            } catch (e) {}
        }

        msg = _formatLog(msg, callerData);
        return _console._log(msg);
    }   

    function _checkMatchingCondition(filetrData, value) {
        if (filetrData[0] !== "!")
                return filetrData === value;
        var _filterData = filetrData.substring(1, filetrData.length);
        // console.log(_filterData + " vs " + value)
        return _filterData !== value;
    }


    function _checkMatching(filetrData, value){
        if (Array.isArray(filetrData)) {
            var i =0, l = filetrData.length, matching, 
                results = [], isNegative, result;
            for (; i < l; i++) {                
                if (!isNegative && filetrData[i][0] === "!")
                    isNegative = true;
                results.push(_checkMatchingCondition(filetrData[i], value))
            };
            result = isNegative ? true : false
            for(i = 0, l = results.length; i < l; i++) {
                if (isNegative) {
                    result &= results[i];
                    if (!result)
                        return false;
                } else {
                    result |= results[i];
                    if (result)
                        return true;
                }
            }
            return result;
        } else 
            return _checkMatchingCondition(filetrData, value);        
    }

    function _formatLog(msg, callerData) {

        if (!_format.f)
            return msg;

    	if (_format.f.indexOf("{{moduleName}}") !== -1) {
			var lastSlash = callerData.filePath.lastIndexOf("/"),
                dot = callerData.filePath.lastIndexOf(".");
                        
            callerData["moduleName"] =  callerData.filePath.substring(++lastSlash, dot);  
    	}

        if (_filter) {                        
            //apply filters
            var current, matching = true;
            for (current in _filter) {        
                if (!_checkMatching(_filter[current], callerData[current])) 
                    return;                                      
            }
        }
        
        var prefix = S(_format.f).template(callerData).s;
        return prefix + msg;
    } 

    this.enable = function(){
    	_console._log = _console.log;
    	_console.log = _logIt;
    };

    this.disable = function(){
    	_console.log = _console._log;
    };

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