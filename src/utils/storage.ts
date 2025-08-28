interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
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

// Task storage functions
export const loadTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem('taskflow-tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

// Recipe storage functions
export const loadFavoriteRecipes = (): Recipe[] => {
  try {
    const recipes = localStorage.getItem('taskflow-favorite-recipes');
    return recipes ? JSON.parse(recipes) : [];
  } catch (error) {
    console.error('Error loading favorite recipes:', error);
    return [];
  }
};

export const saveFavoriteRecipes = (recipes: Recipe[]): void => {
  try {
    localStorage.setItem('taskflow-favorite-recipes', JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving favorite recipes:', error);
  }
};

// User authentication storage
export const loadUser = () => {
  try {
    const user = localStorage.getItem('taskflow-user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
};

export const saveUser = (user: any): void => {
  try {
    localStorage.setItem('taskflow-user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const removeUser = (): void => {
  try {
    localStorage.removeItem('taskflow-user');
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// Generate unique ID for tasks
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};