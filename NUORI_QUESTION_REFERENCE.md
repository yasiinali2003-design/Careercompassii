# NUORI Question Index Reference
**Use this when creating test data for NUORI cohort**

## Question Structure (Q0-Q29)

### Q0-Q9: Career Field INTERESTS
| Q# | Finnish Question | Subdimension | Category Impact |
|----|------------------|--------------|-----------------|
| Q0 | IT-ala ja digitaaliset ratkaisut | `technology` | innovoija ⚙️ |
| Q1 | Terveydenhuolto ja hoivatyö | `health` | auttaja 🏥 |
| Q2 | Luovat alat ja sisällöntuotanto | `creative` | luova 🎨 |
| Q3 | Liike-elämä ja johtaminen | `leadership` | johtaja 👔 |
| Q4 | Tekniikka ja insinöörityö | `technology` | innovoija ⚙️ |
| Q5 | Opetusala ja kasvatus | `education` | auttaja 🏫 |
| Q6 | Tutkimustyö ja tieteellinen työ | `analytical` | visionaari 🔬 |
| Q7 | Oikeusala tai lakimiehen tehtävät | `analytical` | visionaari ⚖️ |
| Q8 | Media, journalismi ja viestintä | `creative` | luova 📰 |
| Q9 | Matkailu tai ravintola-ala | `hands_on` | rakentaja 🍽️ |

### Q10-Q17: Work VALUES
| Q# | Finnish Question | Subdimension | Category Impact |
|----|------------------|--------------|-----------------|
| Q10 | Hyvä palkka (yli 4000€/kk) | `advancement` | johtaja 💰 |
| Q11 | Vaikuttaa yhteiskuntaan positiivisesti | `social_impact` | auttaja 🌍 |
| Q12 | Varma ja pysyvä työpaikka | `stability` | jarjestaja 🔒 |
| Q13 | Uralla nopeasti eteenpäin ja ylennyksiä | `advancement` | johtaja 📈 |
| Q14 | Aikaa perheelle ja harrastuksille | `stability` | jarjestaja ⏰ |
| Q15 | Kansainvälinen ja monikulttuurinen ympäristö | `global` | visionaari 🌐 |
| Q16 | Oppia jatkuvasti uutta työssäsi | `growth` | innovoija 📚 |
| Q17 | Olla luova ja keksiä uusia ideoita | `creative` | luova 💡 |

### Q18-Q24: Work CONTEXT/ENVIRONMENT
| Q# | Finnish Question | Subdimension | Category Impact |
|----|------------------|--------------|-----------------|
| Q18 | Työskennellä kotoa käsin (etätyö) | `work_environment` | - |
| Q19 | Perinteinen toimisto ja säännöllinen työpäivä | `structure` | jarjestaja 🏢 |
| Q20 | Liikkua paljon ja vierailla eri paikoissa | `work_environment` | - |
| Q21 | Työskennellä isossa, tunnetussa yrityksessä | `stability` | jarjestaja 🏛️ |
| Q22 | Pienessä startup-yrityksessä | `entrepreneurship` | visionaari 🚀 |
| Q23 | Vuorotyö (yö-, ilta-, viikonloppuvuorot) | `flexibility` | luova 🌙 |
| Q24 | Matkustaa paljon ulkomailla | `global` | visionaari ✈️ |

### Q25-Q29: Work STYLE
| Q# | Finnish Question | Subdimension | Category Impact |
|----|------------------|--------------|-----------------|
| Q25 | Tehdä työsi itsenäisesti ilman ohjausta | `flexibility` | luova 🎯 |
| Q26 | Johtaa tiimiä ja tehdä suuria päätöksiä | `leadership` | johtaja 👥 |
| Q27 | Tiimityöskentely ja yhteistyö | `motivation` | johtaja 🤝 |
| Q28 | Selkeät rutiinit ja toistuvat tehtävät | `structure` | jarjestaja 📋 |
| Q29 | Jokainen päivä erilainen ja yllättävä | `flexibility` | luova 🎲 |

---

## Example Test Profiles

### Tech Career Switcher (innovoija ⚙️)
**Focus:** High technology interest + growth/learning values

