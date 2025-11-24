# Content Review Checklist for New Careers

## Overview
This checklist helps subject matter experts review the 349 newly added careers across all categories.

---

## ✅ General Quality Checks

### Accuracy & Relevance
- [ ] Career title is accurate and commonly used in Finland
- [ ] Finnish title (`title_fi`) matches industry standard terminology
- [ ] English title (`title_en`) is correct translation
- [ ] Career exists in Finnish job market (not US-specific)
- [ ] Description accurately reflects the role

### Completeness
- [ ] All required fields are filled
- [ ] Main tasks (5-6 items) are comprehensive
- [ ] Education paths are realistic for Finland
- [ ] Core skills list is complete (5-7 skills)
- [ ] Tools/tech are current and relevant

---

## 💰 Salary Data Verification

### Salary Ranges
- [ ] Median salary is realistic for Finnish market
- [ ] Range [min, max] is reasonable spread
- [ ] Reflects 2024 market conditions
- [ ] Source is cited (Ammattinetti, TES, etc.)

**Expected Ranges by Education Level:**
- AMK (42 months): €3,200 - €5,500/month
- DI/FM (60 months): €4,000 - €7,000/month
- Specialized roles: €4,500 - €8,000/month

---

## 📚 Education Path Validation

### Education Requirements
- [ ] Required degree matches Finnish education system
- [ ] AMK (University of Applied Sciences) vs Yliopisto (University) distinction is correct
- [ ] Study length estimate is accurate (42, 48, or 60 months)
- [ ] Alternative paths are included where relevant
- [ ] Certifications/licenses are mentioned if required

---

## 🌍 Language Requirements

### Language Levels (CEFR Format)
- [ ] Finnish (fi): Appropriate level for role
- [ ] Swedish (sv): Reflects actual requirement
- [ ] English (en): Matches international communication needs

**Typical Patterns:**
- Most careers: `{ fi: "C1", sv: "B1", en: "B2" }`
- International roles: `{ fi: "C1", sv: "B1", en: "C1" }`
- Technical roles: May have lower sv requirement

---

## 📈 Job Outlook Validation

### Market Trends
- [ ] Status ("kasvaa", "vakaa", "laskee", "vaihtelee") is accurate
- [ ] Explanation reflects current Finnish labor market
- [ ] Source is credible (Ammattinetti, TEM, etc.)
- [ ] Considers digitalization and automation impact

---

## 🏢 Employer & Work Conditions

### Typical Employers
- [ ] List reflects Finnish companies/organizations
- [ ] Includes public and private sectors where relevant
- [ ] Examples are recognizable

### Work Conditions
- [ ] Remote work possibility is realistic
- [ ] Shift work requirement is accurate
- [ ] Travel expectation matches role

---

## 🔍 Category-Specific Checks

### Rakentaja (Builder) - 95 careers
**Focus Areas:**
- [ ] Construction and engineering roles
- [ ] Technical specifications are correct
- [ ] Safety requirements mentioned
- [ ] Finnish building codes/standards referenced

### Ympäristön Puolustaja (Environmental Defender) - 95 careers
**Focus Areas:**
- [ ] Environmental impact is clear
- [ ] Sustainability focus is authentic
- [ ] Regulations (EU, Finnish) are mentioned
- [ ] Green technology is current

### Johtaja (Leader) - 95 careers
**Focus Areas:**
- [ ] Leadership responsibilities are realistic
- [ ] Team sizes mentioned where relevant
- [ ] Budget/resource management included
- [ ] Strategic thinking required

### Visionääri (Visionary) - 95 careers
**Focus Areas:**
- [ ] Future-oriented perspective
- [ ] Innovation and strategy emphasized
- [ ] Trend analysis mentioned
- [ ] Long-term planning focus

### Luova (Creative) - 95 careers
**Focus Areas:**
- [ ] Creative skills are highlighted
- [ ] Portfolio requirements mentioned
- [ ] Artistic/design tools are current
- [ ] Freelance opportunities noted

