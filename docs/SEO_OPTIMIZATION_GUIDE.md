# SEO Optimization Guide for CareerCompass

## Overview
This guide covers SEO optimizations for all 760 career pages after the category expansion.

---

## 🎯 SEO Goals

### Primary Objectives
1. **Index all 760 careers** in search engines (Google, Bing)
2. **Rank for long-tail keywords** (e.g., "ohjelmistokehittäjä palkka suomi")
3. **Appear in featured snippets** for career questions
4. **Compete with Ammattinetti.fi** for Finnish career searches

### Target Keywords Per Career
- `[career name]` - Primary keyword
- `[career name] palkka` - Salary queries
- `[career name] koulutus` - Education queries
- `[career name] urapolku` - Career path queries
- `[career name] työtehtävät` - Job tasks

---

## 📊 Current SEO Implementation

### Metadata Generation
**File:** `/lib/seo/careerMetadata.ts`

Each career page includes:
- ✅ Optimized title (60 chars): `[Career] - Palkka, Koulutus & Urapolku`
- ✅ Meta description (150-160 chars): Includes salary, outlook, education
- ✅ Keywords: Career name, skills, tools, category
- ✅ Open Graph tags: For social media sharing
- ✅ Twitter Card: For Twitter previews
- ✅ Canonical URL: Prevents duplicate content issues

### Structured Data (JSON-LD)
**Schema.org Occupation** markup includes:
- Career name (Finnish & English)
- Description
- Education requirements
- Skills
- Salary range (min, max, median)
- Job outlook (growing, stable, declining)
- Responsibilities

### Sitemap
**File:** `/app/sitemap.ts`

- ✅ All 760 career pages listed
- ✅ 8 category pages
- ✅ Static pages (homepage, test, etc.)
- ✅ Last modified dates
- ✅ Priority and change frequency

### Robots.txt
**File:** `/app/robots.ts`

- ✅ Allow all career pages
- ✅ Disallow admin/API routes
- ✅ Sitemap reference
- ✅ Block AI training bots (GPTBot, CCBot)

---

## 🔍 SEO Checklist

### Technical SEO ✅
- [x] Generate unique titles for all 760 careers
- [x] Create meta descriptions under 160 chars
- [x] Add structured data (JSON-LD)
- [x] Generate sitemap.xml
- [x] Create robots.txt
- [x] Set canonical URLs
- [x] Add Open Graph tags
- [x] Add Twitter Card tags

### Content SEO 🔄
- [ ] Ensure all career descriptions are unique
- [ ] Add internal links between related careers
- [ ] Create category landing pages with content
- [ ] Add FAQ sections to career pages
- [ ] Include user testimonials/reviews

### On-Page SEO 🔄
- [ ] Use H1 tags for career titles
- [ ] Use H2/H3 for sections (Palkka, Koulutus, etc.)
- [ ] Add alt text to images
- [ ] Optimize page load speed
- [ ] Ensure mobile responsiveness

### Off-Page SEO 🔜
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Build backlinks from education sites
- [ ] Partner with Opintopolku.fi
- [ ] Get listed in career directories

---

## 📈 Recommended Next Steps

### 1. Submit to Search Engines (Immediate)

```bash
# Google Search Console
1. Go to https://search.google.com/search-console
2. Add property: careercompass.fi
3. Verify ownership
4. Submit sitemap: https://careercompass.fi/sitemap.xml
5. Request indexing for key pages

# Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add site
3. Verify ownership
4. Submit sitemap
```

### 2. Optimize Page Speed (Week 1)

**Current Issues to Address:**
- Lazy load images
- Minify CSS/JS
- Enable compression
- Use CDN for static assets
- Implement ISR (Incremental Static Regeneration)

**Tools:**
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)
- WebPageTest.org

### 3. Add Internal Linking (Week 2)

**Strategy:**
- Link from category pages to careers
- Link between related careers (same category)
- Link from homepage to popular careers
- Create breadcrumbs for navigation

**Example:**
```tsx
// On Ohjelmistokehittäjä page
<RelatedCareers>
  <Link href="/ammatit/web-developer">Web-kehittäjä</Link>
  <Link href="/ammatit/full-stack-developer">Full Stack -kehittäjä</Link>
  <Link href="/ammatit/devops-engineer">DevOps-insinööri</Link>
</RelatedCareers>
```

### 4. Create Category Landing Pages (Week 3)

**Content for each category:**
- Overview of category (300-500 words)
- Why choose this category?
- Common career paths
- Average salary range
- Education requirements
- List of all 95 careers in category

**Example URL:**
- `/ammatit/innovoija` - Innovoija category page
- `/ammatit/innovoija/ohjelmistokehittaja` - Specific career

### 5. Add User-Generated Content (Week 4)

**Features to implement:**
- Career ratings (1-5 stars)
- User reviews/comments
- "Day in the life" stories
- Salary reports from real users
- Q&A section per career

### 6. Build Backlinks (Ongoing)

**Target Sites:**
- Opintopolku.fi - Finnish education portal
- Ammattinetti.fi - Finnish career site
- University career pages
- AMK career services
- LinkedIn articles
- Education blogs

**Outreach Strategy:**
- Email partnership requests
- Offer to write guest posts
- Create shareable career guides
- Participate in education forums

