"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * CareerCompassTest – Single-file React component
 * Flow:
 * 0) Landing with "Aloita testi" button
 * 1) Valitse kohderyhmä (3 korttia)
 * 2) 30 kysymystä ryhmän perusteella, 5-portainen Likert-asteikko
 * 3) Yhteenveto + JSON, lähetä backendille /api/analyze (voit vaihtaa polun)
 *
 * Notes:
 * - Tailwind CSS luokilla tyylitys. Ei ulkoisia riippuvuuksia.
 * - Vastaukset tallennetaan myös localStorageen (avain: careercompass-progress)
 * - Kaikki 90 kysymystä on sisällytetty alla taulukoihin.
 */

// ---------- KYSYMYKSET ----------
const QUESTIONS = {
  YLA: [
    "Pidätkö enemmän yksin tekemisestä vai porukassa toimimisesta?",
    "Nautitko siitä, kun saat suunnitella jotain uutta?",
    "Tykkäätkö ratkaista pulmia ja tehtäviä, joissa pitää käyttää järkeä?",
    "Oletko usein se, joka ottaa ohjat ryhmässä?",
    "Pidätkö käsillä tekemisestä tai rakentelusta?",
    "Onko sinulle tärkeää, että muut voivat hyvin?",
    "Kiinnostavatko sinua ympäristöasiat ja luonto?",
    "Ajatteletko usein tulevaisuutta ja mitä haluat tehdä \"isona\"?",
    "Haluatko auttaa muita, jos heillä on ongelma?",
    "Tykkäätkö esiintyä tai kertoa ideoitasi muille?",
    "Oletko utelias ja haluat tietää, miten asiat toimivat?",
    "Onko sinusta kivaa järjestää asioita ja pitää aikataulu kunnossa?",
    "Tykkäätkö kokeilla uusia juttuja, vaikka ne tuntuisivat aluksi vaikeilta?",
    "Pidätkö taiteesta, musiikista tai piirtämisestä?",
    "Pidätkö enemmän rauhallisesta vai vauhdikkaasta tekemisestä?",
    "Onko sinusta mukavaa tehdä tehtäviä, joissa pitää miettiä luovasti?",
    "Oletko sellainen, joka helposti innostuu uusista projekteista?",
    "Onko tärkeää, että työsi auttaa muita?",
    "Tykkäätkö suunnitella asioita etukäteen?",
    "Onko sinusta mukavaa tehdä yhteistyötä eri ihmisten kanssa?",
    "Oletko enemmän käytännön tekijä vai ideoija?",
    "Kiinnitätkö huomiota siihen, että asiat tehdään oikein ja siististi?",
    "Nautitko siitä, kun opit jotain uutta?",
    "Pidätkö vastuusta ja päätöksenteosta?",
    "Oletko kiinnostunut teknologiasta ja sen toiminnasta?",
    "Pidätkö luonnossa olemisesta tai ympäristöprojekteista?",
    "Nautitko auttamisesta koulussa tai kotona?",
    "Tykkäätkö kirjoittaa, piirtää tai luoda tarinoita?",
    "Onko sinusta mukavaa seurata sääntöjä ja ohjeita?",
    "Kuvitteletko usein, millainen tulevaisuus voisi olla?",
  ],
  TASO2: [
    "Millaisissa tehtävissä tunnet olevasi parhaimmillasi?",
    "Nautitko enemmän ideoiden kehittämisestä vai niiden toteuttamisesta?",
    "Pidätkö esiintymisestä ja muiden inspiroimisesta?",
    "Kuinka tärkeää sinulle on vakaus ja ennakoitavuus työssä?",
    "Pidätkö analyyttisestä ajattelusta ja ongelmien ratkaisusta?",
    "Tuntuuko sinusta hyvältä johtaa ryhmää tai ohjata muita?",
    "Haluatko, että työsi vaikuttaa positiivisesti yhteiskuntaan?",
    "Innostutko teknologiasta ja innovaatioista?",
    "Tykkäätkö suunnitella ja organisoida projekteja?",
    "Koetko luovat tehtävät (piirtäminen, kirjoittaminen, suunnittelu) palkitsevina?",
    "Nautitko käsillä tekemisestä tai konkreettisista tuloksista?",
    "Pidätkö siitä, että työsi auttaa ihmisiä suoraan?",
    "Haluatko vaikuttaa muiden päätöksiin ja olla esimerkkinä?",
    "Onko tärkeää, että työsi on vaihtelevaa ja luovaa?",
    "Koetko olevasi enemmän käytännönläheinen vai visionäärinen ajattelija?",
    "Nautitko itsenäisestä työstä ilman tiukkaa ohjausta?",
    "Pidätkö yhteistyöstä ja tiimityöstä?",
    "Kiinnostavatko sinua ympäristönsuojelu tai kestävä kehitys?",
    "Tykkäätkö etsiä uusia ratkaisuja ongelmiin?",
    "Pidätkö aikataulujen ja projektien hallinnasta?",
    "Onko sinulla taipumus suunnitella pitkälle eteenpäin?",
    "Nautitko uusien asioiden kokeilemisesta ilman pelkoa epäonnistumisesta?",
    "Haluatko työsi olevan luovaa, vastuullista vai teknistä?",
    "Onko sinulle tärkeämpää vapaus vai turvallisuus työssä?",
    "Motivoiko sinua raha, vaikutusvalta vai merkityksellisyys?",
    "Tykkäätkö mieluummin johtaa vai tukea muita?",
    "Kuinka tärkeää sinulle on nähdä työn tulos konkreettisesti?",
    "Pidätkö opettamisesta tai muiden auttamisesta oppimaan?",
    "Koetko olevasi hyvä suunnittelemaan ja järjestämään asioita?",
    "Kuvitteletko usein, millaisia tulevaisuuden ammatteja voisi syntyä?",
  ],
  NUORI: [
    "Mitkä kolme asiaa ovat sinulle tärkeimpiä työelämässä?",
    "Millaisissa ympäristöissä olet tehokkain (rauha, paine, tiimi)?",
    "Pidätkö enemmän ideoiden kehittämisestä vai tulosten saavuttamisesta?",
    "Kuinka tärkeää sinulle on työn merkityksellisyys yhteiskunnassa?",
    "Nautitko teknologian ja uusien työkalujen käytöstä?",
    "Haluatko rakentaa uraa johtotehtävissä vai asiantuntijana?",
    "Millaiset tehtävät antavat sinulle eniten energiaa?",
    "Pidätkö rutiineista vai vaihtelevuudesta työssä?",
    "Kuinka tärkeää on, että työsi tukee arvojasi (esim. luonto, ihmiset, kehitys)?",
    "Nautitko luovasta ongelmanratkaisusta?",
    "Haluatko, että työsi näkyy konkreettisesti (rakentaminen, tuotanto, palvelu)?",
    "Pidätkö vastuusta ja päätöksenteosta?",
    "Koetko itsesi visionääriseksi ajattelijaksi vai realistiseksi toteuttajaksi?",
    "Motivoiko sinua enemmän ura, yhteisö vai henkilökohtainen kasvu?",
    "Nautitko muiden ohjaamisesta ja kehittämisestä?",
    "Pidätkö jatkuvasta oppimisesta ja itsesi kehittämisestä?",
    "Onko sinulle tärkeää joustava työaika vai selkeä rakenne?",
    "Koetko helpommaksi suunnitella vai improvisoida?",
    "Pidätkö ihmisten kohtaamisesta ja kuuntelemisesta?",
    "Kuinka tärkeää on ympäristön ja kestävän kehityksen huomioiminen työssäsi?",
    "Onko sinulla luontainen halu johtaa tai vaikuttaa?",
    "Tykkäätkö suunnitella strategisesti ja pitkällä aikavälillä?",
    "Oletko enemmän idean luoja vai sen toteuttaja?",
    "Nautitko verkostoitumisesta ja muiden kanssa työskentelystä?",
    "Koetko parhaaksi työn, jossa voit auttaa muita suoraan?",
    "Kuinka tärkeää on työn luovuus ja vapaus?",
    "Pidätkö enemmän digitaalisten työkalujen käytöstä vai käytännön tekemisestä?",
    "Haluatko nähdä työsi tulokset nopeasti vai pitkällä aikavälillä?",
    "Millainen työ saa sinut tuntemaan, että \"tämä on mun juttu\"?",
    "Jos saisit valita vapaasti, mitä tekisit viiden vuoden päästä?",
  ],
};

