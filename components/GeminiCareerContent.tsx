"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface GeminiCareerContentProps {
  career: string;
  userContext: {
    age?: number;
    education?: string;
    interests?: string[];
    currentSkills?: string[];
    personalityType?: string;
  };
}

export default function GeminiCareerContent({
  career,
  userContext
}: GeminiCareerContentProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [career, userContext]);

  const generateContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career, userContext }),
      });

      const data = await response.json();
      if (data.success) {
        setContent(data.content);
      } else {
        setError(data.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Failed to generate career content:", error);
      setError("Failed to generate content");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#2B5F75] border-t-[#E8994A] rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 w-16 h-16 border-4 border-[#4A7C59] border-b-transparent rounded-full opacity-30"
          />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-400"
        >
          Luodaan personoitua sisältöä urasta <span className="text-[#E8994A] font-semibold">{career}</span>...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-8 text-center"
      >
        <span className="text-4xl mb-4 block">⚠️</span>
        <p className="text-red-400">{error}</p>
        <button
          onClick={generateContent}
          className="mt-4 px-6 py-2 bg-[#2B5F75] hover:bg-[#2B5F75]/80 rounded-lg text-white transition-colors"
        >
          Yritä Uudelleen
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          {career}
        </motion.h1>
        <p className="text-gray-400 text-lg">
          Personoitu uraopas sinulle
        </p>
      </motion.div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl bg-gradient-to-br from-[#2B5F75]/5 via-transparent to-[#4A7C59]/5 backdrop-blur-xl border border-white/10 p-8 md:p-12"
      >
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => {
                const { onDrag, onDragStart, onDragEnd, ...safeProps } = props as any;
                return (
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-white mb-6 flex items-center gap-3"
                    {...safeProps}
                  />
                );
              },
              h2: ({ node, ...props }) => {
                const { onDrag, onDragStart, onDragEnd, ...safeProps } = props as any;
                return (
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold text-[#E8994A] mt-8 mb-4 flex items-center gap-2"
                    {...safeProps}
                  />
                );
              },
              h3: ({ node, ...props }) => {
                const { onDrag, onDragStart, onDragEnd, ...safeProps } = props as any;
                return (
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-semibold text-[#2B5F75] mt-6 mb-3"
                    {...safeProps}
                  />
                );
              },
              p: ({ node, ...props }) => {
                const { onDrag, onDragStart, onDragEnd, ...safeProps } = props as any;
                return (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-300 leading-relaxed mb-4"
                    {...safeProps}
                  />
                );
              },
              ul: ({ node, ...props }) => (
                <ul className="space-y-2 my-4" {...props} />
              ),
              li: ({ node, ...props }) => {
                const { onDrag, onDragStart, onDragEnd, ...safeProps } = props as any;
                return (
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <span className="text-[#E8994A] mt-1">▸</span>
                    <span {...safeProps} />
                  </motion.li>
                );
              },
              strong: ({ node, ...props }) => (
                <strong className="text-[#E8994A] font-semibold" {...props} />
              ),
              blockquote: ({ node, ...props }) => {
                const { onDrag, onDragStart, onDragEnd, ...safeProps } = props as any;
                return (
                  <motion.blockquote
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-l-4 border-[#2B5F75] pl-6 italic text-gray-400 my-6"
                    {...safeProps}
                  />
                );
              },
              code: ({ node, ...props }) => (
                <code
                  className="bg-white/5 px-2 py-1 rounded text-[#4A7C59] text-sm"
                  {...props}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </motion.div>

      {/* User Context Display */}
      {userContext && Object.keys(userContext).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-2xl bg-gradient-to-br from-[#E8994A]/10 to-transparent backdrop-blur-xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Tämä sisältö on personoitu sinulle:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userContext.age && (
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-[#E8994A]">👤</span>
                <span>Ikä: {userContext.age} vuotta</span>
              </div>
            )}

            {userContext.education && (
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-[#2B5F75]">🎓</span>
                <span>Koulutus: {userContext.education}</span>
              </div>
            )}

            {userContext.personalityType && (
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-[#4A7C59]">🎯</span>
                <span>Tyyppi: {userContext.personalityType}</span>
              </div>
            )}

            {userContext.interests && userContext.interests.length > 0 && (
              <div className="col-span-2">
                <div className="flex items-start gap-2 text-gray-300">
                  <span className="text-[#E8994A] mt-1">💡</span>
                  <div className="flex-1">
                    <span className="block mb-2">Kiinnostuksen kohteet:</span>
                    <div className="flex flex-wrap gap-2">
                      {userContext.interests.map((interest, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="px-3 py-1 bg-[#E8994A]/20 text-[#E8994A] rounded-lg text-sm border border-[#E8994A]/30"
                        >
                          {interest}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {userContext.currentSkills && userContext.currentSkills.length > 0 && (
              <div className="col-span-2">
                <div className="flex items-start gap-2 text-gray-300">
                  <span className="text-[#4A7C59] mt-1">⚡</span>
                  <div className="flex-1">
                    <span className="block mb-2">Nykyiset taidot:</span>
                    <div className="flex flex-wrap gap-2">
                      {userContext.currentSkills.map((skill, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="px-3 py-1 bg-[#4A7C59]/20 text-[#4A7C59] rounded-lg text-sm border border-[#4A7C59]/30"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Regenerate Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center"
      >
        <button
          onClick={generateContent}
          className="px-6 py-3 bg-gradient-to-r from-[#2B5F75] to-[#4A7C59] hover:from-[#2B5F75]/80 hover:to-[#4A7C59]/80 rounded-xl text-white font-medium transition-all transform hover:scale-105"
        >
          🔄 Päivitä Sisältö
        </button>
      </motion.div>
    </motion.div>
  );
}
