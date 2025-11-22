"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CareerMatch {
  name: string;
  match: number;
  description: string;
  salary: string;
  education: string;
}

interface LearningPath {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
}

interface CareerRoadmapStep {
  stage: string;
  timeline: string;
  actions: string[];
}

interface GeminiAnalysis {
  personalityType: string;
  matchPercentage: number;
  topCareers: CareerMatch[];
  strengths: string[];
  learningPath: LearningPath;
  careerRoadmap: CareerRoadmapStep[];
  insights: string;
}

interface GeminiResultsDisplayProps {
  analysisData: GeminiAnalysis;
  onGenerateUI?: boolean;
}

export default function GeminiResultsDisplay({
  analysisData,
  onGenerateUI = false
}: GeminiResultsDisplayProps) {
  const [generatedUI, setGeneratedUI] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (onGenerateUI && analysisData) {
      generateDynamicUI();
    }
  }, [onGenerateUI, analysisData]);

  const generateDynamicUI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/gemini/generate-ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisResult: analysisData }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedUI(data.ui);
      }
    } catch (error) {
      console.error("Failed to generate dynamic UI:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#2B5F75] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Personality Type Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2B5F75]/10 to-[#4A7C59]/10 backdrop-blur-xl border border-white/10 p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-[#E8994A] to-[#2B5F75] rounded-full opacity-20 blur-2xl"
        />

        <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🎯
          </motion.span>
          {analysisData.personalityType}
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analysisData.matchPercentage}%` }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#2B5F75] via-[#E8994A] to-[#4A7C59] rounded-full"
            />
          </div>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="text-2xl font-bold text-[#E8994A]"
          >
            {analysisData.matchPercentage}%
          </motion.span>
        </div>

        <p className="text-gray-300 text-lg leading-relaxed">
          {analysisData.insights}
        </p>
      </motion.div>

      {/* Top Careers */}
      <div className="space-y-4">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-white mb-6"
        >
          Sinulle Sopivat Urat
        </motion.h3>

        {analysisData.topCareers.map((career, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 10 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2B5F75]/5 to-transparent backdrop-blur-xl border border-white/10 p-6 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-semibold text-white group-hover:text-[#E8994A] transition-colors">
                    {career.name}
                  </h4>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="px-3 py-1 bg-[#4A7C59]/20 backdrop-blur-sm rounded-full text-sm text-[#4A7C59] font-medium border border-[#4A7C59]/30"
                  >
                    {career.match}% Match
                  </motion.div>
                </div>

                <p className="text-gray-400 mb-4">{career.description}</p>

                <div className="flex gap-4 text-sm">
                  <span className="text-[#E8994A]">💰 {career.salary}</span>
                  <span className="text-[#2B5F75]">🎓 {career.education}</span>
                </div>
              </div>

              <motion.div
                className="w-1 h-full bg-gradient-to-b from-[#2B5F75] to-[#4A7C59] rounded-full"
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ delay: index * 0.1 + 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Strengths */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-gradient-to-br from-[#4A7C59]/10 to-transparent backdrop-blur-xl border border-white/10 p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Vahvuutesi</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {analysisData.strengths.map((strength, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.1, rotate: 2 }}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
            >
              <span className="text-[#E8994A]">✨</span>
              <span className="text-gray-200">{strength}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Learning Path */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-gradient-to-br from-[#2B5F75]/10 to-transparent backdrop-blur-xl border border-white/10 p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Oppimispolkusi</h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-[#E8994A] mb-3">Heti</h4>
            <ul className="space-y-2">
              {analysisData.learningPath.immediate.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-start gap-2 text-gray-300"
                >
                  <span className="text-[#E8994A] mt-1">→</span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#2B5F75] mb-3">Lyhyellä Aikavälillä</h4>
            <ul className="space-y-2">
              {analysisData.learningPath.shortTerm.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className="flex items-start gap-2 text-gray-300"
                >
                  <span className="text-[#2B5F75] mt-1">→</span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#4A7C59] mb-3">Pitkällä Aikavälillä</h4>
            <ul className="space-y-2">
              {analysisData.learningPath.longTerm.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.05 }}
                  className="flex items-start gap-2 text-gray-300"
                >
                  <span className="text-[#4A7C59] mt-1">→</span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Career Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-2xl bg-gradient-to-br from-[#E8994A]/10 to-transparent backdrop-blur-xl border border-white/10 p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-8">Urapolkusi</h3>

        <div className="relative space-y-8">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2B5F75] via-[#E8994A] to-[#4A7C59]" />

          {analysisData.careerRoadmap.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.15 }}
              className="relative pl-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + index * 0.15 + 0.2, type: "spring" }}
                className="absolute left-6 top-2 w-5 h-5 bg-[#E8994A] rounded-full border-4 border-[#0f1419]"
              />

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <h4 className="text-xl font-semibold text-white">{step.stage}</h4>
                  <span className="text-sm text-gray-400">{step.timeline}</span>
                </div>

                <ul className="space-y-2">
                  {step.actions.map((action, actionIndex) => (
                    <motion.li
                      key={actionIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + index * 0.15 + 0.3 + actionIndex * 0.05 }}
                      className="flex items-start gap-2 text-gray-300"
                    >
                      <span className="text-[#4A7C59] mt-1">✓</span>
                      {action}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