// ---------- UI HELPERS ----------
const Likert = ({ value, onChange }: { value?: number; onChange: (v: number) => void }) => {
  const labels = [
    "Täysin eri mieltä",
    "Eri mieltä",
    "En osaa sanoa",
    "Samaa mieltä",
    "Täysin samaa mieltä",
  ];
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

const Progress = ({ current, total }: { current: number; total: number }) => {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{current + 1} / {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ---------- PERSISTENCE ----------
const STORAGE_KEY = "careercompass-progress";

function saveProgress(state: any) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}
function loadProgress() {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}

// ---------- MAIN COMPONENT ----------
export default function CareerCompassTest() {
  type GroupKey = "YLA" | "TASO2" | "NUORI";
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0: landing, 1: group select, 2: questions, 3: summary
  const [group, setGroup] = useState<GroupKey | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const qList = useMemo(() => (group ? QUESTIONS[group] : []), [group]);
  const total = qList.length;

  // Load saved progress
  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.step !== undefined) {
      setStep(saved.step);
      setGroup(saved.group);
      setIndex(saved.index ?? 0);
      setAnswers(saved.answers ?? []);
    }
  }, []);

  useEffect(() => {
    saveProgress({ step, group, index, answers });
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
    saveProgress({});
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
      {step === 0 && (
        <Landing onStart={start} />
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
          index={index}
          total={total}
          question={qList[index]}
          value={answers[index]}
          onChange={setAnswer}
          onNext={nextQ}
          onPrev={prevQ}
          onExit={restart}
        />
      )}

      {step === 3 && (
        <Summary
          group={group}
          questions={qList}
          answers={answers}
          onRestart={restart}
          onSend={sendToBackend}
        />
      )}
    </div>
  );
}

