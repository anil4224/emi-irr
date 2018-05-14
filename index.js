'use strict';

/**
 * Adds commas to a number
 * @param {number} number
 * @param {string} locale
 * @return {string}
 */
var FinanceCalc = function () {};

FinanceCalc.prototype.FLATEMICalc = function (principal, tenure, rateOfInterest) {
    var emiAmount = 0;
    rateOfInterest = Number(rateOfInterest);
    principal = Number(principal);
    tenure = Number(tenure);
    if (rateOfInterest > 0) {
        var interest = (principal * (tenure / 12) * rateOfInterest) / 100;
        emiAmount = (principal + interest) / tenure;
    } else {
        emiAmount = principal / tenure;
    }
    return Math.round(Math.ceil(emiAmount));
};

//Reference from: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]	
FinanceCalc.prototype.EffectiveEMICalc = function (loanAmount, tenure, interestRate) {
    var emiAmount;
    interestRate = Number(interestRate);
    loanAmount = Number(loanAmount);
    tenure = Number(tenure);
    if (interestRate > 0) {
        var intrPerMonth = interestRate / 1200;
        emiAmount = loanAmount * intrPerMonth / (1 - (Math.pow(1 / (1 + intrPerMonth), tenure)));
    } else {
        emiAmount = loanAmount / tenure;
    }
    return Math.ceil((emiAmount * 100) / 100);
}

/* FinanceCalc.prototype.IRRCalcMonthly = function (loanAmount, tenure, interestRate) {
    var emiAmount;
    interestRate = Number(interestRate);
    loanAmount = Number(loanAmount);
    tenure = Number(tenure);
    if (interestRate > 0) {
        var intrPerMonth = interestRate / 1200;
        emiAmount = loanAmount * intrPerMonth / (1 - (Math.pow(1 / (1 + intrPerMonth), tenure)));
    } else {
        emiAmount = loanAmount / tenure;
    }
    return Math.ceil((emiAmount * 100) / 100);
} */

FinanceCalc.prototype.IRRCalcYearly = function (loanAmount, loanTenure, rateOfInterest, rateType, advEMI) {
    var loanAmount = Number(loanAmount) || 0;
    var loanTenure = Number(loanTenure) || 0;
    var rateOfInterest = Number(rateOfInterest) || 0;
    var advEMI = Number(advEMI) || 0;
    var emi = 0;
    if (loanAmount > 0 && rateOfInterest > 0 && loanTenure > 0) {
        var monthlyIRR = IRRMainCalc(loanAmount, loanTenure, rateOfInterest, rateType, advEMI);

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

FinanceCalc.prototype.IRRCalcMonthly = function (loanAmount, loanTenure, rateOfInterest, rateType, advEMI) {
    var loanAmount = Number(loanAmount) || 0;
    var loanTenure = Number(loanTenure) || 0;
    var rateOfInterest = Number(rateOfInterest) || 0;
    var advEMI = Number(advEMI) || 0;
    if (loanAmount > 0 && rateOfInterest > 0 && loanTenure > 0) {
        var monthlyIRR = IRRMainCalc(loanAmount, loanTenure, rateOfInterest, rateType, advEMI);
        if (monthlyIRR) {
            monthlyIRR = parseFloat(monthlyIRR.toFixed(2));
            return monthlyIRR;
        }
    } else {
        console.log("entered data its not enough");
    }
}

function IRRMainCalc(loanAmount, loanTenure, rateOfInterest, rateType, advEMI) {
    try {
        var emi = 0;
        if (rateType == 'FLAT') {
            emi = FinanceCalc.prototype.FLATEMICalc(loanAmount, loanTenure, rateOfInterest);
        } else {
            emi = FinanceCalc.prototype.EffectiveEMICalc(loanAmount, loanTenure, rateOfInterest);
        }
        var emiArray = [];
        var loanAmtWithAdvEMIs;
        if (advEMI > 0) {
            loanAmtWithAdvEMIs = -Math.abs(loanAmount) + (emi * advEMI);
        } else {
            loanAmtWithAdvEMIs = -Math.abs(loanAmount);
        }
        emiArray.splice(0, 0, loanAmtWithAdvEMIs);
        if (loanTenure <= advEMI) {
            return null;
        }
        var loanEMICount = loanTenure - advEMI;
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

function PVCalc(money, interest, n) {
    return money / (Math.pow(1 + interest, n));
}

function IRRCalc(CArray) {
    let min = -1.0;
    let max = 1.0;
    let guess = (min + max) / 2;
    let lastGuess = 1.0
    let notSame = true
    let NPV = 0;
    do {
        NPV = 0;
        guess = (min + max) / 2;
        if (Math.abs(lastGuess - guess) < 0.0000000000000000001) notSame = false
        lastGuess = guess
        for (let j = 0; j < CArray.length; j++) {
            NPV += PVCalc(CArray[j], guess, j);
        }
        if (NPV > 0) {
            min = guess;
        } else {
            max = guess;
        }
    } while (notSame && (Math.abs(NPV) > 0.0000000000000000001));
    let raw = Number(guess * 100);
    return parseFloat(raw);
}



if (typeof exports !== 'undefined' && module.exports) {
    module.exports = FinanceCalc;
}