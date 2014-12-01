var assert = require("assert"),
    expect = require('expect.js'),
    TestModule = require("./testModule.js"),
    FooBar = require("./fooBar.js"),    
    _console = {
        log: _loggingMethod
    },
    UltiLogger = require("../lib/ultimate-logger")(_console);

function _loggingMethod(msg) {    
    return msg;    
}

describe('Ultimate logger - advanced suite', function(){    

    before(function(){
        UltiLogger.enable();
        TestModule.setConsole(_console);
        FooBar.setConsole(_console);
    });

    beforeEach(function(){
        UltiLogger.setFilter(null);
    });

    it('depth basic check', function(){

        var msg = "testMsg", log;

        UltiLogger.setStackLevel(2);
        UltiLogger.setFormat("{{moduleName}}: ");
        log = FooBar.foo(msg);
        expect(log).to.eql("fooBar: " + msg);

        UltiLogger.setFormat("{{moduleName}}:{{methodName}}() ");
        log = FooBar.foo(msg);
        expect(log).to.eql("fooBar:foo() " + msg);

        UltiLogger.setFormat("{{moduleName}}:{{methodName}}():{{lineNumber}} ");
        log = FooBar.foo(msg);
        expect(log).to.eql("fooBar:foo():6 " + msg);

    });   
});   





