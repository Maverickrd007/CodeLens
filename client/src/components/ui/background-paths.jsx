import React from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Link } from "react-router-dom";

// Note: FloatingPaths is omitted here because we already integrated 
// FloatingPathsBackground globally in App.jsx! This component now just
// focuses on the beautiful animated hero text.

export function BackgroundPaths({
    title = "Understand any codebase instantly.",
}) {
    const words = title.split(" ");

    return (
        <div className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-transparent py-10">
            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-white to-white/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <div
                        className="inline-flex items-center gap-4 group relative rounded-2xl backdrop-blur-lg 
                        overflow-hidden transition-shadow duration-300"
                    >
                        <Button
                            asChild
                            variant="ghost"
                            className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                            bg-white/10 hover:bg-white/20 text-white transition-all duration-300 
                            group-hover:-translate-y-0.5 border border-white/20
                            shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                        >
                            <Link to="/register">
                                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                    Start Exploring for Free
                                </span>
                                <span
                                    className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                    transition-all duration-300"
                                >
                                    →
                                </span>
                            </Link>
                        </Button>
                        <a
                            href="#features"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent px-8 py-6 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/5"
                        >
                            See how it works
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
