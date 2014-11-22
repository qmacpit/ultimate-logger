var assert = require("assert"),
    expect = require('expect.js'),
    TestModule = require("./testModule.js"),
    _console = {
        log: _loggingMethod
    },
    UltiLogger = require("../lib/ultimate-logger")(_console);

function _loggingMethod(msg) {    
    return msg;
}

describe('DBusConnector suite', function(){

    TestModule.setConsole(_console);

    it('methods check', function(){

        var msg = "testMsg",
            log = _console.log("testMsg");

        expect(log).to.eql(msg);

    });    

    it('format', function(){
        var msg = "testMsg", log;

        //{{filePath}}:{{lineNumber}}
        UltiLogger.setFormat("{{filePath}}:{{lineNumber}} ");
        
        log = TestModule.error(msg)     
        expect(log).to.eql(__dirname + "/testModule.js:10 " + msg)       

        log = TestModule.info(msg)     
        expect(log).to.eql(__dirname + "/testModule.js:7 " + msg)          

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

    it('filter', function(){

        var msg = "testMsg", log;

        //by method name
        UltiLogger.setFormat("{{methodName}}: ");
        UltiLogger.setFilter({
            methodName: "error"
        });

        log = TestModule.error(msg)
        expect(log).to.eql("error: " + msg)

        //by method name & line
        UltiLogger.setFormat("{{methodName}}:{{lineNumber}} ");
        UltiLogger.setFilter({
            methodName: "error",
            lineNumber: 6
        });

        log = TestModule.error(msg)
        expect(log).to.eql("error:6 " + msg)

        //by module name
        UltiLogger.setFormat("{{moduleName}} ");
        UltiLogger.setFilter({
            moduleName: "testModule"
        });

        log = TestModule.error(msg)        
        expect(log).to.eql("testModule " + msg)   
    });   

})
