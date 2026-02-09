"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import { Chrome, ArrowRight, User, Mail, Lock } from "lucide-react";

export default function AuthPage({ onAuth }: { onAuth: (user: any, method: "login" | "signup" | "reset" | "get_question") => string | void | any }) {
    const [view, setView] = useState<"login" | "signup" | "forgot">("login");
    const [showSplash, setShowSplash] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [fetchedQuestion, setFetchedQuestion] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        securityQuestion: "What is your pet's name?", // Default
        securityAnswer: ""
    });

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (view === "forgot" && !fetchedQuestion) {
            // Step 1 of Forgot Password: Get User's Question
            const res = onAuth({ email: formData.email }, "get_question");
            if (typeof res === "string") {
                setError(res);
            } else if (res && res.question) {
                setFetchedQuestion(res.question);
            }
            return;
        }

        const method = view === "forgot" ? "reset" : view;
        const res = onAuth(formData, method);

        if (res && typeof res === "string") {
            setError(res);
        } else if (view === "forgot") {
            setSuccessMsg("Password reset successfully! Please login.");
            setTimeout(() => {
                setView("login");
                setFetchedQuestion(null);
                setSuccessMsg(null);
                setFormData({ ...formData, password: "", securityAnswer: "" });
            }, 2000);
        }
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
                        {view === "login" ? "Welcome back!" : view === "signup" ? "Start your journey with us." : "Recover your account"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Messages */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 rounded-lg bg-red-500/80 p-3 text-center text-sm text-white backdrop-blur-md"
                            >
                                {error}
                            </motion.div>
                        )}
                        {successMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 rounded-lg bg-green-500/80 p-3 text-center text-sm text-white backdrop-blur-md"
                            >
                                {successMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Full Name - Only for Signup */}
                    <AnimatePresence mode="wait">
                        {view === "signup" && (
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
                                    required={view === "signup"}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Email - Always Visible */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                        <Input
                            type="email"
                            placeholder="Email Address"
                            className="bg-white/10 border-white/20 pl-10 text-white placeholder:text-white/50 focus:border-violet-500 focus:ring-violet-500"
                            required
                            disabled={!!fetchedQuestion} // Lock email after fetching question
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Forgot Password Flow */}
                    {view === "forgot" && fetchedQuestion && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <div className="rounded-lg bg-white/5 p-3 text-sm text-white">
                                <span className="opacity-70">Security Question:</span>
                                <p className="font-medium">{fetchedQuestion}</p>
                            </div>
                            <Input
                                type="text"
                                placeholder="Answer"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-violet-500"
                                required
                                value={formData.securityAnswer}
                                onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                            />
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                                <Input
                                    type="password"
                                    placeholder="New Password"
                                    className="bg-white/10 border-white/20 pl-10 text-white placeholder:text-white/50 focus:border-violet-500"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Security Question Setup - Only for Signup */}
                    <AnimatePresence mode="wait">
                        {view === "signup" && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-4"
                            >
                                <select
                                    className="w-full rounded-md bg-white/10 border border-white/20 p-2 text-white placeholder:text-white/50 focus:border-violet-500 outline-none"
                                    value={formData.securityQuestion}
                                    onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                                >
                                    <option className="bg-zinc-800" value="What is your pet's name?">What is your pet's name?</option>
                                    <option className="bg-zinc-800" value="What is your favorite place?">What is your favorite place?</option>
                                    <option className="bg-zinc-800" value="What is your favorite food?">What is your favorite food?</option>
                                    <option className="bg-zinc-800" value="Where do you live?">Where do you live?</option>
                                    <option className="bg-zinc-800" value="What represents you?">What represents you?</option>
                                </select>
                                <Input
                                    type="text"
                                    placeholder="Security Answer"
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-violet-500"
                                    required={view === "signup"}
                                    value={formData.securityAnswer}
                                    onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Password - Login/Signup Only */}
                    {view !== "forgot" && (
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                            <Input
                                type="password"
                                placeholder="Password"
                                className="bg-white/10 border-white/20 pl-10 text-white placeholder:text-white/50 focus:border-violet-500 focus:ring-violet-500"
                                required={view !== "forgot"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    )}

                    {/* Forgot Password Link - Only Login */}
                    {view === "login" && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => { setView("forgot"); setError(null); }}
                                className="text-xs text-white/70 hover:text-white hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                    >
                        {view === "login" ? "Sign In" : view === "signup" ? "Sign Up" : (!fetchedQuestion ? "Find Account" : "Reset Password")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </form>

                <div className="mt-6 text-center space-y-4">
                    <button
                        onClick={() => {
                            setView(view === "login" ? "signup" : "login");
                            setError(null);
                            setFetchedQuestion(null);
                        }}
                        className="text-sm font-medium text-white/80 transition-colors hover:text-white hover:underline block w-full"
                    >
                        {view === "login"
                            ? "Don't have an account? Sign Up"
                            : view === "signup"
                                ? "Already have an account? Sign In"
                                : "Back to Login"}
                    </button>


                </div>
            </GlassCard>
        </div>
    );
}
