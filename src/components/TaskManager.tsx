import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Circle,
  Edit3,
  Trash2,
  AlertCircle,
  X,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
}

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

function TaskManager({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TaskManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed" | "high" | "medium" | "low"
  >("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      onUpdateTask(editingTask.id, {
        ...formData,
        completed: editingTask.completed,
      });
    } else {
      onAddTask({
        ...formData,
        completed: false,
      });
    }

    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    });
    setShowForm(false);
    setEditingTask(null);
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

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = (() => {
      switch (filter) {
        case "pending":
          return !task.completed;
        case "completed":
          return task.completed;
        case "high":
        case "medium":
        case "low":
          return task.priority === filter;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesFilter;
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
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-white rounded-xl font-semibold hover:from-pink-500 hover:to-yellow-400 focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-colors shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 rounded-xl shadow-md border border-pink-100 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="h-5 w-5 text-pink-300 absolute left-3 top-3" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/80 text-pink-700 placeholder-pink-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-pink-300" />
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as any)}
            >
              <SelectTrigger className="px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/80 text-pink-700">
                <SelectValue placeholder="Filter tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          <div className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-pink-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-pink-700">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h3>
              <Button
                onClick={handleCloseForm}
                variant="ghost"
                className="p-1 text-pink-300 hover:text-pink-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Title
                </label>
                <Input
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
                <Textarea
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
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value as any })
                    }
                  >
                    <SelectTrigger className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/80 text-pink-700">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-pink-700 mb-2">
                    Due Date
                  </label>
                  <Input
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
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={handleCloseForm}
                  variant="ghost"
                  className="px-4 py-2 text-pink-600 hover:text-pink-800 hover:bg-pink-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-white rounded-lg hover:from-pink-500 hover:to-yellow-400 transition-colors"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </Button>
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
                    <Button
                      type="button"
                      onClick={() =>
                        onUpdateTask(task.id, { completed: !task.completed })
                      }
                      variant="ghost"
                      className="mt-1 hover:scale-110 transition-transform p-0"
                    >
                      {task.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-pink-300 hover:text-pink-500" />
                      )}
                    </Button>
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
                    <Button
                      type="button"
                      onClick={() => handleEdit(task)}
                      variant="ghost"
                      className="p-2 text-pink-300 hover:text-pink-700 hover:bg-pink-100 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this task?"
                          )
                        ) {
                          onDeleteTask(task.id);
                        }
                      }}
                      variant="ghost"
                      className="p-2 text-pink-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            <Button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-white rounded-lg hover:from-pink-500 hover:to-yellow-400 transition-colors"
            >
              Add Your First Task
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskManager;
