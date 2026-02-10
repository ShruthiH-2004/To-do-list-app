"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, CheckCircle2, Clock, Edit2, CalendarDays, Save, X, Trash2, Quote } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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
    dob?: string;
    bio?: string;
    dailyQuote?: string;
}

interface ProfileViewProps {
    user: UserProfile;
    tasks: Task[];
    onUpdateUser: (updatedUser: UserProfile) => void;
    onDeleteUser: () => void;
}

export default function ProfileView({ user, tasks, onUpdateUser, onDeleteUser }: ProfileViewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile>(user);
    const [isEditingQuote, setIsEditingQuote] = useState(false);
    const [quote, setQuote] = useState(user.dailyQuote || "Your daily inspiration goes here...");

    // Stats Calculations
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = tasks.length - completedCount;
    // Overall Activity Productivity
    const overallRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    // Everyday Productivity (Today)
    const todayTasks = tasks.filter(t => isSameDay(new Date(t.date), new Date()));
    const todayCompleted = todayTasks.filter(t => t.completed).length;
    const dailyRate = todayTasks.length > 0 ? Math.round((todayCompleted / todayTasks.length) * 100) : 0;

    const handleSave = () => {
        onUpdateUser(formData);
        setIsEditing(false);
    };

    const handleSaveQuote = () => {
        const updatedUser = { ...user, dailyQuote: quote };
        onUpdateUser(updatedUser);
        setFormData(updatedUser); // Keep formData in sync
        setIsEditingQuote(false);
    }

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
            {/* Header Section */}
            <GlassCard className="relative overflow-hidden p-8">
                <div className="absolute top-0 left-0 h-32 w-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20" />
                <div className="relative z-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-4xl font-bold text-white shadow-xl ring-4 ring-white/20">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-2">
                        {isEditing ? (
                            <div className="grid gap-4 sm:max-w-md">
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Username"
                                    className="bg-white/50 dark:bg-black/50"
                                />
                                <Input
                                    value={formData.email || ""}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Email Address"
                                    className="bg-white/50 dark:bg-black/50"
                                />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{user.name}</h2>
                                <p className="text-zinc-500 dark:text-zinc-400">{user.email || "user@example.com"}</p>
                            </>
                        )}

                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                <CalendarDays className="h-3 w-3" /> Joined {format(new Date(), "MMM yyyy")}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                    <Save className="mr-2 h-4 w-4" /> Save
                                </Button>
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                    <X className="mr-2 h-4 w-4" /> Cancel
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" onClick={() => setIsEditing(true)} className="border-violet-200 hover:bg-violet-50 dark:border-violet-800 dark:hover:bg-violet-900/20">
                                <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        )}
                    </div>
                </div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Completed Tasks Card */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <GlassCard className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-900/30">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">{completedCount}</h3>
                        <p className="font-medium text-emerald-600/80 dark:text-emerald-500">Completed Tasks</p>
                    </GlassCard>
                </motion.div>

                {/* Pending Tasks Card */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <GlassCard className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-900/30">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            <Clock className="h-8 w-8" />
                        </div>
                        <h3 className="text-4xl font-bold text-orange-700 dark:text-orange-400">{pendingCount}</h3>
                        <p className="font-medium text-orange-600/80 dark:text-orange-500">Pending Tasks</p>
                    </GlassCard>
                </motion.div>

                {/* Productivity Card (Split) */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <GlassCard className="flex h-full flex-col justify-center p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-900/30">
                        <h4 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200 mb-4">Productivity</h4>

                        {/* Overall Progress */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-500">Overall Activity</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">{overallRate}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${overallRate}%` }}
                                    transition={{ duration: 0.8 }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                />
                            </div>
                        </div>

                        {/* Daily Progress */}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-500">Everyday Productivity</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{dailyRate}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dailyRate}%` }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                />
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <GlassCard className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Account Information</h3>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="flex flex-col sm:flex-row justify-between border-b border-zinc-100 py-3 dark:border-white/5">
                            <span className="text-zinc-500 mb-1 sm:mb-0">Username</span>
                            <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between border-b border-zinc-100 py-3 dark:border-white/5">
                            <span className="text-zinc-500 mb-1 sm:mb-0">Email</span>
                            <span className="font-medium">{user.email || "No email added"}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between border-b border-zinc-100 py-3 dark:border-white/5">
                            <span className="text-zinc-500 mb-1 sm:mb-0">Date of Birth</span>
                            {isEditing ? (
                                <Input
                                    type="date"
                                    value={formData.dob || ""}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    className="w-full sm:w-auto h-8 bg-white/50 dark:bg-black/50"
                                />
                            ) : (
                                <span className="font-medium">{user.dob ? format(new Date(user.dob), "PPP") : "Not set"}</span>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between py-3">
                            <span className="text-zinc-500 mb-1 sm:mb-0">Bio</span>
                            {isEditing ? (
                                <Input
                                    value={formData.bio || ""}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us about yourself"
                                    className="w-full sm:w-auto h-8 bg-white/50 dark:bg-black/50"
                                />
                            ) : (
                                <span className="font-medium max-w-xs text-right truncate">{user.bio || "No bio added"}</span>
                            )}
                        </div>
                    </div>

                    {/* Delete Account Button Moved Here */}
                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-white/5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-400">Permanently delete account.</span>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                                        onDeleteUser();
                                    }
                                }}
                                className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 px-3 h-8 text-xs"
                            >
                                <Trash2 className="mr-2 h-3 w-3" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </GlassCard>

                {/* Quote of the Day (Replaces Danger Zone) */}
                <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-violet-600 dark:text-violet-400">
                            <Quote className="h-5 w-5 fill-current" /> Quote of the Day
                        </h3>
                        {!isEditingQuote ? (
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingQuote(true)} className="h-8 w-8 p-0 rounded-full">
                                <Edit2 className="h-4 w-4 text-zinc-400" />
                            </Button>
                        ) : (
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={handleSaveQuote} className="h-8 w-8 p-0 rounded-full text-green-500 hover:text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingQuote(false)} className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-600">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                        {isEditingQuote ? (
                            <textarea
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                                className="w-full h-32 bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg p-4 resize-none focus:ring-2 focus:ring-violet-500 outline-none transition-all text-center italic font-serif text-lg text-zinc-700 dark:text-zinc-300"
                                placeholder="Enter your daily inspiration..."
                                autoFocus
                            />
                        ) : (
                            <div className="relative">
                                <Quote className="absolute -top-4 -left-4 h-8 w-8 text-violet-200 dark:text-violet-900/40 fill-current transform scale-x-[-1]" />
                                <p className="text-xl font-serif italic text-zinc-700 dark:text-zinc-300 leading-relaxed px-6">
                                    "{user.dailyQuote || "Your daily inspiration goes here..."}"
                                </p>
                                <Quote className="absolute -bottom-4 -right-4 h-8 w-8 text-violet-200 dark:text-violet-900/40 fill-current" />
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
