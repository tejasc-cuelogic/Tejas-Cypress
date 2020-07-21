import {
    
    gotoLandingPage,
    gotoLoginscreen

    
  } from './Utility/Login';


    describe ('Nextseed Login page', () => {

       it ('User appears on Landing page', () => {

         cy.visit('https://dev.nextseed.qa/');   

         gotoLandingPage();

       });

        it('User apprears on login screen' , () => {

            gotoLoginscreen()

        } )

        it('User changes email address', () => {

        })

  });