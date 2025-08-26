require('ts-node').register({ transpileOnly: true })

// jest.config.js
const config = {
  collectCoverageFrom: ['components/**/*', 'lib/**/*'],
  modulePaths: ['<rootDir>'],
  testPathIgnorePatterns: ['<rootDir>/cypress/'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(scss|css|less)$': '<rootDir>/styleMock.js',
  },
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
    '\\.(gql|graphql)$': '@graphql-tools/jest-transform',
  },
}

module.exports = config
