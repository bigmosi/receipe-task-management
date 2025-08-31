import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TaskManager from "./components/TaskManager";
import RecipeSearch from "./components/RecipeSearch";
import {
  loadTasks,
  saveTasks,
  loadFavoriteRecipes,
  saveFavoriteRecipes,
  loadUser,
  saveUser,
  removeUser,
  generateId,
} from "./utils/storage";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  sourceUrl: string;
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const savedUser = loadUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setTasks(loadTasks());
    setFavoriteRecipes(loadFavoriteRecipes());
  }, []);

  useEffect(() => {
    if (!user) return;
    let timer: NodeJS.Timeout;
    const logoutAfterInactivity = () => {
      handleLogout();
    };
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(logoutAfterInactivity, 5 * 60 * 1000);
    };
    // List of events to track
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  // Save tasks whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Save favorite recipes whenever they change
  useEffect(() => {
    saveFavoriteRecipes(favoriteRecipes);
  }, [favoriteRecipes]);

  const handleLogin = (userData: any) => {
    setUser(userData);
    saveUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    removeUser();
  };

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleToggleFavoriteRecipe = (recipe: Recipe) => {
    setFavoriteRecipes((prev) => {
      const isAlreadyFavorite = prev.some((fav) => fav.id === recipe.id);
      if (isAlreadyFavorite) {
        return prev.filter((fav) => fav.id !== recipe.id);
      } else {
        return [...prev, recipe];
      }
    });
  };

  // ...existing code...

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard tasks={tasks} favoriteRecipes={favoriteRecipes} />
            }
          />
          <Route
            path="/tasks"
            element={
              <TaskManager
                tasks={tasks}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            }
          />
          <Route
            path="/recipes"
            element={
              <RecipeSearch
                favoriteRecipes={favoriteRecipes}
                onToggleFavorite={handleToggleFavoriteRecipe}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
