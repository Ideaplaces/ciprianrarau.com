import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphql, print } from 'graphql'
import schemaString from 'graphql/schema.graphql'
import { MemberPageDocument } from 'types/graphql'

const schema = makeExecutableSchema({ typeDefs: schemaString })
const schemaWithMocks = addMocksToSchema({ schema })

const query = /* GraphQL */ `
  query currentUserTest {
    viewer {
      id
      name
    }
  }
`

describe('mockQuery call', () => {
  test(`explicit query should return`, () => {
    graphql({
      schema: schemaWithMocks,
      source: query,
    })
      .then((result) => {
        expect(result).toHaveProperty('data')
        expect(result).not.toHaveProperty('errors')
        expect(result?.data).toHaveProperty('viewer')
      })
      .catch((error) => console.error(error))
  })
  test(`imported codegen query with vars should work`, () => {
    graphql({
      schema: schema,
      source: print(MemberPageDocument),
      variableValues: { groupId: '1', userId: '1' },
    })
      .then((result) => {
        expect(result).toHaveProperty('data')
        expect(result).not.toHaveProperty('errors')
        expect(result?.data?.group).toHaveProperty('member')
      })
      .catch((error) => console.error(error))
  })
})
