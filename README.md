# Workout Tracker

A comprehensive cross-platform fitness application built with modern React Native technologies. Track your workouts, browse exercises with detailed information, and manage your fitness journey with an intuitive interface.

![Platform Support](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)

## Features

### Core Functionality
- **Exercise Library**: Browse comprehensive exercise database with imagery and detailed metadata
- **Workout Management**: Create, track, and manage custom workout routines
- **Active Workout Mode**: Real-time workout tracking with timer and progress monitoring  
- **Workout History**: View past workout sessions and track progress over time
- **User Profiles**: Personal fitness profiles with authentication support

### User Interface
- **Tab Navigation**: Intuitive 5-tab interface (Home, Exercises, Workout, History, Profile)
- **Responsive Design**: Optimized for all screen sizes and orientations
- **Dark/Light Mode**: Consistent theming across the application
- **Smooth Animations**: Fluid transitions and micro-interactions

### Authentication & Security
- **Clerk Integration**: Secure user authentication and session management
- **Google Sign-In**: Social authentication support
- **Secure Storage**: Encrypted local data storage using Expo SecureStore

### Media & Content
- **Rich Media Support**: Exercise videos and images with optimized loading
- **Markdown Support**: Rich text content rendering for exercise descriptions
- **Content Management**: Sanity CMS integration for dynamic content updates

## Tech Stack

