# Mentorly Website

## Development Setup

### Prerequisites

- Node.js and npm
- Backend server running locally (see mentorly-backend README)

### Quick Start

1. Clone the repository
2. Copy environment template:

   ```bash
   cp .env.local.template .env.local
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   # Regular start (with GraphQL codegen)
   ./start.sh

   # Fast start (without GraphQL codegen)
   ./start-fast.sh
   ```

### Development Workflow

The application uses different npm scripts for different environments:

- `npm run dev:local`: Connect to local backend (http://localhost:3000)
- `npm run dev:staging`: Connect to staging server
- `npm run dev:production`: Connect to production server

### VS Code Setup

For the best development experience:

1. Open both frontend and backend projects in a single workspace
2. Arrange terminals side by side:
   - Left terminal: Backend (`./start.sh`)
   - Right terminal: Frontend (`./start.sh` or `./start-fast.sh` for faster startup without GraphQL codegen)

Both scripts will take care of starting all necessary services and watching for changes.

### Local Development URLs

The application uses subdomains for different tenants:

- Main home page: http://www.localtest.me:3010/
- Default development program: http://dev.localtest.me:3010/

### Environment Variables

The project uses `.env.local` for local development. A template is provided (`.env.local.template`) with the basic configuration:

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket URL for real-time features
- `PORT`: Frontend server port
- `HOST`: Host for local development (using localtest.me for subdomain support)

## Testing

### Storybook

Run the Storybook development environment:

```bash
npm run storybook
```

### Cypress

Run Cypress tests:

```bash
npx cypress open
```
