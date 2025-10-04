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
| **Angular** | 18.2.0 | Modern TypeScript framework |
| **Angular Material** | 18.2.14 | UI component library (Blue/Azure theme) |
| **RxJS** | 7.8.0 | Reactive programming for HTTP requests |

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
# Course Review Frontend - Feature-Based Architecture

course-review-frontend/
├── angular.json                    # Angular workspace config
├── package.json                    # Dependencies
├── package-lock.json
├── tsconfig.json                   # TypeScript config
├── tsconfig.app.json
├── tsconfig.spec.json
├── karma.conf.js                   # Test config
├── .gitignore
├── README.md
└── src/
    ├── index.html                  # Main HTML
    ├── main.ts                     # App bootstrap
    ├── styles.scss                 # Global styles entry point
    ├── favicon.ico
    ├── assets/
    │   ├── images/
    │   │   ├── logo.png
    │   │   ├── hero-background.jpg
    │   │   ├── default-course.jpg
    │   │   └── platforms/
    │   │       ├── udemy-icon.png
    │   │       ├── youtube-icon.png
    │   │       ├── freecodecamp-icon.png
    │   │       └── coursera-icon.png
    │   ├── icons/
    │   │   ├── star-filled.svg
    │   │   ├── star-empty.svg
    │   │   ├── click-icon.svg
    │   │   └── tech-icons/
    │   │       ├── angular.svg
    │   │       ├── react.svg
    │   │       ├── nodejs.svg
    │   │       └── javascript.svg
    │   └── styles/                 # SCSS architecture
    │       ├── _variables.scss     # CSS custom properties & theme variables
    │       ├── _mixins.scss        # SCSS mixins for components & themes
    │       ├── _base.scss          # Reset, typography, base elements
    │       ├── _components.scss    # Component-specific styles
    │       └── _utilities.scss     # Utility classes (spacing, colors, layout)
    ├── environments/
    │   ├── environment.ts          
    │   └── environment.prod.ts     
    └── app/
        ├── app.component.html      # Root component template
        ├── app.component.scss      # Root component styles
        ├── app.component.ts        # Root component logic
        ├── app.component.spec.ts   # Root component tests
        ├── app.config.ts           # App configuration with providers
        ├── app.routes.ts           # Main routing config
        │
        ├── core/                   # Singleton services, guards, interceptors
        │   ├── models/             # Domain models (shared across features)
        │   │   ├── user.model.ts
        │   │   ├── course.model.ts
        │   │   ├── review.model.ts
        │   │   ├── api-response.model.ts
        │   │   ├── search-params.model.ts
        │   │   ├── auth-response.model.ts
        │   │   └── pagination.model.ts
        │   ├── services/           # Core singleton services
        │   │   ├── base-api.service.ts     # Base HTTP service
        │   │   ├── storage.service.ts      # LocalStorage wrapper
        │   │   └── notification.service.ts # Global notifications
        │   ├── guards/
        │   │   ├── auth.guard.ts
        │   │   ├── auth.guard.spec.ts
        │   │   └── no-auth.guard.ts
        │   ├── interceptors/
        │   │   ├── auth.interceptor.ts
        │   │   ├── loading.interceptor.ts
        │   │   ├── error.interceptor.ts
        │   │   └── mock.interceptor.ts
        │   ├── constants/
        │   │   ├── api-endpoints.ts
        │   │   ├── app-constants.ts
        │   │   ├── storage-keys.ts
        │   │   ├── technologies.ts
        │   │   └── platforms.ts
        │   └── utils/
        │       ├── validators.ts
        │       ├── helpers.ts
        │       ├── date.utils.ts
        │       └── array.utils.ts
        │
        ├── shared/                 # Reusable UI components, pipes, directives
        │   ├── components/
        │   │   ├── layout/
        │   │   │   ├── header/
        │   │   │   │   ├── header.component.html
        │   │   │   │   ├── header.component.scss
        │   │   │   │   ├── header.component.ts
        │   │   │   │   └── header.component.spec.ts
        │   │   │   ├── footer/
        │   │   │   │   ├── footer.component.html
        │   │   │   │   ├── footer.component.scss
        │   │   │   │   ├── footer.component.ts
        │   │   │   │   └── footer.component.spec.ts
        │   │   │   ├── sidebar/
        │   │   │   │   ├── sidebar.component.html
        │   │   │   │   ├── sidebar.component.scss
        │   │   │   │   ├── sidebar.component.ts
        │   │   │   │   └── sidebar.component.spec.ts
        │   │   │   └── main-layout/
        │   │   │       ├── main-layout.component.html
        │   │   │       ├── main-layout.component.scss
        │   │   │       ├── main-layout.component.ts
        │   │   │       └── main-layout.component.spec.ts
        │   │   └── ui/             # Generic UI components
        │   │       ├── loading-spinner/
        │   │       │   ├── loading-spinner.component.html
        │   │       │   ├── loading-spinner.component.scss
        │   │       │   ├── loading-spinner.component.ts
        │   │       │   └── loading-spinner.component.spec.ts
        │   │       ├── error-message/
        │   │       │   ├── error-message.component.html
        │   │       │   ├── error-message.component.scss
        │   │       │   ├── error-message.component.ts
        │   │       │   └── error-message.component.spec.ts
        │   │       ├── confirmation-dialog/
        │   │       │   ├── confirmation-dialog.component.html
        │   │       │   ├── confirmation-dialog.component.scss
        │   │       │   ├── confirmation-dialog.component.ts
        │   │       │   └── confirmation-dialog.component.spec.ts
        │   │       ├── pagination/
        │   │       │   ├── pagination.component.html
        │   │       │   ├── pagination.component.scss
        │   │       │   ├── pagination.component.ts
        │   │       │   └── pagination.component.spec.ts
        │   │       └── star-rating/      # Moved from review feature (reusable)
        │   │           ├── star-rating.component.html
        │   │           ├── star-rating.component.scss
        │   │           ├── star-rating.component.ts
        │   │           └── star-rating.component.spec.ts
        │   ├── pipes/
        │   │   ├── truncate.pipe.ts
        │   │   ├── difficulty-color.pipe.ts
        │   │   ├── platform-icon.pipe.ts
        │   │   ├── time-ago.pipe.ts
        │   │   └── tech-icon.pipe.ts
        │   ├── directives/
        │   │   ├── lazy-load-image.directive.ts
        │   │   ├── click-track.directive.ts
        │   │   ├── auto-focus.directive.ts
        │   │   └── tooltip.directive.ts
        │   └── validators/
        │       ├── custom-validators.ts
        │       ├── async-validators.ts
        │       └── email-validator.ts
        │
        └── features/               # Business domain features
            ├── auth/               # Authentication & User Registration
            │   ├── auth.routes.ts
            │   ├── components/
            │   │   ├── login/
            │   │   │   ├── login.component.html
            │   │   │   ├── login.component.scss
            │   │   │   ├── login.component.ts
            │   │   │   └── login.component.spec.ts
            │   │   ├── register/
            │   │   │   ├── register.component.html
            │   │   │   ├── register.component.scss
            │   │   │   ├── register.component.ts
            │   │   │   └── register.component.spec.ts
            │   │   ├── tech-interests-setup/
            │   │   │   ├── tech-interests-setup.component.html
            │   │   │   ├── tech-interests-setup.component.scss
            │   │   │   ├── tech-interests-setup.component.ts
            │   │   │   └── tech-interests-setup.component.spec.ts
            │   │   └── forgot-password/
            │   │       ├── forgot-password.component.html
            │   │       ├── forgot-password.component.scss
            │   │       ├── forgot-password.component.ts
            │   │       └── forgot-password.component.spec.ts
            │   └── services/
            │       ├── auth.service.ts
            │       └── auth-state.service.ts
            │
            ├── home/               # Landing page & dashboard
            │   ├── home.routes.ts
            │   ├── components/
            │   │   ├── home/
            │   │   │   ├── home.component.html
            │   │   │   ├── home.component.scss
            │   │   │   ├── home.component.ts
            │   │   │   └── home.component.spec.ts
            │   │   ├── hero-section/
            │   │   │   ├── hero-section.component.html
            │   │   │   ├── hero-section.component.scss
            │   │   │   ├── hero-section.component.ts
            │   │   │   └── hero-section.component.spec.ts
            │   │   ├── recommendations-section/
            │   │   │   ├── recommendations-section.component.html
            │   │   │   ├── recommendations-section.component.scss
            │   │   │   ├── recommendations-section.component.ts
            │   │   │   └── recommendations-section.component.spec.ts
            │   │   ├── popular-courses-section/
            │   │   │   ├── popular-courses-section.component.html
            │   │   │   ├── popular-courses-section.component.scss
            │   │   │   ├── popular-courses-section.component.ts
            │   │   │   └── popular-courses-section.component.spec.ts
            │   │   ├── featured-section/
            │   │   │   ├── featured-section.component.html
            │   │   │   ├── featured-section.component.scss
            │   │   │   ├── featured-section.component.ts
            │   │   │   └── featured-section.component.spec.ts
            │   │   └── stats-section/
            │   │       ├── stats-section.component.html
            │   │       ├── stats-section.component.scss
            │   │       ├── stats-section.component.ts
            │   │       └── stats-section.component.spec.ts
            │   └── services/
            │       └── home.service.ts
            │
            ├── courses/            # Course discovery & browsing
            │   ├── courses.routes.ts
            │   ├── components/
            │   │   ├── course-catalog/
            │   │   │   ├── course-catalog.component.html
            │   │   │   ├── course-catalog.component.scss
            │   │   │   ├── course-catalog.component.ts
            │   │   │   └── course-catalog.component.spec.ts
            │   │   ├── course-detail/
            │   │   │   ├── course-detail.component.html
            │   │   │   ├── course-detail.component.scss
            │   │   │   ├── course-detail.component.ts
            │   │   │   └── course-detail.component.spec.ts
            │   │   ├── course-card/
            │   │   │   ├── course-card.component.html
            │   │   │   ├── course-card.component.scss
            │   │   │   ├── course-card.component.ts
            │   │   │   └── course-card.component.spec.ts
            │   │   ├── course-grid/
            │   │   │   ├── course-grid.component.html
            │   │   │   ├── course-grid.component.scss
            │   │   │   ├── course-grid.component.ts
            │   │   │   └── course-grid.component.spec.ts
            │   │   ├── course-filters/
            │   │   │   ├── course-filters.component.html
            │   │   │   ├── course-filters.component.scss
            │   │   │   ├── course-filters.component.ts
            │   │   │   └── course-filters.component.spec.ts
            │   │   ├── course-search/
            │   │   │   ├── course-search.component.html
            │   │   │   ├── course-search.component.scss
            │   │   │   ├── course-search.component.ts
            │   │   │   └── course-search.component.spec.ts
            │   │   ├── course-info/
            │   │   │   ├── course-info.component.html
            │   │   │   ├── course-info.component.scss
            │   │   │   ├── course-info.component.ts
            │   │   │   └── course-info.component.spec.ts
            │   │   ├── difficulty-badge/
            │   │   │   ├── difficulty-badge.component.html
            │   │   │   ├── difficulty-badge.component.scss
            │   │   │   ├── difficulty-badge.component.ts
            │   │   │   └── difficulty-badge.component.spec.ts
            │   │   └── platform-badge/
            │   │       ├── platform-badge.component.html
            │   │       ├── platform-badge.component.scss
            │   │       ├── platform-badge.component.ts
            │   │       └── platform-badge.component.spec.ts
            │   └── services/
            │       ├── course.service.ts
            │       ├── course-detail.service.ts
            │       └── course-state.service.ts
            │
            ├── reviews/            # Review system & management
            │   ├── reviews.routes.ts
            │   ├── components/
            │   │   ├── review-form/
            │   │   │   ├── review-form.component.html
            │   │   │   ├── review-form.component.scss
            │   │   │   ├── review-form.component.ts
            │   │   │   └── review-form.component.spec.ts
            │   │   ├── review-list/
            │   │   │   ├── review-list.component.html
            │   │   │   ├── review-list.component.scss
            │   │   │   ├── review-list.component.ts
            │   │   │   └── review-list.component.spec.ts
            │   │   ├── review-card/
            │   │   │   ├── review-card.component.html
            │   │   │   ├── review-card.component.scss
            │   │   │   ├── review-card.component.ts
            │   │   │   └── review-card.component.spec.ts
            │   │   ├── review-edit/
            │   │   │   ├── review-edit.component.html
            │   │   │   ├── review-edit.component.scss
            │   │   │   ├── review-edit.component.ts
            │   │   │   └── review-edit.component.spec.ts
            │   │   ├── review-summary/
            │   │   │   ├── review-summary.component.html
            │   │   │   ├── review-summary.component.scss
            │   │   │   ├── review-summary.component.ts
            │   │   │   └── review-summary.component.spec.ts
            │   │   ├── pros-cons-list/
            │   │   │   ├── pros-cons-list.component.html
            │   │   │   ├── pros-cons-list.component.scss
            │   │   │   ├── pros-cons-list.component.ts
            │   │   │   └── pros-cons-list.component.spec.ts
            │   │   ├── rating-input/
            │   │   │   ├── rating-input.component.html
            │   │   │   ├── rating-input.component.scss
            │   │   │   ├── rating-input.component.ts
            │   │   │   └── rating-input.component.spec.ts
            │   │   └── pros-cons-input/
            │   │       ├── pros-cons-input.component.html
            │   │       ├── pros-cons-input.component.scss
            │   │       ├── pros-cons-input.component.ts
            │   │       └── pros-cons-input.component.spec.ts
            │   └── services/
            │       ├── review.service.ts
            │       └── review-state.service.ts
            │
            ├── users/              # User management & profiles
            │   ├── users.routes.ts
            │   ├── components/
            │   │   ├── profile/
            │   │   │   ├── profile.component.html
            │   │   │   ├── profile.component.scss
            │   │   │   ├── profile.component.ts
            │   │   │   └── profile.component.spec.ts
            │   │   ├── profile-info/
            │   │   │   ├── profile-info.component.html
            │   │   │   ├── profile-info.component.scss
            │   │   │   ├── profile-info.component.ts
            │   │   │   └── profile-info.component.spec.ts
            │   │   ├── my-reviews/
            │   │   │   ├── my-reviews.component.html
            │   │   │   ├── my-reviews.component.scss
            │   │   │   ├── my-reviews.component.ts
            │   │   │   └── my-reviews.component.spec.ts
            │   │   ├── edit-interests/
            │   │   │   ├── edit-interests.component.html
            │   │   │   ├── edit-interests.component.scss
            │   │   │   ├── edit-interests.component.ts
            │   │   │   └── edit-interests.component.spec.ts
            │   │   ├── activity-history/
            │   │   │   ├── activity-history.component.html
            │   │   │   ├── activity-history.component.scss
            │   │   │   ├── activity-history.component.ts
            │   │   │   └── activity-history.component.spec.ts
            │   │   ├── preferences/
            │   │   │   ├── preferences.component.html
            │   │   │   ├── preferences.component.scss
            │   │   │   ├── preferences.component.ts
            │   │   │   └── preferences.component.spec.ts
            │   │   └── tech-chips-selector/
            │   │       ├── tech-chips-selector.component.html
            │   │       ├── tech-chips-selector.component.scss
            │   │       ├── tech-chips-selector.component.ts
            │   │       └── tech-chips-selector.component.spec.ts
            │   └── services/
            │       ├── user.service.ts
            │       └── profile-state.service.ts
            │
            ├── recommendations/    # Recommendation engine & algorithms
            │   ├── recommendations.routes.ts
            │   ├── components/
            │   │   ├── recommended-courses/
            │   │   │   ├── recommended-courses.component.html
            │   │   │   ├── recommended-courses.component.scss
            │   │   │   ├── recommended-courses.component.ts
            │   │   │   └── recommended-courses.component.spec.ts
            │   │   └── recommendation-settings/
            │   │       ├── recommendation-settings.component.html
            │   │       ├── recommendation-settings.component.scss
            │   │       ├── recommendation-settings.component.ts
            │   │       └── recommendation-settings.component.spec.ts
            │   └── services/
            │       ├── recommendation.service.ts
            │       └── tracking.service.ts
            │
            └── theme/              # Theme system
                ├── theme.routes.ts # Optional: for showcase page
                ├── components/
                │   ├── theme-toggle/
                │   │   ├── theme-toggle.component.html
                │   │   ├── theme-toggle.component.scss
                │   │   ├── theme-toggle.component.ts
                │   │   └── theme-toggle.component.spec.ts
                │   └── theme-showcase/     # Development/testing component
                │       ├── theme-showcase.component.html
                │       ├── theme-showcase.component.scss
                │       ├── theme-showcase.component.ts
                │       └── theme-showcase.component.spec.ts
                └── services/
                    └── theme.service.ts
```

## Key Architectural Changes Made:

### 1. **Consolidated Feature Domains**
- `users/` now contains all user-related functionality (profile, preferences, etc.)
- `courses/` contains everything course-related (discovery, details, filtering)
- `reviews/` is focused solely on review creation and management

### 2. **Moved Reusable Components to Shared**
- `star-rating` moved from reviews to shared (used across features)
- Generic UI components remain in `shared/components/ui/`

### 3. **Created New Feature Modules**
- `recommendations/` for recommendation engine logic
- `theme/` 

### 4. **Simplified Service Distribution**
- Core services (API, storage, notifications) in `core/`
- Feature-specific services within their respective features
- Shared business logic services appropriately placed

### 5. **Maintained Clean Separation**
- `core/` for singletons and app-wide concerns
- `shared/` for reusable UI components and utilities  
- `features/` for business domain logic

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
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
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


Made with ❤️ for the learning community

⭐ Star this repo if you find it helpful! ⭐

