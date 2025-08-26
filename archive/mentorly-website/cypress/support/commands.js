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
/* eslint-disable no-undef */
/// <reference types="Cypress" />

// -- This is a parent command --

Cypress.Commands.add('PMLogin', (token = Cypress.env('CYPRESS_PM_TOKEN')) => {
  cy.setCookie('token', token)
})

Cypress.Commands.add(
  'MenteeLogin',
  (token = Cypress.env('CYPRESS_MENTEE_TOKEN')) => {
    cy.setCookie('token', token)
  }
)

Cypress.Commands.add(
  'MentorLogin',
  (token = Cypress.env('CYPRESS_MENTOR_TOKEN')) => {
    cy.setCookie('token', token)
  }
)

// @TODO: try using API to login once, then store token to local storage
// Cypress.Commands.add('PMLogin', () => {
//   cy.request({
//     method: 'POST',
//     url: 'en/login',
//
//     body: {
//       email: Cypress.env('PM_username'),
//       password: Cypress.env('PM_password'),
//     },
//   })
//     .its('body')
//     .then((res) => {
//       cy.log(res)
//     })
// })
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
