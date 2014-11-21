var assert = require("assert"),
    expect = require('expect.js'),
    TestModule = require("./testModule.js"),
    UltiLogger = require("../lib/ultimate-logger");


// (function(){
//     console.__log = console.log;
//     console.log = function() {
//         console.__log.apply(console, arguments);
//         return arguments[0];
//     }    
// })();


function _loggingMethod(msg) {    
    return msg;
}

describe('DBusConnector suite', function(){

    UltiLogger.setLoggingMethod(_loggingMethod);

    it('methods check', function(){

        expect(console.crit).to.be.ok();
        expect(console.error).to.be.ok();
        expect(console.warn).to.be.ok();
        expect(console.notice).to.be.ok();
        expect(console.info).to.be.ok();
        expect(console.debug).to.be.ok();

    });    

    it('caller data check', function(){

        var log = TestModule.info("info")
        console.log(log)
        TestModule.error("error")

    });

    it('format', function(){
        var msg = "testMsg", log;

        //{{filePath}}:{{lineNumber}}
        UltiLogger.setFormat("{{filePath}}:{{lineNumber}} ");
        
        log = TestModule.error(msg)     
        expect(log).to.eql(__dirname + "/testModule.js:6 " + msg)       

        log = TestModule.info(msg)     
        expect(log).to.eql(__dirname + "/testModule.js:3 " + msg)          

        //{{filePath}}
        UltiLogger.setFormat("{{filePath}}: ");
        
        log = TestModule.error(msg)     
        expect(log).to.eql(__dirname + "/testModule.js: " + msg)       

        log = TestModule.info(msg)     
        expect(log).to.eql(__dirname + "/testModule.js: " + msg)   

        //{{filePath}}:{{methodName}}
        UltiLogger.setFormat("{{filePath}}:{{methodName}}() ");
        
        log = TestModule.error(msg)     
        expect(log).to.eql(__dirname + "/testModule.js:error() " + msg)       

        log = TestModule.info(msg)     
        expect(log).to.eql(__dirname + "/testModule.js:info() " + msg)   


    });    

})
