"use client";

import { useState, useEffect } from "react";
import AuthPage from "@/components/auth/AuthPage";
import ProfileView from "@/components/profile/ProfileView";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Calendar as CalendarIcon, ListTodo, Star, User, LogOut, CheckCircle2, Delete, Trash2, Plus } from "lucide-react";
import { format, isSameDay } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/app/calendar-custom.css";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: Date;
  important: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  password?: string;
  dob?: string;
  bio?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("today");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  /* Persistence Logic */
  useEffect(() => {
    // 1. Check for Active Session
    const sessionUser = localStorage.getItem("taskmaster_session");
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  // Handle User Session & Data Loading
  useEffect(() => {
    if (user && user.email) {
      // A. Save Session
      localStorage.setItem("taskmaster_session", JSON.stringify(user));

      // B. Save/Update Profile in Database
      const profilesStr = localStorage.getItem("taskmaster_profiles");
      const profiles = profilesStr ? JSON.parse(profilesStr) : {};

      // Merge with existing password if not present in current user object update (to avoid overwrite if we didn't load it)
      // But we generally load the full object.
      profiles[user.email] = user;
      localStorage.setItem("taskmaster_profiles", JSON.stringify(profiles));

      // C. Load User-Specific Tasks
      const userTasksKey = `taskmaster_tasks_${user.email}`;
      const savedTasks = localStorage.getItem(userTasksKey);
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
            ...task,
            date: new Date(task.date),
          }));
          setTasks(parsedTasks);
        } catch (e) {
          console.error("Failed to load tasks", e);
          setTasks([]);
        }
      } else {
        setTasks([]); // No tasks for this user yet
      }
    } else {
      // Logout Cleanup
      localStorage.removeItem("taskmaster_session");
      setTimeout(() => setTasks([]), 0); // Clear tasks from UI immediately
    }
  }, [user]);

  // Save Tasks specifically for the current user
  useEffect(() => {
    if (user && user.email && tasks.length >= 0) { // Allow saving empty array
      const userTasksKey = `taskmaster_tasks_${user.email}`;
      localStorage.setItem(userTasksKey, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const handleAuth = (authData: any, method: "login" | "signup" | "reset" | "get_question"): string | void | any => {
    const { email, password, name, securityQuestion, securityAnswer } = authData;

    // 1. Get all profiles
    const profilesStr = localStorage.getItem("taskmaster_profiles");
    const profiles = profilesStr ? JSON.parse(profilesStr) : {};

    // 2. Check if this user exists
    const existingUser = profiles[email];

    if (method === "login") {
      if (!existingUser) {
        return "Account does not exist. Please Sign Up.";
      }
      if (existingUser.password !== password) {
        return "Incorrect password.";
      }
      // Success
      setUser(existingUser);
    } else if (method === "signup") {
      // Signup
      if (existingUser) {
        return "Account already exists with this email.";
      }
      // Create new user
      const newUser = {
        name,
        email,
        password, // Save password
        securityQuestion,
        securityAnswer,
        bio: "",
        dob: ""
      };
      setUser(newUser);
    } else if (method === "get_question") {
      // Forgot Password - Step 1
      if (!existingUser) {
        return "Account does not exist.";
      }
      return { question: existingUser.securityQuestion || "What is your pet's name?" }; // Fallback
    } else if (method === "reset") {
      // Forgot Password - Step 2 (Reset)
      if (!existingUser) return "Error finding account.";

      if (existingUser.securityAnswer?.toLowerCase() !== securityAnswer.toLowerCase()) {
        return "Incorrect answer.";
      }

      // Update Password logic happens here, we simulate it by updating the specific user profile
      existingUser.password = password;
      profiles[email] = existingUser;
      localStorage.setItem("taskmaster_profiles", JSON.stringify(profiles));

      return null; // Success (no error)
    }
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask,
      completed: false,
      date: activeTab === "calendar" ? selectedDate : new Date(), // Use selected date if in calendar view
      important: activeTab === "important",
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "today") return isSameDay(task.date, new Date());
    if (activeTab === "important") return task.important;
    if (activeTab === "calendar") return isSameDay(task.date, selectedDate);
    return true; // "tasks" [All Tasks] tab shows all
  });

  // Dynamic Overview Stats based on Active Tab
  let overviewTitle = "Today's Overview";
  let overviewCompleted = 0;
  let overviewTotal = 0;

  if (activeTab === "tasks") {
    overviewTitle = "Total Overview";
    overviewCompleted = tasks.filter(t => t.completed).length;
    overviewTotal = tasks.length;
  } else if (activeTab === "calendar") {
    const selectedTasks = tasks.filter(t => isSameDay(t.date, selectedDate));
    overviewTitle = `Overview for ${format(selectedDate, "MMM d")}`;
    overviewCompleted = selectedTasks.filter(t => t.completed).length;
    overviewTotal = selectedTasks.length;
  } else {
    // Default to Today for "today" tab and others
    const todayTasks = tasks.filter(t => isSameDay(new Date(t.date), new Date()));
    overviewTitle = "Today's Overview";
    overviewCompleted = todayTasks.filter(t => t.completed).length;
    overviewTotal = todayTasks.length;
  }

  const overviewProgress = overviewTotal > 0 ? (overviewCompleted / overviewTotal) * 100 : 0;

  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  const handleDeleteAccount = () => {
    if (!user || !user.email) return;

    // 1. Remove User Tasks
    const userTasksKey = `taskmaster_tasks_${user.email}`;
    localStorage.removeItem(userTasksKey);

    // 2. Remove User Profile
    const profilesStr = localStorage.getItem("taskmaster_profiles");
    if (profilesStr) {
      const profiles = JSON.parse(profilesStr);
      delete profiles[user.email];
      localStorage.setItem("taskmaster_profiles", JSON.stringify(profiles));
    }

    // 3. Clear Session
    localStorage.removeItem("taskmaster_session");
    setUser(null);
    setTasks([]);
  };

  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <ProfileView
          user={user}
          tasks={tasks}
          onUpdateUser={(updatedUser) => {
            setUser(updatedUser);
            // Explicitly force a save to session/profiles via useEffect
          }}
          onDeleteUser={handleDeleteAccount}
        />
      );
    }

    return (
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Task List Section */}
        <GlassCard className="col-span-2 min-h-[500px] flex flex-col">
          <h3 className="mb-6 text-2xl font-semibold capitalize">
            {activeTab === "calendar" ? `Tasks for ${format(selectedDate, "MMM do")}` : activeTab === "tasks" ? "All Tasks" : `${activeTab} Tasks`}
          </h3>

          {/* Add Task Input */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="bg-white/40 border-white/40 dark:bg-black/40 dark:border-white/10"
            />
            <Button onClick={() => addTask()} className="bg-violet-600 hover:bg-violet-700 text-white px-4">
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Tasks Display */}
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <div className="mb-4 rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
                  <ListTodo className="h-12 w-12" />
                </div>
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm">Start by adding a new task to your day.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-md ${task.completed
                    ? "bg-zinc-50 border-transparent opacity-60 dark:bg-white/5"
                    : "bg-white border-white/40 dark:bg-white/10 dark:border-white/10"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${task.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-zinc-400 hover:border-violet-500"
                        }`}
                    >
                      {task.completed && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <span className={`${task.completed ? "line-through opacity-70" : ""}`}>
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs opacity-50 mr-2">{format(new Date(task.date), 'MMM d')}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Right Panel: Stats Only (Calendar Removed) */}
        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-200 dark:border-violet-900/30">
            <h3 className="mb-4 text-lg font-semibold">{overviewTitle}</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="opacity-70">Completed</span>
              <span className="font-bold text-violet-600 dark:text-violet-400">
                {overviewCompleted}/{overviewTotal}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${overviewProgress}%` }}
              />
            </div>
          </GlassCard>

          {/* Calendar Widget */}
          <GlassCard className="p-4 flex justify-center">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) setSelectedDate(value);
                else if (Array.isArray(value) && value.length > 0 && value[0] instanceof Date) setSelectedDate(value[0]);
                setActiveTab("calendar");
              }}
              value={selectedDate}
              className="react-calendar-custom"
              tileClassName={({ date, view }) => {
                if (view === "month") {
                  const hasTask = tasks.some(t => isSameDay(t.date, date));
                  return hasTask ? "has-task" : "";
                }
                return null;
              }}
            />
          </GlassCard>

        </div>
      </section>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-100 to-fuchsia-50 dark:from-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-white/20 bg-white/60 p-6 backdrop-blur-xl dark:bg-black/40 lg:flex sticky top-0 h-screen">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg">
            <ListTodo className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">TaskMaster</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: "today", label: "Today", icon: <CalendarIcon className="mr-3 h-5 w-5" /> },
            { id: "important", label: "Important", icon: <Star className="mr-3 h-5 w-5" /> },
            { id: "tasks", label: "All Tasks", icon: <CheckCircle2 className="mr-3 h-5 w-5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-all ${activeTab === item.id
                ? "bg-violet-100 text-violet-700 shadow-sm dark:bg-violet-500/20 dark:text-violet-300"
                : "hover:bg-white/50 dark:hover:bg-white/5"
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-zinc-200 py-4 dark:border-zinc-800">
          <div
            onClick={() => setActiveTab("profile")}
            className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 shadow-sm transition-all hover:bg-white/80 dark:hover:bg-black/60 ${activeTab === "profile" ? "bg-violet-100 dark:bg-violet-500/20 ring-1 ring-violet-200 dark:ring-violet-500/30" : "bg-white/50 dark:bg-black/50"}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs opacity-70">
                {user.email || "user@example.com"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setUser(null);
              setActiveTab("today");
              setNewTask("");
              setSelectedDate(new Date());
            }}
            className="mt-2 w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              {activeTab === 'profile' ? 'Your Profile' : `Good Morning, ${user.name}!`}
            </h2>
            <p className="opacity-70">
              {format(new Date(), "EEEE, MMMM do, yyyy")}
            </p>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
