// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/// <reference types="Cypress" /> 

/// <reference types="cypress-xpath" />

// custom command for clicking on link using label

Cypress.Commands.add('clickLink', (label) => {
    cy.get('a').contains(label).click();
})

//Custom command for login
Cypress.Commands.add('loginByForm', (email, password) => {
    Cypress.log({
      name: 'loginByForm',
      message: `${email} | ${password}`,
    })
    return cy.request({
      method: 'POST',
      url: 'https://frx-wl-one.slashash.dev/api/users/login',
      form: true,
      body: {
        email,
        password,
      },
    })
  })