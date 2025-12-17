# 🎓 Quiz Builder - Full Stack Web Application

A comprehensive quiz platform built with React and Node.js that allows users to create, share, and attempt quizzes with AI-powered features.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- Role-based access (Users & Quiz Owners)
- Protected routes and API endpoints

### 📝 Quiz Management (Owners)
- Create quizzes with multiple questions
- Edit and delete existing quizzes
- Set categories, difficulty levels, and time limits
- View quiz attempt statistics

### 🎯 Quiz Taking Experience (Users)
- Browse and filter quizzes by category/difficulty
- Real-time countdown timer
- Previous/Next question navigation
- Mark questions for review
- Visual progress tracking

### 🤖 AI-Powered Learning
- **OpenAI Integration** - Get detailed explanations for wrong answers
- **Smart Analysis** - AI identifies strengths and weaknesses
- **Personalized Insights** - Category-wise performance recommendations

### 📊 Progress Tracking & Analytics
- Interactive score graphs using Chart.js
- Category-wise performance metrics
- Historical attempt tracking
- Dashboard with comprehensive statistics

### 🎨 Modern UI/UX
- Fully responsive design
- Loading skeletons and smooth animations
- Toast notifications for user feedback
- Clean, intuitive interface

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- React Router DOM
- Axios + Chart.js
- React Toastify
- CSS3 (Responsive)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- OpenAI API Integration
- Express Validator + Rate Limiting

## 📁 Project Structure

```
quiz-builder/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   ├── attemptController.js
│   │   ├── progressController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── validator.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   ├── Attempt.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── attemptRoutes.js
│   │   ├── progressRoutes.js
│   │   └── aiRoutes.js
│   ├── utils/
│   │   └── seedDatabase.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── QuizCard.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useTimer.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── QuizList.jsx
│   │   │   ├── QuizAttempt.jsx
│   │   │   ├── QuizResult.jsx
│   │   │   ├── Progress.jsx
│   │   │   ├── Analysis.jsx
│   │   │   └── owner/
│   │   │       ├── OwnerQuizzes.jsx
│   │   │       ├── CreateQuiz.jsx
│   │   │       └── EditQuiz.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── quizService.js
│   │   │   ├── attemptService.js
│   │   │   ├── progressService.js
│   │   │   └── aiService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Backend
```bash
npm run dev      # Start development server
npm run start    # Start production server
npm run reset    # Reset database with sample data
npm run seed     # Seed database only
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🧪 Testing

- **Postman Collection** included (`Quiz_Builder_API.postman_collection.json`)
- **Sample Data** automatically seeded
- **Test Credentials** provided for immediate testing

## 🌟 Key Features Showcase

### For Quiz Takers:
- 🔍 **Smart Filtering** - Find quizzes by category, difficulty, or search
- ⏱️ **Timer Challenge** - Real-time countdown with visual indicators
- 🔖 **Review System** - Mark questions for later review
- 📈 **Progress Tracking** - Visual graphs of your improvement
- 🧠 **AI Insights** - Get personalized strength/weakness analysis

### For Quiz Creators:
- ✏️ **Easy Quiz Builder** - Intuitive interface for creating quizzes
- 📊 **Analytics Dashboard** - See how users perform on your quizzes
- 🎛️ **Full Control** - Edit, delete, and manage your content

### AI-Powered Learning:
- 🤖 **Wrong Answer Explanations** - AI explains why answers are incorrect
- 📊 **Performance Analysis** - AI identifies learning patterns
- 💡 **Study Recommendations** - Personalized improvement suggestions

## 🔒 Security Features

- JWT token authentication
- Role-based access control
- Input validation & sanitization
- Rate limiting protection
- CORS configuration
- Secure password handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI-powered explanations
- Chart.js for beautiful data visualizations
- React and Node.js communities

---

**⭐ Star this repository if you found it helpful!**

## 📊 Database Schema

### User
- name, email, password (hashed)
- role (user | owner)
- createdAt

### Quiz
- title, description, category, difficulty
- timeLimit, questions[], createdBy
- isSample, createdAt

### Attempt
- userId, quizId, selectedAnswers[]
- score, correctCount, wrongCount
- timeTaken, createdAt

### Progress
- userId, totalQuizzesAttempted
- overallAccuracy, categoryPerformance[]
- lastUpdated

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy from Git repository
3. Run seed command

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Set VITE_API_URL to production backend URL
3. Deploy dist folder

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update MONGODB_URI

## 📦 Dependencies

### Backend
- express, mongoose, bcryptjs, jsonwebtoken
- dotenv, cors, express-validator
- express-rate-limit, openai

### Frontend
- react, react-dom, react-router-dom
- axios, chart.js, react-chartjs-2
- react-toastify

