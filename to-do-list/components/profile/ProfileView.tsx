"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { User, CheckCircle2, Clock, Trophy, Edit2, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Task {
    id: string;
    title: string;
    completed: boolean;
    date: Date;
    important: boolean;
}

interface ProfileViewProps {
    user: { name: string; email?: string };
    tasks: Task[];
}

export default function ProfileView({ user, tasks }: ProfileViewProps) {
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = tasks.length - completedCount;
    const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header Section */}
            <GlassCard className="relative overflow-hidden p-8">
                <div className="absolute top-0 left-0 h-32 w-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20" />
                <div className="relative z-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-4xl font-bold text-white shadow-xl ring-4 ring-white/20">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{user.name}</h2>
                        <p className="text-zinc-500 dark:text-zinc-400">{user.email || "user@example.com"}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                                <Trophy className="h-3 w-3" /> Level 1 Achiever
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                <CalendarDays className="h-3 w-3" /> Joined {format(new Date(), "MMM yyyy")}
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" className="border-violet-200 hover:bg-violet-50 dark:border-violet-800 dark:hover:bg-violet-900/20">
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
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

                {/* Completion Rate Card */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <GlassCard className="flex h-full flex-col justify-between p-8 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-900/30">
                        <div>
                            <h4 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">Productivity Score</h4>
                            <h3 className="mt-2 text-5xl font-bold text-blue-600 dark:text-blue-400">{completionRate}%</h3>
                            <p className="text-sm text-zinc-500 mt-1">Completion Rate</p>
                        </div>

                        <div className="relative mt-6 h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${completionRate}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                            />
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <GlassCard className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">Account Information</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-zinc-100 py-2 dark:border-white/5">
                            <span className="text-zinc-500">Username</span>
                            <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-100 py-2 dark:border-white/5">
                            <span className="text-zinc-500">Email</span>
                            <span className="font-medium">{user.email || "user@example.com"}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-zinc-500">Member Since</span>
                            <span className="font-medium">{format(new Date(), "MMMM d, yyyy")}</span>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
