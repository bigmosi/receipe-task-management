import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Filter,
  Search,
  AlertCircle,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onUpdateTask: (id: string, task: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed" | "high" | "medium" | "low"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
  }>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    });
    setShowForm(false);
    setEditingTask(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate) return;

    if (editingTask) {
      onUpdateTask(editingTask.id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
      });
    } else {
      onAddTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
        completed: false,
      });
    }
    resetForm();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setShowForm(true);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !task.completed) ||
      (filter === "completed" && task.completed) ||
      filter === task.priority;

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTaskCardBorder = (task: Task) => {
    if (task.completed) return "border-green-200 bg-green-50";
    const isOverdue = new Date(task.dueDate) < new Date();
    if (isOverdue && task.priority === "high")
      return "border-red-300 bg-red-50";
    if (task.priority === "high") return "border-red-200 bg-white";
    return "border-gray-200 bg-white";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-2 md:px-0 bg-gradient-to-br from-orange-50 via-yellow-100 to-pink-100 min-h-screen pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-8">
        <div>
          <h2 className="text-3xl font-extrabold text-pink-700 drop-shadow">
            Task Management
          </h2>
          <p className="text-pink-500 mt-1">
            Organize your tasks and stay productive
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-white rounded-xl font-semibold hover:from-pink-500 hover:to-yellow-400 focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-colors shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 rounded-xl shadow-md border border-pink-100 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="h-5 w-5 text-pink-300 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/80 text-pink-700 placeholder-pink-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-pink-300" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/80 text-pink-700"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          <div className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-pink-100">
              <h3 className="text-lg font-semibold text-pink-700">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/80 text-pink-700 placeholder-pink-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/80 text-pink-700 placeholder-pink-300"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-pink-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/80 text-pink-700"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-pink-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/80 text-pink-700"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-pink-400 hover:text-pink-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-white rounded-lg font-semibold hover:from-pink-500 hover:to-yellow-400 transition-colors"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isOverdue =
              new Date(task.dueDate) < new Date() && !task.completed;
            return (
              <div
                key={task.id}
                className={`rounded-xl border p-4 sm:p-6 hover:shadow-lg transition-all duration-200 ${getTaskCardBorder(
                  task
                )}`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={() =>
                        onUpdateTask(task.id, { completed: !task.completed })
                      }
                      className="mt-1 hover:scale-110 transition-transform"
                    >
                      {task.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-pink-300 hover:text-pink-500" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3
                          className={`text-lg font-semibold ${
                            task.completed
                              ? "text-pink-300 line-through"
                              : "text-pink-900"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        {isOverdue && (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Overdue</span>
                          </div>
                        )}
                      </div>
                      {task.description && (
                        <p
                          className={`text-pink-500 mb-3 ${
                            task.completed ? "line-through" : ""
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-pink-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-0 sm:ml-4">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-pink-300 hover:text-pink-700 hover:bg-pink-100 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this task?"
                          )
                        ) {
                          onDeleteTask(task.id);
                        }
                      }}
                      className="p-2 text-pink-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 rounded-lg border border-pink-100 p-12 text-center">
          <Calendar className="h-12 w-12 text-pink-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-pink-700 mb-2">
            No tasks found
          </h3>
          <p className="text-pink-400 mb-6">
            {searchTerm || filter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Create your first task to get started"}
          </p>
          {!searchTerm && filter === "all" && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-white rounded-lg hover:from-pink-500 hover:to-yellow-400 transition-colors"
            >
              Add Your First Task
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskManager;
