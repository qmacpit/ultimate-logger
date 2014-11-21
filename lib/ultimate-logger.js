/*!
 * ultimate-logger - lib/ultimate-logger.js
 * Copyright(c) 2014 fengmk2 <qmacpit@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var _colorsMap = {
    RED: "1;31m",
    YELLOW: "1;33m",
    LIME: "1;32m",
    CYAN: "1;36m",
    PINK: "1;35m",
    BLUE: "1;34m",
    BROWN: "33m"
};

(function(){    

    function _logIt(msg, color) {
        if (typeof msg == "object") {
            try {
                msg = JSON.stringify(msg, null, 4);
            } catch (e) {}
        }

        if (!color || !_colorsMap[color])
            return console.log(msg);
        if (_colorsMap[color])
            color = _colorsMap[color];

        return console.log("\033[" + color + msg +"\033[0m");
    }
    /**
     * Different logging levels used to filter messages by systemd journal.
     * Numeric values taken from sys/syslog.h
     */

    /* Critical condition. Used when system is unusable. Eg. prior to application
     * retart */
    console.crit = function(msg, color) { _logIt(msg, color ? color : _colorsMap.RED); }

    /* Error condition. Used when breaking function calls, catching an exception
     * that prevents normal function return. */
    console.error = function(msg, color) { _logIt(msg, color ? color : _colorsMap.RED); }

    /* Warning condition. Used when for example invalid parameters are passed to
     * function. */
    console.warn = function(msg, color) { _logIt(msg, color ? color : _colorsMap.YELLOW);  }

    /* Notice condition. Used when providing normal, but significant condition */
    console.notice = _logIt;

    /* Informational condition. Normal, expected messages */
    console.info = _logIt;

    /* Debug condition. Debug, low-level messages */
    console.debug = _logIt;

})();

module.exports = {
	COLORS: _colorsMap
};
