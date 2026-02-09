"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import { Chrome, ArrowRight, User, Mail, Lock } from "lucide-react";

export default function AuthPage({ onLogin }: { onLogin: (user: any) => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login for now
        onLogin({ name: "User" });
    };

    if (showSplash) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500"
            >
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="text-6xl font-bold text-white drop-shadow-lg"
                >
                    Hello
                </motion.h1>
            </motion.div>
        );
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <GlassCard className="z-10 w-full max-w-md p-8">
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 shadow-lg"
                    >
                        <Chrome className="h-6 w-6 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white">To Do App</h2>
                    <p className="mt-2 text-zinc-200">
                        {isLogin ? "Welcome back!" : "Start your journey with us."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="relative"
                            >
                                <User className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    className="bg-white/10 border-white/20 pl-10 text-white placeholder:text-white/50 focus:border-violet-500 focus:ring-violet-500"
                                    required
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                        <Input
                            type="email"
                            placeholder="Email Address"
                            className="bg-white/10 border-white/20 pl-10 text-white placeholder:text-white/50 focus:border-violet-500 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                        <Input
                            type="password"
                            placeholder="Password"
                            className="bg-white/10 border-white/20 pl-10 text-white placeholder:text-white/50 focus:border-violet-500 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                    >
                        {isLogin ? "Sign In" : "Sign Up"}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-medium text-white/80 transition-colors hover:text-white hover:underline"
                    >
                        {isLogin
                            ? "Don't have an account? Sign Up"
                            : "Already have an account? Sign In"}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
