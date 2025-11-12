#!/usr/bin/env node

const fs = require('fs');

// Combine all 75 careers (50 modern + 25 progressive)
const allNewCareers = [
  // TECH/STARTUP (15 careers) - Category: innovoija
  {
    slug: "product-manager",
    title: "Product Manager",
    category: "innovoija",
    interests: { technology: 0.8, people: 0.6, creative: 0.5, analytical: 0.8, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.8, organization: 0.9, problem_solving: 0.9 },
    values: { growth: 0.8, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    slug: "scrum-master",
    title: "Scrum Master",
    category: "jarjestaja",
    interests: { technology: 0.7, people: 0.9, creative: 0.3, analytical: 0.5, hands_on: 0, business: 0.5, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 1, independence: 0.3, leadership: 0.7, organization: 1, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    category: "innovoija",
    interests: { technology: 1, people: 0.3, creative: 0.4, analytical: 0.9, hands_on: 0.5, business: 0.3, environment: 0, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.4, organization: 0.8, problem_solving: 1 },
    values: { growth: 0.8, impact: 0.5 },
    context: { outdoor: 0 }
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    category: "innovoija",
    interests: { technology: 0.8, people: 0.4, creative: 0.3, analytical: 1, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.6, independence: 0.7, leadership: 0.3, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "ux-researcher",
    title: "UX Researcher",
    category: "innovoija",
    interests: { technology: 0.6, people: 0.9, creative: 0.6, analytical: 0.8, hands_on: 0, business: 0.4, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.4, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.6, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "growth-hacker",
    title: "Growth Hacker",
    category: "innovoija",
    interests: { technology: 0.8, people: 0.5, creative: 0.7, analytical: 0.9, hands_on: 0, business: 1, environment: 0, health: 0, innovation: 0.9 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.5, organization: 0.6, problem_solving: 0.9 },
    values: { growth: 1, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "customer-success-manager",
    title: "Customer Success Manager",
    category: "auttaja",
    interests: { technology: 0.6, people: 1, creative: 0.4, analytical: 0.5, hands_on: 0, business: 0.7, environment: 0, health: 0, innovation: 0.3 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.6, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    slug: "frontend-developer",
    title: "Frontend Developer",
    category: "innovoija",
    interests: { technology: 1, people: 0.3, creative: 0.7, analytical: 0.7, hands_on: 0.4, business: 0.2, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.2, organization: 0.6, problem_solving: 0.9 },
    values: { growth: 0.8, impact: 0.5 },
    context: { outdoor: 0 }
  },
  {
    slug: "backend-developer",
    title: "Backend Developer",
    category: "innovoija",
    interests: { technology: 1, people: 0.2, creative: 0.4, analytical: 0.9, hands_on: 0.4, business: 0.2, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.6, independence: 0.9, leadership: 0.2, organization: 0.7, problem_solving: 1 },
    values: { growth: 0.8, impact: 0.5 },
    context: { outdoor: 0 }
  },
  {
    slug: "qa-engineer",
    title: "QA Engineer",
    category: "innovoija",
    interests: { technology: 0.8, people: 0.4, creative: 0.3, analytical: 0.9, hands_on: 0.3, business: 0.3, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.7, independence: 0.6, leadership: 0.3, organization: 0.9, problem_solving: 0.9 },
    values: { growth: 0.6, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "technical-writer",
    title: "Technical Writer",
    category: "luova",
    interests: { technology: 0.7, people: 0.5, creative: 0.8, analytical: 0.6, hands_on: 0, business: 0.3, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.6, independence: 0.8, leadership: 0.2, organization: 0.9, problem_solving: 0.6 },
    values: { growth: 0.5, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "site-reliability-engineer",
    title: "Site Reliability Engineer",
    category: "innovoija",
    interests: { technology: 1, people: 0.3, creative: 0.4, analytical: 0.9, hands_on: 0.5, business: 0.3, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.4, organization: 0.9, problem_solving: 1 },
    values: { growth: 0.8, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "solutions-architect",
    title: "Solutions Architect",
    category: "visionaari",
    interests: { technology: 0.9, people: 0.6, creative: 0.6, analytical: 1, hands_on: 0.3, business: 0.7, environment: 0, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.7, organization: 0.8, problem_solving: 1 },
    values: { growth: 0.8, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    slug: "platform-engineer",
    title: "Platform Engineer",
    category: "innovoija",
    interests: { technology: 1, people: 0.4, creative: 0.5, analytical: 0.9, hands_on: 0.5, business: 0.3, environment: 0, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.4, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.8, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "api-developer",
    title: "API Developer",
    category: "innovoija",
    interests: { technology: 0.9, people: 0.3, creative: 0.5, analytical: 0.8, hands_on: 0.4, business: 0.3, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.3, organization: 0.7, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.6 },
    context: { outdoor: 0 }
  },

  // CREATIVE/MEDIA (12 careers) - Category: luova
  {
    slug: "content-strategist",
    title: "Content Strategist",
    category: "luova",
    interests: { technology: 0.5, people: 0.7, creative: 0.9, analytical: 0.6, hands_on: 0, business: 0.7, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "social-media-manager",
    title: "Social Media Manager",
    category: "luova",
    interests: { technology: 0.6, people: 0.9, creative: 0.8, analytical: 0.5, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.7, independence: 0.6, leadership: 0.5, organization: 0.7, problem_solving: 0.6 },
    values: { growth: 0.7, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "podcast-producer",
    title: "Podcast Producer",
    category: "luova",
    interests: { technology: 0.6, people: 0.8, creative: 0.9, analytical: 0.4, hands_on: 0.5, business: 0.5, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.7, leadership: 0.5, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "video-editor",
    title: "Video Editor",
    category: "luova",
    interests: { technology: 0.7, people: 0.4, creative: 1, analytical: 0.4, hands_on: 0.6, business: 0.3, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.6, independence: 0.8, leadership: 0.2, organization: 0.7, problem_solving: 0.6 },
    values: { growth: 0.6, impact: 0.5 },
    context: { outdoor: 0 }
  },
  {
    slug: "community-manager",
    title: "Community Manager",
    category: "auttaja",
    interests: { technology: 0.5, people: 1, creative: 0.6, analytical: 0.4, hands_on: 0, business: 0.5, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.6, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    slug: "brand-designer",
    title: "Brand Designer",
    category: "luova",
    interests: { technology: 0.6, people: 0.6, creative: 1, analytical: 0.5, hands_on: 0.4, business: 0.7, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.4, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "copywriter",
    title: "Copywriter",
    category: "luova",
    interests: { technology: 0.4, people: 0.6, creative: 1, analytical: 0.5, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.6, independence: 0.8, leadership: 0.3, organization: 0.6, problem_solving: 0.6 },
    values: { growth: 0.6, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "motion-graphics-designer",
    title: "Motion Graphics Designer",
    category: "luova",
    interests: { technology: 0.7, people: 0.4, creative: 1, analytical: 0.5, hands_on: 0.5, business: 0.4, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.6, independence: 0.8, leadership: 0.3, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    category: "luova",
    interests: { technology: 0.7, people: 0.7, creative: 0.9, analytical: 0.6, hands_on: 0.4, business: 0.5, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.4, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "content-creator",
    title: "Content Creator",
    category: "luova",
    interests: { technology: 0.6, people: 0.7, creative: 1, analytical: 0.4, hands_on: 0.5, business: 0.6, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.5, independence: 0.9, leadership: 0.4, organization: 0.6, problem_solving: 0.6 },
    values: { growth: 0.8, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "influencer-marketing-specialist",
    title: "Influencer Marketing Specialist",
    category: "luova",
    interests: { technology: 0.6, people: 0.9, creative: 0.7, analytical: 0.5, hands_on: 0, business: 0.8, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.5, organization: 0.7, problem_solving: 0.6 },
    values: { growth: 0.8, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "digital-content-producer",
    title: "Digital Content Producer",
    category: "luova",
    interests: { technology: 0.7, people: 0.6, creative: 0.9, analytical: 0.5, hands_on: 0.5, business: 0.6, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.5, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.6 },
    context: { outdoor: 0 }
  },

  // BUSINESS/CONSULTING (10 careers)
  {
    slug: "management-consultant",
    title: "Management Consultant",
    category: "visionaari",
    interests: { technology: 0.5, people: 0.8, creative: 0.5, analytical: 0.9, hands_on: 0, business: 1, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.8, organization: 0.9, problem_solving: 1 },
    values: { growth: 0.9, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    slug: "business-analyst",
    title: "Business Analyst",
    category: "visionaari",
    interests: { technology: 0.6, people: 0.6, creative: 0.4, analytical: 1, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.7, independence: 0.6, leadership: 0.5, organization: 0.9, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "strategy-consultant",
    title: "Strategy Consultant",
    category: "visionaari",
    interests: { technology: 0.4, people: 0.7, creative: 0.6, analytical: 0.9, hands_on: 0, business: 1, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.9, organization: 0.8, problem_solving: 1 },
    values: { growth: 0.9, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "sales-development-representative",
    title: "Sales Development Representative",
    category: "johtaja",
    interests: { technology: 0.5, people: 0.9, creative: 0.5, analytical: 0.5, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.5, organization: 0.7, problem_solving: 0.6 },
    values: { growth: 0.9, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "account-executive",
    title: "Account Executive",
    category: "johtaja",
    interests: { technology: 0.5, people: 0.9, creative: 0.5, analytical: 0.6, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.8, independence: 0.7, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.9, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "operations-manager",
    title: "Operations Manager",
    category: "jarjestaja",
    interests: { technology: 0.5, people: 0.7, creative: 0.3, analytical: 0.8, hands_on: 0.3, business: 0.8, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.8, independence: 0.5, leadership: 0.8, organization: 1, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "business-development-manager",
    title: "Business Development Manager",
    category: "johtaja",
    interests: { technology: 0.5, people: 0.9, creative: 0.6, analytical: 0.7, hands_on: 0, business: 1, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.8, independence: 0.7, leadership: 0.8, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 1, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    slug: "project-coordinator",
    title: "Project Coordinator",
    category: "jarjestaja",
    interests: { technology: 0.5, people: 0.8, creative: 0.4, analytical: 0.6, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.3 },
    workstyle: { teamwork: 0.9, independence: 0.4, leadership: 0.5, organization: 1, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "digital-transformation-consultant",
    title: "Digital Transformation Consultant",
    category: "visionaari",
    interests: { technology: 0.8, people: 0.7, creative: 0.6, analytical: 0.8, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.9 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.8, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.9, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "change-management-specialist",
    title: "Change Management Specialist",
    category: "visionaari",
    interests: { technology: 0.4, people: 0.9, creative: 0.5, analytical: 0.7, hands_on: 0, business: 0.8, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.8, organization: 0.9, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },

  // MODERN HEALTHCARE/WELLNESS (6 careers)
  {
    slug: "mental-health-counselor",
    title: "Mental Health Counselor",
    category: "auttaja",
    interests: { technology: 0.3, people: 1, creative: 0.4, analytical: 0.6, hands_on: 0, business: 0.2, environment: 0, health: 1, innovation: 0.3 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.5, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    slug: "wellness-coach",
    title: "Wellness Coach",
    category: "auttaja",
    interests: { technology: 0.4, people: 0.9, creative: 0.5, analytical: 0.4, hands_on: 0.3, business: 0.5, environment: 0.3, health: 0.9, innovation: 0.5 },
    workstyle: { teamwork: 0.6, independence: 0.8, leadership: 0.6, organization: 0.6, problem_solving: 0.6 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0.3 }
  },
  {
    slug: "occupational-health-specialist",
    title: "Occupational Health Specialist",
    category: "auttaja",
    interests: { technology: 0.4, people: 0.8, creative: 0.3, analytical: 0.7, hands_on: 0.2, business: 0.5, environment: 0.2, health: 1, innovation: 0.4 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.6, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "health-data-analyst",
    title: "Health Data Analyst",
    category: "innovoija",
    interests: { technology: 0.8, people: 0.4, creative: 0.3, analytical: 1, hands_on: 0, business: 0.5, environment: 0, health: 0.8, innovation: 0.6 },
    workstyle: { teamwork: 0.6, independence: 0.7, leadership: 0.3, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    slug: "nutrition-specialist",
    title: "Nutrition Specialist",
    category: "auttaja",
    interests: { technology: 0.3, people: 0.8, creative: 0.4, analytical: 0.6, hands_on: 0.2, business: 0.4, environment: 0.4, health: 1, innovation: 0.4 },
    workstyle: { teamwork: 0.6, independence: 0.7, leadership: 0.5, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "healthcare-coordinator",
    title: "Healthcare Coordinator",
    category: "jarjestaja",
    interests: { technology: 0.5, people: 0.9, creative: 0.3, analytical: 0.6, hands_on: 0, business: 0.5, environment: 0, health: 0.8, innovation: 0.3 },
    workstyle: { teamwork: 0.9, independence: 0.4, leadership: 0.5, organization: 1, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.9 },
    context: { outdoor: 0 }
  },

  // INTERNATIONAL/REMOTE (7 careers)
  {
    slug: "international-sales-manager",
    title: "International Sales Manager",
    category: "johtaja",
    interests: { technology: 0.5, people: 0.9, creative: 0.5, analytical: 0.7, hands_on: 0, business: 1, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.8, independence: 0.7, leadership: 0.8, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.9, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "remote-team-lead",
    title: "Remote Team Lead",
    category: "johtaja",
    interests: { technology: 0.7, people: 0.9, creative: 0.4, analytical: 0.6, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 1, independence: 0.5, leadership: 0.9, organization: 0.9, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    slug: "localization-specialist",
    title: "Localization Specialist",
    category: "luova",
    interests: { technology: 0.6, people: 0.6, creative: 0.7, analytical: 0.6, hands_on: 0, business: 0.5, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.3, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "global-partnerships-manager",
    title: "Global Partnerships Manager",
    category: "johtaja",
    interests: { technology: 0.4, people: 0.9, creative: 0.6, analytical: 0.7, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.8, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.9, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    slug: "technical-support-specialist",
    title: "Technical Support Specialist",
    category: "auttaja",
    interests: { technology: 0.8, people: 0.8, creative: 0.3, analytical: 0.7, hands_on: 0.3, business: 0.3, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.7, independence: 0.6, leadership: 0.3, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.6, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    slug: "translation-project-manager",
    title: "Translation Project Manager",
    category: "jarjestaja",
    interests: { technology: 0.5, people: 0.8, creative: 0.6, analytical: 0.6, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.6, organization: 0.9, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    slug: "export-coordinator",
    title: "Export Coordinator",
    category: "jarjestaja",
    interests: { technology: 0.5, people: 0.7, creative: 0.3, analytical: 0.7, hands_on: 0, business: 0.8, environment: 0, health: 0, innovation: 0.3 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.4, organization: 0.9, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.6 },
    context: { outdoor: 0 }
  },

  // SOCIAL IMPACT & ACTIVISM (8 careers)
  {
    slug: "diversity-and-inclusion-specialist",
    title: "Diversity & Inclusion Specialist",
    category: "auttaja",
    interests: { technology: 0.4, people: 1, creative: 0.6, analytical: 0.6, hands_on: 0, business: 0.6, environment: 0, health: 0.4, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.7, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    slug: "social-justice-advocate",
    title: "Social Justice Advocate",
    category: "auttaja",
    interests: { technology: 0.3, people: 1, creative: 0.7, analytical: 0.6, hands_on: 0, business: 0.4, environment: 0, health: 0.3, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.7, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.2 }
  },
  {
    slug: "community-organizer",
    title: "Community Organizer",
    category: "auttaja",
    interests: { technology: 0.4, people: 1, creative: 0.7, analytical: 0.5, hands_on: 0.3, business: 0.4, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 1, independence: 0.5, leadership: 0.8, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.4 }
  },
  {
    slug: "nonprofit-program-coordinator",
    title: "Nonprofit Program Coordinator",
    category: "jarjestaja",
    interests: { technology: 0.4, people: 0.9, creative: 0.5, analytical: 0.6, hands_on: 0, business: 0.5, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.6, organization: 0.9, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "human-rights-researcher",
    title: "Human Rights Researcher",
    category: "visionaari",
    interests: { technology: 0.4, people: 0.8, creative: 0.6, analytical: 0.9, hands_on: 0, business: 0.3, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.6, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    slug: "accessibility-consultant",
    title: "Accessibility Consultant",
    category: "auttaja",
    interests: { technology: 0.7, people: 0.9, creative: 0.6, analytical: 0.7, hands_on: 0, business: 0.5, environment: 0, health: 0.3, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "gender-equality-advisor",
    title: "Gender Equality Advisor",
    category: "auttaja",
    interests: { technology: 0.3, people: 1, creative: 0.5, analytical: 0.7, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.7, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    slug: "youth-empowerment-coordinator",
    title: "Youth Empowerment Coordinator",
    category: "auttaja",
    interests: { technology: 0.5, people: 1, creative: 0.7, analytical: 0.5, hands_on: 0.3, business: 0.4, environment: 0, health: 0, innovation: 0.5, education: 0.8 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.7, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0.3 }
  },

  // SUSTAINABILITY & ETHICAL DESIGN (7 careers)
  {
    slug: "sustainable-fashion-designer",
    title: "Sustainable Fashion Designer",
    category: "luova",
    interests: { technology: 0.4, people: 0.5, creative: 1, analytical: 0.5, hands_on: 0.7, business: 0.6, environment: 0.9, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.6, independence: 0.8, leadership: 0.4, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "circular-economy-specialist",
    title: "Circular Economy Specialist",
    category: "ympariston-puolustaja",
    interests: { technology: 0.5, people: 0.6, creative: 0.7, analytical: 0.8, hands_on: 0.3, business: 0.8, environment: 1, health: 0, innovation: 0.9 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.7, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "ethical-brand-strategist",
    title: "Ethical Brand Strategist",
    category: "luova",
    interests: { technology: 0.5, people: 0.7, creative: 0.9, analytical: 0.7, hands_on: 0, business: 0.8, environment: 0.6, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "green-building-designer",
    title: "Green Building Designer",
    category: "ympariston-puolustaja",
    interests: { technology: 0.6, people: 0.5, creative: 0.9, analytical: 0.8, hands_on: 0.5, business: 0.5, environment: 1, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.5, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0.2 }
  },
  {
    slug: "zero-waste-consultant",
    title: "Zero Waste Consultant",
    category: "ympariston-puolustaja",
    interests: { technology: 0.4, people: 0.7, creative: 0.7, analytical: 0.7, hands_on: 0.4, business: 0.7, environment: 1, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.8, independence: 0.7, leadership: 0.7, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.3 }
  },
  {
    slug: "sustainable-product-designer",
    title: "Sustainable Product Designer",
    category: "luova",
    interests: { technology: 0.6, people: 0.5, creative: 1, analytical: 0.7, hands_on: 0.6, business: 0.6, environment: 0.9, health: 0, innovation: 0.9 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.4, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "ethical-sourcing-manager",
    title: "Ethical Sourcing Manager",
    category: "jarjestaja",
    interests: { technology: 0.5, people: 0.7, creative: 0.4, analytical: 0.8, hands_on: 0, business: 0.8, environment: 0.7, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.7, organization: 0.9, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },

  // INCLUSIVE MEDIA & REPRESENTATION (5 careers)
  {
    slug: "inclusive-content-creator",
    title: "Inclusive Content Creator",
    category: "luova",
    interests: { technology: 0.6, people: 0.8, creative: 1, analytical: 0.4, hands_on: 0.4, business: 0.5, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.5, organization: 0.6, problem_solving: 0.6 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "cultural-sensitivity-consultant",
    title: "Cultural Sensitivity Consultant",
    category: "auttaja",
    interests: { technology: 0.4, people: 1, creative: 0.7, analytical: 0.7, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.7, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "representation-editor",
    title: "Representation Editor",
    category: "luova",
    interests: { technology: 0.5, people: 0.8, creative: 0.8, analytical: 0.7, hands_on: 0, business: 0.5, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "documentary-filmmaker-social-issues",
    title: "Documentary Filmmaker (Social Issues)",
    category: "luova",
    interests: { technology: 0.7, people: 0.8, creative: 1, analytical: 0.6, hands_on: 0.7, business: 0.4, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.6, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.6 }
  },
  {
    slug: "multicultural-marketing-specialist",
    title: "Multicultural Marketing Specialist",
    category: "luova",
    interests: { technology: 0.6, people: 0.9, creative: 0.8, analytical: 0.6, hands_on: 0, business: 0.8, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0 }
  },

  // COMMUNITY ARTS & CULTURE (5 careers)
  {
    slug: "public-art-coordinator",
    title: "Public Art Coordinator",
    category: "luova",
    interests: { technology: 0.4, people: 0.8, creative: 1, analytical: 0.5, hands_on: 0.5, business: 0.5, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.9 },
    context: { outdoor: 0.6 }
  },
  {
    slug: "cultural-events-producer",
    title: "Cultural Events Producer",
    category: "jarjestaja",
    interests: { technology: 0.5, people: 0.9, creative: 0.9, analytical: 0.5, hands_on: 0.5, business: 0.7, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.7, organization: 0.9, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0.4 }
  },
  {
    slug: "art-therapy-facilitator",
    title: "Art Therapy Facilitator",
    category: "auttaja",
    interests: { technology: 0.2, people: 1, creative: 1, analytical: 0.5, hands_on: 0.7, business: 0.2, environment: 0, health: 0.8, innovation: 0.5 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.6, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    slug: "community-arts-director",
    title: "Community Arts Director",
    category: "johtaja",
    interests: { technology: 0.4, people: 0.9, creative: 1, analytical: 0.5, hands_on: 0.4, business: 0.6, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.9, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0.3 }
  },
  {
    slug: "museum-education-specialist",
    title: "Museum Education Specialist",
    category: "auttaja",
    interests: { technology: 0.5, people: 0.9, creative: 0.8, analytical: 0.6, hands_on: 0.3, business: 0.3, environment: 0, health: 0, innovation: 0.6, education: 0.9 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0 }
  }
];

console.log('🚀 MERGING ALL 75 NEW CAREERS TO DATABASE');
console.log('='.repeat(80));
console.log('');

// Read current careerVectors
const content = fs.readFileSync('./lib/scoring/careerVectors.ts', 'utf8');
const match = content.match(/(export const CAREER_VECTORS[^=]*=\s*\[)([\s\S]*?)(\];)/);

if (!match) {
  console.log('❌ Could not parse CAREER_VECTORS');
  process.exit(1);
}

const prefix = match[1];
const existingCareers = match[2];
const suffix = match[3];

// Convert new careers to JSON string with proper formatting
const newCareersJson = allNewCareers.map(career =>
  '  ' + JSON.stringify(career, null, 2).split('\n').join('\n  ')
).join(',\n');

// Combine
const newContent = `/**
 * GENERATED CAREER VECTORS
 * Auto-generated from careers-fi.ts
 * Do not edit manually - regenerate using generateVectorsScript.js
 *
 * UPDATED: Added 75 modern Helsinki careers for NUORI cohort
 * - 50 modern tech/creative/business roles
 * - 25 progressive social impact/sustainability roles
 */

${prefix}${existingCareers},
${newCareersJson}
${suffix}`;

fs.writeFileSync('./lib/scoring/careerVectors.ts', newContent);

console.log('✅ Successfully added 75 careers!');
console.log('');
console.log('📊 Breakdown:');
console.log('  Tech/Startup: 15 careers');
console.log('  Creative/Media: 12 careers');
console.log('  Business/Consulting: 10 careers');
console.log('  Modern Healthcare: 6 careers');
console.log('  International/Remote: 7 careers');
console.log('  Social Impact & Activism: 8 careers');
console.log('  Sustainability & Ethical Design: 7 careers');
console.log('  Inclusive Media & Representation: 5 careers');
console.log('  Community Arts & Culture: 5 careers');
console.log('');
console.log('  📈 Total careers: 286 → 361');
console.log('');
console.log('='.repeat(80));
console.log('');
console.log('✨ All careers include comprehensive subdimension scores:');
console.log('  ✓ Interests (technology, people, creative, analytical, etc.)');
console.log('  ✓ Workstyle (teamwork, independence, leadership, etc.)');
console.log('  ✓ Values (growth, impact)');
console.log('  ✓ Context (outdoor work)');
console.log('');
console.log('🎯 Perfect for Helsinki NUORI cohort (20-25 year olds)!');
