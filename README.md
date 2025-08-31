# Recipe & Task Management App

A modern, mobile-friendly web application for discovering recipes and managing daily tasks. Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## Features

- **Recipe Search & Discovery:** Search for recipes using the Spoonacular API, view details, and save favorites.
- **Task Management:** Add, edit, filter, and complete tasks with priority and due dates.
- **Beautiful UI:** Responsive design with Tailwind CSS and shadcn/ui components.
- **Progress Tracking:** Visual progress bar for task completion.
- **Secure API Keys:** API keys managed via environment variables.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- lucide-react icons
- Spoonacular API

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bigmosi/receipe-task-management.git
cd receipe-task-management/project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_SPOONACULAR_API_KEY=your_spoonacular_api_key
VITE_SPOONACULAR_BASE_URL=https://api.spoonacular.com/recipes
```

### 4. Run the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## Deployment

- **Live Demo:** [Recipe & Task Management App on Vercel](https://receipe-task-management.vercel.app/)
- **Vercel:** Set environment variables in the Vercel dashboard (Settings → Environment Variables) with the same names as above.
- Redeploy after saving variables.

## Folder Structure

```
project/
  src/
    components/
      Dashboard.tsx
      Layout.tsx
      Login.tsx
      RecipeSearch.tsx
      TaskManager.tsx
      ui/
        button.tsx
        input.tsx
        textarea.tsx
        select.tsx
        dropdown-menu.tsx
        form.tsx
        progress.tsx
        label.tsx
    utils/
      storage.ts
    App.tsx
    main.tsx
    index.css
```

## API Reference

- [Spoonacular API Docs](https://spoonacular.com/food-api/docs)

## Routes

The app uses React Router for navigation. Available routes:

- `/` — Dashboard (overview of tasks and favorite recipes)
- `/tasks` — Task Manager (add, edit, delete, and manage tasks)
- `/recipes` — Recipe Search (discover and save recipes)

## Troubleshooting

- If API calls fail on Vercel, ensure environment variables are set and redeploy.
- Restart the dev server after editing `.env` locally.

## License

MIT
