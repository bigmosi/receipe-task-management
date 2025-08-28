import React from "react";
import { User, LogOut, Calendar, ChefHat } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onViewChange,
  user,
  onLogout,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: Calendar },
    { id: "recipes", label: "Recipes", icon: ChefHat },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-100 to-pink-100">
      {/* Header */}
      <header className="bg-white/90 shadow-sm border-b border-pink-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-pink-500 mr-3" />
              <h1 className="text-xl font-extrabold text-pink-700 drop-shadow">
                RecipeFlow
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-pink-700">
                <User className="h-4 w-4 mr-2" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center text-sm text-pink-400 hover:text-pink-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar - responsive */}
        <nav className="hidden md:block w-64 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 shadow-md h-[calc(100vh-4rem)] sticky top-16 border-r border-pink-100">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 font-semibold text-lg ${
                    currentView === item.id
                      ? "bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-200 text-white shadow-md"
                      : "text-pink-600 hover:bg-pink-100 hover:text-pink-900"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile Sidebar */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 border-t border-pink-100 shadow-inner flex md:hidden justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  currentView === item.id
                    ? "text-pink-700"
                    : "text-pink-400 hover:text-pink-700"
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
