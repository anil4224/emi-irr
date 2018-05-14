# emi-irr

Flat or Effective EMI Calculation, Monthly or Annually Internal rate of return (IRR) Calculation

## Installation

```
npm install irr-emi --save
```

## Usage

```
var financeCalc = require('emi-irr');

var finance = new financeCalc();
```
/*
* @param {number} principal  //98000
* @param {number} tenure //24 (in months means 2 years)
* @param {number} interest // 11.22 rate of interest
* @return {number} 
*/
### For Flat EMI calcultion
```
finance.FLATEMICalc(98000, 24, 11.22);

EMI value we will get 5000/-
```


### For Effective EMI calcultion

```
finance.FLATEMICalc(98000, 24, 11.22);
// result
EMI value we will get 5000/-

var result = finance.EffectiveEMICalc(98000, 24, 11.22);
```
 // result
 Effective EMI value will get 4578/-


/**
 * Adds commas to a number
 * @param {number} principal //98000
 * @param {number} tenure //24 (in months means 2 years)
 * @param {number} interest //11.22
 * @param {string} rateType // 'FLAT' or 'EFFECTIVE' optional param (by default 'EFFECTIVE' rate of      interest will apply)
 * @param {number} advEMIs // like 0 or 1 ...
 * @return {number} 
 */
### Calculate IRR With Flat rate of Interest for Annum

```
var res = finance.IRRCalcYearly(98000, 24, 11.22, 'FLAT', 0);
// result
Will get IRR Yearly in ( % ) 
```
### Calc IRR With Flat rate of Interest for month
```
var res = finance.IRRCalcMonthly(98000, 24, 11.22, 'FLAT', 0);
// result
Will get IRR Yearly in ( % ) 
```
### Calc IRR With EFFECTIVE rate of Interest for Month

```
var res = finance.IRRCalcYearly(98000, 24, 11.22, 'EFFECTIVE', 0);
// result
Will get IRR Yearly in ( % ) 
```

### Calc IRR With EFFECTIVE rate of Interest for month

```
var res = finance.IRRCalcMonthly(98000, 24, 11.22, 'EFFECTIVE', 0);
// result
Will get IRR Yearly in ( % ) 
```

## Tests

```
`npm test`
```