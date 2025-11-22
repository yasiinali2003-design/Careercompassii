"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PathNode {
  id: string;
  title: string;
  description: string;
  timeline: string;
  skillsRequired: string[];
  skillsGained: string[];
  animation: string;
  interactive: boolean;
  branches?: { condition: string; nextId: string }[];
}

interface CareerPathData {
  path: PathNode[];
  visualizationType: string;
  interactionHints: string[];
}

interface GeminiCareerPathVisualizationProps {
  userGoals: string[];
  currentSkills: string[];
}

export default function GeminiCareerPathVisualization({
  userGoals,
  currentSkills
}: GeminiCareerPathVisualizationProps) {
  const [pathData, setPathData] = useState<CareerPathData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    generateVisualization();
  }, [userGoals, currentSkills]);

  const generateVisualization = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini/visualization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userGoals, currentSkills }),
      });

      const data = await response.json();
      if (data.success) {
        setPathData(data.visualization);
      }
    } catch (error) {
      console.error("Failed to generate career path visualization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const toggleNodeCompletion = (nodeId: string) => {
    setCompletedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-[#2B5F75] border-t-[#E8994A] rounded-full"
        />
        <p className="text-gray-400 animate-pulse">Luodaan urapolkuasi...</p>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="text-center text-gray-400 py-12">
        Urapolun visualisointia ei voitu luoda
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-4">
          Interaktiivinen Urapolkusi
        </h2>
        <p className="text-gray-400 text-lg">
          Klikkaa vaiheita nähdäksesi lisätietoja
        </p>
      </motion.div>

      {/* Interaction Hints */}
      {pathData.interactionHints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 flex flex-wrap gap-3 justify-center"
        >
          {pathData.interactionHints.map((hint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="px-4 py-2 bg-[#E8994A]/10 backdrop-blur-sm rounded-full text-sm text-[#E8994A] border border-[#E8994A]/20"
            >
              💡 {hint}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Career Path Visualization */}
      <div className="relative">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2B5F75" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#E8994A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4A7C59" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {pathData.path.map((node, index) => {
            if (index < pathData.path.length - 1) {
              const startY = 120 + index * 280;
              const endY = 120 + (index + 1) * 280;

              return (
                <motion.path
                  key={`line-${index}`}
                  d={`M 50% ${startY} Q 50% ${(startY + endY) / 2} 50% ${endY}`}
                  stroke="url(#pathGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="10 5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: index * 0.3, duration: 0.8 }}
                />
              );
            }
            return null;
          })}
        </svg>

        {/* Path Nodes */}
        <div className="relative space-y-16" style={{ zIndex: 1 }}>
          {pathData.path.map((node, index) => {
            const isCompleted = completedNodes.has(node.id);
            const isSelected = selectedNode === node.id;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                className={`relative ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'} max-w-2xl`}
              >
                {/* Node Card */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNodeClick(node.id)}
                  className={`
                    relative overflow-hidden rounded-2xl cursor-pointer
                    transition-all duration-300
                    ${isCompleted
                      ? 'bg-gradient-to-br from-[#4A7C59]/20 to-[#4A7C59]/5 border-[#4A7C59]/50'
                      : 'bg-gradient-to-br from-[#2B5F75]/10 to-transparent border-white/10'
                    }
                    backdrop-blur-xl border-2 p-6
                    ${isSelected ? 'ring-4 ring-[#E8994A]/50' : ''}
                  `}
                >
                  {/* Completion Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNodeCompletion(node.id);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-[#4A7C59]/20 transition-colors"
                  >
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="text-[#4A7C59] text-xl"
                        >
                          ✓
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  {/* Stage Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.2, type: "spring" }}
                    className="absolute -left-4 -top-4 w-12 h-12 bg-gradient-to-br from-[#E8994A] to-[#2B5F75] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  >
                    {index + 1}
                  </motion.div>

                  {/* Content */}
                  <div className="ml-8">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-white">{node.title}</h3>
                      <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                        ⏱️ {node.timeline}
                      </span>
                    </div>

                    <p className="text-gray-300 mb-4">{node.description}</p>

                    {/* Expandable Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4 mt-6 pt-6 border-t border-white/10"
                        >
                          {/* Skills Required */}
                          {node.skillsRequired.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-[#2B5F75] mb-2">
                                Vaaditut Taidot:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {node.skillsRequired.map((skill, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`px-3 py-1 rounded-lg text-sm ${
                                      currentSkills.includes(skill)
                                        ? 'bg-[#4A7C59]/20 text-[#4A7C59] border border-[#4A7C59]/30'
                                        : 'bg-white/5 text-gray-400 border border-white/10'
                                    }`}
                                  >
                                    {skill}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills Gained */}
                          {node.skillsGained.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-[#E8994A] mb-2">
                                Opittavat Taidot:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {node.skillsGained.map((skill, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="px-3 py-1 bg-[#E8994A]/20 text-[#E8994A] border border-[#E8994A]/30 rounded-lg text-sm"
                                  >
                                    ✨ {skill}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Branches */}
                          {node.branches && node.branches.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-2">
                                Vaihtoehtoiset Polut:
                              </h4>
                              <div className="space-y-2">
                                {node.branches.map((branch, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-2 text-sm text-gray-300"
                                  >
                                    <span className="text-[#E8994A]">↪</span>
                                    {branch.condition}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-12 rounded-2xl bg-gradient-to-br from-[#2B5F75]/10 to-[#4A7C59]/10 backdrop-blur-xl border border-white/10 p-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Edistymisesi</h3>
          <span className="text-2xl font-bold text-[#E8994A]">
            {completedNodes.size} / {pathData.path.length}
          </span>
        </div>

        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedNodes.size / pathData.path.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-[#2B5F75] via-[#E8994A] to-[#4A7C59]"
          />
        </div>
      </motion.div>
    </div>
  );
}