---

## 🎨 Content Optimization Tips

### Title Tag Formula
```
[Career Name] - [Key Benefit 1], [Key Benefit 2] & [Key Benefit 3] | CareerCompass
```

**Examples:**
- ✅ Good: "Ohjelmistokehittäjä - Palkka, Koulutus & Urapolku | CareerCompass" (60 chars)
- ❌ Too long: "Ohjelmistokehittäjä ammatti Suomessa - Palkkainfo, koulutusvaatimukset ja urapolku | CareerCompass" (95 chars)

### Meta Description Formula
```
[Short description]. Palkka [range]€/kk. [Outlook]. Koulutus: [education]. Lue lisää ja tutustu [aspect].
```

**Examples:**
- ✅ Good: "Ohjelmistokehittäjä suunnittelee ja toteuttaa ohjelmistoja. Palkka 4000-6500€/kk. Alan kysyntä kasvaa. Koulutus: DI tai AMK. Lue lisää ja tutustu urapolkuun." (159 chars)

### URL Structure
```
https://careercompass.fi/ammatit/[career-slug]
```

**Best practices:**
- Use lowercase
- Use hyphens (not underscores)
- Keep under 60 characters
- Use Finnish characters (ä, ö) if in career name

---

## 📊 Tracking & Analytics

### Key Metrics to Monitor

**Search Console Metrics:**
- Impressions per career page
- Click-through rate (CTR)
- Average position
- Top queries driving traffic

**Google Analytics:**
- Organic traffic to career pages
- Bounce rate per career
- Time on page
- Pages per session

**CareerCompass Custom Analytics:**
- Category distribution (via `/api/analytics/category-distribution`)
- User feedback ratings (via `career_feedback` table)
- Test-to-career-page conversion rate

### Monthly SEO Report Template

```markdown
## SEO Report - [Month Year]

### Traffic
- Total organic sessions: [X]
- Career page sessions: [X] (+/-Y% MoM)
- Top 10 landing pages: [list]

### Rankings
- Keywords ranking in top 10: [X]
- Keywords ranking in top 3: [X]
- Featured snippets: [X]

### Indexation
- Pages indexed: [X] / 760
- Index coverage issues: [X]
- Mobile usability issues: [X]

### Goals
- Career test completions: [X]
- Career page → test conversions: [X%]
- Career page → external links: [X]
```

---

## 🚀 Advanced SEO Tactics

### 1. Featured Snippets Optimization

**Target "People Also Ask" questions:**
- "Mitä [ammatti] tekee?"
- "Paljonko [ammatti] tienaa?"
- "Miten pääsee [ammatti]ksi?"
- "Mikä on [ammatti]n urapolku?"

**Implementation:**
Add FAQ schema:
```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Mitä ohjelmistokehittäjä tekee?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Ohjelmistokehittäjä suunnittelee, toteuttaa ja ylläpitää ohjelmistosovelluksia..."
    }
  }]
}
```

### 2. Local SEO (If Applicable)

If you add location-based features:
- Add LocalBusiness schema
- Create city-specific landing pages
- Optimize for "career in [city]" searches

### 3. Video SEO

Create career videos:
- "Day in the life of [career]"
- Career path explanations
- Salary negotiation tips
- Add VideoObject schema

### 4. Voice Search Optimization

Optimize for conversational queries:
- "Alexa, what does a software developer do?"
- Use natural language in content
- Answer questions directly

---

## 🔧 Tools & Resources

### Essential SEO Tools
- **Google Search Console** - Index monitoring
- **Google Analytics** - Traffic analysis
- **Screaming Frog** - Site crawling
- **Ahrefs/SEMrush** - Keyword research
- **PageSpeed Insights** - Performance

### Finnish SEO Resources
- Ammattinetti.fi - Competitor analysis
- Opintopolku.fi - Education keywords
- Google Trends (Finland) - Search trends
- Answer the Public - Question research

### Technical Resources
- Next.js SEO docs
- Schema.org markup validator
- Rich Results Test (Google)
- Mobile-Friendly Test

---

## 📞 Support & Questions

For SEO-related questions:
- Review this guide first
- Check Google Search Console for errors
- Create GitHub issue with label `seo`
- Monitor analytics dashboard

---

## ✅ SEO Launch Checklist

### Pre-Launch
- [x] Generate metadata for all 760 careers
- [x] Create sitemap.xml
- [x] Set up robots.txt
- [x] Add structured data
- [x] Configure canonical URLs

### Launch Day
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics tracking
- [ ] Test rich snippets with Google's tool
- [ ] Verify all pages are crawlable

### Week 1
- [ ] Monitor indexation status
- [ ] Fix any crawl errors
- [ ] Check for duplicate content
- [ ] Verify mobile usability
- [ ] Run PageSpeed tests

### Week 2-4
- [ ] Build initial backlinks
- [ ] Create category landing pages
- [ ] Optimize top-performing pages
- [ ] Add more internal links
- [ ] Monitor keyword rankings

### Ongoing
- [ ] Monthly SEO reports
- [ ] Update content regularly
- [ ] Monitor competitor rankings
- [ ] Test new keywords
- [ ] Expand content (blog, guides)

---

Last Updated: January 24, 2025