### Frontend
- **[Expo](https://expo.dev/)** - React Native development platform
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - File-based navigation system
- **[React Native](https://reactnative.dev/)** - Cross-platform mobile framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript development
- **[Nativewind](https://www.nativewind.dev/)** - Tailwind CSS for React Native
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Backend & Services
- **[Sanity](https://www.sanity.io/)** - Headless CMS for content management
- **[Clerk](https://clerk.com/)** - Authentication and user management
- **[OpenAI](https://openai.com/)** - AI integration for workout recommendations (optional)

### Development Tools
- **[PNPM](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[ESLint](https://eslint.org/)** - Code linting and quality assurance
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking

## State Management

### Zustand Store (`store/workout-store.ts`)
The app uses **[Zustand](https://github.com/pmndrs/zustand)** for lightweight, type-safe state management with persistence.

#### Key Features
- **Persistent Storage**: User preferences saved with AsyncStorage
- **TypeScript Support**: Full type safety with interfaces
- **UUID Integration**: Reliable unique identifiers for exercises
- **Immutable Updates**: Safe state mutations with spread operators

#### Store Structure
```typescript
interface WorkoutStore {
  // State
  workoutExercises: WorkoutExercise[];
  weightUnit: "kg" | "lbs";
  
  // Exercise Management
  addExerciseToWorkout: (exercise: { name: string; sanityId: string }) => void;
  setWorkoutExercises: (exercises: WorkoutExercise[] | ((prev: WorkoutExercise[]) => WorkoutExercise[])) => void;
  resetWorkout: () => void;
  
  // Settings
  setWeightUnit: (unit: "kg" | "lbs") => void;
}
```

#### Usage Example
```typescript
import { useWorkoutStore } from './store/workout-store';

export const WorkoutScreen = () => {
  const { 
    workoutExercises, 
    weightUnit,
    addExerciseToWorkout,
    setWeightUnit 
  } = useWorkoutStore();

  const handleAddExercise = () => {
    addExerciseToWorkout({
      name: "Bench Press",
      sanityId: "bench-press-123"
    });
  };

  const handleWeightUnitChange = () => {
    setWeightUnit(weightUnit === "kg" ? "lbs" : "kg");
  };
};
```

#### Persistence Strategy
- **User Preferences**: `weightUnit` is persisted across sessions
- **Workout Data**: Exercises and sets are session-only (fresh start each time)
- **Storage**: Uses React Native AsyncStorage for cross-platform persistence

## Project Structure

```
workout-tracker/
├── src/
│   ├── app/                          # Expo Router app directory
│   │   ├── _layout.tsx                  # Root layout with providers
│   │   ├── (app)/                    # Authenticated app routes
│   │   │   ├── _layout.tsx              # App layout with auth guard
│   │   │   ├── (tabs)/               # Tab-based navigation
│   │   │   │   ├── _layout.tsx          # Tab layout configuration
│   │   │   │   ├── index.tsx            # Home tab - Dashboard
│   │   │   │   ├── exercises.tsx        # Exercises tab - Browse library
│   │   │   │   ├── workout.tsx          # Workout tab - Create routines
│   │   │   │   ├── active-workout.tsx   # Active workout session
│   │   │   │   ├── history/          # Workout history
│   │   │   │   │   └── index.tsx        # History main page
│   │   │   │   └── profile/          # User profile
│   │   │   │       └── index.tsx        # Profile main page
│   │   │   ├── exercise-detail.tsx      # Exercise detail view
│   │   │   ├── sign-in.tsx              # Sign in screen
│   │   │   └── sign-up.tsx              # Sign up screen
│   │   ├── api/                      # API routes
│   │   │   └── ai+api.ts                # OpenAI integration
│   │   └── components/               # Reusable components
│   │       ├── ExerciseCard.tsx         # Exercise display card
│   │       └── GoogleSignIn.tsx         # Google auth component
│   ├── lib/                          # Shared libraries
│   │   └── sanity/                      # Sanity CMS integration
│   │       ├── client.ts                # Sanity client configuration
│   │       └── types.ts                 # Type definitions
│   ├── store/                        # State management
│   │   └── workout-store.ts             # Zustand store with UUID support
│   └── global.css                       # Global styles
├── sanity/                          # Sanity CMS workspace
│   ├── sanity.config.ts                 # Sanity configuration
│   ├── sanity.types.ts                  # Generated types
│   └── schemaTypes/                     # Content schemas
│       ├── exercise.ts                  # Exercise schema
│       ├── workout.ts                   # Workout schema
│       └── index.ts                     # Schema exports
├── Configuration Files
│   ├── app.json                         # Expo app configuration
│   ├── babel.config.js                  # Babel transpiler config
│   ├── metro.config.js                  # Metro bundler config
│   ├── tailwind.config.js               # Tailwind CSS config
│   ├── tsconfig.json                    # TypeScript config
│   └── package.json                     # Dependencies and scripts
└── Documentation
    └── README.md                        # This file
```

## Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **PNPM** (recommended) or npm
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (macOS) or **Android Studio** (for mobile development)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/workout-tracker.git
cd workout-tracker
```

### 2. Install Dependencies
```bash
# Using PNPM (recommended)
pnpm install

# Or using npm
npm install

# Install additional UUID package for unique identifiers
npm install uuid
npm install --save-dev @types/uuid
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Sanity Configuration
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Optional: OpenAI Integration
OPENAI_API_KEY=sk-your_openai_api_key

# Optional: Google Services
GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Sanity CMS Setup
```bash
# Navigate to sanity directory
cd sanity

# Install Sanity CLI globally
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Deploy schemas
sanity deploy
```

### 5. Start Development Server
```bash
# Start Expo development server
pnpm start

# Platform-specific commands
pnpm run ios      # iOS Simulator
pnpm run android  # Android Emulator
pnpm run web      # Web browser
```

## Usage

### Starting the App
1. Launch the development server with `pnpm start`
2. Open the Expo Go app on your device or use a simulator
3. Scan the QR code or select your platform

### Navigation Structure
- **Home**: Dashboard with workout summaries and quick actions
- **Exercises**: Browse exercise library with search and filtering
- **Workout**: Create custom workout routines and start sessions
- **History**: View workout history and progress tracking
- **Profile**: User settings, preferences, and account management

### Key Workflows
1. **Browse Exercises**: Navigate to Exercises tab → Select exercise for details
2. **Create Workout**: Go to Workout tab → Add exercises → Save routine
3. **Track Session**: Start active workout → Log sets/reps → Complete session
4. **View Progress**: Check History tab for past workouts and analytics

## Configuration

### Customizing Themes
Modify `tailwind.config.js` to customize colors, fonts, and styling:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Adding Custom Components
1. Create component in `src/app/components/`
2. Export from component file
3. Import where needed in your screens

### Extending Sanity Schemas
1. Add new schema file in `sanity/schemaTypes/`
2. Import in `sanity/schemaTypes/index.ts`
3. Deploy with `sanity deploy`

## Deployment

### Web Deployment
```bash
# Build for web
npx expo export -p web

# Deploy to EAS Hosting
npx eas-cli@latest deploy
```

### Mobile App Builds
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure builds
eas build:configure

# Build for iOS/Android
eas build --platform ios
eas build --platform android

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

## Scripts

The following scripts are available in `package.json`:

```json
{
  "start": "expo start",
  "android": "expo start --android", 
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

## Environment Variables

### Required Variables
- `SANITY_API_TOKEN`: Required for any write/mutation operations via the admin client in `src/lib/sanity/client.ts`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Required for Clerk authentication

### Optional Variables  
- `OPENAI_API_KEY` (or `OPEN_AI_KEY`): Only needed if you implement the placeholder AI route at `src/app/api/ai+api.ts`
- `GOOGLE_CLIENT_ID`: Required for Google Sign-In functionality

Set them in your shell before running scripts that need them:

```bash
export OPENAI_API_KEY="sk-..."
export SANITY_API_TOKEN="your_token"
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/frankkinuthian/workout-tracker/issues)
---
