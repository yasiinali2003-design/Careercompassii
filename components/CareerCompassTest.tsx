"use client";

import React, { useEffect, useMemo, useState } from "react";
import { selectQuestionSet, markSetAsUsed } from "@/lib/questionPool";
import { toast, Toaster } from "sonner";
import Todistuspistelaskuri from './Todistuspistelaskuri';
import { validateResponseQuality, getSeverityColor, getQualityWarningMessage, type ResponseQualityMetrics } from "@/lib/scoring/responseValidation";
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { safeGetItem, safeSetItem, safeRemoveItem, safeSetString, isLocalStorageAvailable } from '@/lib/safeStorage';

// Debug logging only in development
const isDev = process.env.NODE_ENV !== 'production';
const debugLog = (...args: unknown[]) => { if (isDev) console.log(...args); };

// ---------- QUESTIONS DATA ----------
// YLA: Education path focus (Lukio vs. Ammattikoulu) + career preview
// TASO2: Career field focus + education path guidance
// NUORI: Career + lifestyle focus

const QUESTIONS = {
  YLA: [
    // REDESIGNED: Interest-based questions for Lukio vs Ammattikoulu path + career exploration
    // Section 1: Learning & Thinking (Q0-6) - analytical, hands_on, technology, problem_solving
    "Pidätkö lukemisesta ja kirjoittamisesta?", // Q0: analytical
    "Pidätkö matematiikasta ja laskemisesta?", // Q1: analytical
    "Opitko parhaiten tekemällä ja kokeilemalla?", // Q2: hands_on
    "Kiinnostaako sinua tietokoneet ja ohjelmointi?", // Q3: technology
    "Pidätkö pulmien ja ongelmien ratkaisemisesta?", // Q4: problem_solving
    "Haluaisitko tutkia ja selvittää, miten asiat toimivat?", // Q5: problem_solving
    "Tykkäätkö miettiä ja pohtia asioita tarkkaan?", // Q6: analytical

    // Section 2: People & Helping (Q7-9) - people
    "Pidätkö ihmisten auttamisesta ja tukemisesta?", // Q7: people
    "Haluaisitko opettaa tai neuvoa muita?", // Q8: people
    "Kiinnostaako sinua ymmärtää ihmisten tunteita ja ajatuksia?", // Q9: people

    // Section 3: Creative & Expression (Q10-12) - creative
    "Pidätkö piirtämisestä, maalaamisesta tai suunnittelusta?", // Q10: creative
    "Kiinnostaako sinua musiikki, näytteleminen tai tanssi?", // Q11: creative
    "Haluaisitko luoda videoita, kuvia tai muuta sisältöä?", // Q12: creative

    // Section 4: Healthcare & Well-being (Q13) - health
    "Haluaisitko auttaa sairaita tai loukkaantuneita ihmisiä?", // Q13: health

    // Section 5: Business & Entrepreneurship (Q14) - business
    "Kiinnostaako sinua myynti ja asiakaspalvelu?", // Q14: business

    // Section 6: Leadership (Q15) - leadership
    "Haluaisitko johtaa ryhmää tai projektia?", // Q15: leadership

    // Section 7: Hands-On & Practical Work (Q16) - hands_on
    "Pidätkö käytännön töistä, kuten rakentamisesta tai korjaamisesta?", // Q16: hands_on

    // Section 8: Technology & Innovation (Q17-18) - technology, innovation
    "Haluaisitko työskennellä tekniikan ja laitteiden parissa?", // Q17: technology
    "Pidätkö uusien ideoiden keksimisestä?", // Q18: innovation

    // Section 9: Impact & Environment (Q19) - impact
    "Haluaisitko suojella luontoa ja ympäristöä?", // Q19: impact

    // Section 10: More Hands-On (Q20) - hands_on
    "Kiinnostaako sinua autot, moottorit tai ajoneuvot?", // Q20: hands_on

    // Section 11: People & Health (Q21-22) - people, health
    "Haluaisitko työskennellä lasten tai nuorten kanssa?", // Q21: people
    "Kiinnostaako sinua terveys ja liikunta?", // Q22: health

    // Section 12: Workstyle (Q23-24) - teamwork, independence
    "Pidätkö työskentelystä ryhmässä muiden kanssa?", // Q23: teamwork
    "Tykkäätkö tehdä asioita itsenäisesti?", // Q24: independence

    // Section 13: More Hands-On (Q25) - hands_on
    "Pidätkö fyysisestä työstä ja liikkumisesta?", // Q25: hands_on

    // Section 14: Business & Innovation (Q26-27) - business, innovation
    "Haluaisitko perustaa oman yrityksen joskus?", // Q26: business
    "Kiinnostaako sinua kehittää uusia tuotteita tai palveluita?", // Q27: innovation

    // Section 15: Organization & Outdoor (Q28-29) - organization, outdoor
    "Pidätkö järjestyksestä ja suunnittelusta?", // Q28: organization
    "Haluaisitko työskennellä ulkona luonnossa?" // Q29: outdoor
  ],
  TASO2: [
    // Section 1: Tech & Digital (Q1-7)
    "Kiinnostaako sinua koodaaminen tai omien ohjelmien tekeminen?",
    "Haluaisitko työskennellä tietokoneiden ja teknologian parissa?",
    "Pidätkö numeroiden ja tilastojen tutkimisesta?",
    "Pidätkö teknisten ongelmien ratkaisemisesta?",
    "Haluaisitko suunnitella verkkosivuja tai mobiilisovelluksia?",
    "Kiinnostaako sinua videopelit tai niiden tekeminen?",
    "Kiinnostaako sinua suojata tietoja hakkereilta ja tietomurroilta?",
    // Section 2: People & Care (Q8-14)
    "Haluaisitko auttaa ihmisiä voimaan hyvin?",
    "Kiinnostaako sinua ymmärtää, miten ihmisen mieli toimii?",
    "Pidätkö ajatuksesta opettaa tai kouluttaa muita?",
    "Haluaisitko tukea ihmisiä vaikeissa elämäntilanteissa?",
    "Haluaisitko työskennellä lasten tai nuorten kanssa?",
    "Haluaisitko olla tukena vanhuksille ja ikääntyneille?",
    "Pidätkö siitä, että autat ihmisiä tekemään hyviä valintoja?",
    // Section 3: Creative & Business (Q15-21)
    "Kiinnostaako sinua grafiikka, kuvat tai visuaalinen suunnittelu?",
    "Haluaisitko työskennellä mainonnan ja markkinoinnin parissa?",
    "Kiinnostaako sinua sisustaa tiloja ja suunnitella ympäristöjä?",
    "Pidätkö ajatuksesta kirjoittaa artikkeleita, blogeja tai tarinoita?",
    "Kiinnostaako sinua valokuvaus tai videoiden tekeminen?",
    "Haluaisitko joskus perustaa ja pyörittää omaa yritystä?",
    "Pidätkö myynnistä ja asiakkaiden kohtaamisesta?",
    // Section 4: Hands-On & Practical (Q21-29)
    "Haluaisitko rakentaa taloja tai korjata rakennuksia?",
    "Kiinnostaako sinua autot, moottorit tai muut ajoneuvot?",
    "Haluaisitko tehdä sähkö- ja asennustöitä?",
    "Kiinnostaako sinua maatalous, karjanhoito tai eläinlääkintä?",
    "Haluaisitko suojella ympäristöä ja luontoa?",
    "Kiinnostaako sinua kuljettaa ihmisiä tai tavaroita paikasta toiseen?",
    "Haluaisitko valmistaa ruokaa tai leipoa ammatiksesi?",
    "Kiinnostaako sinua puun, metallin tai tekstiilien käsityöt?",
    "Haluaisitko työskennellä laboratoriossa ja tehdä kokeita?",
    // Section 5: Additional Questions (Q30-32)
    "Kiinnostaako sinua ympäristönsuojelu ja ilmastonmuutos?",
    "Haluaisitko työskennellä kansainvälisissä projekteissa tai ulkomailla?",
    "Pidätkö suunnittelusta, aikatauluista ja asioiden organisoinnista?"
  ],
  NUORI: [
    // REDESIGNED: Interest-based questions for career matching (NOT values)
    // Section 1: Technology & Digital (Q0-2) - technology
    "Kiinnostaako sinua ohjelmointi ja sovelluskehitys?", // Q0: technology
    "Haluaisitko työskennellä tietoturvan ja kyberturvallisuuden parissa?", // Q1: technology
    "Kiinnostaako sinua data-analyysi ja koneoppiminen?", // Q2: technology

    // Section 2: People & Care (Q3-5) - people
    "Haluaisitko auttaa ihmisiä heidän terveydessään ja hyvinvoinnissaan?", // Q3: people
    "Kiinnostaako sinua opettaa, kouluttaa tai valmentaa muita?", // Q4: people
    "Haluaisitko tukea ihmisiä henkisesti vaikeissa tilanteissa?", // Q5: people

    // Section 3: Creative & Design (Q6-9) - creative
    "Kiinnostaako sinua graafinen suunnittelu ja visuaalinen ilme?", // Q6: creative
    "Haluaisitko työskennellä sisällöntuotannon tai median parissa?", // Q7: creative
    "Pidätkö kirjoittamisesta, journalismista tai viestinnästä?", // Q8: creative
    "Kiinnostaako sinua valokuvaus, video tai äänisuunnittelu?", // Q9: creative

    // Section 4: Business & Leadership (Q10-13) - business, leadership
    "Haluaisitko työskennellä myynnissä tai asiakaspalvelussa?", // Q10: business
    "Kiinnostaako sinua perustaa ja johtaa omaa yritystä?", // Q11: business
    "Haluaisitko johtaa tiimiä tai projektia?", // Q12: leadership
    "Kiinnostaako sinua strateginen suunnittelu ja päätöksenteko?", // Q13: leadership

    // Section 5: Hands-On & Technical (Q14-17) - hands_on
    "Haluaisitko työskennellä rakentamisen tai korjaamisen parissa?", // Q14: hands_on
    "Kiinnostaako sinua autot, koneet tai tekniset laitteet?", // Q15: hands_on
    "Haluaisitko tehdä sähkö- tai asennustöitä?", // Q16: hands_on
    "Kiinnostaako sinua valmistaa tai rakentaa asioita käsilläsi?", // Q17: hands_on

    // Section 6: Analytical & Research (Q18-20) - analytical
    "Pidätkö tiedon analysoinnista ja tutkimisesta?", // Q18: analytical
    "Kiinnostaako sinua tieteellinen tutkimus tai laboratoriotyö?", // Q19: analytical
    "Haluaisitko työskennellä lakiasioiden tai oikeusjärjestelmän parissa?", // Q20: analytical

    // Section 7: Healthcare & Fitness (Q21-22) - health
    "Haluaisitko työskennellä terveydenhuollossa hoitajana tai lääkärinä?", // Q21: health
    "Kiinnostaako sinua liikunta, urheilu tai fysioterapia?", // Q22: health

    // Section 8: Innovation & Problem-Solving (Q23-26) - innovation, problem_solving
    "Pidätkö uusien ratkaisujen ja tuotteiden kehittämisestä?", // Q23: innovation
    "Kiinnostaako sinua startup-kulttuuri ja innovaatiot?", // Q24: innovation
    "Haluaisitko ratkaista monimutkaisia teknisiä ongelmia?", // Q25: problem_solving
    "Pidätkö haastavien ongelmien selvittämisestä?", // Q26: problem_solving

    // Section 9: Workstyle (Q27-28) - teamwork, organization
    "Pidätkö tiimityöskentelystä ja yhteistyöstä?", // Q27: teamwork
    "Pidätkö järjestelmällisestä työskentelystä ja suunnittelusta?", // Q28: organization

    // Section 10: Environment & Outdoor (Q29) - impact/outdoor combined
    "Haluaisitko työskennellä ympäristönsuojelun, luonnonsuojelun tai ulkotyön parissa?" // Q29: impact + outdoor (combined)
  ]
};

