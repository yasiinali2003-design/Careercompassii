/**
 * STUDY PROGRAMS DATABASE
 * Contains study programs with todistusvalinta point requirements (2025 data)
 * Matches programs with related careers for personalized recommendations
 */

export interface StudyProgram {
  id: string;
  name: string;
  institution: string;
  institutionType: 'yliopisto' | 'amk';
  field: string; // teknologia, terveys, kauppa, tekniikka, kasvatus, oikeus, psykologia, etc.
  minPoints: number; // Minimum points required (2025 data)
  maxPoints?: number; // Maximum points (if available)
  relatedCareers: string[]; // Career slugs that match this program
  opintopolkuUrl?: string;
  description?: string;
}

/**
 * Initial database with 20-30 popular programs covering major fields
 * Data from 2025 todistusvalinta results
 */
export const studyPrograms: StudyProgram[] = [
  // TECHNOLOGY PROGRAMS (5-7)
  {
    id: 'tietojenkäsittelytiede-helsinki',
    name: 'Tietojenkäsittelytiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'teknologia',
    minPoints: 95.0,
    maxPoints: 120.0,
    relatedCareers: ['ohjelmistokehittaja', 'tietoturva-asiantuntija', 'tekoalyasiantuntija', 'tietojarjestelma-arkkitehti'],
    description: 'Syvällinen tietojenkäsittelytieteen koulutus, joka valmistaa tutkijoiksi ja teknologia-alan asiantuntijoiksi.'
  },
  {
    id: 'tietotekniikka-aalto',
    name: 'Tietotekniikka',
    institution: 'Aalto-yliopisto',
    institutionType: 'yliopisto',
    field: 'teknologia',
    minPoints: 88.0,
    maxPoints: 110.0,
    relatedCareers: ['ohjelmistokehittaja', 'tietoturva-asiantuntija', 'tekoalyasiantuntija', 'tietojarjestelma-arkkitehti', 'verkkosuunnittelija'],
    description: 'Teknologiapainotteinen koulutus, joka yhdistää tietojenkäsittelytieteen ja tekniikan.'
  },
  {
    id: 'tietotekniikka-tampere',
    name: 'Tietotekniikka',
    institution: 'Tampereen yliopisto',
    institutionType: 'yliopisto',
    field: 'teknologia',
    minPoints: 82.0,
    maxPoints: 100.0,
    relatedCareers: ['ohjelmistokehittaja', 'tietoturva-asiantuntija', 'tekoalyasiantuntija'],
    description: 'Käytännönläheinen tietotekniikan koulutus, joka valmistaa työelämään.'
  },
  {
    id: 'tietotekniikka-amk-helsinki',
    name: 'Tietotekniikka',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'teknologia',
    minPoints: 45.0,
    maxPoints: 75.0,
    relatedCareers: ['ohjelmistokehittaja', 'verkkosuunnittelija', 'tietoturva-asiantuntija', 'it-tukihenkilo'],
    description: 'Käytännönläheinen AMK-koulutus, joka valmistaa suoraan työelämään.'
  },
  {
    id: 'tietotekniikka-amk-turku',
    name: 'Tietotekniikka',
    institution: 'Turun ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'teknologia',
    minPoints: 42.0,
    maxPoints: 70.0,
    relatedCareers: ['ohjelmistokehittaja', 'verkkosuunnittelija', 'it-tukihenkilo'],
    description: 'AMK-koulutus, joka painottaa käytännön sovelluksia ja työelämäyhteistyötä.'
  },

  // HEALTHCARE PROGRAMS (4-5)
  {
    id: 'lääketiede-helsinki',
    name: 'Lääketiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'terveys',
    minPoints: 188.3,
    maxPoints: 200.0,
    relatedCareers: ['laakari', 'erikoislaakari'],
    description: 'Yliopistotason lääketieteen koulutus, joka valmistaa lääkäreiksi.'
  },
  {
    id: 'lääketiede-tampere',
    name: 'Lääketiede',
    institution: 'Tampereen yliopisto',
    institutionType: 'yliopisto',
    field: 'terveys',
    minPoints: 182.3,
    maxPoints: 195.0,
    relatedCareers: ['laakari', 'erikoislaakari'],
    description: 'Lääketieteen koulutus, joka painottaa potilastyötä ja käytännön taitoja.'
  },
  {
    id: 'sairaanhoitaja-amk-helsinki',
    name: 'Sairaanhoitaja',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'terveys',
    minPoints: 35.0,
    maxPoints: 65.0,
    relatedCareers: ['sairaanhoitaja', 'terveydenhoitaja', 'kotihoitaja'],
    description: 'AMK-koulutus, joka valmistaa sairaanhoitajiksi. Käytännönläheinen ja työelämäkytköksellinen.'
  },
  {
    id: 'sairaanhoitaja-amk-turku',
    name: 'Sairaanhoitaja',
    institution: 'Turun ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'terveys',
    minPoints: 32.0,
    maxPoints: 62.0,
    relatedCareers: ['sairaanhoitaja', 'terveydenhoitaja'],
    description: 'Sairaanhoitajakoulutus, joka painottaa potilastyötä ja hoitotaitoja.'
  },
  {
    id: 'hammaslääketiede-helsinki',
    name: 'Hammaslääketiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'terveys',
    minPoints: 170.7,
    maxPoints: 185.0,
    relatedCareers: ['hammaslaakari'],
    description: 'Hammaslääketieteen koulutus, joka valmistaa hammaslääkäreiksi.'
  },

  // BUSINESS PROGRAMS (3-4)
  {
    id: 'kauppatiede-aalto',
    name: 'Kauppatiede',
    institution: 'Aalto-yliopisto',
    institutionType: 'yliopisto',
    field: 'kauppa',
    minPoints: 118.7,
    maxPoints: 140.0,
    relatedCareers: ['liiketalousjohtaja', 'markkinointipäällikkö', 'yritysneuvoja', 'talousjohtaja'],
    description: 'Kauppatieteellinen koulutus, joka valmistaa liiketalouden asiantuntijoiksi.'
  },
  {
    id: 'kauppatiede-tampere',
    name: 'Kauppatiede',
    institution: 'Tampereen yliopisto',
    institutionType: 'yliopisto',
    field: 'kauppa',
    minPoints: 111.5,
    maxPoints: 130.0,
    relatedCareers: ['liiketalousjohtaja', 'markkinointipäällikkö', 'yritysneuvoja'],
    description: 'Kauppatieteellinen koulutus, joka painottaa liiketoiminnan kehittämistä.'
  },
  {
    id: 'liiketalous-amk-helsinki',
    name: 'Liiketalous',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'kauppa',
    minPoints: 30.0,
    maxPoints: 60.0,
    relatedCareers: ['liiketalousjohtaja', 'markkinointipäällikkö', 'myyntipäällikkö'],
    description: 'AMK-koulutus, joka valmistaa liiketalouden ammattilaisiksi.'
  },
  {
    id: 'kauppatiede-turku',
    name: 'Kauppatiede',
    institution: 'Turun yliopisto',
    institutionType: 'yliopisto',
    field: 'kauppa',
    minPoints: 111.5,
    maxPoints: 128.0,
    relatedCareers: ['liiketalousjohtaja', 'markkinointipäällikkö', 'yritysneuvoja'],
    description: 'Kauppatieteellinen koulutus Turun yliopistossa.'
  },

  // ENGINEERING PROGRAMS (3-4)
  {
    id: 'konetekniikka-aalto',
    name: 'Konetekniikka',
    institution: 'Aalto-yliopisto',
    institutionType: 'yliopisto',
    field: 'tekniikka',
    minPoints: 76.5,
    maxPoints: 95.0,
    relatedCareers: ['konetekniikan-insinoori', 'automaatioteknikko', 'projektipäällikkö'],
    description: 'Konetekniikan koulutus, joka valmistaa diplomi-insinööreiksi.'
  },
  {
    id: 'rakennustekniikka-aalto',
    name: 'Rakennustekniikka',
    institution: 'Aalto-yliopisto',
    institutionType: 'yliopisto',
    field: 'tekniikka',
    minPoints: 72.0,
    maxPoints: 90.0,
    relatedCareers: ['rakennusinsinoori', 'projektipäällikkö', 'rakennusmestari'],
    description: 'Rakennustekniikan koulutus, joka valmistaa rakennusalan insinööreiksi.'
  },
  {
    id: 'konetekniikka-amk-tampere',
    name: 'Konetekniikka',
    institution: 'Tampereen ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'tekniikka',
    minPoints: 40.0,
    maxPoints: 70.0,
    relatedCareers: ['konetekniikan-insinoori', 'automaatioteknikko'],
    description: 'AMK-koulutus konetekniikassa, käytännönläheinen ja työelämäkytköksellinen.'
  },
  {
    id: 'sähkötekniikka-aalto',
    name: 'Sähkötekniikka',
    institution: 'Aalto-yliopisto',
    institutionType: 'yliopisto',
    field: 'tekniikka',
    minPoints: 75.0,
    maxPoints: 92.0,
    relatedCareers: ['sahkotekniikan-insinoori', 'automaatioteknikko'],
    description: 'Sähkötekniikan koulutus, joka valmistaa sähkötekniikan insinööreiksi.'
  },

  // EDUCATION PROGRAMS (2-3)
  {
    id: 'opettajankoulutus-helsinki',
    name: 'Luokanopettaja',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'kasvatus',
    minPoints: 85.0,
    maxPoints: 105.0,
    relatedCareers: ['luokanopettaja', 'aineenopettaja', 'erityisopettaja'],
    description: 'Luokanopettajakoulutus, joka valmistaa peruskoulun opettajiksi.'
  },
  {
    id: 'varhaiskasvatus-amk-helsinki',
    name: 'Varhaiskasvatus',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'kasvatus',
    minPoints: 28.0,
    maxPoints: 58.0,
    relatedCareers: ['varhaiskasvatuksen-opettaja', 'lastentarhanopettaja'],
    description: 'AMK-koulutus varhaiskasvatuksessa, joka valmistaa päiväkodin opettajiksi.'
  },
  {
    id: 'aineenopettaja-jyvaskyla',
    name: 'Aineenopettaja',
    institution: 'Jyväskylän yliopisto',
    institutionType: 'yliopisto',
    field: 'kasvatus',
    minPoints: 80.0,
    maxPoints: 100.0,
    relatedCareers: ['aineenopettaja', 'luokanopettaja'],
    description: 'Aineenopettajakoulutus, joka valmistaa yläkoulun ja lukion opettajiksi.'
  },

  // LAW PROGRAMS (2)
  {
    id: 'oikeustiede-helsinki',
    name: 'Oikeustiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'oikeus',
    minPoints: 133.6,
    maxPoints: 150.0,
    relatedCareers: ['asianajaja', 'oikeusneuvos', 'notaari'],
    description: 'Oikeustieteen koulutus, joka valmistaa juristeiksi.'
  },
  {
    id: 'oikeustiede-turku',
    name: 'Oikeustiede',
    institution: 'Turun yliopisto',
    institutionType: 'yliopisto',
    field: 'oikeus',
    minPoints: 131.1,
    maxPoints: 145.0,
    relatedCareers: ['asianajaja', 'oikeusneuvos'],
    description: 'Oikeustieteen koulutus Turun yliopistossa.'
  },

  // PSYCHOLOGY PROGRAMS (2)
  {
    id: 'psykologia-helsinki',
    name: 'Psykologia',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'psykologia',
    minPoints: 137.9,
    maxPoints: 155.0,
    relatedCareers: ['psykologi', 'koulupsykologi', 'tyopsykologi'],
    description: 'Psykologian koulutus, joka valmistaa psykologeiksi.'
  },
  {
    id: 'psykologia-tampere',
    name: 'Psykologia',
    institution: 'Tampereen yliopisto',
    institutionType: 'yliopisto',
    field: 'psykologia',
    minPoints: 137.0,
    maxPoints: 152.0,
    relatedCareers: ['psykologi', 'koulupsykologi'],
    description: 'Psykologian koulutus Tampereen yliopistossa.'
  },

  // OTHER POPULAR PROGRAMS (3-5)
  {
    id: 'arkkitehtuuri-aalto',
    name: 'Arkkitehtuuri',
    institution: 'Aalto-yliopisto',
    institutionType: 'yliopisto',
    field: 'rakentaminen',
    minPoints: 90.0,
    maxPoints: 110.0,
    relatedCareers: ['arkkitehti', 'rakennusarkkitehti'],
    description: 'Arkkitehtuurin koulutus, joka valmistaa arkkitehdeiksi.'
  },
  {
    id: 'sosiaalitieteet-helsinki',
    name: 'Sosiaalitieteet',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'yhteiskunta',
    minPoints: 75.0,
    maxPoints: 95.0,
    relatedCareers: ['sosiaalityontekija', 'sosiaaliohjaja'],
    description: 'Sosiaalitieteiden koulutus, joka valmistaa sosiaalialan ammattilaisiksi.'
  },
  {
    id: 'media-amk-tampere',
    name: 'Media',
    institution: 'Tampereen ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'media',
    minPoints: 35.0,
    maxPoints: 65.0,
    relatedCareers: ['graafinen-suunnittelija', 'mediasuunnittelija', 'sisaltotuottaja'],
    description: 'Media-alan AMK-koulutus, joka valmistaa median ammattilaisiksi.'
  },

  // ADDITIONAL TECHNOLOGY PROGRAMS
  {
    id: 'tietotekniikka-oulu',
    name: 'Tietotekniikka',
    institution: 'Oulun yliopisto',
    institutionType: 'yliopisto',
    field: 'teknologia',
    minPoints: 78.0,
    maxPoints: 95.0,
    relatedCareers: ['ohjelmistokehittaja', 'tietoturva-asiantuntija', 'tekoalyasiantuntija'],
    description: 'Tietotekniikan koulutus Oulun yliopistossa, painottaen käytännön sovelluksia.'
  },
  {
    id: 'tietotekniikka-jyvaskyla',
    name: 'Tietotekniikka',
    institution: 'Jyväskylän yliopisto',
    institutionType: 'yliopisto',
    field: 'teknologia',
    minPoints: 75.0,
    maxPoints: 92.0,
    relatedCareers: ['ohjelmistokehittaja', 'verkkosuunnittelija', 'tietoturva-asiantuntija'],
    description: 'Tietotekniikan koulutus, joka yhdistää teorian ja käytännön.'
  },
  {
    id: 'tietotekniikka-amk-oulu',
    name: 'Tietotekniikka',
    institution: 'Oulun ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'teknologia',
    minPoints: 38.0,
    maxPoints: 68.0,
    relatedCareers: ['ohjelmistokehittaja', 'it-tukihenkilo', 'verkkosuunnittelija'],
    description: 'AMK-koulutus tietotekniikassa, työelämäkytköksellinen.'
  },
  {
    id: 'tietotekniikka-amk-jyvaskyla',
    name: 'Tietotekniikka',
    institution: 'Jyväskylän ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'teknologia',
    minPoints: 40.0,
    maxPoints: 70.0,
    relatedCareers: ['ohjelmistokehittaja', 'verkkosuunnittelija'],
    description: 'Käytännönläheinen tietotekniikan AMK-koulutus.'
  },
  {
    id: 'tietotekniikka-amk-tampere',
    name: 'Tietotekniikka',
    institution: 'Tampereen ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'teknologia',
    minPoints: 43.0,
    maxPoints: 73.0,
    relatedCareers: ['ohjelmistokehittaja', 'it-tukihenkilo', 'verkkosuunnittelija'],
    description: 'AMK-koulutus, joka valmistaa IT-alan ammattilaisiksi.'
  },

  // ADDITIONAL HEALTHCARE PROGRAMS
  {
    id: 'apteekkari-helsinki',
    name: 'Apteekkari',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'terveys',
    minPoints: 155.0,
    maxPoints: 175.0,
    relatedCareers: ['apteekkari', 'farmaseutti'],
    description: 'Farmasian koulutus, joka valmistaa apteekkareiksi.'
  },
  {
    id: 'elainlaakari-helsinki',
    name: 'Eläinlääketiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'terveys',
    minPoints: 165.0,
    maxPoints: 180.0,
    relatedCareers: ['elainlaakari'],
    description: 'Eläinlääketieteen koulutus, joka valmistaa eläinlääkäreiksi.'
  },
  {
    id: 'fysioterapia-amk-helsinki',
    name: 'Fysioterapia',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'terveys',
    minPoints: 38.0,
    maxPoints: 68.0,
    relatedCareers: ['fysioterapeutti', 'liikuntaterapeutti'],
    description: 'Fysioterapian AMK-koulutus, joka valmistaa fysioterapeuteiksi.'
  },
  {
    id: 'terveydenhoitaja-amk-helsinki',
    name: 'Terveydenhoitaja',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'terveys',
    minPoints: 33.0,
    maxPoints: 63.0,
    relatedCareers: ['terveydenhoitaja', 'kouluterveydenhoitaja'],
    description: 'Terveydenhoitajakoulutus, joka painottaa ennaltaehkäisevää terveydenhoitoa.'
  },
  {
    id: 'bioanalyytikko-amk-helsinki',
    name: 'Bioanalyytikko',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'terveys',
    minPoints: 36.0,
    maxPoints: 66.0,
    relatedCareers: ['bioanalyytikko', 'laboratoriohoitaja'],
    description: 'Bioanalyytikon koulutus, joka valmistaa laboratorioalan ammattilaisiksi.'
  },
  {
    id: 'hoitotyö-amk-turku',
    name: 'Hoitotyö',
    institution: 'Turun ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'terveys',
    minPoints: 30.0,
    maxPoints: 60.0,
    relatedCareers: ['sairaanhoitaja', 'terveydenhoitaja'],
    description: 'Hoitotyön AMK-koulutus Turussa.'
  },

  // ADDITIONAL BUSINESS PROGRAMS
  {
    id: 'kauppatiede-jyvaskyla',
    name: 'Kauppatiede',
    institution: 'Jyväskylän yliopisto',
    institutionType: 'yliopisto',
    field: 'kauppa',
    minPoints: 108.0,
    maxPoints: 125.0,
    relatedCareers: ['liiketalousjohtaja', 'markkinointipäällikkö', 'yritysneuvoja'],
    description: 'Kauppatieteellinen koulutus Jyväskylässä.'
  },
  {
    id: 'liiketalous-amk-tampere',
    name: 'Liiketalous',
    institution: 'Tampereen ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'kauppa',
    minPoints: 28.0,
    maxPoints: 58.0,
    relatedCareers: ['liiketalousjohtaja', 'myyntipäällikkö', 'markkinointipäällikkö'],
    description: 'Liiketalouden AMK-koulutus Tampereella.'
  },
  {
    id: 'taloushallinto-amk-helsinki',
    name: 'Taloushallinto',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'kauppa',
    minPoints: 32.0,
    maxPoints: 62.0,
    relatedCareers: ['kirjanpitaja', 'talousjohtaja', 'tilitoimiston-johtaja'],
    description: 'Taloushallinnon AMK-koulutus, joka valmistaa talousalan ammattilaisiksi.'
  },
  {
    id: 'markkinointi-amk-helsinki',
    name: 'Markkinointi',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'kauppa',
    minPoints: 30.0,
    maxPoints: 60.0,
    relatedCareers: ['markkinointipäällikkö', 'markkinointisuunnittelija', 'sosiaalisen-median-asiantuntija'],
    description: 'Markkinoinnin AMK-koulutus, joka painottaa digitaalista markkinointia.'
  },

  // ADDITIONAL ENGINEERING PROGRAMS
  {
    id: 'konetekniikka-oulu',
    name: 'Konetekniikka',
    institution: 'Oulun yliopisto',
    institutionType: 'yliopisto',
    field: 'tekniikka',
    minPoints: 70.0,
    maxPoints: 88.0,
    relatedCareers: ['konetekniikan-insinoori', 'automaatioteknikko'],
    description: 'Konetekniikan koulutus Oulun yliopistossa.'
  },
  {
    id: 'rakennustekniikka-tampere',
    name: 'Rakennustekniikka',
    institution: 'Tampereen yliopisto',
    institutionType: 'yliopisto',
    field: 'tekniikka',
    minPoints: 68.0,
    maxPoints: 85.0,
    relatedCareers: ['rakennusinsinoori', 'projektipäällikkö'],
    description: 'Rakennustekniikan koulutus Tampereella.'
  },
  {
    id: 'sähkötekniikka-tampere',
    name: 'Sähkötekniikka',
    institution: 'Tampereen yliopisto',
    institutionType: 'yliopisto',
    field: 'tekniikka',
    minPoints: 72.0,
    maxPoints: 90.0,
    relatedCareers: ['sahkotekniikan-insinoori', 'automaatioteknikko'],
    description: 'Sähkötekniikan koulutus Tampereella.'
  },
  {
    id: 'rakennustekniikka-amk-helsinki',
    name: 'Rakennustekniikka',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'tekniikka',
    minPoints: 35.0,
    maxPoints: 65.0,
    relatedCareers: ['rakennusinsinoori', 'rakennusmestari'],
    description: 'Rakennustekniikan AMK-koulutus.'
  },
  {
    id: 'sähkötekniikka-amk-tampere',
    name: 'Sähkötekniikka',
    institution: 'Tampereen ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'tekniikka',
    minPoints: 37.0,
    maxPoints: 67.0,
    relatedCareers: ['sahkotekniikan-insinoori', 'automaatioteknikko'],
    description: 'Sähkötekniikan AMK-koulutus.'
  },
  {
    id: 'ympäristötekniikka-aalto',
    name: 'Ympäristötekniikka',
    institution: 'Aalto-yliopisto',
    institutionType: 'yliopisto',
    field: 'tekniikka',
    minPoints: 74.0,
    maxPoints: 92.0,
    relatedCareers: ['ymparistonsuojelun-asiantuntija', 'ymparistoteknikko'],
    description: 'Ympäristötekniikan koulutus, joka painottaa kestävää kehitystä.'
  },

  // ADDITIONAL EDUCATION PROGRAMS
  {
    id: 'luokanopettaja-jyvaskyla',
    name: 'Luokanopettaja',
    institution: 'Jyväskylän yliopisto',
    institutionType: 'yliopisto',
    field: 'kasvatus',
    minPoints: 82.0,
    maxPoints: 102.0,
    relatedCareers: ['luokanopettaja', 'erityisopettaja'],
    description: 'Luokanopettajakoulutus Jyväskylässä.'
  },
  {
    id: 'varhaiskasvatus-amk-turku',
    name: 'Varhaiskasvatus',
    institution: 'Turun ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'kasvatus',
    minPoints: 26.0,
    maxPoints: 56.0,
    relatedCareers: ['varhaiskasvatuksen-opettaja', 'lastentarhanopettaja'],
    description: 'Varhaiskasvatuksen AMK-koulutus Turussa.'
  },
  {
    id: 'erityispedagogiikka-jyvaskyla',
    name: 'Erityispedagogiikka',
    institution: 'Jyväskylän yliopisto',
    institutionType: 'yliopisto',
    field: 'kasvatus',
    minPoints: 78.0,
    maxPoints: 98.0,
    relatedCareers: ['erityisopettaja', 'erityispedagogi'],
    description: 'Erityispedagogiikan koulutus, joka valmistaa erityisopettajiksi.'
  },

  // ADDITIONAL LAW PROGRAMS
  {
    id: 'oikeustiede-oulu',
    name: 'Oikeustiede',
    institution: 'Oulun yliopisto',
    institutionType: 'yliopisto',
    field: 'oikeus',
    minPoints: 128.0,
    maxPoints: 142.0,
    relatedCareers: ['asianajaja', 'oikeusneuvos'],
    description: 'Oikeustieteen koulutus Oulussa.'
  },

  // ADDITIONAL PSYCHOLOGY PROGRAMS
  {
    id: 'psykologia-jyvaskyla',
    name: 'Psykologia',
    institution: 'Jyväskylän yliopisto',
    institutionType: 'yliopisto',
    field: 'psykologia',
    minPoints: 135.0,
    maxPoints: 150.0,
    relatedCareers: ['psykologi', 'koulupsykologi'],
    description: 'Psykologian koulutus Jyväskylässä.'
  },

  // JOURNALISM AND MEDIA PROGRAMS
  {
    id: 'journalismi-tampere',
    name: 'Journalismi',
    institution: 'Tampereen yliopisto',
    institutionType: 'yliopisto',
    field: 'media',
    minPoints: 88.0,
    maxPoints: 105.0,
    relatedCareers: ['journalisti', 'uutistoimittaja', 'sisaltotuottaja'],
    description: 'Journalismin koulutus, joka valmistaa journalisteiksi ja media-alan ammattilaisiksi.'
  },
  {
    id: 'viestinta-tampere',
    name: 'Viestintä',
    institution: 'Tampereen yliopisto',
    institutionType: 'yliopisto',
    field: 'media',
    minPoints: 85.0,
    maxPoints: 102.0,
    relatedCareers: ['viestintapäällikkö', 'markkinointipäällikkö', 'sisaltotuottaja'],
    description: 'Viestinnän koulutus, joka painottaa strategista viestintää.'
  },
  {
    id: 'media-amk-helsinki',
    name: 'Media',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'media',
    minPoints: 33.0,
    maxPoints: 63.0,
    relatedCareers: ['graafinen-suunnittelija', 'mediasuunnittelija', 'sisaltotuottaja'],
    description: 'Media-alan AMK-koulutus Helsingissä.'
  },

  // DESIGN PROGRAMS
  {
    id: 'graafinen-suunnittelu-aalto',
    name: 'Graafinen suunnittelu',
    institution: 'Aalto-yliopisto',
    institutionType: 'yliopisto',
    field: 'taide',
    minPoints: 92.0,
    maxPoints: 112.0,
    relatedCareers: ['graafinen-suunnittelija', 'visuaalinen-suunnittelija'],
    description: 'Graafisen suunnittelun koulutus, joka valmistaa visuaalisen suunnittelun ammattilaisiksi.'
  },
  {
    id: 'muotoilu-aalto',
    name: 'Muotoilu',
    institution: 'Aalto-yliopisto',
    institutionType: 'yliopisto',
    field: 'taide',
    minPoints: 88.0,
    maxPoints: 108.0,
    relatedCareers: ['muotoilija', 'tuotesuunnittelija'],
    description: 'Muotoilun koulutus, joka yhdistää taiteen ja teknologian.'
  },
  {
    id: 'graafinen-suunnittelu-amk-helsinki',
    name: 'Graafinen suunnittelu',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'taide',
    minPoints: 36.0,
    maxPoints: 66.0,
    relatedCareers: ['graafinen-suunnittelija', 'visuaalinen-suunnittelija'],
    description: 'Graafisen suunnittelun AMK-koulutus.'
  },

  // SOCIAL WORK PROGRAMS
  {
    id: 'sosiaalityo-tampere',
    name: 'Sosiaalityö',
    institution: 'Tampereen yliopisto',
    institutionType: 'yliopisto',
    field: 'yhteiskunta',
    minPoints: 72.0,
    maxPoints: 92.0,
    relatedCareers: ['sosiaalityontekija', 'sosiaaliohjaja'],
    description: 'Sosiaalityön koulutus, joka valmistaa sosiaalialan ammattilaisiksi.'
  },
  {
    id: 'sosiaalityo-amk-helsinki',
    name: 'Sosiaalityö',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'yhteiskunta',
    minPoints: 30.0,
    maxPoints: 60.0,
    relatedCareers: ['sosiaalityontekija', 'sosiaaliohjaja'],
    description: 'Sosiaalityön AMK-koulutus.'
  },
  {
    id: 'sosiaalitieteet-tampere',
    name: 'Sosiaalitieteet',
    institution: 'Tampereen yliopisto',
    institutionType: 'yliopisto',
    field: 'yhteiskunta',
    minPoints: 73.0,
    maxPoints: 93.0,
    relatedCareers: ['sosiaalityontekija', 'sosiaalitutkija'],
    description: 'Sosiaalitieteiden koulutus Tampereella.'
  },

  // NATURAL SCIENCES PROGRAMS
  {
    id: 'biologia-helsinki',
    name: 'Biologia',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'luonnontiede',
    minPoints: 82.0,
    maxPoints: 100.0,
    relatedCareers: ['biologi', 'tutkija', 'ymparistonsuojelun-asiantuntija'],
    description: 'Biologian koulutus, joka valmistaa biologeiksi ja tutkijoiksi.'
  },
  {
    id: 'kemia-helsinki',
    name: 'Kemia',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'luonnontiede',
    minPoints: 80.0,
    maxPoints: 98.0,
    relatedCareers: ['kemiisti', 'tutkija', 'laatuasiantuntija'],
    description: 'Kemian koulutus, joka valmistaa kemiikoiksi ja tutkijoiksi.'
  },
  {
    id: 'fysiikka-helsinki',
    name: 'Fysiikka',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'luonnontiede',
    minPoints: 78.0,
    maxPoints: 96.0,
    relatedCareers: ['fyysikko', 'tutkija', 'insinoori'],
    description: 'Fysiikan koulutus, joka valmistaa fyysikoiksi ja tutkijoiksi.'
  },
  {
    id: 'matematiikka-helsinki',
    name: 'Matematiikka',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'luonnontiede',
    minPoints: 85.0,
    maxPoints: 103.0,
    relatedCareers: ['matemaatikko', 'tutkija', 'aktuaari'],
    description: 'Matematiikan koulutus, joka valmistaa matemaatikoiksi ja tutkijoiksi.'
  },

  // HUMANITIES PROGRAMS
  {
    id: 'historia-helsinki',
    name: 'Historia',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'humanistinen',
    minPoints: 70.0,
    maxPoints: 88.0,
    relatedCareers: ['historioitsija', 'tutkija', 'museoasiantuntija'],
    description: 'Historian koulutus, joka valmistaa historioitsijoiksi ja tutkijoiksi.'
  },
  {
    id: 'filosofia-helsinki',
    name: 'Filosofia',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'humanistinen',
    minPoints: 68.0,
    maxPoints: 86.0,
    relatedCareers: ['filosofi', 'tutkija', 'etiikan-asiantuntija'],
    description: 'Filosofian koulutus, joka valmistaa filosofeiksi ja tutkijoiksi.'
  },
  {
    id: 'kirjallisuus-helsinki',
    name: 'Kirjallisuus',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'humanistinen',
    minPoints: 72.0,
    maxPoints: 90.0,
    relatedCareers: ['kirjailija', 'kriitikko', 'kustannustoimittaja'],
    description: 'Kirjallisuuden koulutus, joka valmistaa kirjallisuuden asiantuntijoiksi.'
  },

  // SPORTS PROGRAMS
  {
    id: 'liikuntatiede-jyvaskyla',
    name: 'Liikuntatiede',
    institution: 'Jyväskylän yliopisto',
    institutionType: 'yliopisto',
    field: 'liikunta',
    minPoints: 75.0,
    maxPoints: 93.0,
    relatedCareers: ['liikuntaneuvoja', 'valmentaja', 'liikuntaterapeutti'],
    description: 'Liikuntatieteen koulutus, joka valmistaa liikunta-alan ammattilaisiksi.'
  },
  {
    id: 'liikunta-amk-helsinki',
    name: 'Liikunta',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'liikunta',
    minPoints: 32.0,
    maxPoints: 62.0,
    relatedCareers: ['liikuntaneuvoja', 'valmentaja'],
    description: 'Liikunnan AMK-koulutus.'
  },

  // AGRICULTURE AND FORESTRY PROGRAMS
  {
    id: 'maatalous-helsinki',
    name: 'Maatalous',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'maatalous',
    minPoints: 65.0,
    maxPoints: 83.0,
    relatedCareers: ['maatalousasiantuntija', 'maatalousinsinoori'],
    description: 'Maatalouden koulutus, joka valmistaa maatalousalan asiantuntijoiksi.'
  },
  {
    id: 'metsatiede-helsinki',
    name: 'Metsätiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'metsatalous',
    minPoints: 68.0,
    maxPoints: 86.0,
    relatedCareers: ['metsainsinoori', 'metsatalousasiantuntija'],
    description: 'Metsätieteen koulutus, joka valmistaa metsäalan asiantuntijoiksi.'
  },
  {
    id: 'maatalous-amk-helsinki',
    name: 'Maatalous',
    institution: 'Helsingin yliopisto (Ruralia)',
    institutionType: 'amk',
    field: 'maatalous',
    minPoints: 28.0,
    maxPoints: 58.0,
    relatedCareers: ['maatalousasiantuntija', 'maatalousinsinoori'],
    description: 'Maatalouden AMK-koulutus.'
  },

  // FOOD SCIENCE PROGRAMS
  {
    id: 'elintarviketiede-helsinki',
    name: 'Elintarviketiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'elintarvike',
    minPoints: 76.0,
    maxPoints: 94.0,
    relatedCareers: ['elintarviketutkija', 'laatuasiantuntija'],
    description: 'Elintarviketieteen koulutus, joka valmistaa elintarvikealan asiantuntijoiksi.'
  },
  {
    id: 'ravitsemustiede-helsinki',
    name: 'Ravitsemustiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'elintarvike',
    minPoints: 74.0,
    maxPoints: 92.0,
    relatedCareers: ['ravitsemusterapeutti', 'ravitsemusasiantuntija'],
    description: 'Ravitsemustieteen koulutus, joka valmistaa ravitsemusalan ammattilaisiksi.'
  },

  // MARITIME PROGRAMS
  {
    id: 'merenkulku-turku',
    name: 'Merenkulku',
    institution: 'Turun ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'merenkulku',
    minPoints: 30.0,
    maxPoints: 60.0,
    relatedCareers: ['merikapteeni', 'merenkulun-insinoori'],
    description: 'Merenkulun AMK-koulutus, joka valmistaa merenkulun ammattilaisiksi.'
  },

  // POLICE PROGRAMS
  {
    id: 'poliisi-polamk',
    name: 'Poliisi',
    institution: 'Poliisiammattikorkeakoulu',
    institutionType: 'amk',
    field: 'turvallisuus',
    minPoints: 42.0,
    maxPoints: 72.0,
    relatedCareers: ['poliisi', 'rikostutkija'],
    description: 'Poliisin koulutus, joka valmistaa poliiseiksi.'
  },

  // MILITARY PROGRAMS
  {
    id: 'maanpuolustus-maa',
    name: 'Maanpuolustus',
    institution: 'Maanpuolustuskorkeakoulu',
    institutionType: 'amk',
    field: 'turvallisuus',
    minPoints: 40.0,
    maxPoints: 70.0,
    relatedCareers: ['upseeri', 'sotilas'],
    description: 'Maanpuolustuksen koulutus, joka valmistaa upseereiksi.'
  },

  // TOURISM PROGRAMS
  {
    id: 'matkailu-amk-helsinki',
    name: 'Matkailu',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'palvelu',
    minPoints: 28.0,
    maxPoints: 58.0,
    relatedCareers: ['matkailuneuvoja', 'hotellityöntekijä'],
    description: 'Matkailun AMK-koulutus, joka valmistaa matkailualan ammattilaisiksi.'
  },
  {
    id: 'hotelli-ja-ravintola-amk-helsinki',
    name: 'Hotelli- ja ravintola',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'palvelu',
    minPoints: 26.0,
    maxPoints: 56.0,
    relatedCareers: ['hotellityöntekijä', 'ravintolapäällikkö'],
    description: 'Hotelli- ja ravintola-alan AMK-koulutus.'
  }
];

