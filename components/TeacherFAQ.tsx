"use client";

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeacherFAQProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeacherFAQ({ isOpen, onClose }: TeacherFAQProps) {
  if (!isOpen) return null;

  const faqs = [
    {
      category: "Pakettierot",
      questions: [
        {
          q: "Mitä eroa on Premium- ja Standard (Yläaste) -paketeilla?",
          a: "Standard (Yläaste) -paketti sisältää luokkien ja testien luonnin yläasteen oppilaille. Siinä on perusanalytiikka ja raportointi sekä pääsy kohorteihin YLA, TASO2 ja NUORI. Premium-paketti sisältää kaikki Standard-paketin ominaisuudet sekä lisäksi lisääntyneen analytiikan, vertailuanalyytiikan eri kohorttien välillä, koulutason koostetiedot ja pidennetyn datan säilytyksen. Sinulla on pääsy kaikkiin kohortteihin ja laajennettuihin raportointiominaisuuksiin."
        },
        {
          q: "Voinko päivittää Standard-paketista Premium-pakettiin?",
          a: "Kyllä! Ota yhteyttä pääkäyttäjään tai CareerCompassi-tukeen päivityksestä. Päivityksen jälkeen sinulla on välittömästi pääsy Premium-ominaisuuksiin, kuten vertailuanalyytiikkaan ja koulutason koostetietoihin."
        }
      ]
    },
    {
      category: "Aloittaminen",
      questions: [
        {
          q: "Miten luon opettajatilin?",
          a: "Opettajatilit luodaan pääkäyttäjän toimesta. Ota yhteyttä koulusi pääkäyttäjään tai CareerCompassi-tukeen, jotta saat opettajakoodin. Kun olet saanut koodin, voit kirjautua opettajan hallintapaneeliin."
        },
        {
          q: "Miten luon uuden luokan?",
          a: "1. Kirjaudu opettajan hallintapaneeliin.\n2. Klikkaa \"Luo uusi luokka\" -painiketta.\n3. Syötä luokan nimi ja valitse kohortti (YLA, TASO2 tai NUORI).\n4. Tallenna luokka."
        },
        {
          q: "Miten luon PIN-koodit oppilaille?",
          a: "1. Valitse luokka hallintapaneelistasi.\n2. Klikkaa \"Luo PIN-koodit\" -painiketta.\n3. Määritä tarvitsemasi PIN-koodien määrä.\n4. PIN-koodit luodaan ja ne voidaan jakaa oppilaille. Jokainen PIN-koodi on yksilöllinen ja voidaan käyttää vain kerran."
        },
        {
          q: "Miten oppilaat pääsevät testiin?",
          a: "Oppilaat menevät verkkosivustolle ja syöttävät PIN-koodinsa. Heidät ohjataan suoraan määriteltyyn testiin kohortin perusteella."
        }
      ]
    },
    {
      category: "Tekninen tuki",
      questions: [
        {
          q: "Mitkä selaimet ovat tuettuja?",
          a: "CareerCompassi toimii nykyaikaisilla selaimilla, kuten Chrome, Firefox, Safari ja Edge. Varmista, että selaimesi on ajan tasalla."
        },
        {
          q: "Mitä tehdä, jos oppilas ei pääse testiin PIN-koodilla?",
          a: "Varmista, että PIN-koodi syötetään oikein (ei ylimääräisiä välilyöntejä).\nTarkista, että PIN-koodia ei ole jo käytetty.\nVarmista, että luokka on aktiivinen.\nJos ongelma jatkuu, ota yhteyttä opettajaan tai pääkäyttäjään."
        },
        {
          q: "Tarvitsevatko oppilaat tilin?",
          a: "Ei. Oppilaat tarvitsevat vain opettajalta saamansa PIN-koodin. Rekisteröintiä tai tilin luomista ei tarvita."
        }
      ]
    },
    {
      category: "Tulokset ja raportit",
      questions: [
        {
          q: "Miten näen oppilaiden tulokset?",
          a: "1. Kirjaudu opettajan hallintapaneeliin.\n2. Valitse luokka.\n3. Klikkaa \"Näytä tulokset\" nähdäksesi yksittäiset oppilastulokset.\n4. Tulokset näyttävät vastaukset ja pisteet kullekin oppilaalle."
        },
        {
          q: "Voinko viedä tulokset?",
          a: "Kyllä. Luokan tulossivulta voit viedä dataa jatkoanalyysiä varten. Premium-käyttäjillä on pääsy lisämuotoihin ja vertailuanalyytiikkaan."
        },
        {
          q: "Mikä on vertailuanalyytiikka? (Premium-ominaisuus)",
          a: "Vertailuanalyytiikka antaa sinun vertailla tuloksia eri kohorttien (YLA, TASO2, NUORI) välillä tunnistaaksesi malleja ja trendejä. Tämä ominaisuus on saatavilla Premium-paketissa."
        },
        {
          q: "Mitä ovat koulutason koostetiedot?",
          a: "Koulutason koostetiedot tarjoavat yhteenvetotilastoja ja analytiikkaa kaikista luokistasi. Tämä on Premium-ominaisuus, joka auttaa pääkäyttäjiä ymmärtämään kokonaisuoritusta ja trendejä."
        },
        {
          q: "Miten ymmärrän testin tulokset?",
          a: "Tulokset näyttävät yksittäiset vastaukset ja kokonaisuorituksen. Jokaisen oppilaan vastaukset näytetään ja näet, miten he vastasivat jokaiseen kysymykseen. Ota yhteyttä tukeen saadaksesi yksityiskohtaista ohjeistusta tulosten tulkitsemiseen."
        }
      ]
    },
    {
      category: "Data ja yksityisyys",
      questions: [
        {
          q: "Kuka näkee oppilaiden tulokset?",
          a: "Vain luokkaan pääsyn omaavat opettajat ja pääkäyttäjät näkevät oppilaiden tulokset. Oppilaat itse näkevät omat tuloksensa testin suorittamisen jälkeen."
        },
        {
          q: "Kuinka kauan dataa säilytetään?",
          a: "Datan säilytyskäytännöt vaihtelevat paketista riippuen. Premium-paketeilla on tyypillisesti pidennetty säilytysaika. Ota yhteyttä tukeen saadaksesi tietoja pakettisi säilytyskäytännöistä."
        },
        {
          q: "Onko CareerCompassi GDPR-yhteensopiva?",
          a: "Kyllä. CareerCompassi noudattaa GDPR:ää. Katso yksityisyysselosteemme (Tietosuojaseloste) ja käyttöehdomme (Käyttöehdot) saadaksesi lisätietoja datan käsittelystä ja oppilaiden oikeuksista."
        },
        {
          q: "Voinko poistaa oppilasdataa?",
          a: "Ota yhteyttä pääkäyttäjääsi tai CareerCompassi-tukeen pyytääksesi datan poistamista GDPR-vaatimusten mukaisesti."
        },
        {
          q: "Missä oppilasdataa säilytetään?",
          a: "Oppilasdataa säilytetään turvallisesti tietokannassamme asianmukaisilla turvallisuustoimenpiteillä. Katso yksityisyysselosteemme lisätietoja varten."
        }
      ]
    },
    {
      category: "Laskutus ja pääsy",
      questions: [
        {
          q: "Miten paketin päivitykset toimivat?",
          a: "Ota yhteyttä koulusi pääkäyttäjään tai CareerCompassi-myyntitiimiin päivityksestä. Päivityksen vahvistamisen jälkeen tilisi päivitetään ja Premium-ominaisuudet ovat saatavilla."
        },
        {
          q: "Mitä tapahtuu, jos pääsyni vanhenee?",
          a: "Ota yhteyttä pääkäyttäjääsi tai CareerCompassi-tukeen uusimaan pääsy. Historiallinen data säilytetään tyypillisesti pakettisi säilytyskäytännön mukaisesti."
        },
        {
          q: "Voinko siirtyä Premium-paketista Standard-pakettiin?",
          a: "Kyllä, mutta jotkut Premium-ominaisuudet (kuten pidennetty datan säilytys ja lisääntyneet analytiikkaominaisuudet) eivät välttämättä enää ole saatavilla. Ota yhteyttä tukeen keskustellaksesi vaihtoehdoista."
        },
        {
          q: "Miten nollaan opettajakoodini?",
          a: "Ota yhteyttä pääkäyttäjääsi. He voivat luoda uuden pääsykoodin tai nollata tilisi tarvittaessa."
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-900">Usein kysytyt kysymykset (UKK)</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-start">
                        <span className="text-blue-600 mr-2">Q:</span>
                        <span>{faq.q}</span>
                      </h4>
                      <p className="text-gray-700 ml-6 whitespace-pre-line">
                        <span className="text-green-600 font-medium">A: </span>
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Etsitkö lisää tukea? Ota yhteyttä pääkäyttäjääsi tai CareerCompassi-tukeen.
          </p>
        </div>
      </div>
    </div>
  );
}



