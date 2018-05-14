'use strict';

var expect = require('chai').expect;
var app = require('../index');
var should = require('chai').should();

describe('#EMICalculation and IRR calculation', function () {
    it('should convert flat EMI amount', function () {
        var finance = new app();
        var result = finance.FLATEMICalc(98000, 24, 11.22);
        expect(result).to.equal(5000);
    });

    it('should convert effective EMI amount', function () {
        var finance = new app();
        var res = finance.EffectiveEMICalc(98000, 24, 11.22);
        expect(res).to.equal(4578);
    });

    it('Calc IRR With Flat rate of Interest for Annum', function () {
        var finance = new app();
        var res = finance.IRRCalcYearly(98000, 24, 11.22, 'FLAT', 0);
        (res).should.be.within(22, 23); //22.25
    });

    it('Calc IRR With Flat rate of Interest for month', function () {
        var finance = new app();
        var res = finance.IRRCalcMonthly(98000, 24, 11.22, 'FLAT', 0);
        (res).should.be.within(1, 2); //1.69
    });

    it('Calc IRR With EFFECTIVE rate of Interest for Annum', function () {
        var finance = new app();
        var res = finance.IRRCalcYearly(98000, 24, 11.22, 'EFFECTIVE', 0);
        (res).should.be.within(11, 83); //11.83
    });

    it('Calc IRR With EFFECTIVE rate of Interest for Month', function () {
        var finance = new app();
        var res = finance.IRRCalcMonthly(98000, 24, 11.22, 'EFFECTIVE', 0);
        (res).should.be.within(0, 1); //0.94
    });
});