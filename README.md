# 🎓 StudyBuddy - AI-Powered Student Companion

A comprehensive, professional-grade web application designed to revolutionize the way students learn, study, and manage their academic journey. Built with modern technologies and AI-powered features.

## 🌟 Features

### Core Features
- **🔐 Secure Authentication** - JWT-based authentication with password hashing
- **🎨 Modern UI/UX** - Responsive design with light/dark theme support
- **🤖 AI Study Tools** - Notes generator, quiz maker, flashcards creator
- **💬 Smart Chatbot** - AI-powered study assistant
- **📊 Progress Tracking** - Comprehensive study analytics
- **📱 Mobile Responsive** - Works perfectly on all devices

### Study Tools
- **📝 Notes Generator** - AI-powered comprehensive study notes
- **🎯 Quiz Maker** - Create custom quizzes with AI assistance
- **📚 Flashcards** - Interactive flashcard system with study mode
- **📊 Graph/Chart Generator** - Visual learning aids
- **🔍 Resource Library** - Curated study materials

### User Features
- **👤 Profile Management** - Complete user profile with avatar upload
- **📈 Study Analytics** - Track learning progress and achievements
- **🔄 Data Export/Import** - PDF, DOCX, CSV support
- **🔔 Notifications** - Study reminders and updates
- **🎙️ Voice Features** - Read-aloud functionality for notes

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Cloudinary** - Image storage

### AI Integration
- **OpenAI API** - GPT models for content generation
- **Custom AI Config** - Configurable AI settings

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd studybuddy-ai
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**
```bash
# In backend directory, create .env file
cp env.example .env
# Edit .env with your configuration
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/studybuddy-ai

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=5000
```

### Running the Application

1. **Start MongoDB** (if using local)
```bash
mongod
```

2. **Start the backend server**
```bash
cd backend
npm start
```

3. **Start the frontend development server**
```bash
cd frontend
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api

## 📁 Project Structure

```
studybuddy-ai/
├── backend/
│   ├── config/
│   │   └── aiConfig.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── ChatMessage.js
│   │   ├── Flashcard.js
│   │   ├── Quiz.js
│   │   ├── StudyNote.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── flashcardRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── resourceRoutes.js
│   │   └── studyNoteRoutes.js
│   ├── utils/
│   │   └── cloudinary.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── Flashcards.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotesGenerator.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── QuizMaker.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Study Notes
- `GET /api/notes` - Get user's notes
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Quizzes
- `GET /api/quizzes` - Get user's quizzes
- `POST /api/quizzes` - Create new quiz
- `GET /api/quizzes/:id` - Get specific quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

### Flashcards
- `GET /api/flashcards` - Get user's flashcards
- `POST /api/flashcards` - Create new flashcard set
- `GET /api/flashcards/:id` - Get specific flashcard set
- `PUT /api/flashcards/:id` - Update flashcard set
- `DELETE /api/flashcards/:id` - Delete flashcard set

### Chat
- `GET /api/chat` - Get chat history
- `POST /api/chat` - Send message
- `DELETE /api/chat/:id` - Delete message

### Resources
- `GET /api/resources` - Get study resources
- `GET /api/resources/:id` - Get specific resource
- `GET /api/resources/search` - Search resources

## 🎯 Usage Guide

### For Students
1. **Sign up** for a new account or **log in**
2. **Create your profile** with avatar and preferences
3. **Generate study notes** on any topic using AI
4. **Create quizzes** to test your knowledge
5. **Make flashcards** for memorization
6. **Chat with AI** for instant help
7. **Track your progress** with analytics

### For Educators
1. **Create custom quizzes** for your students
2. **Share study materials** through the platform
3. **Monitor student progress** (future feature)
4. **Generate lesson plans** using AI tools

## 🎨 Features in Detail

### AI Notes Generator
- Input any topic and get comprehensive notes
- Choose difficulty level (beginner, intermediate, advanced)
- Select subject area
- Export as PDF, DOCX, or Markdown
- Save to personal library

### Quiz Maker
- Create custom quizzes with multiple question types
- AI-generated questions based on topic
- Set difficulty levels and time limits
- Track performance and scores
- Share quizzes with others

### Flashcards
- Create interactive flashcard sets
- Study mode with flip animations
- Track learning progress
- Spaced repetition algorithm
- Import/export functionality

### Profile Management
- Upload profile picture
- Update personal information
- View study statistics
- Manage saved content
- Privacy settings

## 🔧 Development

### Adding New Features
1. Create model in `backend/models/`
2. Add routes in `backend/routes/`
3. Create component in `frontend/src/components/`
4. Update navigation in `frontend/src/components/Navbar.jsx`
5. Add route in `frontend/src/App.jsx`

### Code Style
- Use ESLint for JavaScript linting
- Follow React best practices
- Use meaningful component names
- Add comments for complex logic
- Maintain consistent formatting

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Ensure MongoDB is running
mongod

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/studybuddy-ai
```

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm start
```

**CORS Issues**
- Ensure backend is running on correct port
- Check CORS configuration in server.js

## 📈 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Bundle size monitoring
- Service worker for caching

### Backend
- Database indexing
- Request rate limiting
- Response compression
- Error handling middleware

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Secure file uploads

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Set environment variables
git push heroku main
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT integration
- MongoDB for database
- TailwindCSS for styling
- Lucide React for icons
- Vite for build tooling

## 📞 Support

For support, email support@studysphere.com or join our Discord server.

---

**StudySphere** - Empowering students to learn smarter, not harder.
