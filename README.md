git clone https://github.com/kianerfaan/ReasonToSue.com.git
cd reason-to-sue
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=your_postgresql_database_url
```

4. Push the database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔑 API Configuration

### GroqCloud Setup
1. Sign up for a GroqCloud account at https://console.groq.com
2. Generate an API key from the GroqCloud console
3. Add the API key to your `.env` file

## 📁 Project Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   └── pages/       # Page components
├── server/              # Backend Express application
│   ├── routes.ts        # API routes
│   └── storage.ts       # Data storage interface
├── shared/              # Shared types and schemas
│   └── schema.ts        # Zod schemas and types