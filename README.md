# ReasonToSue

ReasonToSue is an advanced web-based AI legal assistant that helps users understand their legal standing and potential case merit using state-of-the-art language models. Built with modern web technologies and hosted on Replit, this tool democratizes access to preliminary legal analysis.

## 🚀 Features

- **AI-Powered Legal Analysis**: Leverages Groq API's mixtral-8x7b-32768 model for sophisticated legal reasoning
- **Case Management**: Store and retrieve previous case analyses
- **User-Friendly Interface**: Clean, intuitive React-based frontend
- **Secure Data Handling**: PostgreSQL database with Neon.tech hosting
- **Real-time Processing**: Fast response times through Groq's high-performance API

## 🏗 Architecture

### Frontend (client/)
- React application with responsive design
- TanStack Query for efficient data fetching
- Tailwind CSS for styling
- Wouter for lightweight routing
- Components organized in a modular structure

### Backend (server/)
- Express server handling API routes:
  - POST /api/analyze: Processes legal cases through Groq AI
  - GET /api/cases/:id: Retrieves case details
- PostgreSQL database using Drizzle ORM
- Shared type definitions between frontend and backend

## 🔧 Technical Stack

- **Frontend**: React + TypeScript
- **Backend**: Express.js
- **Database**: PostgreSQL (Neon.tech)
- **ORM**: Drizzle
- **AI Integration**: Groq API (mixtral-8x7b-32768)
- **Styling**: Tailwind CSS + shadcn/ui
- **Hosting**: Replit

## 🌐 API Integration

ReasonToSue integrates with the Groq API to provide legal analysis:

1. User submits case details through the web interface
2. Backend formats the input and sends it to Groq's mixtral-8x7b-32768 model
3. AI generates comprehensive legal analysis
4. Results are stored in PostgreSQL and displayed to the user

## 🚀 Getting Started

1. Fork the project on Replit
2. Set up environment variables:
   - GROQ_API_KEY: Your Groq API key
   - DATABASE_URL: Your Neon PostgreSQL connection string
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## 📝 License

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💡 Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.