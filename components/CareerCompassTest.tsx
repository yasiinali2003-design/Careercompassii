"use client";

import React, { useEffect, useMemo, useState } from "react";

// ---------- QUESTIONS DATA ----------
// YLA: Education path focus (Lukio vs. Ammattikoulu) + career preview
// TASO2: Career field focus + education path guidance
// NUORI: Career + lifestyle focus

const QUESTIONS = {
  YLA: [
    // Section 1: Learning Preferences (Q1-8)
    "Pidätkö lukemisesta ja kirjojen lukemisesta?",
    "Tykkäätkö matikasta ja laskemisesta?",
    "Haluaisitko oppia tekemällä ja kokeilemalla itse?",
    "Pidätkö siitä, että voit opiskella monia eri aineita kerralla?",
    "Oletko hyvä muistamaan teorioita ja faktoja?",
    "Pidätkö enemmän käytännön harjoituksista kuin luennoista?",
    "Kiinnostaako sinua tutkia ja selvittää asioita syvällisesti?",
    "Haluaisitko oppia yhden tietyn ammatin taidot nopeasti?",
    // Section 2: Future Mindset (Q9-15)
    "Tiedätkö jo nyt, mitä ammattia haluaisit tehdä aikuisena?",
    "Haluaisitko pitää kaikki vaihtoehdot auki mahdollisimman pitkään?",
    "Kiinnostaako sinua ajatus yliopistossa opiskelusta tulevaisuudessa?",
    "Haluaisitko aloittaa työnteon mahdollisimman aikaisin (n. 18-19v)?",
    "Oletko valmis opiskelemaan vielä monta vuotta ennen töiden aloittamista?",
    "Tuntuuko sinusta, että tiedät jo mitä haluat tehdä elämälläsi?",
    "Haluaisitko kokeilla monia eri aloja ennen kuin päätät urasi?",
    // Section 3: Interest Areas (Q16-23)
    "Kiinnostaako sinua tietokoneet, puhelimet ja teknologia?",
    "Haluaisitko auttaa ja hoivata ihmisiä työssäsi?",
    "Pidätkö piirtämisestä, musiikista tai muusta luovasta tekemisestä?",
    "Haluaisitko työskennellä ulkona ja olla tekemisissä luonnon kanssa?",
    "Haluaisitko olla johtaja ja tehdä tärkeitä päätöksiä?",
    "Kiinnostaako sinua rakentaminen ja asioiden korjaaminen?",
    "Haluaisitko auttaa sairaita tai loukkaantuneita ihmisiä?",
    "Kiinnostaako sinua yritykset ja rahan ansaitseminen?",
    // Section 4: Work Style (Q24-30)
    "Pidätkö työskentelystä ryhmässä muiden kanssa?",
    "Tykkäätkö tehdä asioita yksin ja itsenäisesti?",
    "Haluaisitko työskennellä ulkona luonnon keskellä?",
    "Pidätkö säännöllisestä päivärytmistä ja toistuvista rutiineista?",
    "Kiinnostaako sinua matkustaminen ja eri maiden näkeminen?",
    "Haluaisitko työssä tavata paljon uusia ihmisiä joka päivä?",
    "Onko sinulle tärkeää, että voit tehdä töitä kotona tietokoneen ääressä?"
  ],
  TASO2: [
    // Section 1: Tech & Digital (Q1-7)
    "Kiinnostaako sinua koodaaminen ja ohjelmien tekeminen?",
    "Haluaisitko työskennellä tietokoneiden ja teknologian parissa?",
    "Kiinnostaako sinua numeroiden ja tilastojen analysointi?",
    "Pidätkö teknisten ongelmien ratkaisemisesta?",
    "Haluaisitko suunnitella nettisivuja tai mobiilisovelluksia?",
    "Kiinnostaako sinua videopelit ja pelien tekeminen?",
    "Haluaisitko suojella yrityksiä tietomurroilta ja hakkereilta?",
    // Section 2: People & Care (Q8-14)
    "Haluaisitko auttaa ihmisiä heidän terveyden ja hyvinvoinnin kanssa?",
    "Kiinnostaako sinua ymmärtää, miten ihmisten mieli ja ajatukset toimivat?",
    "Haluaisitko opettaa tai kouluttaa muita ihmisiä?",
    "Kiinnostaako sinua auttaa ihmisiä, joilla on vaikeuksia elämässä?",
    "Haluaisitko työskennellä lasten tai nuorten kanssa?",
    "Haluaisitko huolehtia vanhuksista ja ikääntyneistä ihmisistä?",
    "Kiinnostaako sinua neuvoa ja ohjata ihmisiä heidän valinnoissaan?",
    // Section 3: Creative & Business (Q15-21)
    "Kiinnostaako sinua grafiikka, kuvat ja visuaalinen suunnittelu?",
    "Haluaisitko työskennellä mainonnan ja markkinoinnin parissa?",
    "Kiinnostaako sinua sisustaminen ja tilojen suunnittelu?",
    "Haluaisitko kirjoittaa artikkeleita, blogeja tai kirjoja?",
    "Kiinnostaako sinua valokuvaus tai videoiden tekeminen?",
    "Haluaisitko perustaa ja pyörittää omaa yritystä?",
    "Kiinnostaako sinua myynti ja asiakkaiden palveleminen?",
    // Section 4: Hands-On & Practical (Q22-30)
    "Haluaisitko rakentaa taloja tai korjata rakennuksia?",
    "Kiinnostaako sinua autot, moottorit ja ajoneuvot?",
    "Haluaisitko asentaa sähköjä tai tehdä sähköasennuksia?",
    "Kiinnostaako sinua kasvattaa kasveja tai huolehtia eläimistä työksesi?",
    "Haluaisitko suojella ympäristöä ja luontoa?",
    "Kiinnostaako sinua kuljettaa tavaroita tai ihmisiä?",
    "Haluaisitko valmistaa ruokaa tai leipoa ammatiksesi?",
    "Kiinnostaako sinua puuntyöstö, metallintyöstö tai kangaspuut?",
    "Haluaisitko työskennellä laboratorioissa tai tehdä kokeita?"
  ],
  NUORI: [
    // Section 1: Career Fields (Q1-10)
    "Kiinnostaako sinua IT-ala ja digitaaliset ratkaisut?",
    "Haluaisitko työskennellä terveydenhuollossa ja hoivatyössä?",
    "Kiinnostaako sinua luovat alat ja sisällöntuotanto?",
    "Haluaisitko työskennellä liike-elämässä ja johtamisessa?",
    "Kiinnostaako sinua tekniikka ja insinöörityö?",
    "Haluaisitko työskennellä opetusalalla ja kasvatuksessa?",
    "Kiinnostaako sinua tutkimustyö ja tieteellinen työ?",
    "Haluaisitko työskennellä oikeusalalla tai lakimiehen tehtävissä?",
    "Kiinnostaako sinua media, journalismi ja viestintä?",
    "Haluaisitko työskennellä matkailualalla tai ravintola-alalla?",
    // Section 2: Work Values (Q11-18)
    "Onko sinulle erittäin tärkeää ansaita hyvä palkka (yli 4000€/kk)?",
    "Haluaisitko työn, jossa voit vaikuttaa yhteiskuntaan positiivisesti?",
    "Onko sinulle tärkeää, että työpaikkasi on varma ja pysyvä?",
    "Haluaisitko uralla nopeasti eteenpäin ja ylennyksiä?",
    "Onko sinulle tärkeää, että sinulla on aikaa perheelle ja harrastuksille?",
    "Haluaisitko työskennellä kansainvälisessä ja monikulttuurisessa ympäristössä?",
    "Onko sinulle tärkeää oppia jatkuvasti uutta työssäsi?",
    "Haluaisitko työn, jossa voit olla luova ja keksiä uusia ideoita?",
    // Section 3: Work Environment (Q19-25)
    "Haluaisitko työskennellä pääosin kotoa käsin (etätyö)?",
    "Pidätkö perinteisestä toimistoympäristöstä ja säännöllisestä työpäivästä?",
    "Haluaisitko liikkua paljon työssäsi ja vierailla eri paikoissa?",
    "Onko sinulle tärkeää työskennellä isossa, tunnetussa yrityksessä?",
    "Kiinnostaako sinua työskennellä pienessä startup-yrityksessä?",
    "Oletko valmis tekemään vuorotyötä (yö-, ilta-, viikonloppuvuoroja)?",
    "Haluaisitko työn, jossa matkustat paljon ulkomailla?",
    // Section 4: Work Style & Preferences (Q26-30)
    "Pidätkö siitä, että saat tehdä työsi itsenäisesti ilman jatkuvaa ohjausta?",
    "Haluaisitko johtaa tiimiä ja tehdä suuria päätöksiä?",
    "Pidätkö tiimityöskentelystä ja yhteistyöstä kollegoiden kanssa?",
    "Haluaisitko työn, jossa on selkeät rutiinit ja toistuvat tehtävät?",
    "Pidätkö työstä, jossa jokainen päivä on erilainen ja yllättävä?"
  ]
};

