# Course Review & Recommendation Platform 🎓

> A comprehensive web application that helps students discover and choose online courses through authentic reviews and personalized recommendations. Think TripAdvisor for online courses.

![Angular](https://img.shields.io/badge/Angular-18-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Material](https://img.shields.io/badge/Angular_Material-18-purple?style=flat-square&logo=angular)

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)
- [Known Issues](#-known-issues)
- [Contact](#-contact)

---

## 🚀 Project Overview

This platform aggregates courses from multiple online learning platforms (Udemy, Coursera, edX) and provides a centralized place for students to:

- **Browse and search courses** across platforms
- **Read authentic reviews** from fellow learners
- **Get personalized course recommendations** based on interests
- **Share their own learning experiences** with the community

---

## ✨ Key Features

### 🎯 Core Functionality
- **Cross-Platform Course Catalog** - Browse courses from multiple providers
- **Authentic Review System** - Rate and review courses with detailed feedback
- **Smart Recommendations** - Get personalized course suggestions
- **Advanced Search & Filters** - Find courses by category, level, platform, price
- **User Profiles** - Track learning journey and manage reviews

### 💡 User Experience
- **Responsive Design** - Seamless experience on desktop and mobile
- **Modern UI** - Clean, intuitive interface with Material Design
- **Fast Performance** - Optimized loading and smooth interactions
- **Accessibility** - WCAG compliant design

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 18 | Modern TypeScript framework |
| **Angular Material** | 18 | UI component library (Blue/Azure theme) |
| **SCSS** | Latest | Enhanced CSS with variables and mixins |
| **RxJS** | Latest | Reactive programming for HTTP requests |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | Latest | Web application framework |
| **MongoDB** | Latest | NoSQL database for flexible data storage |
| **JWT** | Latest | Token-based authentication |

### Tools & Deployment
- **Git/GitHub** - Version control and code collaboration
- **Vercel** - Frontend deployment and hosting
- **Heroku** - Backend API deployment
- **Postman** - API testing and documentation

---

## 📋 Prerequisites

Before running this project, make sure you have:

```bash
Node.js 18.19.1+ or 20.11.1+ (LTS recommended)
npm 9+ or yarn 1.22+
Angular CLI 18+
Git for version control
```

**Check your versions:**
```bash
node --version
npm --version
ng version
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone git@github.com:tokimanana/watcher_front.git
cd watcher_front
```

### 2. Switch to Development Branch
```bash
git checkout -b dev
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Setup
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Course Review Platform'
};
```

### 5. Development Server
```bash
ng serve
```
Navigate to **http://localhost:4200**. The app will automatically reload when you change source files.

### 6. Build for Production
```bash
ng build --prod
```
The build artifacts will be stored in the `dist/` directory.

---

## 📁 Project Structure

```
src/app/
├── components/     # Reusable UI components
│   ├── header/
│   ├── course-card/
│   ├── review-card/
│   └── search-bar/
├── pages/         # Main application pages  
│   ├── home/
│   ├── course-catalog/
│   ├── course-detail/
│   ├── login/
│   └── profile/
├── services/      # HTTP services and business logic
│   ├── auth.service.ts
│   ├── course.service.ts
│   └── review.service.ts
├── models/        # TypeScript interfaces and types
│   ├── course.model.ts
│   ├── user.model.ts
│   └── review.model.ts
├── guards/        # Route protection and authentication
│   └── auth.guard.ts
└── shared/        # Utilities and common functionality
    ├── constants/
    └── utils/
```

---

## 📚 API Integration

This frontend application consumes a RESTful API that provides:
- **Course data management** 
- **User authentication and profiles**
- **Review and rating system**
- **Personalized recommendations**

API endpoints are configured through environment variables for different deployment stages (development, staging, production).

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** from dev (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request** to dev branch

### 📝 Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation updates
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

---

## 🐛 Known Issues

- Search functionality may be slow with large datasets
- Mobile responsiveness needs optimization for tablets  
- Review sorting options are limited

> **Note:** These issues are tracked and will be addressed in future releases.

---

## 👥 Team

**Developer:** tokimanana  
**Project Type:** Web Development Hackathon Submission  
**Timeline:** September 17-28, 2025

---

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Material Design team for the beautiful UI components
- Online learning community for inspiration
- Hackathon organizers for the opportunity

---

## 📞 Contact

For questions or feedback, please reach out:

| Platform | Link |
|----------|------|
| **Email** | tokimananasarobidy@gmail.com |
| **GitHub** | [@tokimanana](https://github.com/tokimanana) |
| **LinkedIn** | [Samuel Sarobidy](www.linkedin.com/in/samuel-sarobidy-70aa22282) |

---

<div align="center">

**Made with ❤️ for the learning community**

⭐ **Star this repo if you find it helpful!** ⭐

</div>
