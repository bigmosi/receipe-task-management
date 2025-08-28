import React from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface DashboardProps {
  tasks: any[];
  favoriteRecipes: any[];
  onViewChange: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  favoriteRecipes,
  onViewChange,
}) => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high" && !task.completed
  ).length;

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: Calendar,
      color: "bg-blue-50 text-blue-600",
      bgColor: "bg-blue-600",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
      bgColor: "bg-green-600",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      bgColor: "bg-orange-600",
    },
    {
      title: "Favorite Recipes",
      value: favoriteRecipes.length,
      icon: Star,
      color: "bg-purple-50 text-purple-600",
      bgColor: "bg-purple-600",
    },
  ];

  const recentTasks = tasks
    .filter((task) => !task.completed)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentRecipes = favoriteRecipes.slice(0, 4);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-2 md:px-0 bg-gradient-to-br from-orange-50 via-yellow-100 to-pink-100 min-h-screen pb-12">
      <div className="mb-8 pt-8">
        <h2 className="text-3xl font-extrabold text-pink-700 mb-2 drop-shadow">
          Dashboard
        </h2>
        <p className="text-pink-500">
          Welcome back! Here's what's happening with your tasks and recipes.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          // Pick a color for each stat card
          const statColors = [
            "from-pink-200 via-orange-100 to-yellow-100",
            "from-orange-200 via-pink-100 to-yellow-100",
            "from-yellow-200 via-pink-100 to-orange-100",
            "from-pink-100 via-yellow-100 to-orange-100",
          ];
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${
                statColors[index % statColors.length]
              } rounded-xl shadow-md border border-pink-100 p-6 hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pink-700 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-extrabold text-pink-900 drop-shadow">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/60">
                  <Icon className="h-6 w-6 text-pink-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* High Priority Alert */}
      {highPriorityTasks > 0 && (
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-pink-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-pink-800">
                Attention Required
              </h3>
              <p className="text-sm text-pink-700">
                You have {highPriorityTasks} high priority task
                {highPriorityTasks !== 1 ? "s" : ""} pending.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 rounded-xl shadow-md border border-pink-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-pink-700">
              Recent Tasks
            </h3>
            <button
              onClick={() => onViewChange("tasks")}
              className="text-sm text-pink-500 hover:text-pink-700 font-medium"
            >
              View All
            </button>
          </div>

          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-white/70 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-pink-900 mb-1">
                      {task.title}
                    </h4>
                    <p className="text-xs text-pink-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-pink-200 mx-auto mb-3" />
              <p className="text-pink-400">No pending tasks</p>
              <button
                onClick={() => onViewChange("tasks")}
                className="text-pink-500 hover:text-pink-700 text-sm font-medium mt-2"
              >
                Create your first task
              </button>
            </div>
          )}
        </div>

        {/* Favorite Recipes */}
        <div className="bg-gradient-to-br from-yellow-50 via-pink-50 to-orange-50 rounded-xl shadow-md border border-pink-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-orange-600">
              Favorite Recipes
            </h3>
            <button
              onClick={() => onViewChange("recipes")}
              className="text-sm text-orange-400 hover:text-orange-600 font-medium"
            >
              Explore More
            </button>
          </div>

          {recentRecipes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {recentRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="group cursor-pointer"
                  onClick={() => onViewChange("recipes")}
                >
                  <div className="relative overflow-hidden rounded-lg bg-orange-50 aspect-square">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-pink-100 bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
                  </div>
                  <h4 className="text-sm font-medium text-orange-700 mt-2 group-hover:text-pink-600 transition-colors">
                    {recipe.title.length > 40
                      ? recipe.title.substring(0, 40) + "..."
                      : recipe.title}
                  </h4>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-orange-100 mx-auto mb-3" />
              <p className="text-orange-300">No favorite recipes yet</p>
              <button
                onClick={() => onViewChange("recipes")}
                className="text-orange-400 hover:text-orange-600 text-sm font-medium mt-2"
              >
                Discover recipes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      {tasks.length > 0 && (
        <div className="bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50 rounded-xl shadow-md border border-pink-100 p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-pink-400 mr-2" />
            <h3 className="text-lg font-semibold text-pink-700">
              Task Progress
            </h3>
          </div>
          <div className="flex items-center">
            <div className="flex-1 bg-pink-100 rounded-full h-3 mr-4">
              <div
                className="bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-pink-700">
              {tasks.length > 0
                ? Math.round((completedTasks / tasks.length) * 100)
                : 0}
              % Complete
            </span>
          </div>
          <p className="text-sm text-pink-400 mt-2">
            {completedTasks} of {tasks.length} tasks completed
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