/**
 * Get study programs filtered by points range
 */
export function getProgramsByPoints(
  points: number,
  type?: 'yliopisto' | 'amk'
): StudyProgram[] {
  let filtered = studyPrograms;
  
  if (type) {
    filtered = filtered.filter(p => p.institutionType === type);
  }
  
  // Return programs where user has realistic chance (within 30 points of minimum)
  return filtered.filter(program => {
    const minPoints = program.minPoints;
    const maxPoints = program.maxPoints || minPoints + 50;
    return points >= minPoints - 30 && points <= maxPoints + 20;
  });
}

/**
 * Get study programs filtered by career slugs
 */
export function getProgramsByCareers(careerSlugs: string[]): StudyProgram[] {
  return studyPrograms.filter(program => 
    program.relatedCareers.some(careerSlug => careerSlugs.includes(careerSlug))
  );
}

/**
 * Career field mapping for enhanced matching
 * Maps career slugs to their primary fields
 */
const CAREER_FIELD_MAP: Record<string, string[]> = {
  // Technology careers
  'ohjelmistokehittaja': ['teknologia'],
  'tietoturva-asiantuntija': ['teknologia'],
  'tekoalyasiantuntija': ['teknologia'],
  'tietojarjestelma-arkkitehti': ['teknologia'],
  'verkkosuunnittelija': ['teknologia', 'taide'],
  'it-tukihenkilo': ['teknologia'],
  
  // Healthcare careers
  'laakari': ['terveys'],
  'erikoislaakari': ['terveys'],
  'sairaanhoitaja': ['terveys'],
  'terveydenhoitaja': ['terveys'],
  'hammaslaakari': ['terveys'],
  'apteekkari': ['terveys'],
  'farmaseutti': ['terveys'],
  'fysioterapeutti': ['terveys'],
  'bioanalyytikko': ['terveys'],
  'elainlaakari': ['terveys'],
  
  // Business careers
  'liiketalousjohtaja': ['kauppa'],
  'markkinointipäällikkö': ['kauppa', 'media'],
  'yritysneuvoja': ['kauppa'],
  'talousjohtaja': ['kauppa'],
  'kirjanpitaja': ['kauppa'],
  'myyntipäällikkö': ['kauppa'],
  
  // Engineering careers
  'konetekniikan-insinoori': ['tekniikka'],
  'rakennusinsinoori': ['tekniikka', 'rakentaminen'],
  'sahkotekniikan-insinoori': ['tekniikka'],
  'automaatioteknikko': ['tekniikka'],
  'projektipäällikkö': ['tekniikka', 'rakentaminen'],
  
  // Education careers
  'luokanopettaja': ['kasvatus'],
  'aineenopettaja': ['kasvatus'],
  'erityisopettaja': ['kasvatus'],
  'varhaiskasvatuksen-opettaja': ['kasvatus'],
  
  // Other careers
  'psykologi': ['psykologia'],
  'asianajaja': ['oikeus'],
  'graafinen-suunnittelija': ['taide', 'media'],
  'journalisti': ['media'],
  'sosiaalityontekija': ['yhteiskunta'],
};

