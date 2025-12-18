"use client";

import { useState } from 'react';
import { X, ChevronDown, HelpCircle, Mail } from 'lucide-react';

interface TeacherFAQProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeacherFAQ({ isOpen, onClose }: TeacherFAQProps) {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      category: "Pakettierot",
      questions: [
        {
          q: "Mitä eroa on Premium- ja Standard-paketeilla?",
          a: "Standard-paketti sisältää luokkien ja testien luonnin yläasteen oppilaille, perusanalytiikan ja pääsyn kohorteihin YLA, TASO2 ja NUORI. Premium-paketti sisältää lisäksi vertailuanalytiikan, koulutason koostetiedot ja pidennetyn datan säilytyksen."
        },
        {
          q: "Voinko päivittää Premium-pakettiin?",
          a: "Kyllä! Ota yhteyttä pääkäyttäjään tai Urakompassi-tukeen. Päivityksen jälkeen saat välittömästi pääsyn Premium-ominaisuuksiin."
        }
      ]
    },
    {
      category: "Aloittaminen",
      questions: [
        {
          q: "Miten luon opettajatilin?",
          a: "Opettajatilit luodaan pääkäyttäjän toimesta. Ota yhteyttä koulusi pääkäyttäjään tai Urakompassi-tukeen saadaksesi opettajakoodin."
        },
        {
          q: "Miten luon uuden luokan?",
          a: "Kirjaudu hallintapaneeliin, klikkaa \"Luo uusi luokka\", syötä luokan nimi ja valitse kohortti. Tallenna luokka."
        },
        {
          q: "Miten luon PIN-koodit oppilaille?",
          a: "Valitse luokka, klikkaa \"Luo PIN-koodit\" ja määritä tarvitsemasi määrä. PIN-koodit ovat yksilöllisiä ja voidaan käyttää vain kerran."
        },
        {
          q: "Miten oppilaat pääsevät testiin?",
          a: "Oppilaat menevät verkkosivustolle ja syöttävät PIN-koodinsa. Heidät ohjataan suoraan oikeaan testiin."
        }
      ]
    },
    {
      category: "Tekninen tuki",
      questions: [
        {
          q: "Mitkä selaimet ovat tuettuja?",
          a: "Chrome, Firefox, Safari ja Edge. Varmista, että selaimesi on ajan tasalla."
        },
        {
          q: "Oppilas ei pääse testiin PIN-koodilla?",
          a: "Tarkista, että PIN-koodi on oikein, sitä ei ole jo käytetty, ja luokka on aktiivinen. Ota tarvittaessa yhteyttä tukeen."
        },
        {
          q: "Tarvitsevatko oppilaat tilin?",
          a: "Ei. Oppilaat tarvitsevat vain PIN-koodin. Rekisteröintiä ei tarvita."
        }
      ]
    },
    {
      category: "Tulokset ja raportit",
      questions: [
        {
          q: "Miten näen oppilaiden tulokset?",
          a: "Kirjaudu hallintapaneeliin, valitse luokka ja klikkaa \"Näytä tulokset\". Näet yksittäiset vastaukset ja pisteet."
        },
        {
          q: "Voinko viedä tulokset?",
          a: "Kyllä. Premium-käyttäjillä on pääsy lisämuotoihin ja vertailuanalytiikkaan."
        }
      ]
    },
    {
      category: "Data ja yksityisyys",
      questions: [
        {
          q: "Kuka näkee oppilaiden tulokset?",
          a: "Vain luokkaan pääsyn omaavat opettajat ja pääkäyttäjät. Oppilaat näkevät omat tuloksensa."
        },
        {
          q: "Onko Urakompassi GDPR-yhteensopiva?",
          a: "Kyllä. Katso yksityisyysselosteemme lisätietoja varten."
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-urak-surface rounded-2xl border border-urak-border shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-urak-border px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-urak-accent-blue/15 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-urak-accent-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Tuki & UKK</h2>
              <p className="text-sm text-urak-text-muted">Usein kysytyt kysymykset</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-urak-text-muted hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-xs font-semibold text-urak-text-muted uppercase tracking-wider mb-3">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.questions.map((faq, faqIndex) => {
                    const isOpen = openIndex === `${categoryIndex}-${faqIndex}`;
                    return (
                      <div
                        key={faqIndex}
                        className="bg-urak-bg rounded-xl border border-urak-border overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, faqIndex)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                        >
                          <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                          <ChevronDown
                            className={`h-4 w-4 text-urak-text-muted flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1">
                            <p className="text-sm text-urak-text-secondary leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-urak-border px-6 py-4 bg-urak-bg">
          <div className="flex items-center justify-center gap-2 text-sm text-urak-text-muted">
            <Mail className="h-4 w-4" />
            <span>Tarvitsetko apua?</span>
            <a
              href="mailto:info@urakompassi.fi"
              className="text-urak-accent-blue hover:underline font-medium"
            >
              info@urakompassi.fi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
