import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from '@/graphql/resolvers';
import { NextRequest } from 'next/server';

// Read the schema file
const schemaPath = join(process.cwd(), 'src', 'graphql', 'schema.graphql');
const typeDefs = readFileSync(schemaPath, 'utf-8');

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection for GraphQL Playground
});

// Create and export the request handler
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
