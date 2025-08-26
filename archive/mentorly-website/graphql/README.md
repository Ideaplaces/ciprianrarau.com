# Mentorly GraphQL Schema

This directory contains the GraphQL schema for the Mentorly website, which must be kept in sync with the backend.

## Understanding Snake Case vs Camel Case

One of the most common issues when working with GraphQL between Ruby on Rails and JavaScript is the naming convention difference:

- **Backend (Ruby)**: Uses `snake_case` for field names
- **GraphQL/Frontend**: Uses `camelCase` for field names

The GraphQL spec automatically converts Ruby's `snake_case` to `camelCase` when exposing the API. This means:

| Ruby Backend        | GraphQL/Frontend   |
| ------------------- | ------------------ |
| `sentiment_summary` | `sentimentSummary` |
| `positive_themes`   | `positiveThemes`   |
| `created_at`        | `createdAt`        |

## Syncing the Schema

When changes are made to the backend GraphQL schema, you need to sync these changes to the frontend:

```bash
# Run the script to sync schema and check for issues
./scripts/sync-graphql-schema.sh
```

This script will:

1. Generate an updated schema from the backend
2. Move the schema files to the correct location
3. Generate TypeScript types
4. Check for common snake_case vs camelCase issues in your components

Alternatively, you can use the update-graphql.sh script with the --sync flag:

```bash
./scripts/update-graphql.sh --sync
```

## Checking for Issues Only

If you want to check for snake_case vs camelCase issues without updating the schema:

```bash
./scripts/sync-graphql-schema.sh --check-only
```

## Generating TypeScript Types Only

If you've made changes to your GraphQL queries in the frontend code but don't need to update the schema, run:

```bash
./scripts/update-graphql.sh
```

If you want it to watch for changes and regenerate automatically:

```bash
./scripts/update-graphql.sh --watch
```

## Common Issues and Solutions

### "Field doesn't exist on type" Error

If you see an error like:

```
Error loading X data: Field 'sentiment_summary' doesn't exist on type 'Y'
```

This usually means you're using the Ruby-style snake_case field name in your GraphQL query instead of the camelCase version.

To fix:

1. Check the schema.graphql file for the correct field name
2. Update your query to use camelCase
3. Update all references in your components

## Adding New Field Name Patterns

If you're working with new Ruby models that have snake_case fields, add them to the `SNAKE_CASE_FIELDS` array in `scripts/sync-graphql-schema.sh` to enable automatic detection.
