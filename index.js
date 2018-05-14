'use strict';

var FinanceCalc = function () {};

/**
 * Adds commas to a number
 * @param {number} principal
 * @param {number} tenure
 * @param {number} interest
 * @return {number} 
 */

FinanceCalc.prototype.FLATEMICalc = function (principal, tenure, interest) {
    var emiAmount = 0;
    interest = Number(interest);
    principal = Number(principal);
    tenure = Number(tenure);
    if (interest > 0) {
        var interest = (principal * (tenure / 12) * interest) / 100;
        emiAmount = (principal + interest) / tenure;
    } else {
        emiAmount = principal / tenure;
    }
    return Math.round(Math.ceil(emiAmount));
};

/**
 * Adds commas to a number
 * @param {number} principal
 * @param {number} tenure
 * @param {number} interest
 * @return {number} 
 */
//Reference from: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]	
FinanceCalc.prototype.EffectiveEMICalc = function (principal, tenure, interest) {
    var emiAmount;
    interest = Number(interest);
    principal = Number(principal);
    tenure = Number(tenure);
    if (interest > 0) {
        var intrPerMonth = interest / 1200;
        emiAmount = principal * intrPerMonth / (1 - (Math.pow(1 / (1 + intrPerMonth), tenure)));
    } else {
        emiAmount = principal / tenure;
    }
    return Math.ceil((emiAmount * 100) / 100);
}

/**
 * Adds commas to a number
 * @param {number} principal
 * @param {number} tenure
 * @param {number} interest
 * @param {string} rateType
 * @param {number} advEMIs
 * @return {number} 
 */
FinanceCalc.prototype.IRRCalcYearly = function (principal, tenure, interest, rateType, advEMIs) {
    var principal = Number(principal) || 0;
    var tenure = Number(tenure) || 0;
    var interest = Number(interest) || 0;
    var advEMIs = Number(advEMIs) || 0;
    var emi = 0;
    if (principal > 0 && interest > 0 && tenure > 0) {
        var monthlyIRR = IRRMainCalc(principal, tenure, interest, rateType, advEMIs);

        if (monthlyIRR) {
            var yearlyIRRPer = Math.pow((1 + (monthlyIRR / 100)), 12) - 1;
            var annualIRR = yearlyIRRPer * 100;
            annualIRR = parseFloat(annualIRR.toFixed(2));
            return annualIRR;
        }
    } else {
        console.log("entered data its not enough");
    }
}

/**
 * Adds commas to a number
 * @param {number} principal
 * @param {number} tenure
 * @param {number} interest
 * @param {string} rateType
 * @param {number} advEMIs
 * @return {number} 
 */
FinanceCalc.prototype.IRRCalcMonthly = function (principal, tenure, interest, rateType, advEMIs) {
    var principal = Number(principal) || 0;
    var tenure = Number(tenure) || 0;
    var interest = Number(interest) || 0;
    var advEMIs = Number(advEMIs) || 0;
    if (principal > 0 && interest > 0 && tenure > 0) {
        var monthlyIRR = IRRMainCalc(principal, tenure, interest, rateType, advEMIs);
        if (monthlyIRR) {
            monthlyIRR = parseFloat(monthlyIRR.toFixed(2));
            return monthlyIRR;
        }
    } else {
        console.log("entered data its not enough");
    }
}

/**
 * Adds commas to a number
 * @param {number} principal
 * @param {number} tenure
 * @param {number} interest
 * @param {string} rateType
 * @param {number} advEMIs
 * @return {number} 
 */

function IRRMainCalc(principal, tenure, interest, rateType, advEMIs) {
    try {
        var emi = 0;
        if (rateType == 'FLAT') {
            emi = FinanceCalc.prototype.FLATEMICalc(principal, tenure, interest);
        } else {
            emi = FinanceCalc.prototype.EffectiveEMICalc(principal, tenure, interest);
        }
        var emiArray = [];
        var loanAmtWithAdvEMIs;
        if (advEMIs > 0) {
            loanAmtWithAdvEMIs = -Math.abs(principal) + (emi * advEMIs);
        } else {
            loanAmtWithAdvEMIs = -Math.abs(principal);
        }
        emiArray.splice(0, 0, loanAmtWithAdvEMIs);
        if (tenure <= advEMIs) {
            return null;
        }
        var loanEMICount = tenure - advEMIs;
        while (loanEMICount > 0) {
            emiArray.push(emi);
            loanEMICount--;
        }
        try {
            if (emiArray.length >= 2)
                return IRRCalc(emiArray);
        } catch (e) {
            console.log(e);
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Adds commas to a number
 * @param {number} money
 * @param {number} interest
 * @param {number} n
 * @return {number} 
 */
function PVCalc(money, interest, n) {
    return money / (Math.pow(1 + interest, n));
}

/**
 * Adds commas to a number
 * @param {Array<number>} CArray
 * @return {number} 
 */
function IRRCalc(CArray) {
    var min = -1.0;
    var max = 1.0;
    var guess = (min + max) / 2;
    var lastGuess = 1.0
    var notSame = true
    var NPV = 0;
    do {
        NPV = 0;
        guess = (min + max) / 2;
        if (Math.abs(lastGuess - guess) < 0.0000000000000000001) notSame = false
        lastGuess = guess
        for (var j = 0; j < CArray.length; j++) {
            NPV += PVCalc(CArray[j], guess, j);
        }
        if (NPV > 0) {
            min = guess;
        } else {
            max = guess;
        }
    } while (notSame && (Math.abs(NPV) > 0.0000000000000000001));
    var raw = Number(guess * 100);
    return parseFloat(raw);
}

if (typeof exports !== 'undefined' && module.exports) {
    module.exports = FinanceCalc;
}