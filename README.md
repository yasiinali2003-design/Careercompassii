# CareerCompassi 2

AI-powered career guidance platform for Finnish students and young adults.

## 🎯 Overview

CareerCompassi is a modern web application that helps Finnish students and young adults discover their ideal career paths through AI-powered personality analysis and career matching. The platform provides personalized career recommendations based on comprehensive assessments.

## ✨ Features

- **AI-Powered Career Test**: 30-question personality assessment
- **Personalized Recommendations**: Get 3-5 career suggestions tailored to your profile
- **Comprehensive Career Database**: 80+ Finnish careers across 8 categories
- **Professional Design**: Clean, modern interface with Scandinavian minimalism
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Category Exploration**: Browse careers by personality types (Luova, Johtaja, Innovoija, etc.)
- **Detailed Career Information**: Salary data, job outlook, education paths, and more

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **UI Components**: Radix UI primitives
- **Data**: Comprehensive Finnish career database
- **AI Analysis**: Custom recommendation engine

## 📁 Project Structure

```
careercompassi/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── kategoriat/        # Category pages
│   ├── meista/            # About page
│   └── test/              # Career test page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── data/                 # Career data and categories
├── lib/                  # Utility functions
└── utils/                # Helper utilities
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/careercompassi-2.git
cd careercompassi-2
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Features

### Homepage (`/`)
- Hero section with call-to-action
- Personality category cards
- How it works section
- Target audience information
- About us section
- Testimonials

### Career Test (`/test`)
- 30-question personality assessment
- Real-time progress tracking
- AI-powered analysis and recommendations
- Downloadable results

### Category Pages (`/kategoriat/[slug]`)
- Browse careers by personality type
- Filtering and sorting options
- Detailed career information
- Professional career cards

### About Page (`/meista`)
- Team information
- Mission and approach
- Professional compass background

## 🎨 Design Philosophy

CareerCompassi follows a **professional, Scandinavian-minimal design** approach:

- **Clean Typography**: Consistent font hierarchy
- **Subtle Animations**: Smooth, professional transitions
- **Color Psychology**: Meaningful color choices for different personality types
- **Accessibility**: WCAG AA compliant design
- **Mobile-First**: Responsive design for all devices

## 🧠 AI & Recommendation Engine

The platform uses a sophisticated recommendation system that:

1. **Analyzes Responses**: Processes 30 personality questions
2. **Calculates Scores**: Maps answers to 8 career categories
3. **Validates Quality**: Detects random or low-quality responses
4. **Generates Insights**: Creates personalized personality analysis
5. **Recommends Careers**: Suggests 3-5 most suitable careers

## 📊 Career Database

Comprehensive database of 80+ Finnish careers including:

- **Salary Information**: Median and range data
- **Job Outlook**: Future employment prospects
- **Education Paths**: Required qualifications
- **Main Tasks**: Daily responsibilities
- **Keywords**: Searchable terms

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push to main branch
3. Environment variables are handled automatically

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Built by three 22-year-old developers who understand the challenges of career decision-making for young adults.

## 🔗 Links

- **Live Demo**: [Add your deployment URL]
- **Documentation**: [Add documentation link]
- **Support**: [Add support contact]

---

**CareerCompassi** - Find your future vibe. 🧭