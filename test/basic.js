var assert = require("assert"),
    expect = require('expect.js'),
    TestModule = require("./testModule.js"),
    Foo = require("./foo.js"),
    Bar = require("./bar.js"),
    _console = {
        log: _loggingMethod
    },
    UltiLogger = require("../lib/ultimate-logger")(_console);

function _loggingMethod(msg) {    
    return msg;
}

describe('Ultimate logger - basic suite', function(){
   
    before(function(){
        UltiLogger.enable();
        UltiLogger.setStackLevel(1);
        TestModule.setConsole(_console);
        Foo.setConsole(_console);
        Bar.setConsole(_console);
    });

    beforeEach(function(){
        UltiLogger.setFilter(null);
    });

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

    it('basic filter', function(){

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
            lineNumber: 10
        });

        log = TestModule.error(msg)
        expect(log).to.eql("error:10 " + msg)

        //by module name
        UltiLogger.setFormat("{{moduleName}} ");
        UltiLogger.setFilter({
            moduleName: "testModule"
        });

        log = TestModule.error(msg)        
        expect(log).to.eql("testModule " + msg)   
    });   

    it('array filter', function(){

        var msg = "testMsg", log;

        //two modules
        UltiLogger.setFormat("{{moduleName}}: ");
        UltiLogger.setFilter({
            moduleName: ["foo", "bar"]
        });

        log = TestModule.error(msg)
        expect(log).to.not.be.ok();
        log = Foo.foo(msg);
        expect(log).to.eql("foo: " + msg)   
        log = Bar.bar(msg);
        expect(log).to.eql("bar: " + msg)   

        //two methods, 1 module
        UltiLogger.setFormat("{{moduleName}}:{{methodName}} ");
        UltiLogger.setFilter({
            moduleName: "testModule",
            methodName: ["info", "error"]
        });

        log = TestModule.warn(msg)
        expect(log).to.not.be.ok();
        log = TestModule.info(msg);
        expect(log).to.eql("testModule:info " + msg);
        log = TestModule.error(msg)
        expect(log).to.eql("testModule:error " + msg)   

        //two methods, two modules
        UltiLogger.setFormat("{{moduleName}}:{{methodName}} ");
        UltiLogger.setFilter({
            moduleName: ["foo", "bar"],
            methodName: ["foo", "bar"]
        });

        log = Foo.foo(msg);
        expect(log).to.eql("foo:foo " + msg) 
        log = Foo.bar(msg);
        expect(log).to.eql("foo:bar " + msg)
        log = Bar.foo(msg);
        expect(log).to.eql("bar:foo " + msg) 
        log = Bar.bar(msg);
        expect(log).to.eql("bar:bar " + msg) 
        log = Foo.fooBar(msg);
        expect(log).to.not.be.ok() 
    });   


    it('negative filter', function(){

        var msg = "testMsg", log;

        //not moduleName
        UltiLogger.setFormat("{{moduleName}}: ");
        UltiLogger.setFilter({
            moduleName: "!testModule"
        });
        log = TestModule.warn(msg)
        expect(log).to.not.be.ok();
        log = Foo.foo(msg)
        expect(log).to.eql("foo: " + msg);
        log = Bar.bar(msg)
        expect(log).to.eql("bar: " + msg);

        //neithter module
        UltiLogger.setFilter({
            moduleName: ["!foo", "!bar"]
        });
        log = TestModule.warn(msg)
        expect(log).to.eql("testModule: " + msg);
        log = Foo.foo(msg)
        expect(log).to.not.be.ok();
        log = Bar.bar(msg)
        expect(log).to.not.be.ok();

        //not method in a module
        UltiLogger.setFormat("{{moduleName}}:{{methodName}} ");
        UltiLogger.setFilter({
            moduleName: "foo",
            methodName: "!foo"
        });
        log = Foo.foo(msg)
        expect(log).to.not.be.ok();
        log = Bar.bar(msg)
        expect(log).to.not.be.ok();
        log = Foo.bar(msg)
        expect(log).to.eql("foo:bar " + msg);

        //neighter method in a module
        UltiLogger.setFilter({
            moduleName: "foo",
            methodName: ["!foo", "!bar"]
        });
        log = Foo.foo(msg)
        expect(log).to.not.be.ok();
        log = Foo.bar(msg)
        expect(log).to.not.be.ok();
        log = Foo.fooBar(msg)
        expect(log).to.eql("foo:fooBar " + msg);

        //neighter method in two module
        UltiLogger.setFilter({
            moduleName: ["foo", "bar"],
            methodName: ["!foo", "!bar"]
        });
        log = Foo.foo(msg)
        expect(log).to.not.be.ok();
        log = Foo.bar(msg)
        expect(log).to.not.be.ok();
        log = Bar.foo(msg)
        expect(log).to.not.be.ok();
        log = Bar.bar(msg)
        expect(log).to.not.be.ok();
        log = Foo.fooBar(msg)
        expect(log).to.eql("foo:fooBar " + msg);

    });

    it('enable/disable', function(){

        var msg = "testMsg", log;

        UltiLogger.setFormat("{{moduleName}}: ");
        log = Foo.foo(msg);        
        expect(log).to.eql("foo: " + msg);
        UltiLogger.disable();
        log = Foo.foo(msg);        
        expect(log).to.eql(msg);
        UltiLogger.enable();
        log = Foo.foo(msg);        
        expect(log).to.eql("foo: " + msg);
    });  
})
