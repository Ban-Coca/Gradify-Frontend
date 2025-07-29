# Gradify - Academic Performance Management System

A comprehensive educational platform designed to streamline grading, analytics, and academic performance tracking for both teachers and students.

## 🎯 Features

### For Teachers
- **Class Management**: Create and manage multiple classes with detailed information
- **Grade Management**: Upload, edit, and manage student grades with flexible grading schemes
- **Analytics Dashboard**: View comprehensive analytics including:
  - Class performance metrics
  - Grade distribution charts
  - Student progress tracking
  - At-risk student identification
- **Spreadsheet Integration**: Upload and link spreadsheets for bulk grade management
- **Report Generation**: Create detailed performance reports and feedback
- **Student Insights**: Individual student performance analysis with trend tracking

### For Students
- **Academic Dashboard**: Overview of all enrolled classes and performance metrics
- **Grade Tracking**: Real-time access to grades across all courses
- **Performance Analytics**: 
  - GPA calculation and tracking
  - Grade distribution visualization
  - Progress trends and comparisons
- **Feedback System**: Access teacher feedback and improvement recommendations
- **Improvement Areas**: AI-powered suggestions for academic improvement
- **Notifications**: Real-time updates on grades and important announcements

## 🚀 Technology Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Charts**: Chart.js and Recharts
- **Authentication**: JWT with OAuth2 support
- **Notifications**: Firebase Cloud Messaging
- **Forms**: React Hook Form with validation
- **Rich Text Editor**: Lexical editor

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── charts/          # Chart components for analytics
│   ├── student-dashboard/ # Student-specific components
│   ├── student-grades/   # Grade viewing components
│   ├── student-progress/ # Progress tracking components
│   └── lexical/         # Rich text editor components
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
│   ├── AuthenticationPages/
│   ├── OnBoardingPages/
│   ├── StudentPages/
│   └── TeacherPages/
├── services/            # API service functions
└── lib/                 # Utility functions
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd Gradify-Frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add necessary environment variables for:
- API endpoints
- Firebase configuration
- Authentication settings

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔧 Key Dependencies

- **UI Components**: Radix UI primitives with custom styling
- **Data Fetching**: React Query for server state management
- **Charts**: Chart.js and Recharts for data visualization
- **Authentication**: JWT decoding and Firebase integration
- **Notifications**: React Hot Toast and Firebase messaging
- **Form Handling**: React Hook Form with resolvers
- **Animations**: Framer Motion for smooth interactions

## 🎨 Features Highlight

### Teacher Dashboard
- Real-time class statistics and performance metrics
- Quick actions for grade management and reporting
- Visual grade distribution charts
- Student performance analytics

### Student Dashboard
- Personal academic performance overview
- Course enrollment and grade tracking
- Progress visualization and improvement suggestions
- Feedback and notification center

### Grade Management
- Flexible grading schemes with customizable weights
- Bulk grade uploads via spreadsheet integration
- Real-time grade calculations and updates
- Export capabilities for academic records

## 🔐 Authentication & Security

- JWT-based authentication with refresh token support
- OAuth2 integration for external authentication providers
- Role-based access control (Teacher/Student)
- Secure API communication with authentication headers

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm run build
# Deploy build folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

### Traditional Web Server
```bash
npm run build
# Serve the dist folder with any web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions
