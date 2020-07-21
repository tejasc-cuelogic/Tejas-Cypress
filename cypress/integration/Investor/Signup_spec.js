 import {
    
   gotoSignupscreen,

//   fillsignupform,

//   otpcode,

//   identity
  
 } from './Utility/basicSignup';


describe('Investor Sign up page launch', () => {

it ('visits signup page', () => {

  //cy.visit('/', { failOnStatusCode: false, timeout: 100000 });

  cy.visit('https://dev.nextseed.qa/')

console.log("This is home screen");

gotoSignupscreen();  

})


// it('should enter basic data', () => {

//    fillsignupform();
//  })


//  it ('Enter valid OTP',() => {

// otpcode();

// })


// it('It should enter identity verification data', () => {

//   identity();

// })


});