```javascript
generateAnswers([
  // Q0-9: Career Field INTERESTS
  5, 1, 2, 2, 5, 2, 3, 3, 3, 2,  // Q0=5 (IT), Q4=5 (engineering), Q1=1 (NOT health)
  // Q10-17: Work VALUES
  4, 3, 3, 5, 3, 3, 5, 3,  // Q10=4 (salary), Q13=5 (advancement), Q16=5 (growth)
  // Q18-24: Work CONTEXT
  5, 2, 3, 2, 4, 3, 3,  // Q18=5 (remote), Q22=4 (startup OK)
  // Q25-29: Work STYLE
  5, 3, 3, 2, 4  // Q25=5 (autonomy), Q29=4 (variety)
])
```

### Leadership Focus (johtaja 👔)
**Focus:** Leadership workstyle + advancement values

```javascript
generateAnswers([
  // Q0-9: Career Field INTERESTS
  3, 2, 3, 5, 3, 2, 3, 3, 3, 2,  // Q3=5 (business/leadership)
  // Q10-17: Work VALUES
  5, 3, 3, 5, 3, 4, 4, 3,  // Q10=5 (salary), Q13=5 (advancement), Q15=4 (global)
  // Q18-24: Work CONTEXT
  4, 3, 4, 3, 3, 3, 4,  // Q18=4 (remote), Q20=4 (travel), Q24=4 (international)
  // Q25-29: Work STYLE
  4, 5, 4, 2, 3  // Q26=5 (LEADERSHIP!), Q27=4 (teamwork)
])
```

### Creative Entrepreneur (luova 🎨)
**Focus:** Creative interests + flexibility/autonomy

```javascript
generateAnswers([
  // Q0-9: Career Field INTERESTS
  3, 1, 5, 3, 2, 2, 2, 3, 5, 3,  // Q2=5 (creative), Q8=5 (media)
  // Q10-17: Work VALUES
  3, 3, 2, 3, 3, 3, 3, 5,  // Q17=5 (creative value)
  // Q18-24: Work CONTEXT
  5, 1, 3, 1, 5, 4, 3,  // Q18=5 (remote), Q21=1 (NOT big company), Q22=5 (startup), Q23=4 (flexible hours)
  // Q25-29: Work STYLE
  5, 2, 2, 1, 5  // Q25=5 (autonomy), Q28=1 (NOT routine), Q29=5 (variety)
])
```

### Social Impact Worker (auttaja 🏥)
**Focus:** Health/education interests + social impact values

```javascript
generateAnswers([
  // Q0-9: Career Field INTERESTS
  2, 5, 3, 2, 2, 4, 3, 2, 3, 3,  // Q1=5 (healthcare), Q5=4 (education)
  // Q10-17: Work VALUES
  3, 5, 4, 2, 5, 3, 3, 3,  // Q11=5 (social impact), Q14=5 (work-life balance)
  // Q18-24: Work CONTEXT
  3, 3, 4, 3, 2, 2, 2,  // Q20=4 (field work)
  // Q25-29: Work STYLE
  3, 3, 5, 3, 3  // Q27=5 (teamwork)
])
```

### Strategic Planner (visionaari 🔬)
**Focus:** Analytical interests + global/entrepreneurship values

```javascript
generateAnswers([
  // Q0-9: Career Field INTERESTS
  3, 2, 3, 4, 3, 2, 5, 4, 3, 2,  // Q6=5 (research), Q7=4 (legal), Q3=4 (business)
  // Q10-17: Work VALUES
  5, 3, 3, 5, 2, 5, 5, 3,  // Q10=5 (salary), Q13=5 (advancement), Q15=5 (global), Q16=5 (growth)
  // Q18-24: Work CONTEXT
  4, 3, 5, 2, 5, 2, 5,  // Q20=5 (travel), Q22=5 (startup), Q24=5 (international)
  // Q25-29: Work STYLE
  4, 4, 3, 2, 4  // Q26=4 (some leadership), Q29=4 (variety)
])
```

---

## Key Insights

1. **Technology (innovoija):** Boost Q0, Q4, Q16
2. **Healthcare (auttaja):** Boost Q1, Q5, Q11
3. **Creative (luova):** Boost Q2, Q8, Q17, Q25, Q29
4. **Leadership (johtaja):** Boost Q3, Q10, Q13, Q26
5. **Strategy (visionaari):** Boost Q6, Q7, Q15, Q22, Q24
6. **Hands-on (rakentaja):** Boost Q9 (but NUORI rarely gets this)
7. **Organized (jarjestaja):** Boost Q12, Q14, Q19, Q21, Q28
8. **Environmental (ympariston-puolustaja):** No direct questions! (Missing)

---

**Last Updated:** 2025-11-23
