1. Set Database URL and API Key DATABASE_URL=postgresql://user:password@host:port/database

GROQ_API_KEY=your_groq_api_key
   ```

3. Install Dependencies:
   ```bash
   npm install
   ```

4. Database Setup:
   ```bash
   npm run db:push
   ```

5. Start Development Server:
   ```bash
   npm run dev
   ```
   Serves both frontend and backend on port 5000.

## API Endpoints

### Get Recent Queries
```typescript
GET /api/tariff/recent
Response: TariffQuery[]
```

### Submit Tariff Query
```typescript
POST /api/tariff/query
Body: {
  importerCountry: string;
  exporterCountry: string;
  productDescription: string;
}
Response: TariffQuery
```

### Submit Feedback
```typescript
POST /api/tariff/feedback
Body: {
  queryId: number;
  isPositive: boolean;
}
```

## Project Structure
```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utilities and API clients
│   │   └── pages/      # Route components
├── server/             # Backend Express server
│   ├── routes.ts      # API endpoints
│   ├── storage.ts     # Database operations
│   └── db.ts         # Database configuration
└── shared/            # Shared TypeScript types and utilities