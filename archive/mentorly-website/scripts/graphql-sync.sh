#!/bin/bash

# graphql-sync.sh - Consolidated script for GraphQL schema and code generation
# Usage: 
#   ./scripts/graphql-sync.sh         - Full sync (schema + types generation)
#   ./scripts/graphql-sync.sh --check - Check for issues only, don't update files
#   ./scripts/graphql-sync.sh --types - Only generate TypeScript types from existing schema
#   ./scripts/graphql-sync.sh --watch - Watch mode for TypeScript generation

set -e # Exit on any error

# Navigate to the root of the website project
cd "$(dirname "$0")/.."
WEBSITE_DIR=$(pwd)

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Common snake_case fields to detect in queries
SNAKE_CASE_FIELDS=(
  "created_at"
  "updated_at"
  "sentiment_summary"
  "positive_themes"
  "negative_themes"
  "neutral_themes"
  "knowledge_gaps"
  "user_goals"
  "emerging_themes"
)

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}       MENTORLY GRAPHQL SYNC UTILITY     ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Parse command line arguments
CHECK_ONLY=false
TYPES_ONLY=false
WATCH_MODE=false

case "$1" in
  --check)
    CHECK_ONLY=true
    echo -e "${YELLOW}Running in check-only mode. Will not update files.${NC}"
    ;;
  --types)
    TYPES_ONLY=true
    echo -e "${YELLOW}Running in types-only mode. Will not update schema from backend.${NC}"
    ;;
  --watch)
    WATCH_MODE=true
    TYPES_ONLY=true
    echo -e "${YELLOW}Running in watch mode. Will regenerate types on changes.${NC}"
    ;;
esac

# Function to check for snake_case fields in component files
check_snake_case_fields() {
  echo -e "${GREEN}Checking for snake_case field usage in GraphQL queries...${NC}"
  
  FOUND_ISSUES=false
  
  for field in "${SNAKE_CASE_FIELDS[@]}"; do
    # Find all occurrences in .js, .jsx, .ts, .tsx files
    GREP_RESULTS=$(grep -r "$field" --include="*.{js,jsx,ts,tsx}" ./components ./pages ./lib 2>/dev/null || true)
    
    if [ -n "$GREP_RESULTS" ]; then
      echo -e "${RED}Found potential snake_case field usage: ${NC}$field"
      echo "$GREP_RESULTS" | head -5 # Show first 5 results
      LINES_COUNT=$(echo "$GREP_RESULTS" | wc -l)
      if [ $LINES_COUNT -gt 5 ]; then
        echo "...and $(($LINES_COUNT - 5)) more occurrences."
      fi
      echo ""
      FOUND_ISSUES=true
    fi
  done
  
  if [ "$FOUND_ISSUES" == "true" ]; then
    echo -e "${YELLOW}Warning: Potential snake_case fields found. These should be converted to camelCase in GraphQL queries.${NC}"
    echo "For example, use 'sentimentSummary' instead of 'sentiment_summary'."
    echo ""
  else
    echo -e "${GREEN}✅ No snake_case field issues detected.${NC}"
  fi
}

# Step 1: Update schema from backend (if not in types-only mode)
if [ "$TYPES_ONLY" == "false" ]; then
  echo -e "${GREEN}Step 1: Generating GraphQL schema from backend...${NC}"
  
  # Navigate to the backend directory
  cd ../mentorly-backend
  
  # Use the rake task to generate the IDL schema
  bundle exec rake graphql:schema:dump_idl_only
  
  echo -e "${YELLOW}✅ Schema generated${NC}"
  
  # Navigate back to website directory
  cd "$WEBSITE_DIR"
  
  if [ "$CHECK_ONLY" == "false" ]; then
    echo -e "${GREEN}Step 2: Checking for schema changes...${NC}"
    CHANGES=$(git diff graphql/schema.graphql 2>/dev/null || echo "New file")
    
    if [ -z "$CHANGES" ]; then
      echo -e "${YELLOW}No schema changes detected.${NC}"
    else
      echo -e "${YELLOW}Schema changes detected!${NC}"
    fi
  fi
fi

# Step 3: Generate TypeScript types (if not in check-only mode)
if [ "$CHECK_ONLY" == "false" ]; then
  echo -e "${GREEN}Step 3: Generating TypeScript types from schema...${NC}"
  
  # Temporarily modify codegen.yml to use local schema
  sed -i.bak 's/# schema: .\/graphql\/schema.graphql/schema: .\/graphql\/schema.graphql/' codegen.yml
  sed -i.bak 's/schema: \${SCHEMA_PATH:.*}/# schema: \${SCHEMA_PATH:https:\/\/api2.mentorly.co\/graphql}/' codegen.yml
  
  if [ "$WATCH_MODE" == "true" ]; then
    echo -e "${YELLOW}🔄 Running in watch mode. Press Ctrl+C to stop.${NC}"
    npm run graphql-codegen -- --watch
  else
    npm run graphql-codegen
    echo -e "${GREEN}✅ TypeScript types generated successfully.${NC}"
  fi
  
  # Restore original codegen.yml
  mv codegen.yml.bak codegen.yml
fi

# Step 4: Check for common issues
if [ "$WATCH_MODE" == "false" ]; then
  echo -e "${GREEN}Step 4: Checking for common issues...${NC}"
  check_snake_case_fields
  
  # Clean up any existing schema.json files
  if [ -f "graphql/schema.json" ]; then
    echo -e "${YELLOW}Removing schema.json as it's not needed...${NC}"
    rm graphql/schema.json
  fi
  
  echo -e "${GREEN}=========================================${NC}"
  echo -e "${GREEN}GraphQL sync process completed!${NC}"
  echo -e "${GREEN}=========================================${NC}"
  
  if [ "$CHECK_ONLY" == "false" ] && [ "$TYPES_ONLY" == "false" ]; then
    echo -e "Next steps:"
    echo -e "1. Review any schema changes in 'graphql/schema.graphql'"
    echo -e "2. Check the generated types in 'types/graphql.ts'"
    echo -e "3. Fix any snake_case vs camelCase issues reported above"
    echo -e "4. Run tests to verify everything works correctly"
  fi
fi 