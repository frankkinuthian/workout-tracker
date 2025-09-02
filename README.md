## Workout Tracker (Expo + Expo Router + Nativewind)

A cross‑platform workout tracker built with Expo Router and styled with Nativewind. Content (exercises and workouts) is managed in Sanity. The current scope includes:

- Browsing exercises with imagery and metadata
- Viewing detailed exercise information
- Managing and tracking workouts via tabbed navigation (Home, Exercises, Workout, History, Profile)
- Authentication scaffolding for user profiles (e.g., sign in/sign up screens)

### Tech stack

- **Expo** (React Native)
- **Expo Router** for navigation
- **Nativewind/Tailwind CSS** for styling
- **Sanity** as CMS (`sanity/` workspace)
- **OpenAI** (optional; placeholder API route exists)

### Getting started

1. Install dependencies

```sh
pnpm install
# or npm install
```

2. Start the app

```sh
npm run start
# iOS: npm run ios
# Android: npm run android
# Web (Expo web): npm run web
```

### Scripts

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "deploy": "npx expo export -p web && npx eas-cli@latest deploy"
}
```

### Environment variables

- `SANITY_API_TOKEN`: required for any write/mutation operations via the admin client in `src/lib/sanity/client.ts`.
- `OPENAI_API_KEY` (or `OPEN_AI_KEY`): only needed if you implement the placeholder AI route at `src/app/api/ai+api.ts`.

Set them in your shell before running scripts that need them:

```sh
export OPENAI_API_KEY="sk-..."
```

### Folder structure

```
.
├─ app.json
├─ babel.config.js
├─ metro.config.js
├─ nativewind-env.d.ts
├─ tailwind.config.js
├─ tsconfig.json
├─ src/
│  ├─ app/
│  │  ├─ _layout.tsx
│  │  ├─ (app)/                # App routes via Expo Router
│  │  │  ├─ _layout.tsx
│  │  │  ├─ (tabs)/
│  │  │  │  ├─ _layout.tsx
│  │  │  │  ├─ index.tsx       # Home tab
│  │  │  │  ├─ exercises.tsx
│  │  │  │  ├─ workout.tsx
│  │  │  │  ├─ history.tsx
│  │  │  │  └─ profile/
│  │  │  │     ├─ _layout.tsx
│  │  │  │     └─ index.tsx
│  │  │  ├─ exercise-detail.tsx
│  │  │  ├─ sign-in.tsx
│  │  │  └─ sign-up.tsx
│  │  ├─ api/
│  │  │  └─ ai+api.ts          # Placeholder OpenAI API route
│  │  └─ components/
│  │     ├─ ExerciseCard.tsx
│  │     └─ GoogleSignIn.tsx
│  ├─ global.css
│  └─ lib/
│     └─ sanity/
│        ├─ client.ts
│        └─ types.ts
├─ sanity/                      # Sanity Studio / schema workspace
│  ├─ sanity.config.ts
│  ├─ sanity.types.ts
│  └─ schemaTypes/
│     ├─ exercise.ts
│     └─ workout.ts
└─ README.md
```

### Sanity

- Schemas live in `sanity/schemaTypes/` and content types are generated to `sanity.types.ts`.
- Configure the Sanity client in `src/lib/sanity/client.ts` (reads `SANITY_API_TOKEN` for admin operations).

### Deploy

Deploy on all platforms with Expo Application Services (EAS).

- Website: `npx eas-cli deploy` — see the EAS Hosting docs.
- iOS/Android builds: `npx eas-cli build` — see the EAS Build docs.