// ---------- PERSISTENCE ----------
const STORAGE_KEY = "careercompass-progress";

function saveProgress(state: any) {
  // Add timestamp for debugging
  const dataToSave = {
    ...state,
    timestamp: Date.now(),
    version: "1.0" // For future compatibility
  };
  safeSetItem(STORAGE_KEY, dataToSave);
}

function loadProgress() {
  const parsed = safeGetItem<{ timestamp?: number; [key: string]: any }>(STORAGE_KEY, null);
  if (!parsed) return null;

  // Check if data is not too old (optional: expire after 30 days)
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  if (parsed.timestamp && parsed.timestamp < thirtyDaysAgo) {
    safeRemoveItem(STORAGE_KEY);
    return null;
  }

  return parsed;
}

// ---------- API FETCH FUNCTION ----------
/**
 * Fetches questions from the secure backend API
 * This protects business logic by keeping weights, subdimensions, and mappings server-side
 */
interface QuestionResponse {
  index: number;
  text: string;
  originalQ?: number;
}

async function fetchQuestions(cohort: string, setIndex: number, subCohort?: string): Promise<QuestionResponse[]> {
  try {
    let url = `/api/questions?cohort=${cohort}&setIndex=${setIndex}`;
    if (subCohort) {
      url += `&subCohort=${subCohort}`;
    }
    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      console.error('[CareerCompassTest] API error:', data.error);
      throw new Error(data.error || 'Failed to fetch questions');
    }

    return data.questions;
  } catch (error) {
    console.error('[CareerCompassTest] Failed to fetch questions:', error);
    throw error;
  }
}

