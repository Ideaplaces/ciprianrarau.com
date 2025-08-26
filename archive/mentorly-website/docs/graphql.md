# GraphQL Schema Management

This document explains how to manage the GraphQL schema in the Mentorly application.

## Overview

The Mentorly application uses GraphQL for communication between the frontend and backend. The GraphQL schema is defined in the backend (Ruby on Rails) and needs to be synchronized with the frontend (Next.js) to ensure type safety and proper integration.

## Workflow

The typical workflow for GraphQL schema management is:

1. Make changes to the GraphQL schema in the backend (Ruby on Rails)
2. Generate the updated schema file using the rake task
3. Copy the schema file to the frontend
4. Generate TypeScript types based on the updated schema
5. Check for any snake_case vs camelCase issues

## Available Scripts

We have several scripts to automate this process:

### Backend Scripts

- `bundle exec rake graphql:schema:dump` - Generates the GraphQL schema JSON in the backend
- `npm run graphql:schema` - Same as above but as an npm script

### Frontend Scripts

- `npm run graphql:sync` - Syncs the schema from backend to frontend and updates TypeScript types
- `npm run graphql:check` - Checks for snake_case vs camelCase issues without updating the schema
- `npm run graphql:update` - Updates TypeScript types based on the current schema
- `npm run graphql:update:watch` - Same as above but in watch mode (continuously updates)
- `npm run graphql:full-sync` - Performs a complete sync workflow (backend to frontend)

## Common Issues

### snake_case vs camelCase

One of the most common issues when working with GraphQL between Ruby on Rails and JavaScript is the naming convention difference:

- **Backend (Ruby)**: Uses `snake_case` for field names
- **GraphQL/Frontend**: Uses `camelCase` for field names

The GraphQL spec automatically converts Ruby's `snake_case` to `camelCase` when exposing the API. This means:

| Ruby Backend        | GraphQL/Frontend   |
| ------------------- | ------------------ |
| `sentiment_summary` | `sentimentSummary` |
| `positive_themes`   | `positiveThemes`   |
| `created_at`        | `createdAt`        |

Our scripts check for this issue and warn you if you're using snake_case in your frontend code.

### Schema Synchronization

If you're experiencing issues with GraphQL queries failing, it might be because the schema in the frontend is out of sync with the backend. Run `npm run graphql:full-sync` to perform a complete sync.

## Updating After Schema Changes

After making changes to the GraphQL schema in the backend:

1. Navigate to the project root
2. Run `npm run graphql:full-sync` from the frontend directory
3. This will update the schema and generate new TypeScript types
4. Verify that your queries are using the correct field names (camelCase)
5. Run tests to ensure everything is working as expected

## Manual Process

If you need to perform the process manually:

1. Go to backend directory: `cd mentorly-backend`
2. Generate schema: `bundle exec rake graphql:schema:dump`
3. Go to frontend directory: `cd ../mentorly-website`
4. Generate TypeScript types: `npm run graphql-codegen`
5. Check for issues: `./scripts/sync-graphql-schema.sh --check-only`
