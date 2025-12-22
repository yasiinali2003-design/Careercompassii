"use client";

import React from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

// Main AboutUs Component
const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-0 pb-24 lg:pb-32">
      {/* Minimal Nordic-style header */}
      <AnimatedSection>
        <section className="pt-20 lg:pt-28 pb-12">
          <p className="text-base lg:text-lg tracking-[0.25em] text-sky-400 uppercase font-medium">
            MEISTÄ
          </p>
        </section>
      </AnimatedSection>

      {/* Two-column text layout */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Column 1: Missiomme & Lähestymistapamme */}
          <div className="space-y-0">
            {/* Missiomme */}
            <section className="pb-10">
              <h2 className="text-xl font-semibold mb-4 text-slate-50">
                Missiomme
              </h2>
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-slate-200">
                  UraKompassi on kotimainen palvelu, joka tukee nuoria heidän
                  etsiessään suuntaa opinnoilleen ja tulevaisuudelleen. Tavoitteenamme
                  on auttaa käyttäjiä ymmärtämään paremmin omia vahvuuksiaan,
                  kiinnostuksen kohteitaan ja arvojaan, jotta uravalinnoista tulee
                  selkeämpiä ja vähemmän kuormittavia.
                </p>
                <p className="text-base leading-relaxed text-slate-200">
                  Uskomme, että jokainen nuori hyötyy siitä, että voi pysähtyä
                  tarkastelemaan itseään ilman suorituspaineita tai vertailua muihin.
                  Meidän tehtävämme on tarjota turvallinen ja selkeä kokonaisuus,
                  joka tukee päätöksentekoa ja auttaa rakentamaan luottamusta omaan
                  osaamiseen.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-slate-800/80 my-10 lg:hidden" />

            {/* Lähestymistapamme */}
            <section className="pt-10 lg:pt-0 lg:mt-10 lg:border-t lg:border-slate-800/80">
              <h2 className="text-xl font-semibold mb-4 text-slate-50">
                Lähestymistapamme
              </h2>
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-slate-200">
                  Hyödynnämme modernia analytiikkaa ja tutkittuun uraohjaukseen
                  perustuvaa arviointia. Palvelumme vertailee käyttäjän antamia
                  vastauksia laajaan ura- ja koulutusprofiilien tietopohjaan ja
                  muodostaa niiden perusteella yksilöllisiä näkemyksiä ja
                  vaihtoehtoja.
                </p>
                <p className="text-base leading-relaxed text-slate-200">
                  Taustalla oleva käsittely on automatisoitua, mutta varsinainen
                  käyttökokemus on suunniteltu selkeäksi, rauhalliseksi ja käyttäjää
                  kunnioittavaksi. Tavoitteena on tarjota luotettavaa ja helposti
                  omaksuttavaa tukea opinto- ja urapohdintoihin ilman kiirettä tai
                  ylimääräistä stressiä.
                </p>
              </div>
            </section>
          </div>

          {/* Column 2: Keitä olemme & Yhteystiedot */}
          <div className="space-y-0">
            {/* Keitä olemme */}
            <section className="pb-10">
              <h2 className="text-xl font-semibold mb-4 text-slate-50">
                Keitä olemme
              </h2>
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-slate-200">
                  Olemme suomalainen tiimi, joka keskittyy kehittämään ratkaisuja
                  nuorten hyvinvoinnin ja koulutuspolkujen tukemiseksi.
                  Ymmärrämme, millaisia paineita uravalinnat voivat aiheuttaa, ja
                  haluamme tarjota työkalun, joka tekee päätöksenteosta selkeämpää,
                  hallittavampaa ja luotettavampaa.
                </p>
                <p className="text-base leading-relaxed text-slate-200">
                  Käytämme nykyaikaisia analyysimenetelmiä, mutta suunnittelun
                  lähtökohtana on aina käyttäjän kokemus: palvelun tulee olla
                  turvallinen, selkeä ja helposti lähestyttävä. Tavoitteenamme on
                  lisätä nuorten itsevarmuutta ja auttaa heitä tekemään perusteltuja,
                  tietoon pohjautuvia valintoja.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-slate-800/80 my-10" />

            {/* Yhteystiedot */}
            <section className="pt-10">
              <h2 className="text-xl font-semibold mb-4 text-slate-50">
                Yhteystiedot
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-2">Sähköposti</p>
                  <a 
                    href="mailto:info@urakompassi.fi" 
                    className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                  >
                    info@urakompassi.fi
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-2">Osoite</p>
                  <p className="text-sky-400 font-medium">
                    Helsinki, Finland
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-2">Verkkosivut</p>
                  <a 
                    href="https://urakompassi.fi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                  >
                    urakompassi.fi
                  </a>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-200 mb-2">
                    Yhteistyö oppilaitosten ja ohjaajien kanssa
                  </p>
                  <p className="text-base leading-relaxed text-slate-300">
                    Ota yhteyttä, jos haluat tuoda UraKompassin osaksi
                    oppilaitoksen ohjaus- tai opiskelijapalveluita.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default AboutUs;
