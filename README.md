# Reason To Sue - AI Legal Assistant

A web-based AI legal assistant that leverages GroqCloud's Mixtral-8x7b-32768 model to provide preliminary legal analysis for potential legal claims. This application offers a user-friendly interface for submitting cases and receiving structured legal insights.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** (React Query v5) for server state management
- **React Hook Form** with Zod validation
- **Tailwind CSS** with shadcn/ui components
- **wouter** for lightweight routing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** with zod validation
- **GroqCloud API** integration using their official Node.js SDK

### Development Tools
- **ESBuild** for TypeScript/JavaScript compilation
- **PostCSS** with Autoprefixer
- **TypeScript** for static typing

## ✨ Key Features
- AI-powered legal analysis using GroqCloud's Mixtral-8x7b-32768 model
- Structured case submission process
- Responsive design for web accessibility
- Professional branding and UI/UX
- Type-safe frontend and backend
- Real-time form validation
- Efficient state management and caching

## 🛠 Setup Instructions

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- A GroqCloud API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/reason-to-sue.git
cd reason-to-sue
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

4. Start the development server:
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
```

## 🧪 Development Guidelines

### Type Safety
- Use TypeScript for all new code
- Define types in `shared/schema.ts`
- Use Zod for runtime validation

### API Requests
- Use TanStack Query for data fetching
- Handle loading and error states
- Implement proper cache invalidation

### Styling
- Use Tailwind CSS utility classes
- Leverage shadcn/ui components
- Follow the design system in `theme.json`

### Form Handling
- Use React Hook Form with Zod validation
- Implement proper error handling
- Show loading states during submissions

## 📝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License
This project is licensed under the Apache 2.0 - see the LICENSE file for details.
