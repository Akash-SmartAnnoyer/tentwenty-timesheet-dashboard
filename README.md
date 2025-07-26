# Timesheet Management Application

A modern, responsive timesheet management application built with React, TypeScript, and TailwindCSS. This application demonstrates clean code structure, proper state management, and a user-friendly interface for managing employee work hours.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login with email/password
- **Dashboard**: Overview of all timesheet entries with filtering and status tracking
- **Timesheet Management**: Create, view, edit, and delete timesheet entries
- **Detailed View**: Full-screen timesheet detail view with daily task management
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Bonus Features
- **Add/Edit Modal**: Intuitive modal interface for timesheet entry management
- **Form Validation**: Comprehensive client-side validation with error handling
- **Status Tracking**: Visual status indicators (completed, incomplete, missing)
- **Dynamic Actions**: Context-aware action buttons based on entry status
- **Modern UI/UX**: Clean, professional interface with smooth interactions

## 🛠️ Tech Stack

- **Frontend Framework**: React 17 with TypeScript
- **Build Tool**: Vite (for fast development and optimized builds)
- **Styling**: TailwindCSS for utility-first styling
- **Routing**: React Router DOM for client-side routing
- **State Management**: React Context API and hooks
- **Font**: Inter font family for modern typography

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14.19.3 or higher)
- npm or yarn package manager

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <https://github.com/Akash-SmartAnnoyer/tentwenty-timesheet-dashboard>
   cd timesheet-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Application header with user info
│   ├── LoginForm.tsx   # Authentication form
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── TimesheetTable.tsx # Timesheet entries table
│   ├── TimesheetModal.tsx # Add/Edit modal
│   ├── TimesheetDetailScreen.tsx # Detailed timesheet view
│   └── __tests__/      # Component tests
├── lib/                # Utility libraries
│   ├── api.ts          # Mock API service
│   └── auth.tsx        # Authentication context
├── types/              # TypeScript type definitions
│   └── index.ts        # Centralized types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🔧 Key Components

### Authentication System
- **LoginForm**: Split-screen login interface with promotional content
- **AuthContext**: Global authentication state management
- **Protected Routes**: Route protection for authenticated users

### Dashboard
- **TimesheetTable**: Responsive table with sorting and filtering
- **Status Management**: Visual status indicators with color coding
- **Action Buttons**: Dynamic actions based on entry status

### Timesheet Management
- **TimesheetModal**: Reusable modal for add/edit operations
- **TimesheetDetailScreen**: Full-screen detailed view with daily tasks
- **Task Management**: Add, edit, delete tasks within timesheets

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1A56DB, #1C64F2)
- **Status Colors**: 
  - Completed: Green
  - Incomplete: Orange
  - Missing: Red
- **Neutral**: Gray scale for text and borders

### Typography
- **Font Family**: Inter
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)
- **Responsive**: Scalable font sizes across devices

### Layout
- **Container**: Max-width containers with proper spacing
- **Grid System**: CSS Grid and Flexbox for responsive layouts
- **Spacing**: Consistent 8px base unit system

## 🔌 API Integration

### Mock API Service
The application uses a mock API service (`src/lib/api.ts`) that simulates real API endpoints:

- **Authentication**: `login(email, password)`
- **Timesheets**: `getTimesheets()`, `createTimesheet()`, `updateTimesheet()`
- **Error Handling**: Proper error states and loading indicators

### Data Structure
```typescript
interface TimesheetEntry {
  id: string;
  weekNumber: number;
  date: string;
  status: 'completed' | 'incomplete' | 'missing';
  hours?: number;
  description?: string;
  project?: string;
  workType?: string;
}
```

## 🧪 Testing

*Note: Testing framework is set up but tests are not implemented as per requirements.*

### Test Setup
- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **Test Files**: Located in `src/components/__tests__/`

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach**
- **Breakpoint system**: sm, md, lg, xl
- **Flexible layouts**: Adapts to different screen sizes
- **Touch-friendly**: Optimized for mobile interactions

## 🔒 Security Features

- **Token-based authentication**
- **Session management**
- **Protected routes**
- **Input validation**
- **XSS prevention**

## 🚀 Performance Optimizations

- **Code splitting** with React Router
- **Optimized builds** with Vite
- **Lazy loading** for components
- **Efficient state management**
- **Minimal bundle size**

## 📝 Assumptions & Notes

### Technical Decisions
1. **React + Vite**: Chosen over Next.js due to Node.js version constraints
2. **Mock API**: Simulates real API integration patterns
3. **Context API**: Lightweight state management solution
4. **TailwindCSS**: Rapid UI development with consistent design

### User Experience
1. **Intuitive Navigation**: Clear breadcrumbs and navigation
2. **Visual Feedback**: Loading states, success/error messages
3. **Accessibility**: Proper ARIA labels and keyboard navigation
4. **Mobile Optimization**: Touch-friendly interface

### Data Management
1. **Local State**: React hooks for component state
2. **Global State**: Context API for authentication
3. **Form Handling**: Controlled components with validation
4. **Error Handling**: Comprehensive error states

## 🕒 Time Spent

- **Planning & Setup**: 2 hours
- **Core Development**: 8 hours
- **UI/UX Implementation**: 6 hours
- **Testing & Refinement**: 2 hours
- **Documentation**: 1 hour

**Total: ~19 hours**

## 📄 License

This project is created for demonstration purposes as part of a technical assessment.

---

**Built with ❤️ using React, TypeScript, and TailwindCSS**
