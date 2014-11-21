var assert = require("assert"),
    expect = require('expect.js'),
    TestModule = require("./testModule.js"),
    UltiLogger = require("../lib/ultimate-logger");


(function(){
    console.__log = console.log;
    console.log = function() {
        console.__log.apply(console, arguments);
        return arguments[0];
    }    
})();


describe('DBusConnector suite', function(){

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

})