// ---------- PERSISTENCE ----------
const STORAGE_KEY = "careercompass-progress";

function saveProgress(state: any) {
  try {
    // Add timestamp for debugging
    const dataToSave = {
      ...state,
      timestamp: Date.now(),
      version: "1.0" // For future compatibility
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.warn("Failed to save progress to localStorage:", error);
    // Could implement fallback to sessionStorage or other storage methods
  }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved);
    
    // Check if data is not too old (optional: expire after 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    if (parsed.timestamp && parsed.timestamp < thirtyDaysAgo) {
      console.log("Saved progress is too old, clearing...");
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.warn("Failed to load progress from localStorage:", error);
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    return null;
  }
}

// ---------- MAIN COMPONENT ----------
export default function CareerCompassTest({ pin, classToken }: { pin?: string | null; classToken?: string | null } = {}) {
  type GroupKey = "YLA" | "TASO2" | "NUORI";
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0: landing, 1: group select, 2: questions, 3: summary
  const [group, setGroup] = useState<GroupKey | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [originalIndices, setOriginalIndices] = useState<number[]>([]); // For shuffle mapping
  const [shuffleKey, setShuffleKey] = useState<string>(''); // For verification

  // Shuffle questions when group is selected
  const qList = useMemo(() => {
    if (!group) return [];
    
    const originalQs = QUESTIONS[group];
    const qsWithIndices = originalQs.map((text, idx) => ({ q: idx, text }));
    
    // Shuffle using Fisher-Yates
    const shuffled = [...qsWithIndices];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Create mapping from shuffled position -> original index
    const mapping: number[] = shuffled.map(q => q.q);
    setOriginalIndices(mapping);
    
    // Generate simple shuffle key
    let hash = 0;
    for (let i = 0; i < mapping.length; i++) {
      hash = (hash + (mapping[i] * (i + 1))) % 2147483647;
    }
    setShuffleKey(hash.toString(36));
    
    return shuffled.map(q => q.text);
  }, [group]);
  const total = qList.length;

  // Load saved progress on component mount
  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.step !== undefined && saved.step > 0) {
      setStep(saved.step);
      setGroup(saved.group);
      setIndex(saved.index ?? 0);
      setAnswers(saved.answers ?? []);
      setHasLoadedProgress(true);
      
      // Show notification that progress was loaded
      setTimeout(() => {
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 4000);
      }, 500);
    }
  }, []);

  // Auto-save progress whenever state changes
  useEffect(() => {
    if (step > 0) { // Only save if test has started
      saveProgress({ step, group, index, answers });
      
      // Show save notification (but not on initial load)
      if (hasLoadedProgress && (step === 2 || step === 3)) {
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 3000);
      }
    }
  }, [step, group, index, answers, hasLoadedProgress]);

  // Save progress before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (step > 0) {
        saveProgress({ step, group, index, answers });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step, group, index, answers]);

  const start = () => setStep(1);

  const chooseGroup = (g: GroupKey) => {
    setGroup(g);
    setAnswers(Array(QUESTIONS[g].length).fill(0));
    setIndex(0);
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
      await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("Vastaukset lähetetty! Näytä käyttäjälle seuraava näkymä/raportti.");
    } catch (e) {
      console.error(e);
      alert("Lähetys epäonnistui. Tarkista backend /api/analyze.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Progress Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              <p className="text-sm text-blue-800 font-medium">
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

      {step === 2 && group && (
        <QuestionScreen
          title={
            group === "YLA"
              ? "Yläaste (13–15 v) – Tutustu itseesi"
              : group === "TASO2"
              ? "Toisen asteen opiskelijat (16–19 v) – Löydä suuntasi"
              : "Nuoret aikuiset (20–25 v) – Rakenna oma polkusi"
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
        <Summary
          group={group}
          questions={qList}
          answers={answers}
          originalIndices={originalIndices}
          shuffleKey={shuffleKey}
          onRestart={restart}
          onSend={sendToBackend}
          pin={pin}
          classToken={classToken}
        />
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

  return (
    <div 
      className={`rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-800 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
      }`}
    >
      <h1 className="text-3xl font-bold tracking-tight text-[#2563EB]">Löydä urasuuntasi</h1>
      
      <div className="mt-4 space-y-3">
        <p className="text-[#475569] leading-relaxed">
          Vastaa 30 huolellisesti suunniteltuun kysymykseen, jotka kartoittavat kiinnostuksesi, arvosi ja vahvuutesi.
        </p>
        <p className="text-[#475569] leading-relaxed">
          Tekoälymallimme analysoi vastauksesi ja tarjoaa henkilökohtaisia urasuosituksia, jotka perustuvat tutkittuun aineistoon ja nykyaikaiseen uratietoon.
        </p>
      </div>
      
      <p className="mt-4 text-sm text-slate-500">
        30 kysymystä • Maksuton • Vastauksesi käsitellään luottamuksellisesti
      </p>
      
      {hasSavedProgress && (
        <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <p className="text-sm text-blue-800 font-medium">
              Löysimme tallennetut vastauksesi – voit jatkaa siitä mihin jäit!
            </p>
          </div>
        </div>
      )}
      
      <button 
        onClick={onStart} 
        className="mt-8 w-full rounded-2xl bg-[#2563EB] px-6 py-3 text-white font-semibold shadow hover:bg-[#1D4ED8] transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {hasSavedProgress ? "Jatka testiä" : "Aloita testi"}
        <span className="text-lg">→</span>
      </button>
    </div>
  );
};

const GroupCard = ({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) => (
  <button onClick={onClick} className="flex w-full flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-1 text-slate-600">{desc}</p>
  </button>
);

const GroupSelect = ({ onChoose, onBack }: { onChoose: (g: "YLA" | "TASO2" | "NUORI") => void; onBack: () => void }) => (
  <div className="space-y-6">
    <div className="text-center">
      <h1 className="text-3xl font-bold">Valitse ikäryhmäsi</h1>
      <p className="mt-2 text-slate-600">Tämä auttaa meitä antamaan sinulle sopivimmat kysymykset</p>
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
        title="Nuori aikuinen (20–25 v)"
        desc="Rakenna oma polkusi ja löydä urapolku"
        onClick={() => onChoose("NUORI")}
      />
    </div>

    <button onClick={onBack} className="w-full rounded-xl border border-slate-300 px-4 py-2 hover:bg-slate-50">
      Takaisin
    </button>
  </div>
);

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
            "rounded-xl border px-3 py-2 text-sm transition " +
            (value === idx + 1
              ? "border-blue-600 bg-blue-50 font-semibold"
              : "border-slate-300 hover:bg-slate-50")
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
        <p className="mt-2 text-slate-600">
          Kysymys {index + 1} / {total}
        </p>
        <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">{questions[index]}</h2>
        <RatingScale value={answers[index]} onChange={onAnswer} />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="rounded-xl border border-slate-300 px-4 py-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edellinen
        </button>
        <button
          onClick={onRestart}
          className="rounded-xl px-4 py-2 text-slate-700 hover:bg-slate-50"
        >
          Aloita alusta
        </button>
        <button
          onClick={onNext}
          disabled={answers[index] === 0}
          className="rounded-xl bg-blue-600 px-6 py-2 text-white font-medium shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
  shuffleKey,
  onRestart,
  onSend,
  pin,
  classToken,
}: {
  group: any;
  questions: string[];
  answers: number[];
  originalIndices: number[];
  shuffleKey: string;
  onRestart: () => void;
  onSend: () => void;
  pin?: string | null;
  classToken?: string | null;
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [careerCache, setCareerCache] = useState<{ [key: string]: any }>({});

  const payload = useMemo(() => ({ group, questions, answers }), [group, questions, answers]);
  const answered = answers.filter((a) => a > 0).length;

  const sendToBackend = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Format answers for new scoring API
      const formattedAnswers = answers.map((score, index) => ({
        questionIndex: index,
        score: score || 3 // Use 3 (neutral) for unanswered questions
      }));

      // If PIN and classToken are provided, save to teacher's class
      if (pin && classToken) {
        console.log('[Test] PIN detected, saving to teacher class:', { pin, classToken });
        // First get the results by calling /api/score
        const scoreResponse = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cohort: group,
            answers: formattedAnswers,
            originalIndices,
            shuffleKey
          }),
        });
        
        const scoreData = await scoreResponse.json();
        
        if (scoreData.success) {
          // Now save to /api/results with PIN
          const resultPayload = {
            cohort: group,
            topCareers: scoreData.topCareers || [],
            dimensionScores: scoreData.userProfile?.dimensionScores || {},
            personalizedAnalysis: scoreData.userProfile?.personalizedAnalysis || null,
            timeSpentSeconds: null
          };

          const resultsResponse = await fetch("/api/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pin,
              classToken,
              resultPayload
            }),
          });

          const resultsData = await resultsResponse.json();

          if (resultsData.success) {
            // Save to localStorage and navigate
            localStorage.setItem('careerTestResults', JSON.stringify(scoreData));
            if (scoreData.resultId) {
              localStorage.setItem('lastTestResultId', scoreData.resultId);
            }
            window.location.href = '/test/results';
          } else {
            setError(resultsData.error || "Tulosten tallentaminen epäonnistui");
          }
        } else {
            setError(scoreData.error || "Analyysi epäonnistui");
        }
      } else {
        console.log('[Test] No PIN, regular public flow');
        // Regular public flow (no PIN)
        const response = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cohort: group,
            answers: formattedAnswers,
            originalIndices,
            shuffleKey
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem('careerTestResults', JSON.stringify(data));
          if (data.resultId) {
            localStorage.setItem('lastTestResultId', data.resultId);
          }
          window.location.href = '/test/results';
        } else {
          setError(data.error || "Analyysi epäonnistui");
        }
      }
    } catch (e) {
      console.error(e);
      setError("Lähetys epäonnistui. Tarkista yhteys.");
    } finally {
      setLoading(false);
    }
  };

  const openCareerDetail = (career: any) => {
    setSelectedCareer(career);
    // Cache the career data for faster reopens
    if (!careerCache[career.id]) {
      setCareerCache(prev => ({ ...prev, [career.id]: career }));
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
                  ? 'bg-white text-[#2563EB] shadow-sm'
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
                  ? 'bg-white text-[#2563EB] shadow-sm'
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
            className="px-6 py-2 bg-white text-[#2563EB] font-semibold rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            Avaa
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-white/70">
          Linkit ohjaavat luotettuihin lähteisiin: Opintopolku (koulutukset) ja Työmarkkinatori (työpaikat). Molemmat linkit vievät pääsivulle, josta voit hakea sopivia mahdollisuuksia.
        </p>
      </div>
    );
  };

  // Career Detail Modal Component
  const CareerDetailModal = ({ career }: { career: any }) => {
    // Generate comprehensive career information
    const generateCareerDetails = (career: any) => {
      const careerDetails = {
        // Enhanced introduction
        introduction: `${career.title_fi} on ${career.category === 'luova' ? 'luova' : 
          career.category === 'johtaja' ? 'johtamispainotteinen' :
          career.category === 'innovoija' ? 'innovaatiopainotteinen' :
          career.category === 'rakentaja' ? 'käytännönläheinen' :
          career.category === 'auttaja' ? 'ihmiskeskeinen' :
          career.category === 'ympariston-puolustaja' ? 'vastuullinen' :
          career.category === 'visionaari' ? 'strateginen' :
          career.category === 'jarjestaja' ? 'järjestelmällinen' : 'monipuolinen'} ammatti, joka ${career.short_description.toLowerCase()}`,
        
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
      return {
        technical: career.keywords.filter((skill: string) => 
          ['ohjelmointi', 'teknologia', 'analyysi', 'suunnittelu', 'kehitys'].some(tech => 
            skill.toLowerCase().includes(tech)
          )
        ),
        soft: career.keywords.filter((skill: string) => 
          ['kommunikaatio', 'johtaminen', 'tiimityö', 'kreatiivisuus', 'ongelmanratkaisu'].some(soft => 
            skill.toLowerCase().includes(soft)
          )
        ),
        industry: career.keywords.filter((skill: string) => 
          !['ohjelmointi', 'teknologia', 'analyysi', 'suunnittelu', 'kehitys', 'kommunikaatio', 'johtaminen', 'tiimityö', 'kreatiivisuus', 'ongelmanratkaisu'].some(general => 
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
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
            aria-label="Sulje"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">{career.title_fi}</h1>
              <p className="text-xl text-white/90 leading-relaxed mb-4">{details.introduction}</p>
              
              {/* Category Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
                {career.category === 'luova' ? '🎨 Luova' :
                 career.category === 'johtaja' ? '👑 Johtaminen' :
                 career.category === 'innovoija' ? '💡 Innovaatio' :
                 career.category === 'rakentaja' ? '🔨 Rakentaminen' :
                 career.category === 'auttaja' ? '🤝 Auttaminen' :
                 career.category === 'ympariston-puolustaja' ? '🌱 Ympäristö' :
                 career.category === 'visionaari' ? '🔮 Visionääri' :
                 career.category === 'jarjestaja' ? '📋 Järjestäminen' : '💼 Ammatti'}
              </div>
            </div>

            {/* Key Info Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Salary */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide mb-3">Palkka</h3>
                <p className="text-2xl font-bold text-[#2563EB] mb-2">
                  {career.salary_eur_month.median}€/kk
                </p>
                <p className="text-sm text-[#475569]">
                  Alue: {career.salary_eur_month.range[0]}€ - {career.salary_eur_month.range[1]}€
                </p>
              </div>

              {/* Job Outlook */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide mb-3">Työllisyysnäkymät</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{career.job_outlook.explanation}</p>
              </div>

              {/* Work Environment */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide mb-3">Työympäristö</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{details.workEnvironment}</p>
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Koulutus</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {career.education_paths.map((path: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg">
                    <span className="text-[#2563EB] mt-1 font-bold">•</span>
                    <span className="text-[#475569]">{path}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Tasks */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Keskeiset tehtävät / vastuut</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {career.main_tasks.map((task: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg">
                    <span className="text-[#2563EB] mt-1 font-bold">•</span>
                    <span className="text-[#475569]">{task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Tärkeimmät taidot</h3>
              <div className="space-y-6">
                {skillsBreakdown.technical.length > 0 && (
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="text-lg font-medium text-[#0F172A] mb-3">Tekniset taidot</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsBreakdown.technical.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {skillsBreakdown.soft.length > 0 && (
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="text-lg font-medium text-[#0F172A] mb-3">Ihmistaidot</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsBreakdown.soft.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {skillsBreakdown.industry.length > 0 && (
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="text-lg font-medium text-[#0F172A] mb-3">Alakohtaiset taidot</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsBreakdown.industry.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
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
              <div className="bg-white rounded-xl p-6">
                <p className="text-[#475569] leading-relaxed text-lg">{details.careerPath}</p>
              </div>
            </div>

            {/* Industry Insights */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Alan kehitys</h3>
              <div className="bg-white rounded-xl p-6">
                <p className="text-[#475569] leading-relaxed text-lg">{details.industryInsights}</p>
              </div>
            </div>

            {/* Future Prospects */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Tulevaisuuden näkymät</h3>
              <div className="bg-white rounded-xl p-6">
                <p className="text-[#475569] leading-relaxed text-lg">{details.futureProspects}</p>
              </div>
            </div>

            {/* Related Careers */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Liittyvät ammatit</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis?.recommendations
                  .filter((rec: any) => rec.id !== career.id)
                  .slice(0, 4)
                  .map((relatedCareer: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => openCareerDetail(relatedCareer)}
                      className="text-left p-4 rounded-xl border border-white/20 bg-white hover:border-[#2563EB] hover:shadow-lg transition-all duration-200"
                    >
                      <h4 className="font-semibold text-[#0F172A] mb-2">{relatedCareer.title_fi}</h4>
                      <p className="text-sm text-[#475569]">{relatedCareer.short_description}</p>
                      <div className="mt-2 text-xs text-[#2563EB] font-medium">Klikkaa nähdäksesi lisätietoja →</div>
                    </button>
                  ))}
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
    return (
      <div className="space-y-6">
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
            <h3 className="text-xl font-semibold text-white mb-4">Vahvuutesi</h3>
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
            <h3 className="text-xl font-semibold text-white mb-4">Urasuositukset</h3>
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
            <h3 className="text-xl font-semibold text-white mb-4">Seuraavat askeleet</h3>
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

        {/* Career Recommendations */}
        <div className="rounded-3xl bg-[#2563EB] p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-8">Suosittelemme sinulle nämä ammatit</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {analysis.recommendations.map((career: any, i: number) => (
              <div 
                key={i} 
                className="rounded-[20px] bg-white p-6 shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:scale-[1.03] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => openCareerDetail(career)}
                role="button"
                tabIndex={0}
                aria-expanded={selectedCareer?.id === career.id}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openCareerDetail(career);
                  }
                }}
              >
                <h3 className="text-xl font-semibold text-[#0F172A] mb-3">{career.title_fi}</h3>
                <p className="text-[#475569] text-sm mb-4 leading-relaxed">{career.short_description}</p>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-[#475569] uppercase tracking-wide">Palkka</span>
                    <p className="text-sm text-[#475569]">
                      {career.salary_eur_month.median}€/kk (alue: {career.salary_eur_month.range[0]}-{career.salary_eur_month.range[1]}€)
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-[#475569] uppercase tracking-wide">Työllisyysnäkymät</span>
                    <p className="text-sm text-[#475569]">{career.job_outlook.explanation}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-[#475569] uppercase tracking-wide">Koulutus</span>
                    <ul className="text-sm text-[#475569] space-y-1">
                      {career.education_paths.map((path: string, j: number) => (
                        <li key={j} className="flex items-start gap-1">
                          <span className="text-[#475569] mt-1">•</span>
                          <span>{path}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <span className="text-sm text-[#2563EB] font-medium hover:underline">Klikkaa nähdäksesi lisätietoja →</span>
                </div>
              </div>
            ))}
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
            className="rounded-xl border border-slate-300 px-4 py-2 hover:bg-slate-50"
          >
            Lataa analyysi
          </button>
          <button onClick={onRestart} className="rounded-xl px-4 py-2 text-slate-700 hover:bg-slate-50">
            Aloita alusta
          </button>
        </div>

        {/* Career Detail Modal */}
        {selectedCareer && <CareerDetailModal career={selectedCareer} />}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">Kiitos vastauksista!</h2>
      <p className="mt-2 text-slate-600">Vastasit {answered}/{questions.length} kysymykseen.</p>

      <div className="mt-6">
        <button 
          onClick={sendToBackend}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 text-white font-medium shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Analysoidaan vastauksiasi..." : "Saat henkilökohtaisen analyysin"}
        </button>
        
        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={sendToBackend}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Yritä uudelleen
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => {
            const file = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url; a.download = "vastaukset.json"; a.click();
            URL.revokeObjectURL(url);
          }}
          className="rounded-xl border border-slate-300 px-4 py-2"
        >
          Lataa vastaukset
        </button>
        <button onClick={onRestart} className="rounded-xl px-4 py-2 text-slate-700 hover:bg-slate-50">
          Aloita alusta
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Analyysi perustuu vastauksiisi ja tarjoaa henkilökohtaisia urasuosituksia.
      </p>
    </div>
  );
};