// ---------- SUB-COMPONENTS ----------
const Landing = ({ onStart }: { onStart: () => void }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
    <h1 className="text-3xl font-bold tracking-tight">Tervetuloa testiin!</h1>
    <p className="mt-2 text-slate-600">Vastaa kysymyksiin, niin rakennamme sinulle urasuositukset.</p>
    <ul className="mt-6 space-y-2 text-slate-700">
      <li>⏱️ 15–20 minuuttia</li>
      <li>💙 100% ilmainen</li>
      <li>🤖 Tekoäly analysoi vastauksesi</li>
    </ul>
    <button onClick={onStart} className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-700">
      Aloita testi
    </button>
  </div>
);

const GroupCard = ({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) => (
  <button onClick={onClick} className="flex w-full flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-1 text-slate-600">{desc}</p>
    <span className="mt-4 inline-flex rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">Aloita</span>
  </button>
);

const GroupSelect = ({ onChoose, onBack }: { onChoose: (g: any) => void; onBack: () => void }) => (
  <div>
    <h2 className="mb-6 text-2xl font-bold">Valitse kohderyhmä</h2>
    <div className="grid gap-4 sm:grid-cols-2">
      <GroupCard
        title="Yläasteen oppilaat"
        desc="Löydä suunta, joka tuntuu omalta."
        onClick={() => onChoose("YLA")}
      />
      <GroupCard
        title="Toisen asteen opiskelijat"
        desc="Selvitä, mihin kiinnostuksesi johtavat."
        onClick={() => onChoose("TASO2")}
      />
      <GroupCard
        title="Nuoret aikuiset (20–25v)"
        desc="Tutustu uusiin mahdollisuuksiin ja löydä oma polkusi."
        onClick={() => onChoose("NUORI")}
      />
    </div>
    <button onClick={onBack} className="mt-6 text-slate-600 hover:underline">← Palaa</button>
  </div>
);

const QuestionScreen = ({
  title,
  index,
  total,
  question,
  value,
  onChange,
  onNext,
  onPrev,
  onExit,
}: {
  title: string;
  index: number;
  total: number;
  question: string;
  value?: number;
  onChange: (n: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-2 text-sm text-slate-500">{title}</div>
    <Progress current={index} total={total} />
    <h3 className="text-xl font-semibold">{question}</h3>
    <Likert value={value} onChange={onChange} />

    <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
      <button onClick={onExit} className="rounded-xl px-4 py-2 text-slate-600 hover:bg-slate-50">Keskeytä</button>
      <div className="space-x-2">
        <button onClick={onPrev} disabled={index === 0} className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 disabled:opacity-40">Edellinen</button>
        <button
          onClick={onNext}
          className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700"
        >
          {index === total - 1 ? "Valmis" : "Seuraava"}
        </button>
      </div>
    </div>
  </div>
);

const Summary = ({
  group,
  questions,
  answers,
  onRestart,
  onSend,
}: {
  group: any;
  questions: string[];
  answers: number[];
  onRestart: () => void;
  onSend: () => void;
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(() => ({ group, questions, answers }), [group, questions, answers]);
  const answered = answers.filter((a) => a > 0).length;

  const sendToBackend = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.message || "Analyysi epäonnistui");
      }
    } catch (e) {
      console.error(e);
      setError("Lähetys epäonnistui. Tarkista yhteys.");
    } finally {
      setLoading(false);
    }
  };

  if (analysis) {
    return (
      <div className="space-y-6">
        {/* AI Analysis Summary */}
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-blue-900">Henkilökohtainen analyysi</h2>
          </div>
          
          <p className="text-blue-800 text-lg leading-relaxed mb-6">
            {analysis.aiAnalysis.summary}
          </p>

          {/* Personality Insights */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Persoonallisuutesi</h3>
            <div className="grid gap-2">
              {analysis.aiAnalysis.personalityInsights.map((insight: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-blue-800">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Vahvuutesi</h3>
            <div className="grid gap-2">
              {analysis.aiAnalysis.strengths.map((strength: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-blue-800">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Advice */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Urasuositukset</h3>
            <div className="grid gap-2">
              {analysis.aiAnalysis.careerAdvice.map((advice: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-blue-800">{advice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Seuraavat askeleet</h3>
            <div className="grid gap-2">
              {analysis.aiAnalysis.nextSteps.map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-blue-800">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Suosittelemme sinulle nämä ammatit</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.recommendations.map((career: any, i: number) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{career.title_fi}</h3>
                <p className="text-slate-600 text-sm mb-3">{career.short_description}</p>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Palkka</span>
                    <p className="text-sm text-slate-700">
                      {career.salary_eur_month.median}€/kk (alue: {career.salary_eur_month.range[0]}-{career.salary_eur_month.range[1]}€)
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Työllisyysnäkymät</span>
                    <p className="text-sm text-slate-700">{career.job_outlook.explanation}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Koulutus</span>
                    <ul className="text-sm text-slate-700 space-y-1">
                      {career.education_paths.map((path: string, j: number) => (
                        <li key={j} className="flex items-start gap-1">
                          <span className="text-slate-400 mt-1">•</span>
                          <span>{path}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