// ---------- MAIN COMPONENT ----------
export default function CareerCompassTest({ pin, classToken }: { pin?: string | null; classToken?: string | null } = {}) {
  type GroupKey = "YLA" | "TASO2" | "NUORI";
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0: landing, 1: group select, 2: questions, 3: summary
  const [group, setGroup] = useState<GroupKey | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentOccupation, setCurrentOccupation] = useState<string>(""); // Current career/occupation for filtering
  const [taso2SubCohort, setTaso2SubCohort] = useState<"LUKIO" | "AMIS" | null>(null); // TASO2 sub-selection: Lukio or Ammattikoulu
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [hasShownSaveNotification, setHasShownSaveNotification] = useState(false);
  const [originalIndices, setOriginalIndices] = useState<number[]>([]); // For shuffle mapping
  const [shuffleKey, setShuffleKey] = useState<string>(''); // For verification
  const [selectedSetIndex, setSelectedSetIndex] = useState<number>(0); // For YLA question pool
  const [questionToOriginalMapping, setQuestionToOriginalMapping] = useState<Map<number, number>>(new Map()); // Maps displayed Q index to originalQ
  const [shuffledToOriginalQ, setShuffledToOriginalQ] = useState<number[]>([]); // Maps shuffled position -> originalQ (0-29)
  const [qList, setQList] = useState<string[]>([]); // Shuffled questions for display

  // Effect to select question set and prepare questions when group changes
  // For TASO2, also wait for subCohort selection before loading questions
  useEffect(() => {
    if (!group) {
      setQList([]);
      setShuffledToOriginalQ([]);
      setOriginalIndices([]);
      setShuffleKey('');
      setSelectedSetIndex(0);
      return;
    }

    // For TASO2, don't load questions until subCohort is selected
    if (group === 'TASO2' && !taso2SubCohort) {
      setQList([]);
      return;
    }

    // Async function to load questions
    const loadQuestions = async () => {
      let setIndex = 0;
      let questions: string[] = [];
      const mapping = new Map<number, number>(); // Maps displayed index to originalQ

      if (group === 'YLA' || group === 'TASO2' || group === 'NUORI') {
        // Use question pool system for YLA, TASO2, and NUORI
        setIndex = selectQuestionSet(group);
        setSelectedSetIndex(setIndex);

        try {
          // Fetch questions from secure API (protects business logic)
          // For TASO2, pass the subCohort to get LUKIO or AMIS specific questions
          const subCohortParam = group === 'TASO2' ? taso2SubCohort || undefined : undefined;
          const apiQuestions = await fetchQuestions(group, setIndex, subCohortParam);

          // Extract question texts and create mapping
          questions = apiQuestions.map(q => q.text);
          apiQuestions.forEach((q, displayedIndex) => {
            // Map displayed index to originalQ (or index if originalQ doesn't exist)
            const originalQ = q.originalQ !== undefined ? q.originalQ : q.index;
            mapping.set(displayedIndex, originalQ);
          });
        } catch (error) {
          console.error('[CareerCompassTest] Failed to load questions, using fallback:', error);
          // Fallback to hardcoded questions if API fails
          questions = QUESTIONS[group] || [];
        }
      } else {
        // Fallback for other cohorts (shouldn't happen, but safe)
        questions = QUESTIONS[group] || [];
      }

      setQuestionToOriginalMapping(mapping);

      // Shuffle using Fisher-Yates
      const qsWithIndices = questions.map((text, idx) => ({ q: idx, text }));
      const shuffled = [...qsWithIndices];

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Create mapping from shuffled position -> original index
      const shuffledMapping: number[] = shuffled.map(q => q.q);
      setOriginalIndices(shuffledMapping);

      // Create mapping from shuffled position -> originalQ (for Set 2/3)
      const shuffledToOriginalQMapping: number[] = shuffled.map(q => {
        const originalQ = mapping.get(q.q);
        return originalQ !== undefined ? originalQ : q.q;
      });
      setShuffledToOriginalQ(shuffledToOriginalQMapping);

      // Generate simple shuffle key
      let hash = 0;
      for (let i = 0; i < shuffledMapping.length; i++) {
        hash = (hash + (shuffledMapping[i] * (i + 1))) % 2147483647;
      }
      setShuffleKey(hash.toString(36));

      // Set the shuffled questions for display
      setQList(shuffled.map(q => q.text));

      // Ensure answers array matches the actual number of questions
      const actualQuestionCount = shuffled.length;
      setAnswers(prev => {
        if (prev.length !== actualQuestionCount) {
          // Resize answers array to match question count
          const resized = [...prev];
          while (resized.length < actualQuestionCount) {
            resized.push(0); // Add unanswered slots
          }
          while (resized.length > actualQuestionCount) {
            resized.pop(); // Remove extra slots
          }
          return resized;
        }
        return prev;
      });
    };

    // Call the async function
    loadQuestions();
  }, [group, taso2SubCohort]);
  const total = qList.length;

  // Load saved progress on component mount
  useEffect(() => {
    const saved = loadProgress();
    // Only restore steps 1 and 2, not step 3 (Summary) - step 3 causes issues when restoring
    if (saved && saved.step !== undefined && saved.step > 0 && saved.step < 3) {
      setStep(saved.step);
      setGroup(saved.group);
      setIndex(saved.index ?? 0);
      const loadedAnswers = saved.answers ?? [];
      setAnswers(loadedAnswers);
      setHasLoadedProgress(true);

      // Restore taso2SubCohort if saved
      if (saved.taso2SubCohort) {
        setTaso2SubCohort(saved.taso2SubCohort);
      }

      // If user already has answers saved, mark notification as shown
      // so it won't show again when they continue answering
      if (loadedAnswers.length > 0) {
        setHasShownSaveNotification(true);
      }

      // Show notification that progress was loaded
      setTimeout(() => {
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 4000);
      }, 500);
    } else if (saved && saved.step === 3) {
      // If saved at step 3, clear it - user should see results page or restart
      safeRemoveItem(STORAGE_KEY);
    }
  }, []);

  // Auto-save progress whenever state changes
  // NOTE: Don't save step 3 (Summary) - it causes issues when restoring because questions re-shuffle
  useEffect(() => {
    if (step > 0 && step < 3) { // Only save steps 1 and 2, not step 3 (Summary)
      saveProgress({ step, group, index, answers, taso2SubCohort });

      // Show save notification only once after the first answer
      // Check if we're in question step (step === 2) and have at least one answer
      // and haven't shown the notification yet
      if (step === 2 && answers.length > 0 && !hasShownSaveNotification) {
        setShowSaveNotification(true);
        setHasShownSaveNotification(true); // Mark as shown so it won't show again
        setTimeout(() => setShowSaveNotification(false), 3000);
      }
    }
  }, [step, group, index, answers, taso2SubCohort, hasShownSaveNotification]);

  // Save progress before page unload (but not step 3)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (step > 0 && step < 3) {
        saveProgress({ step, group, index, answers, taso2SubCohort });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step, group, index, answers, taso2SubCohort]);

  const start = () => setStep(1);

  const chooseGroup = (g: GroupKey) => {
    setGroup(g);
    setAnswers(Array(QUESTIONS[g].length).fill(0));
    setIndex(0);
    // For NUORI cohort, skip to questions (occupation is optional)
    // For other cohorts, go straight to questions
    setStep(2);
  };

  const setAnswer = (val: number) => {
    const next = [...answers];
    next[index] = val;
    setAnswers(next);
  };

  const nextQ = () => {
    if (index < total - 1) setIndex((i) => i + 1);
    else setStep(3);
  };
  const prevQ = () => { if (index > 0) setIndex((i) => i - 1); };

  const restart = () => {
    setStep(0);
    setGroup(null);
    setTaso2SubCohort(null); // Reset TASO2 sub-selection
    setIndex(0);
    setAnswers([]);
    setHasLoadedProgress(false);
    saveProgress({}); // Clear saved progress
  };

  const sendToBackend = async () => {
    const payload = {
      group,
      questions: qList,
      answers, // 1..5, 0 = ei vastattu
    };
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Vastaukset lähetetty onnistuneesti!", {
          description: "Siirrytään tulossivulle...",
          duration: 3000,
        });
      } else {
        toast.error("Lähetys epäonnistui", {
          description: "Yritä uudelleen hetken kuluttua",
          duration: 5000,
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Yhteysvirhe", {
        description: "Tarkista internet-yhteytesi ja yritä uudelleen",
        duration: 5000,
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Toaster position="top-right" richColors closeButton />
        {/* Progress Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="
            relative
            rounded-xl
            border border-cyan-400/20
            bg-gradient-to-b from-white/8 via-white/5 to-white/3
            backdrop-blur-xl
            px-4 py-3
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          ">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <p className="text-sm text-cyan-300 font-medium">
                Tallensimme vastauksesi – voit jatkaa myöhemmin tästä kohdasta.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 0 && (
        <Landing onStart={start} hasSavedProgress={hasLoadedProgress} />
      )}

      {step === 1 && (
        <GroupSelect onChoose={chooseGroup} onBack={restart} />
      )}

      {/* TASO2 sub-selection: Lukio or Ammattikoulu */}
      {step === 2 && group === "TASO2" && !taso2SubCohort && (
        <TASO2SubSelect
          onChoose={(sub) => setTaso2SubCohort(sub)}
          onBack={() => {
            setGroup(null);
            setStep(1);
          }}
        />
      )}

      {step === 2 && group && index === 0 && group === "NUORI" && currentOccupation === "" && (
        <OccupationInput
          value={currentOccupation}
          onChange={setCurrentOccupation}
          onSkip={() => setCurrentOccupation("none")}
        />
      )}

      {/* Show questions when:
          - YLA is selected (no sub-selection needed)
          - TASO2 is selected AND subCohort is chosen
          - NUORI is selected AND (index > 0 OR currentOccupation is set) */}
      {step === 2 && group && (
        (group === "YLA") ||
        (group === "TASO2" && taso2SubCohort) ||
        (group === "NUORI" && (index > 0 || currentOccupation !== ""))
      ) && (
        <QuestionScreen
          title={
            group === "YLA"
              ? "Yläaste (13–15 v) – Tutustu itseesi"
              : group === "TASO2"
              ? taso2SubCohort === "LUKIO"
                ? "Lukio (16–19 v) – Löydä akateeminen suuntasi"
                : "Ammattikoulu (16–19 v) – Löydä ammatillinen suuntasi"
              : "Nuoret aikuiset – Rakenna oma polkusi"
          }
          questions={qList}
          index={index}
          answers={answers}
          onAnswer={setAnswer}
          onNext={nextQ}
          onPrev={prevQ}
          onRestart={restart}
        />
      )}

      {step === 3 && group && (
        // Wait for questions to load before showing Summary (prevents "30/0" error on restore)
        qList.length > 0 && shuffledToOriginalQ.length > 0 ? (
          <Summary
            group={group}
            questions={qList}
            answers={answers}
            originalIndices={originalIndices}
            shuffledToOriginalQ={shuffledToOriginalQ}
            shuffleKey={shuffleKey}
            selectedSetIndex={selectedSetIndex}
            onRestart={restart}
            onSend={sendToBackend}
            pin={pin}
            classToken={classToken}
            currentOccupation={currentOccupation}
            taso2SubCohort={taso2SubCohort}
          />
        ) : (
          // Questions not loaded - show error with restart option instead of infinite loading
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <p className="text-urak-text-secondary">Kysymysten lataus epäonnistui.</p>
            <button
              onClick={restart}
              className="px-4 py-2 bg-urak-accent-blue text-white rounded-lg hover:bg-urak-accent-blue/80 transition-colors"
            >
              Aloita testi alusta
            </button>
          </div>
        )
      )}
    </div>
  );
}

// ---------- SUB-COMPONENTS ----------
const Landing = ({ onStart, hasSavedProgress }: { onStart: () => void; hasSavedProgress: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const featureChips = ['30 kysymystä', 'Noin 5 minuuttia', 'Maksuton', 'Luottamuksellinen'];

  return (
    <section className="flex justify-center px-4 py-24">
      <div
        className={`
          relative
          max-w-4xl w-full
          overflow-hidden
          rounded-[32px]
          border border-cyan-400/10
          bg-gradient-to-b from-white/6 via-white/3 to-white/2
          bg-clip-padding
          backdrop-blur-xl
          shadow-[0_24px_80px_rgba(0,0,0,0.65)]
          px-8 py-10 md:px-12 md:py-14
          transition-all duration-800 ease-in-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'}
        `}
      >
        {/* Top glow effect */}
        <div className="pointer-events-none absolute inset-x-8 -top-32 h-40 rounded-full bg-gradient-to-b from-cyan-300/25 to-transparent blur-3xl" />

        <div className="relative space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Löydä tulevaisuutesi suunta
          </h2>

          <p className="text-base md:text-lg text-urak-text-secondary">
            Vastaa 30 huolellisesti suunniteltuun kysymykseen, jotka kartoittavat
            kiinnostuksesi, arvosi ja vahvuutesi.
          </p>

          <p className="text-base md:text-lg text-urak-text-secondary">
            Analyysimme perustuu tutkittuun persoonallisuus- ja urapsykologiaan ja
            tarjoaa sinulle henkilökohtaisia urasuosituksia Suomen työmarkkinoille.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {featureChips.map((label) => (
              <span
                key={label}
                className="
                  inline-flex items-center
                  rounded-full
                  border border-white/12
                  bg-white/4
                  px-3 py-1.5
                  text-xs font-medium
                  text-urak-text-secondary
                "
              >
                {label}
              </span>
            ))}
          </div>

          {hasSavedProgress && (
            <div className="rounded-lg bg-white/5 border border-white/20 p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#2B5F75]"></div>
                <p className="text-sm text-white font-medium">
                  Löysimme tallennetut vastauksesi – voit jatkaa siitä mihin jäit!
                </p>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="button"
              onClick={onStart}
              className="
                group
                relative inline-flex items-center justify-center
                rounded-full
                bg-gradient-to-r from-sky-500 to-blue-500
                px-8 py-3
                text-sm md:text-base font-semibold text-white
                shadow-[0_18px_40px_rgba(37,99,235,0.6)]
                transition
                hover:shadow-[0_20px_45px_rgba(37,99,235,0.65)]
                hover:scale-[1.01]
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              "
            >
              {hasSavedProgress ? "Jatka testiä" : "Aloita ilmainen testi"}
              <span className="ml-2 inline-block translate-x-0 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const GroupCard = ({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) => (
  <button onClick={onClick} className="flex w-full flex-col items-start rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-6 text-left shadow-sm transition hover:shadow-md hover:bg-white/10">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mt-1 text-urak-text-secondary">{desc}</p>
  </button>
);

const GroupSelect = ({ onChoose, onBack }: { onChoose: (g: "YLA" | "TASO2" | "NUORI") => void; onBack: () => void }) => (
  <div className="space-y-6">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-white">Valitse ikäryhmäsi</h1>
      <p className="mt-2 text-urak-text-secondary">Tämä auttaa meitä antamaan sinulle sopivimmat kysymykset</p>
    </div>

    <div className="grid gap-4">
      <GroupCard
        title="Yläasteen oppilas (13–15 v)"
        desc="Tutustu itseesi ja löydä kiinnostuksesi"
        onClick={() => onChoose("YLA")}
      />
      <GroupCard
        title="Toisen asteen opiskelija (16–19 v)"
        desc="Löydä suuntasi ja suunnittele tulevaisuuttasi"
        onClick={() => onChoose("TASO2")}
      />
      <GroupCard
        title="Nuori aikuinen"
        desc="Rakenna oma polkusi ja löydä urapolku"
        onClick={() => onChoose("NUORI")}
      />
    </div>

    <button onClick={onBack} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 transition-colors">
      Takaisin
    </button>
  </div>
);

// TASO2 Sub-selection: Lukio (academic) or Ammattikoulu (vocational)
const TASO2SubSelect = ({ onChoose, onBack }: { onChoose: (sub: "LUKIO" | "AMIS") => void; onBack: () => void }) => (
  <section className="flex justify-center px-4 py-24">
    <div
      className="
        relative
        max-w-4xl w-full
        overflow-hidden
        rounded-[32px]
        border border-cyan-400/10
        bg-gradient-to-b from-white/6 via-white/3 to-white/2
        bg-clip-padding
        backdrop-blur-xl
        shadow-[0_24px_80px_rgba(0,0,0,0.65)]
        px-8 py-10 md:px-12 md:py-14
      "
    >
      {/* Top glow effect */}
      <div className="pointer-events-none absolute inset-x-8 -top-32 h-40 rounded-full bg-gradient-to-b from-cyan-300/25 to-transparent blur-3xl" />

      <div className="relative space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Missä opiskelet?
          </h1>
          <p className="mt-3 text-base md:text-lg text-urak-text-secondary">
            Valitse nykyinen opiskelupaikkasi, jotta saat sinulle sopivimmat kysymykset.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Lukio card */}
          <button
            onClick={() => onChoose("LUKIO")}
            className="
              group
              flex flex-col items-start
              rounded-2xl
              border border-white/20
              bg-white/5
              backdrop-blur-sm
              p-6
              text-left
              shadow-sm
              transition-all
              hover:shadow-md
              hover:bg-white/10
              hover:border-cyan-400/30
            "
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Lukio</h3>
            </div>
            <p className="text-urak-text-secondary">
              Akateeminen polku kohti yliopistoa tai korkeakoulua. Kysymykset keskittyvät teoreettisiin aloihin ja tutkimukseen.
            </p>
          </button>

          {/* Ammattikoulu card */}
          <button
            onClick={() => onChoose("AMIS")}
            className="
              group
              flex flex-col items-start
              rounded-2xl
              border border-white/20
              bg-white/5
              backdrop-blur-sm
              p-6
              text-left
              shadow-sm
              transition-all
              hover:shadow-md
              hover:bg-white/10
              hover:border-cyan-400/30
            "
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Ammattikoulu</h3>
            </div>
            <p className="text-urak-text-secondary">
              Käytännön ammattitaitoon tähtäävä polku. Kysymykset keskittyvät käytännön työhön ja ammatteihin.
            </p>
          </button>
        </div>

        <button
          onClick={onBack}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 transition-colors"
        >
          Takaisin
        </button>
      </div>
    </div>
  </section>
);

const OccupationInput = ({ value, onChange, onSkip }: { value: string; onChange: (val: string) => void; onSkip: () => void }) => {
  const [localValue, setLocalValue] = useState(value);

  const handleSubmit = () => {
    if (localValue.trim()) {
      onChange(localValue.trim());
    }
  };

  return (
    <section className="flex justify-center px-4 py-24">
      <div
        className="
          relative
          max-w-4xl w-full
          overflow-hidden
          rounded-[32px]
          border border-cyan-400/10
          bg-gradient-to-b from-white/6 via-white/3 to-white/2
          bg-clip-padding
          backdrop-blur-xl
          shadow-[0_24px_80px_rgba(0,0,0,0.65)]
          px-8 py-10 md:px-12 md:py-14
        "
      >
        {/* Top glow effect */}
        <div className="pointer-events-none absolute inset-x-8 -top-32 h-40 rounded-full bg-gradient-to-b from-cyan-300/25 to-transparent blur-3xl" />

        <div className="relative space-y-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Mikä on nykyinen ammattisi tai työsi?
            </h1>
            <p className="mt-3 text-base md:text-lg text-urak-text-secondary">
              Tämä auttaa meitä antamaan sinulle parempia suosituksia. Jos et ole töissä tai opiskelija, voit ohittaa tämän.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && localValue.trim()) {
                  handleSubmit();
                }
              }}
              placeholder="Esim. Sairaanhoitaja, Myyjä, Opiskelija..."
              className="w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-lg text-white placeholder:text-gray-500 focus:border-urak-accent-blue/40 focus:outline-none focus:ring-2 focus:ring-urak-accent-blue/20 focus:bg-white/8 transition-colors"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!localValue.trim()}
                className="
                  group
                  flex-1
                  relative inline-flex items-center justify-center
                  rounded-full
                  bg-gradient-to-r from-sky-500 to-blue-500
                  px-6 py-3
                  text-sm md:text-base font-semibold text-white
                  shadow-[0_18px_40px_rgba(37,99,235,0.6)]
                  transition
                  hover:shadow-[0_20px_45px_rgba(37,99,235,0.65)]
                  hover:scale-[1.01]
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_18px_40px_rgba(37,99,235,0.6)]
                "
              >
                Jatka
              </button>
              <button
                onClick={onSkip}
                className="
                  flex-1
                  rounded-full
                  border border-white/20
                  bg-white/5
                  backdrop-blur-sm
                  px-6 py-3
                  text-sm md:text-base font-semibold text-white
                  transition
                  hover:bg-white/10
                  hover:border-white/30
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                "
              >
                Ohita
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-urak-text-muted">
            Ammattisi auttaa meitä suodattamaan pois työsi, jotta näet uusia vaihtoehtoja.
          </p>
        </div>
      </div>
    </section>
  );
};

