var assert = require("assert"),
    expect = require('expect.js'),
    UltiLogger = require("../lib/ultimate-logger");

describe('DBusConnector suite', function(){

    it('methods check', function(){

        expect(console.crit).to.be.ok();
        expect(console.error).to.be.ok();
        expect(console.warn).to.be.ok();
        expect(console.notice).to.be.ok();
        expect(console.info).to.be.ok();
        expect(console.debug).to.be.ok();

    });    

})
