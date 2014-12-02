var assert = require("assert"),
    expect = require('expect.js'),
    TestModule = require("./testModule.js"),
    FooBar = require("./fooBar.js"),    
    Foo = require("./foo.js"),    
    _console = {
        log: _loggingMethod,
        logCounter: 0
    },
    UltiLogger = require("../lib/ultimate-logger")(_console);

function _loggingMethod(msg) { 
    _console.logCounter++;     
    return msg;    
}

describe('Ultimate logger - advanced suite', function(){    

    before(function(){
        UltiLogger.enable();
        TestModule.setConsole(_console);
        FooBar.setConsole(_console);
        Foo.setConsole(_console);
    });

    beforeEach(function(){
        UltiLogger.setFilter(null);
        UltiLogger.setStackLevel(1);
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

    it('no printout/logging method call from excluded module', function(){

        var msg = "testMsg", log;
        
        UltiLogger.setFormat("{{moduleName}}: ");
        UltiLogger.setFilter({
            moduleName: "!foo"
        });
        _console.logCounter = 0;
        log = Foo.foo(msg);
        expect(_console.logCounter).to.eql(0);

        log = FooBar.foo(msg);        
        expect(log).to.eql("bar: " + msg);

        _console.logCounter = 0;
        log = FooBar.foo(msg);        
        expect(_console.logCounter).to.eql(1);
        log = Foo.foo(msg);
        expect(_console.logCounter).to.eql(1);

    });    
});   