/**
 * Match study programs to careers with enhanced scoring
 * Includes field-based matching and confidence scoring
 */
export function matchProgramsToCareers(
  programs: StudyProgram[],
  careerSlugs: string[]
): StudyProgram[] {
  // Get fields of recommended careers
  const careerFields = new Set<string>();
  careerSlugs.forEach(slug => {
    const fields = CAREER_FIELD_MAP[slug] || [];
    fields.forEach(field => careerFields.add(field));
  });
  
  // Score programs based on multiple factors
  const scored = programs.map(program => {
    // Direct career match count
    const matchCount = program.relatedCareers.filter(slug => 
      careerSlugs.includes(slug)
    ).length;
    
    // Field-based match bonus
    const fieldMatch = careerFields.has(program.field) ? 0.5 : 0;
    
    // Match ratio (how many of program's careers match)
    const matchRatio = program.relatedCareers.length > 0 
      ? matchCount / program.relatedCareers.length 
      : 0;
    
    // Combined score: direct matches + field bonus + ratio bonus
    const totalScore = matchCount + fieldMatch + (matchRatio * 0.3);
    
    // Confidence level
    let confidence: 'high' | 'medium' | 'low' = 'low';
    if (matchCount >= 2) {
      confidence = 'high';
    } else if (matchCount === 1 || fieldMatch > 0) {
      confidence = 'medium';
    }
    
    return {
      program,
      score: totalScore,
      matchCount,
      fieldMatch: fieldMatch > 0,
      matchRatio,
      confidence
    };
  });
  
  // Sort by total score (descending), then by match count, then by match ratio
  scored.sort((a, b) => {
    if (Math.abs(b.score - a.score) > 0.1) {
      return b.score - a.score;
    }
    if (b.matchCount !== a.matchCount) {
      return b.matchCount - a.matchCount;
    }
    return b.matchRatio - a.matchRatio;
  });
  
  return scored.map(item => item.program);
}

/**
 * Get confidence level for a program match
 */
export function getProgramMatchConfidence(
  program: StudyProgram,
  careerSlugs: string[]
): 'high' | 'medium' | 'low' {
  const matchCount = program.relatedCareers.filter(slug => 
    careerSlugs.includes(slug)
  ).length;
  
  const careerFields = new Set<string>();
  careerSlugs.forEach(slug => {
    const fields = CAREER_FIELD_MAP[slug] || [];
    fields.forEach(field => careerFields.add(field));
  });
  const fieldMatch = careerFields.has(program.field);
  
  if (matchCount >= 2) {
    return 'high';
  } else if (matchCount === 1 || fieldMatch) {
    return 'medium';
  }
  return 'low';
}

/**
 * Get all study programs
 */
export function getAllStudyPrograms(): StudyProgram[] {
  return studyPrograms;
}

/**
 * Get study program by ID
 */
export function getStudyProgramById(id: string): StudyProgram | undefined {
  return studyPrograms.find(p => p.id === id);
}

/**
 * Get study programs by field
 */
export function getProgramsByField(field: string): StudyProgram[] {
  return studyPrograms.filter(p => p.field === field);
}