### Innovoija (Innovator) - 95 careers
**Focus Areas:**
- [ ] Technology stack is current (2024)
- [ ] Innovation and R&D emphasized
- [ ] Emerging technologies mentioned
- [ ] Technical depth is appropriate

### Järjestäjä (Organizer) - 95 careers
**Focus Areas:**
- [ ] Organization and planning skills emphasized
- [ ] Process management included
- [ ] Coordination responsibilities clear
- [ ] Systems/tools are relevant

### Auttaja (Helper) - 95 careers
**Focus Areas:**
- [ ] Helping/care focus is clear
- [ ] Empathy and interpersonal skills mentioned
- [ ] Patient/client interaction described
- [ ] Healthcare regulations included (if applicable)

---

## 🚀 Career Progression

### Entry Roles
- [ ] Entry-level titles are realistic
- [ ] Junior positions are appropriate first steps
- [ ] Alternative entry paths mentioned

### Career Progression
- [ ] Senior roles are logical next steps
- [ ] Management positions are relevant
- [ ] Specialization paths are included
- [ ] Timeframes are realistic (not specified but implied)

---

## 🔤 Language & Style

### Finnish Language Quality
- [ ] No spelling errors
- [ ] Grammar is correct
- [ ] Professional tone maintained
- [ ] Consistent terminology

### English Translation Quality
- [ ] Accurate translation
- [ ] No anglicisms in Finnish version
- [ ] Technical terms translated correctly

---

## 📊 Priority Review Areas

### High Priority (Review First)
1. **Technical Roles (Innovoija)** - Technology changes rapidly
2. **Healthcare Roles (Auttaja)** - Regulations are strict
3. **Engineering Roles (Rakentaja)** - Safety-critical

### Medium Priority
4. **Leadership Roles (Johtaja)** - Context-dependent
5. **Creative Roles (Luova)** - Industry-specific
6. **Environmental Roles** - Policy changes

### Lower Priority
7. **Organizer Roles (Järjestäjä)** - Generally stable
8. **Visionary Roles (Visionääri)** - Future-focused

---

## 🛠️ Tools for Review

### Recommended Resources
- **Ammattinetti.fi** - Finnish career information
- **TEM (Työ- ja elinkeinoministeriö)** - Labor market data
- **Tilastokeskus** - Statistical data
- **Industry associations** - Sector-specific information

### Validation Commands
```bash
# Count careers per category
for category in "rakentaja" "ympariston-puolustaja" "johtaja" "visionaari" "luova" "innovoija" "jarjestaja" "auttaja"; do
  count=$(grep -c "category: \"$category\"" data/careers-fi.ts)
  echo "$category: $count careers"
done

# Check for duplicate IDs
grep -o "id: \"[^\"]*\"" data/careers-fi.ts | sort | uniq -d

# Check for missing fields
grep -A 20 "category: \"innovoija\"" data/careers-fi.ts | grep -E "(title_fi|salary_eur_month|job_outlook)" | wc -l
```

---

## 📝 Review Process

### Recommended Workflow
1. **Batch Review** - Review 10-20 careers at a time
2. **Domain Experts** - Assign categories to relevant experts
3. **Peer Review** - Second opinion on changes
4. **User Testing** - Get feedback from target users
5. **Iterative Updates** - Fix issues as they're discovered

### Documentation
- Track review progress in GitHub issues
- Document major changes in changelog
- Note discrepancies in separate log file

---

## ✅ Sign-Off

### Reviewer Information
- **Reviewer Name:** ________________
- **Category:** ________________
- **Date:** ________________
- **Careers Reviewed:** ____ of 95
- **Issues Found:** ____
- **Status:** ⬜ In Progress ⬜ Complete ⬜ Needs Follow-up

### Approval
- ⬜ Content is accurate
- ⬜ Finnish market alignment confirmed
- ⬜ Salaries verified
- ⬜ Education paths correct
- ⬜ Ready for production

---

## 📞 Support

For questions or concerns:
- Create GitHub issue with label `content-review`
- Tag appropriate subject matter expert
- Include career ID in issue title