const RatingScale = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
  const labels = ["Ei lainkaan", "Vähän", "Kohtalaisesti", "Paljon", "Erittäin paljon"];
  return (
    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-5">
      {labels.map((label, idx) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(idx + 1)}
          className={
            "rounded-xl border px-4 py-3.5 text-sm sm:text-base transition min-h-[44px] touch-manipulation " +
            (value === idx + 1
              ? "border-urak-accent-blue bg-urak-accent-blue/10 text-white font-semibold ring-2 ring-urak-accent-blue/30 shadow-lg"
              : "border-white/20 bg-white/5 text-urak-text-secondary hover:bg-white/10 hover:border-white/30")
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const QuestionScreen = ({
  title,
  questions,
  index,
  answers,
  onAnswer,
  onNext,
  onPrev,
  onRestart,
}: {
  title: string;
  questions: string[];
  index: number;
  answers: number[];
  onAnswer: (val: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
}) => {
  const total = questions.length;
  const progress = ((index + 1) / total) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-urak-text-secondary">
          Kysymys {index + 1} / {total}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-urak-text-secondary">{Math.round(progress)}% valmis</span>
            <span className="text-urak-accent-blue">{total - (index + 1)} jäljellä</span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/10 shadow-inner">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-urak-accent-blue to-urak-accent-green transition-all duration-300 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-sm p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-white">{questions[index]}</h2>
        <RatingScale value={answers[index]} onChange={onAnswer} />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edellinen
        </button>
        <button
          onClick={onRestart}
          className="rounded-xl px-4 py-2 text-urak-text-secondary hover:bg-white/10 transition-colors"
        >
          Aloita alusta
        </button>
        <button
          onClick={onNext}
          disabled={answers[index] === 0}
          className="rounded-xl bg-urak-accent-blue hover:bg-urak-accent-blue/90 px-6 py-2 text-white font-medium shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {index === total - 1 ? "Valmis" : "Seuraava"}
        </button>
      </div>
    </div>
  );
};

const Summary = ({
  group,
  questions,
  answers,
  originalIndices,
  shuffledToOriginalQ,
  shuffleKey,
  selectedSetIndex,
  onRestart,
  onSend,
  pin,
  classToken,
  currentOccupation,
  taso2SubCohort,
}: {
  group: any;
  questions: string[];
  answers: number[];
  originalIndices: number[];
  shuffledToOriginalQ: number[];
  shuffleKey: string;
  selectedSetIndex: number;
  onRestart: () => void;
  onSend: () => void;
  pin?: string | null;
  classToken?: string | null;
  currentOccupation?: string;
  taso2SubCohort?: "LUKIO" | "AMIS" | null;
}) => {
  console.log('[Summary] Component rendered with props:', { pin, classToken, hasPin: !!pin, hasClassToken: !!classToken });
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [careerCache, setCareerCache] = useState<{ [key: string]: any }>({});
  const [showValidationWarning, setShowValidationWarning] = useState(false);
  const [validationMetrics, setValidationMetrics] = useState<any>(null);

  const payload = useMemo(() => ({ group, questions, answers }), [group, questions, answers]);
  const answered = answers.filter((a) => a > 0).length;

  const sendToBackend = async () => {
    console.log('[Test] Starting sendToBackend with props:', { pin, verifyPin: !!pin, classToken, verifyClassToken: !!classToken });

    // Validate response quality BEFORE processing
    const validation = validateResponseQuality(answers.filter(a => a > 0));

    // Show warning if quality is low, but allow proceeding
    if (validation.qualityScore < 70 && validation.warnings.length > 0) {
      setValidationMetrics(validation);
      setShowValidationWarning(true);
      // User can dismiss warning and proceed
    }

    setLoading(true);
    setError(null);

    try {
      // Format answers for new scoring API
      // IMPORTANT: Map shuffled answers back to original question indices
      // shuffledToOriginalQ maps: shuffled position -> originalQ (0-29 for YLA/TASO2/NUORI)
      // Safety check: ensure shuffledToOriginalQ is properly initialized
      if (!shuffledToOriginalQ || shuffledToOriginalQ.length === 0) {
        console.error('[Test] shuffledToOriginalQ is not initialized properly');
        setError("Sisäinen virhe: kysymysten kartoitus puuttuu. Yritä uudelleen tai päivitä sivu.");
        setLoading(false);
        return;
      }
      
      // Map each answer from shuffled position to original question index
      // shuffledIndex = position in shuffled array (0, 1, 2, ...)
      // shuffledToOriginalQ[shuffledIndex] = original question index (0-29)
      const formattedAnswers = answers.map((score, shuffledIndex) => {
        const originalQIndex = shuffledToOriginalQ[shuffledIndex];
        if (originalQIndex === undefined || originalQIndex === null) {
          console.warn(`[Test] Missing mapping for shuffled index ${shuffledIndex}, using fallback`);
          return {
            questionIndex: shuffledIndex,
            score: score || 3
          };
        }
        return {
          questionIndex: originalQIndex, // This is the originalQ (0-29)
          score: score || 3 // Use 3 (neutral) for unanswered questions
        };
      });
      
      console.log('[Test] Formatted answers:', {
        totalAnswers: formattedAnswers.length,
        sample: formattedAnswers.slice(0, 3),
        shuffledToOriginalQSample: shuffledToOriginalQ.slice(0, 3)
      });

      // If PIN and classToken are provided, save to teacher's class
      if (pin && classToken) {
        console.log('[Test] PIN detected, saving to teacher class:', { pin, classToken });
        // First get the results by calling /api/score
        console.log('[Test] Calling /api/score with:', { cohort: group, answersCount: formattedAnswers.length });
        // Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const scoreResponse = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cohort: group,
            answers: formattedAnswers,
            originalIndices,
            shuffleKey,
            currentOccupation: currentOccupation || undefined,
            subCohort: group === 'TASO2' ? taso2SubCohort : undefined
          }),
          signal: controller.signal
        }).catch((error) => {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            throw new Error('Pyyntö kesti liian kauan. Yritä uudelleen.');
          }
          throw error;
        });
        clearTimeout(timeoutId);
        console.log('[Test] Score API response status:', scoreResponse.status);
        
        if (!scoreResponse.ok) {
          const errorText = await scoreResponse.text().catch(() => 'Unknown error');
          console.error('[Test] Score API error response:', errorText);
          throw new Error(`Palvelinvirhe (${scoreResponse.status}): ${errorText}`);
        }
        
        const scoreData = await scoreResponse.json().catch((error) => {
          console.error('[Test] Failed to parse score response:', error);
          throw new Error('Vastauksen jäsennys epäonnistui. Yritä uudelleen.');
        });
        console.log('[Test] Score API response data:', scoreData);
        
        if (!scoreData) {
          throw new Error('Vastauksen jäsennys epäonnistui - tyhjä vastaus.');
        }
        
        if (scoreData.success) {
          // Now save to /api/results with PIN
          // Transform topCareers to match Zod schema (overallScore -> score)
          const topCareersForResults = (scoreData.topCareers || []).map((career: any) => ({
            slug: career.slug,
            title: career.title,
            score: career.overallScore || career.score || 0
          }));
          
          const resultPayload = {
            cohort: group,
            topCareers: topCareersForResults,
            dimensionScores: scoreData.userProfile?.dimensionScores || {},
            personalizedAnalysis: scoreData.userProfile?.personalizedAnalysis || null,
            timeSpentSeconds: null,
            educationPath: scoreData.educationPath || null
          };
          
          console.log('[Test] Sending to /api/results with:', { 
            pin, 
            totalToken: classToken, 
            payloadKeys: Object.keys(resultPayload) 
          });

          // Add timeout for results API call too
          const resultsController = new AbortController();
          const resultsTimeoutId = setTimeout(() => resultsController.abort(), 30000);
          
          const resultsResponse = await fetch("/api/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pin,
              classToken,
              resultPayload
            }),
            signal: resultsController.signal
          }).catch((error) => {
            clearTimeout(resultsTimeoutId);
            if (error.name === 'AbortError') {
              throw new Error('Tulosten tallentaminen kesti liian kauan. Yritä uudelleen.');
            }
            throw error;
          });
          clearTimeout(resultsTimeoutId);
          console.log('[Test] Results API response status:', resultsResponse.status);

          if (!resultsResponse.ok) {
            const errorText = await resultsResponse.text().catch(() => 'Unknown error');
            console.error('[Test] Results API error response:', errorText);
            throw new Error(`Tulosten tallentaminen epäonnistui (${resultsResponse.status}): ${errorText}`);
          }

          const resultsData = await resultsResponse.json().catch((error) => {
            console.error('[Test] Failed to parse results response:', error);
            throw new Error('Tulosten vastauksen jäsennys epäonnistui. Yritä uudelleen.');
          });
          console.log('[Test] Results API response:', resultsData);

          if (!resultsData) {
            throw new Error('Tulosten vastauksen jäsennys epäonnistui - tyhjä vastaus.');
          }

          if (resultsData.success) {
            console.log('[Test] Results saved successfully, navigating to results page');
            // Mark question set as used for YLA, TASO2, and NUORI cohorts
            if (group === 'YLA' || group === 'TASO2' || group === 'NUORI') {
              markSetAsUsed(group, selectedSetIndex);
            }
            // Save to localStorage and navigate
            // Save results with answers for verification
            // Include resultId from resultsData if available (for PIN users)
            const resultsWithAnswers = {
              ...scoreData,
              originalAnswers: formattedAnswers, // Store original answers for verification
              cohort: group,
              timestamp: new Date().toISOString(),
              resultId: resultsData.resultId || scoreData.resultId // Use resultId from results API if available
            };

            // IMPORTANT: Save to localStorage BEFORE navigating to ensure persistence
            // Use safeSetString with JSON.stringify for reliable synchronous storage
            const resultsJson = JSON.stringify(resultsWithAnswers);
            const finalResultId = resultsData.resultId || scoreData.resultId;
            console.log('[Test] PIN flow: Saving results to localStorage, resultId:', finalResultId);
            const savedResults = safeSetString('careerTestResults', resultsJson);
            const savedResultId = finalResultId ? safeSetString('lastTestResultId', finalResultId) : true;
            console.log('[Test] PIN flow: localStorage save result - results:', savedResults, 'resultId:', savedResultId);

            // Verify storage succeeded before navigating
            if (!savedResults || !savedResultId) {
              console.error('[Test] Failed to save results to localStorage');
              // Still navigate - results should be retrievable from database
            } else {
              console.log('[Test] Results saved successfully to localStorage');
            }

            // Small delay to ensure localStorage write completes
            setTimeout(() => {
              window.location.href = '/test/results';
            }, 50);
          } else {
            console.error('[Test] Failed to save results:', resultsData.error);
            const errorMsg = resultsData.error || "Tulosten tallentaminen epäonnistui";
            const hint = resultsData.hint || '';
            setError(`Tulosten tallentaminen epäonnistui.\n\n${errorMsg}${hint ? `\n\n${hint}` : ''}\n\nTarkista verkkoyhteytesi ja yritä uudelleen. Älä poistu tältä sivulta. Jos ongelma jatkuu, ota yhteyttä opettajaan.`);
            setLoading(false);
            return;
          }
        } else {
            const errorMsg = scoreData.error || "Analyysi epäonnistui";
            const hint = scoreData.hint || '';
            setError(`${errorMsg}${hint ? `\n\n${hint}` : ''}\n\nRatkaisu:\n1. Tarkista että vastasit kaikkiin kysymyksiin\n2. Tarkista verkkoyhteys\n3. Yritä lähettää vastaukset uudelleen\n4. Jos ongelma jatkuu, ota yhteyttä opettajaan.`);
            setLoading(false);
            return;
        }
      } else {
        console.log('[Test] No PIN, regular public flow');
        // Regular public flow (no PIN)
        // Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cohort: group,
            answers: formattedAnswers,
            originalIndices,
            shuffleKey,
            currentOccupation: currentOccupation || undefined,
            subCohort: group === 'TASO2' ? taso2SubCohort : undefined
          }),
          signal: controller.signal
        }).catch((error) => {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            throw new Error('Pyyntö kesti liian kauan. Yritä uudelleen.');
          }
          throw error;
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error('[Test] API response not OK:', response.status, response.statusText);
          const errorText = await response.text().catch(() => 'Unknown error');
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: errorText || 'Verkkovirhe' };
          }
          const errorMsg = errorData.error || `Palvelinvirhe (${response.status})`;
          const hint = errorData.hint || '';
          setError(`${errorMsg}${hint ? `\n\n${hint}` : ''}\n\nRatkaisu:\n1. Tarkista verkkoyhteys\n2. Odota hetki ja yritä uudelleen\n3. Älä poistu tältä sivulta - vastauksesi tallennetaan\n4. Jos ongelma jatkuu, ota yhteyttä opettajaan.`);
          setLoading(false);
          return;
        }
        
        const data = await response.json().catch((error) => {
          console.error('[Test] Failed to parse response:', error);
          setError('Vastauksen jäsennys epäonnistui. Yritä uudelleen.');
          setLoading(false);
          return; // Don't throw - error is already handled
        });
        
        if (!data) {
          // If data is null/undefined due to parsing error, stop here
          return;
        }
        console.log('[Test] Public flow response:', { success: data.success, hasTopCareers: !!data.topCareers });
        
        if (data.success) {
          // Mark question set as used for YLA, TASO2, and NUORI cohorts
          if (group === 'YLA' || group === 'TASO2' || group === 'NUORI') {
            markSetAsUsed(group, selectedSetIndex);
          }
          // Save results with answers for verification
          const resultsWithAnswers = {
            ...data,
            originalAnswers: formattedAnswers, // Store original answers for verification
            cohort: group,
            timestamp: new Date().toISOString()
          };

          // IMPORTANT: Save to localStorage BEFORE navigating to ensure persistence
          // Use safeSetString with JSON.stringify for reliable synchronous storage
          const resultsJson = JSON.stringify(resultsWithAnswers);
          console.log('[Test] Saving results to localStorage, resultId:', data.resultId);
          const savedResults = safeSetString('careerTestResults', resultsJson);
          const savedResultId = data.resultId ? safeSetString('lastTestResultId', data.resultId) : true;
          console.log('[Test] localStorage save result - results:', savedResults, 'resultId:', savedResultId);

          // Verify storage succeeded before navigating
          if (!savedResults || !savedResultId) {
            console.error('[Test] Failed to save results to localStorage');
            // Still navigate - results should be retrievable from database
          } else {
            console.log('[Test] Results saved successfully to localStorage');
          }

          // Small delay to ensure localStorage write completes
          setTimeout(() => {
            window.location.href = '/test/results';
          }, 50);
        } else {
          console.error('[Test] Score API failed:', data);
          const errorMsg = data.error || data.details || "Analyysi epäonnistui";
          const hint = data.hint || '';
          setError(`${errorMsg}${hint ? `\n\n${hint}` : ''}\n\nRatkaisu:\n1. Tarkista että vastasit kaikkiin kysymyksiin\n2. Tarkista verkkoyhteys\n3. Odota hetki ja yritä lähettää vastaukset uudelleen\n4. Älä poistu tältä sivulta - vastauksesi tallennetaan automaattisesti\n5. Jos ongelma jatkuu, ota yhteyttä opettajaan.`);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error(e);
      setError("Vastausten lähetys epäonnistui.\n\nRatkaisu:\n1. Tarkista verkkoyhteys\n2. Älä poistu tältä sivulta - vastauksesi tallennetaan automaattisesti\n3. Yritä lähettää vastaukset uudelleen\n4. Jos ongelma jatkuu, ota yhteyttä opettajaan.\n\nHuom: Jos poistut sivulta nyt, voit palata myöhemmin ja jatkaa tästä kohdasta.");
    } finally {
      setLoading(false);
    }
  };

  const openCareerDetail = (career: any) => {
    if (!career || typeof career !== 'object') return;
    setSelectedCareer(career);
    // Cache the career data for faster reopens
    const careerKey = career.id || career.slug || `career-${Date.now()}`;
    if (careerKey && !careerCache[careerKey]) {
      setCareerCache(prev => ({ ...prev, [careerKey]: career }));
    }
  };

  const closeCareerDetail = () => {
    setSelectedCareer(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCareerDetail();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeCareerDetail();
    }
  };

  // Dynamic Career Links Component
  const DynamicCareerLinks = ({ career }: { career: any }) => {
    const [activeTab, setActiveTab] = useState<'education' | 'jobs'>('education');

    // Simple URL generation
    const educationUrl = 'https://opintopolku.fi/';
    const jobsUrl = 'https://tyomarkkinatori.fi/';
    
    const currentUrl = activeTab === 'education' ? educationUrl : jobsUrl;
    const sourceName = activeTab === 'education' ? 'Opintopolku.fi' : 'Työmarkkinatori';
    const linkType = activeTab === 'education' ? 'koulutukset' : 'työpaikat';

    const handleTabKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveTab(activeTab === 'education' ? 'jobs' : 'education');
      }
    };

    const openLink = () => {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    };

    return (
      <div className="space-y-4">
        {/* Tab Control */}
        <div className="flex items-center justify-between">
          <div 
            className="flex rounded-lg border border-white/20 bg-white/10 p-1"
            role="tablist"
            aria-label="Valitse hakutyyppi"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'education'}
              aria-controls="education-panel"
              onClick={() => setActiveTab('education')}
              onKeyDown={handleTabKeyDown}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'education'
                  ? 'bg-white/10 text-white shadow-sm border border-white/20'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Koulutukset
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'jobs'}
              aria-controls="jobs-panel"
              onClick={() => setActiveTab('jobs')}
              onKeyDown={handleTabKeyDown}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-white/10 text-white shadow-sm border border-white/20'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Työpaikat
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={openLink}
            aria-label={`Avaa ${linkType} ${sourceName}`}
            className="px-6 py-2 bg-white/10 text-white border border-white/20 font-semibold rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            Avaa
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-white/90">
          Linkit ohjaavat luotettuihin lähteisiin: Opintopolku (koulutukset) ja Työmarkkinatori (työpaikat). Molemmat linkit vievät pääsivulle, josta voit hakea sopivia mahdollisuuksia.
        </p>
      </div>
    );
  };

  // Career Detail Modal Component
  const CareerDetailModal = ({ career }: { career: any }) => {
    // Safety check: return early if career is invalid
    if (!career || typeof career !== 'object') {
      return null;
    }
    
    // Generate comprehensive career information
    const generateCareerDetails = (career: any) => {
      if (!career || typeof career !== 'object') {
        return {
          introduction: 'Ammatti',
          careerPath: '',
          workEnvironment: '',
          skillsBreakdown: { technical: [], soft: [], industry: [] },
          industryInsights: '',
          futureProspects: ''
        };
      }
      
      const title = career.title_fi || career.title || 'Ammatti';
      const description = career.short_description || '';
      const category = career.category || '';
      
      const careerDetails = {
        // Enhanced introduction
        introduction: `${title} on ${category === 'luova' ? 'luova' : 
          category === 'johtaja' ? 'johtamispainotteinen' :
          category === 'innovoija' ? 'innovaatiopainotteinen' :
          category === 'rakentaja' ? 'käytännönläheinen' :
          category === 'auttaja' ? 'ihmiskeskeinen' :
          category === 'ympariston-puolustaja' ? 'vastuullinen' :
          category === 'visionaari' ? 'strateginen' :
          category === 'jarjestaja' ? 'järjestelmällinen' : 'monipuolinen'} ammatti${description ? `, joka ${description.toLowerCase()}` : ''}`,
        
        // Detailed career path
        careerPath: generateCareerPath(career),
        
        // Work environment
        workEnvironment: generateWorkEnvironment(career),
        
        // Skills breakdown
        skillsBreakdown: generateSkillsBreakdown(career),
        
        // Industry insights
        industryInsights: generateIndustryInsights(career),
        
        // Future prospects
        futureProspects: generateFutureProspects(career)
      };
      
      return careerDetails;
    };

    const generateCareerPath = (career: any) => {
      const paths = {
        'luova': 'Luovassa ammatissa voit aloittaa harjoittelijana tai assistenttina, kehittyä erikoistujaksi ja lopulta luovaksi johtajaksi tai freelanceriksi. Portfolio ja verkostot ovat avain menestykseen.',
        'johtaja': 'Johtamisammatissa eteneminen tapahtuu tyypillisesti vastuullisempiin tehtäviin, tiimijohtajuuteen ja lopulta strategiseen johtajuuteen. Kokemus ja tulokset ovat tärkeimmät tekijät.',
        'innovoija': 'Innovaatioammatissa voit aloittaa kehittäjänä, siirtyä senior-rooliin, erikoistua teknologiaan ja lopulta johtaa innovaatioita tai perustaa oman yrityksen.',
        'rakentaja': 'Rakentamisammatissa eteneminen tapahtuu teknisestä työstä vastuullisempiin tehtäviin, projektijohtajuuteen ja lopulta liiketoimintaan tai yrittäjyyteen.',
        'auttaja': 'Auttamisammatissa voit kehittyä erikoistujaksi, siirtyä mentorointiin, johtaa tiimejä ja lopulta vaikuttaa laajemmin yhteiskuntaan tai politiikkaan.',
        'ympariston-puolustaja': 'Ympäristöammatissa eteneminen tapahtuu tutkimuksesta käytännön toimiin, projektijohtajuuteen ja lopulta strategiseen vaikuttamiseen.',
        'visionaari': 'Visionäärisessä ammatissa voit aloitta analyytikkona, siirtyä strategiksi, johtaa muutosta ja lopulta luoda visioita jotka muuttavat koko alan.',
        'jarjestaja': 'Järjestämisammatissa eteneminen tapahtuu koordinoinnista projektijohtajuuteen, prosessien kehittämiseen ja lopulta organisaation johtamiseen.'
      };
      
      return paths[career.category as keyof typeof paths] || 'Tämä ammatti tarjoaa hyvät mahdollisuudet kehittyä ja erikoistua. Työkokemuksen karttuessa voit siirtyä vastuullisempiin tehtäviin ja johtaviin rooleihin.';
    };

    const generateWorkEnvironment = (career: any) => {
      const environments = {
        'luova': 'Luovassa työympäristössä on vapaus ilmaista itseäsi, kokeilla uusia ideoita ja työskennellä inspiroivassa ympäristössä. Tiimityö ja verkostoituminen ovat tärkeää.',
        'johtaja': 'Johtamistyössä työskentelet dynaamisessa ympäristössä, jossa pääset vaikuttamaan strategioihin ja johtamaan ihmisiä. Vastuu ja päätöksenteko ovat keskeisiä.',
        'innovoija': 'Innovaatiotyössä työskentelet nopeatempoisessa teknologiapainotteisessa ympäristössä, jossa saa kokeilla ja kehittää uutta. Oppiminen ja sopeutuminen ovat avain.',
        'rakentaja': 'Rakentamistyössä työskentelet käytännönläheisessä ympäristössä, jossa näet konkreettisia tuloksia työstäsi. Tiimityö ja turvallisuus ovat tärkeää.',
        'auttaja': 'Autamistyössä työskentelet ihmiskeskeisessä ympäristössä, jossa pääset tekemään merkityksellistä työtä. Empatia ja kommunikaatio ovat keskeisiä.',
        'ympariston-puolustaja': 'Ympäristötyössä työskentelet vastuullisessa ympäristössä, jossa pääset vaikuttamaan kestävään kehitykseen. Tutkimus ja käytännön toimet yhdistyvät.',
        'visionaari': 'Visionäärisessä työssä työskentelet strategisessa ympäristössä, jossa pääset suunnittelemaan tulevaisuutta. Analyysi ja kommunikaatio ovat tärkeää.',
        'jarjestaja': 'Järjestämistyössä työskentelet strukturoidussa ympäristössä, jossa pääset luomaan selkeyttä ja tehokkuutta. Organisointi ja kommunikaatio ovat keskeisiä.'
      };
      
      return environments[career.category as keyof typeof environments] || 'Tämä ammatti tarjoaa monipuolisen työympäristön, jossa pääset hyödyntämään vahvuuksiasi ja kehittämään taitojasi.';
    };

    const generateSkillsBreakdown = (career: any) => {
      const keywords = Array.isArray(career?.keywords) ? career.keywords : [];
      return {
        technical: keywords.filter((skill: string) => 
          skill && typeof skill === 'string' && ['ohjelmointi', 'teknologia', 'analyysi', 'suunnittelu', 'kehitys'].some(tech => 
            skill.toLowerCase().includes(tech)
          )
        ),
        soft: keywords.filter((skill: string) => 
          skill && typeof skill === 'string' && ['kommunikaatio', 'johtaminen', 'tiimityö', 'kreatiivisuus', 'ongelmanratkaisu'].some(soft => 
            skill.toLowerCase().includes(soft)
          )
        ),
        industry: keywords.filter((skill: string) => 
          skill && typeof skill === 'string' && !['ohjelmointi', 'teknologia', 'analyysi', 'suunnittelu', 'kehitys', 'kommunikaatio', 'johtaminen', 'tiimityö', 'kreatiivisuus', 'ongelmanratkaisu'].some(general => 
            skill.toLowerCase().includes(general)
          )
        )
      };
    };

    const generateIndustryInsights = (career: any) => {
      const insights = {
        'luova': 'Luova ala on muuttumassa digitaaliseksi ja globaaliksi. Uudet teknologiat avaavat mahdollisuuksia, mutta myös kilpailu on kovaa. Verkostoituminen ja jatkuva oppiminen ovat avain menestykseen.',
        'johtaja': 'Johtaminen muuttuu yhä enemmän palveluksi ja ihmiskeskeiseksi. Etätyö ja globaali tiimityö vaativat uusia taitoja. Empatia ja digitaaliset taidot ovat tärkeitä.',
        'innovoija': 'Teknologia kehittyy eksponentiaalisesti ja luo jatkuvasti uusia mahdollisuuksia. Tekoäly ja automaatio muuttavat alaa, mutta luovat ihmiset tarvitaan edelleen.',
        'rakentaja': 'Rakentaminen digitalisoituu ja kestävään kehitykseen siirtyminen on keskeistä. Uudet materiaalit ja rakennustekniikat muuttavat alaa.',
        'auttaja': 'Autamistyö muuttuu yhä enemmän ennaltaehkäiseväksi ja teknologia-avusteiseksi. Henkilökohtainen lähestymistapa säilyy tärkeänä.',
        'ympariston-puolustaja': 'Ympäristöalan merkitys kasvaa ja siirtyy yhä enemmän liiketoimintaan. Kestävän kehityksen osaaminen on kilpailuetu.',
        'visionaari': 'Strateginen ajattelu ja tulevaisuuden ennustaminen ovat tärkeämpiä kuin koskaan. Data-analyysi ja teknologia tukevat visionääristä työtä.',
        'jarjestaja': 'Organisaatiot muuttuvat ketterämmiksi ja virtuaalisemmiksi. Prosessien optimointi ja automaatio ovat keskeisiä taitoja.'
      };
      
      return insights[career.category as keyof typeof insights] || 'Tämä ala kehittyy jatkuvasti ja tarjoaa hyvät mahdollisuudet niille, jotka pysyvät ajan tasalla ja kehittävät taitojaan.';
    };

    const generateFutureProspects = (career: any) => {
      const prospects = {
        'luova': 'Luova ala kasvaa globaalisti ja digitaaliset taidot ovat yhä tärkeämpiä. Freelancer-työ ja yrittäjyys tarjoavat hyvät mahdollisuudet.',
        'johtaja': 'Johtamistaitoja tarvitaan yhä enemmän, mutta tyyli muuttuu. Palvelullinen johtaminen ja digitaaliset taidot ovat avain.',
        'innovoija': 'Teknologia-alan kasvu jatkuu ja uudet teknologiat luovat jatkuvasti uusia mahdollisuuksia. Koodaustaidot ja analytiikka ovat arvostettuja.',
        'rakentaja': 'Rakentaminen kasvaa kestävän kehityksen paineessa. Uudet teknologiat ja materiaalit muuttavat alaa.',
        'auttaja': 'Autamistyö kasvaa ikääntyvän väestön takia. Teknologia tukee mutta ei korvaa henkilökohtaista lähestymistapaa.',
        'ympariston-puolustaja': 'Ympäristöalan merkitys kasvaa ja siirtyy yhä enemmän liiketoimintaan. Kestävän kehityksen osaaminen on kilpailuetu.',
        'visionaari': 'Strateginen ajattelu ja tulevaisuuden ennustaminen ovat tärkeämpiä kuin koskaan. Data-analyysi tukee visionääristä työtä.',
        'jarjestaja': 'Prosessien optimointi ja automaatio ovat keskeisiä. Organisaatiot tarvitsevat järjestämistaitoja muuttuvassa maailmassa.'
      };
      
      return prospects[career.category as keyof typeof prospects] || 'Tämä ala tarjoaa hyvät mahdollisuudet tulevaisuudessa niille, jotka kehittävät taitojaan ja sopeutuvat muutoksiin.';
    };

    const details = generateCareerDetails(career);
    const skillsBreakdown = details.skillsBreakdown;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#2563EB] rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-250">
          {/* Close Button */}
          <button
            onClick={closeCareerDetail}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 shadow-lg transition-colors"
            aria-label="Sulje"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">{career?.title_fi || career?.title || 'Ammatti'}</h1>
              <p className="text-xl text-white/90 leading-relaxed mb-4">{details.introduction}</p>
              
              {/* Category Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
                {(career?.category || '') === 'luova' ? '🎨 Luova' :
                 career?.category === 'johtaja' ? '👑 Johtaminen' :
                 career?.category === 'innovoija' ? '💡 Innovaatio' :
                 career?.category === 'rakentaja' ? '🔨 Rakentaminen' :
                 career?.category === 'auttaja' ? '🤝 Auttaminen' :
                 career?.category === 'ympariston-puolustaja' ? '🌱 Ympäristö' :
                 career?.category === 'visionaari' ? '🔮 Visionääri' :
                 career?.category === 'jarjestaja' ? '📋 Järjestäminen' : '💼 Ammatti'}
              </div>
            </div>

            {/* Key Info Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Salary */}
              {career?.salary_eur_month && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">Palkka</h3>
                  <p className="text-2xl font-bold text-urak-accent-blue mb-2">
                    {career.salary_eur_month.median || career.salary_eur_month.range?.[0] || 'N/A'}€/kk
                  </p>
                  {career.salary_eur_month.range && career.salary_eur_month.range[0] && career.salary_eur_month.range[1] && (
                    <p className="text-sm text-urak-text-secondary">
                      Alue: {career.salary_eur_month.range[0]}€ - {career.salary_eur_month.range[1]}€
                    </p>
                  )}
                </div>
              )}

              {/* Job Outlook */}
              {career?.job_outlook?.explanation && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">Työllisyysnäkymät</h3>
                  <p className="text-sm text-urak-text-secondary leading-relaxed">{career.job_outlook.explanation}</p>
                </div>
              )}

              {/* Work Environment */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">Työympäristö</h3>
                <p className="text-sm text-urak-text-secondary leading-relaxed">{details.workEnvironment}</p>
              </div>
            </div>

            {/* Education */}
            {Array.isArray(career?.education_paths) && career.education_paths.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Koulutus</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {career.education_paths.map((path: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                      <span className="text-urak-accent-blue mt-1 font-bold">•</span>
                      <span className="text-urak-text-secondary">{path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Tasks */}
            {Array.isArray(career?.main_tasks) && career.main_tasks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Keskeiset tehtävät / vastuut</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {career.main_tasks.map((task: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                      <span className="text-urak-accent-blue mt-1 font-bold">•</span>
                      <span className="text-urak-text-secondary">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Breakdown */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Tärkeimmät taidot</h3>
              <div className="space-y-6">
                {skillsBreakdown.technical.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-white mb-3">Tekniset taidot</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsBreakdown.technical.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-urak-accent-blue/20 text-urak-accent-blue rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {skillsBreakdown.soft.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-white mb-3">Ihmistaidot</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsBreakdown.soft.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-urak-accent-green/20 text-urak-accent-green rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {skillsBreakdown.industry.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-white mb-3">Alakohtaiset taidot</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsBreakdown.industry.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-secondary/20 text-purple-800 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Career Path */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Urapolku & etenemismahdollisuudet</h3>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <p className="text-urak-text-secondary leading-relaxed text-lg">{details.careerPath}</p>
              </div>
            </div>

            {/* Industry Insights */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Alan kehitys</h3>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <p className="text-urak-text-secondary leading-relaxed text-lg">{details.industryInsights}</p>
              </div>
            </div>

            {/* Future Prospects */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Tulevaisuuden näkymät</h3>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <p className="text-urak-text-secondary leading-relaxed text-lg">{details.futureProspects}</p>
              </div>
            </div>

            {/* Related Careers */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Liittyvät ammatit</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {(Array.isArray(analysis?.recommendations) ? analysis.recommendations : [])
                  .filter((rec: any) => {
                    if (!rec || typeof rec !== 'object' || !career || typeof career !== 'object') return false;
                    const recId = rec.id || rec.slug;
                    const careerId = career.id || career.slug;
                    return recId && careerId && recId !== careerId;
                  })
                  .slice(0, 4)
                  .map((relatedCareer: any, i: number) => {
                    if (!relatedCareer || typeof relatedCareer !== 'object' || !relatedCareer.title_fi) return null;
                    const relatedKey = relatedCareer.id || relatedCareer.slug || `related-${i}`;
                    return (
                      <button
                        key={relatedKey || i}
                        onClick={() => openCareerDetail(relatedCareer)}
                        className="text-left p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:border-[#2B5F75] hover:bg-white/10 hover:shadow-lg transition-all duration-200"
                      >
                        <h4 className="font-semibold text-white mb-2">{relatedCareer.title_fi}</h4>
                        <p className="text-sm text-urak-text-secondary">{relatedCareer.short_description || ''}</p>
                        <div className="mt-2 text-xs text-[#2563EB] font-medium">Klikkaa nähdäksesi lisätietoja →</div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Dynamic Links Section */}
            <div className="pt-6 border-t border-white/20">
              <DynamicCareerLinks career={career} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (analysis) {
    // Check if validation metrics exist and display warning
    const qualityWarning = validationMetrics ? getQualityWarningMessage(validationMetrics) : null;

    return (
      <div className="space-y-6">
        {/* Data Quality Warning Banner */}
        {qualityWarning && (
          <div className="rounded-2xl border-2 border-orange-300 bg-orange-50 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-900 mb-2">Huomio vastausten laadusta</h3>
                <p className="text-orange-800 mb-3">{qualityWarning}</p>
                <div className="flex gap-2 text-sm">
                  <span className="text-orange-700">Laatupisteet: <strong>{validationMetrics.qualityScore}/100</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Summary */}
        <div className="rounded-3xl bg-[#2563EB] p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white">Henkilökohtainen analyysi</h2>
          </div>
          
          <p className="text-white/90 text-lg leading-relaxed mb-8">
            {analysis.aiAnalysis.summary}
          </p>

          {/* Personality Insights */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Persoonallisuutesi</h3>
            <div className="grid gap-3">
              {analysis.aiAnalysis.personalityInsights.map((insight: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-white/80 mt-1 font-bold">•</span>
                  <span className="text-white/90">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Vastaustesi perusteella profiilistasi nousee esiin seuraavia vahvuuksia ja kiinnostuksia</h3>
            <div className="grid gap-3">
              {analysis.aiAnalysis.strengths.map((strength: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-white/80 mt-1 font-bold">•</span>
                  <span className="text-white/90">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Advice */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Uranäkökulmia</h3>
            <div className="grid gap-3">
              {analysis.aiAnalysis.careerAdvice.map((advice: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-white/80 mt-1 font-bold">•</span>
                  <span className="text-white/90">{advice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Keskustelun avaamiseen</h3>
            <div className="grid gap-3">
              {analysis.aiAnalysis.nextSteps.map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-white/80 mt-1 font-bold">•</span>
                  <span className="text-white/90">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grade Calculator - TASO2 ONLY */}
        {group === 'TASO2' && (
          <Todistuspistelaskuri
            onCalculate={(points, exams) => {
              // Calculator points stored but not currently used
            }}
          />
        )}

        {/* Career Recommendations */}
        <div className="rounded-3xl bg-[#2563EB] p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">Valitsimme muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa</h2>
          <p className="text-white/80 text-sm mb-8">Ammattiehdotukset ovat esimerkkejä — ei listoja ammateista, joita sinun tulisi hakea.</p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {(Array.isArray(analysis?.recommendations) ? analysis.recommendations : []).map((career: any, i: number) => {
              if (!career || typeof career !== 'object') return null;
              const careerId = career.id || career.slug || `career-${i}`;
              const selectedId = selectedCareer && typeof selectedCareer === 'object' ? (selectedCareer.id || selectedCareer.slug) : null;
              const title = career.title_fi || career.title || 'Ammatti';
              const description = career.short_description || '';
              const salary = career.salary_eur_month?.median || career.salary_eur_month?.range?.[0] || 'N/A';
              const salaryRange = career.salary_eur_month?.range || [0, 0];
              const jobOutlook = career.job_outlook?.explanation || '';
              const educationPaths = Array.isArray(career.education_paths) ? career.education_paths : [];
              
              return (
              <div 
                key={careerId || i} 
                className="rounded-[20px] bg-white/5 backdrop-blur-sm border border-white/10 p-6 shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:scale-[1.03] hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)] hover:bg-white/10 transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => openCareerDetail(career)}
                role="button"
                tabIndex={0}
                aria-expanded={selectedId === careerId}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openCareerDetail(career);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-white flex-1">{title}</h3>
                </div>
                {description && (
                  <p className="text-urak-text-secondary text-sm mb-4 leading-relaxed">{description}</p>
                )}

                <div className="space-y-3">
                  {salary !== 'N/A' && (
                    <div>
                      <span className="text-xs font-medium text-urak-text-muted uppercase tracking-wide">Palkka</span>
                      <p className="text-sm text-urak-text-secondary">
                        {salary}€/kk {salaryRange[0] > 0 && salaryRange[1] > 0 && `(alue: ${salaryRange[0]}-${salaryRange[1]}€)`}
                      </p>
                    </div>
                  )}
                  
                  {jobOutlook && (
                    <div>
                      <span className="text-xs font-medium text-urak-text-muted uppercase tracking-wide">Työllisyysnäkymät</span>
                      <p className="text-sm text-urak-text-secondary">{jobOutlook}</p>
                    </div>
                  )}
                  
                  {educationPaths.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-[#475569] uppercase tracking-wide">Koulutus</span>
                      <ul className="text-sm text-[#475569] space-y-1">
                        {educationPaths.map((path: string, j: number) => (
                          <li key={j} className="flex items-start gap-1">
                            <span className="text-[#475569] mt-1">•</span>
                            <span>{path}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/10">
                  <span className="text-sm text-[#2563EB] font-medium hover:underline">Klikkaa nähdäksesi lisätietoja →</span>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const file = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(file);
              const a = document.createElement("a");
              a.href = url; a.download = "ura-analyysi.json"; a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 transition-colors"
          >
            Lataa analyysi
          </button>
          <button onClick={onRestart} className="rounded-xl px-4 py-3 text-urak-text-secondary hover:bg-white/10 transition-colors">
            Aloita alusta
          </button>
        </div>

        {/* Career Detail Modal */}
        {selectedCareer && <CareerDetailModal career={selectedCareer} />}
      </div>
    );
  }

  return (
    <div>
    <section className="flex justify-center px-4 py-24">
      <div
        className="
          relative
          max-w-4xl w-full
          overflow-hidden
          rounded-[32px]
          border border-cyan-400/10
          bg-gradient-to-b from-white/6 via-white/3 to-white/2
          bg-clip-padding
          backdrop-blur-xl
          shadow-[0_24px_80px_rgba(0,0,0,0.65)]
          px-8 py-10 md:px-12 md:py-14
        "
      >
        {/* Top glow effect */}
        <div className="pointer-events-none absolute inset-x-8 -top-32 h-40 rounded-full bg-gradient-to-b from-cyan-300/25 to-transparent blur-3xl" />

        <div className="relative space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
              Kiitos vastauksista!
            </h2>
            <p className="text-base md:text-lg text-urak-text-secondary">
              Vastasit {answered}/{questions.length} kysymykseen.
            </p>
          </div>

          {/* Main CTA */}
          <div className="pt-2">
            <button
              onClick={sendToBackend}
              disabled={loading}
              className="
                group
                w-full
                relative inline-flex items-center justify-center
                rounded-full
                bg-gradient-to-r from-sky-500 to-blue-500
                px-8 py-4
                text-sm md:text-base font-semibold text-white
                shadow-[0_18px_40px_rgba(37,99,235,0.6)]
                transition
                hover:shadow-[0_20px_45px_rgba(37,99,235,0.65)]
                hover:scale-[1.01]
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_18px_40px_rgba(37,99,235,0.6)]
              "
            >
              {loading ? "Analysoidaan vastauksiasi..." : "Saat henkilökohtaisen analyysin"}
              {!loading && (
                <span className="ml-2 inline-block translate-x-0 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              )}
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6">
              <ErrorMessage 
                message={error}
                onDismiss={() => setError(null)}
              />
              <button
                onClick={sendToBackend}
                className="mt-4 text-sm bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Yritä uudelleen
              </button>
            </div>
          )}

          {/* Secondary Actions */}
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() => {
                const file = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(file);
                const a = document.createElement("a");
                a.href = url; a.download = "vastaukset.json"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="
                rounded-full
                border border-white/20
                bg-white/5
                backdrop-blur-sm
                px-5 py-2.5
                text-sm font-medium text-white
                transition
                hover:bg-white/10
                hover:border-white/30
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              "
            >
              Lataa vastaukset
            </button>
            <button 
              onClick={onRestart} 
              className="
                rounded-full
                px-5 py-2.5
                text-sm font-medium text-urak-text-secondary
                transition
                hover:text-white
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              "
            >
              Aloita alusta
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-sm text-urak-text-muted leading-relaxed pt-2">
            Analyysi perustuu vastauksiisi ja tarjoaa henkilökohtaisia urasuosituksia.
          </p>
        </div>
      </div>
    </section>
    {/* Validation Warning Modal */}
    {showValidationWarning && validationMetrics && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-urak-surface border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">Huomio vastauksistasi</h3>
                  <p className="text-sm text-urak-text-secondary mt-1">
                    Havaitsimme joitakin epätavallisia vastausmalleja, jotka voivat vaikuttaa tulosten tarkkuuteen.
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {validationMetrics.warnings.map((warning: any, idx: number) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 ${getSeverityColor(warning.severity)}`}
                  >
                    <p className="font-semibold text-sm mb-1 text-white">{warning.message}</p>
                    <p className="text-xs text-urak-text-secondary opacity-90">{warning.suggestion}</p>
                  </div>
                ))}
              </div>

              <div className="bg-urak-accent-blue/10 border border-urak-accent-blue/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-urak-text-secondary">
                  <strong className="text-white">Laatupisteet: {validationMetrics.qualityScore}/100</strong>
                  <br />
                  Voit jatkaa analysointiin tai aloittaa testin alusta saadaksesi tarkempia tuloksia.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowValidationWarning(false)}
                  className="flex-1 rounded-xl bg-urak-accent-blue px-4 py-3 text-white font-semibold hover:bg-urak-accent-blue/90 transition-colors"
                >
                  Ymmärrän, jatka
                </button>
                <button
                  onClick={onRestart}
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-urak-text-secondary font-semibold hover:bg-white/10 transition-colors"
                >
                  Aloita alusta
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};