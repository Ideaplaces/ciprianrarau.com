const preprocess = require('./preprocess')

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('file:preprocessor', preprocess)

  const configWithDotenv = require('dotenv').config({
    path: '.env.development',
  })
  if (configWithDotenv.error) {
    throw configWithDotenv.error
  }
  const env = { ...config.env, ...configWithDotenv.parsed }
  const result = { ...config, env }
  // do not forget to return the changed config object!

  return result
}
