'use strict';

// /* eslint-disable no-param-reassign */

// module.exports.hello = function (context) {
//   context.log('JavaScript HTTP trigger function processed a request.');

//   context.res = {
//     // status: 200, /* Defaults to 200 */
//     body: 'Go Serverless v1.x! Your function executed successfully!',
//   };

//   context.done();
// };

const server = require('apollo-server-azure-functions');
const graphqlTools = require('graphql-tools');

const typeDefs = `
  type Random {
    id: Int!
    rand: String
  }

  type Query {
    rands: [Random]
    rand(id: Int!): Random
  }
`;

const rands = [{ id: 1, rand: 'random' }, { id: 2, rand: 'modnar' }];

const resolvers = {
  Query: {
    rands: () => rands,
    rand: (_, { id }) => rands.find(rand => rand.id === id),
  },
};

const schema = graphqlTools.makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports.run = function (context, request) {
  if (request.method === 'POST') {
    server.graphqlAzureFunctions({
      endpointURL: '/api/graphql',
    })(context, request);
  } else if (request.method === 'GET') {
    return server.graphiqlAzureFunctions({
      endpointURL: '/api/graphql',
    })(context, request);
  }
};
