/**
 * Conversation Starters Generator
 * Generates talking points and questions for teachers to use with students
 */

export interface StudentProfile {
  name: string;
  topCareers: Array<{ title: string; score?: number }>;
  dimensions: {
    interests: number;
    values: number;
    workstyle: number;
    context: number;
  };
  educationPath?: {
    primary: string;
    score?: number;
  };
  cohort?: string;
  profile?: string;
}

export interface ConversationStarter {
  category: string;
  questions: string[];
  talkingPoints: string[];
  actionItems: string[];
}

/**
 * Generate conversation starters based on student profile
 */
export function generateConversationStarters(profile: StudentProfile): ConversationStarter {
  const { topCareers, dimensions, educationPath, cohort } = profile;
  
  const questions: string[] = [];
  const talkingPoints: string[] = [];
  const actionItems: string[] = [];

  // Career-focused questions
  if (topCareers.length > 0) {
    const topCareer = topCareers[0];
    questions.push(
      `Mikä ${topCareer.title} -ammatissa kiinnostaa sinua eniten?`,
      `Oletko ajatellut miten ${topCareer.title} -ura voisi sopia sinulle?`,
      `Mitä tiedät ${topCareer.title} -ammatista? Oletko harkinnut sitä ennen?`
    );
    
    talkingPoints.push(
      `Testin mukaan ${topCareer.title} sopii sinulle hyvin (${Math.round((topCareer.score || 0) * 100)}% yhteensopivuus)`,
      `Jos haluat tutustua ${topCareer.title} -uraan tarkemmin, voimme etsiä yhdessä lisätietoa`
    );
    
    actionItems.push(
      `Tutustu ${topCareer.title} -ammattiin tarkemmin`,
      `Keskustele oppilaiden kanssa heidän kokemuksistaan`
    );

    // If multiple top careers
    if (topCareers.length > 1) {
      questions.push(
        `Oletko kiinnostunut myös ${topCareers[1].title} tai ${topCareers[2]?.title || 'muista'}-uraista?`,
        `Mitä eroa näet näiden ammattien välillä?`
      );
    }
  }

  // Dimension-based questions
  if (dimensions.interests > 70) {
    questions.push(
      `Mitä aiheita tai aihealueita kiinnostavat sinua eniten?`,
      `Missä olet havainnut olevasi erityisen kiinnostunut?`
    );
    talkingPoints.push(
      `Sinulla on selkeät kiinnostukset, mikä on hyvä lähtökohta urapolun suunnittelulle`
    );
  } else if (dimensions.interests < 50) {
    questions.push(
      `Mitä harrastuksia tai aktiviteetteja nautit vapaa-ajallasi?`,
      `Onko sinulla jokin aihe, jota haluaisit tutkia tarkemmin?`
    );
    talkingPoints.push(
      `Yhdessä voimme löytää sinulle kiinnostavia aihealueita ja urasuuntia`
    );
    actionItems.push(
      `Etsi yhdessä oppilaan kanssa erilaisia aktiviteetteja ja kiinnostuksen kohteita`,
      `Keskustele oppilaan kanssa hänen harrastuksistaan ja kiinnostuksista`
    );
  }

  if (dimensions.values > 70) {
    questions.push(
      `Mitä arvoja koet tärkeimmiksi elämässäsi?`,
      `Mikä työssä on sinulle tärkeintä - palkka, merkityksellisyys vai jotain muuta?`
    );
    talkingPoints.push(
      `Sinulla on selkeät arvot, jotka ohjaavat valintojasi. Tämä auttaa löytämään merkityksellisen uran`
    );
  }

  if (dimensions.workstyle > 70) {
    questions.push(
      `Pidätkö enemmän käytännön työstä vai teoreettisesta oppimisesta?`,
      `Miten haluaisit oppia uutta?`
    );
    talkingPoints.push(
      `Sinä olet käytännönläheinen oppija - tämä sopii hyvin moniin ammatteihin`
    );
  } else if (dimensions.workstyle < 50) {
    questions.push(
      `Mitä mieltä olet teoreettisesta oppimisesta?`,
      `Sopisiko sinulle lukio tai akateeminen ura?`
    );
    talkingPoints.push(
      `Sinulla on taipumus teoreettiseen oppimiseen - tämä avaa mahdollisuudet korkeakouluun`
    );
  }

  // Education path questions (for YLA)
  if (cohort === 'YLA' && educationPath) {
    const pathNames: Record<string, string> = {
      'lukio': 'Lukio',
      'ammattikoulu': 'Ammattikoulu',
      'kansanopisto': 'Kansanopisto'
    };
    const pathName = pathNames[educationPath.primary] || educationPath.primary;
    
    questions.push(
      `Mitä ajatuksia sinulla on lukiosta/ammattikoulusta/kansanopistosta?`,
      `Mikä kiinnostaa sinua eniten toisessa asteessa?`,
      `Oletko ajatellut, mitä haluaisit opiskella seuraavaksi?`
    );
    
    talkingPoints.push(
      `Testin mukaan ${pathName} voisi sopia sinulle hyvin`,
      `Voimme keskustella ${pathName === 'Lukio' ? 'lukion' : pathName === 'Ammattikoulu' ? 'ammattikoulun' : 'kansanopiston'} vaihtoehdoista ja mahdollisuuksista`
    );
    
    actionItems.push(
      `Tutustu ${pathName.toLowerCase()}n tarjontaan`,
      `Keskustele oppilaan kanssa hänen tulevaisuudensuunnitelmistaan`,
      `Tutustu yhdessä oppilaan kanssa eri koulutusohjelmiin`
    );
  }

  // General guidance questions
  questions.push(
    `Mitä ajatuksia sinulla on omasta tulevaisuudestasi?`,
    `Miten kuvittelet olevasi 5 vuoden päästä?`,
    `Mikä on sinulle tärkeintä työssä?`
  );

  // Action items based on profile
  if (dimensions.interests < 50 && dimensions.values < 50) {
    actionItems.push(
      `Auttaa oppilasta löytämään kiinnostuksen kohteita`,
      `Keskustele oppilaan kanssa hänen harrastuksistaan ja kiinnostuksista`,
      `Etsi yhdessä mahdollisuuksia kokeilla uusia asioita`
    );
  }

  // Check for at-risk indicators
  const avgScore = (dimensions.interests + dimensions.values + dimensions.workstyle + dimensions.context) / 4;
  if (avgScore < 50) {
    talkingPoints.push(
      `Voimme yhdessä löytää sinulle sopivia urasuuntia ja kiinnostuksen kohteita`,
      `On täysin normaalia, että kaikki eivät vielä tiedä mitä haluavat tehdä`
    );
    actionItems.push(
      `Seuraa oppilaan kehitystä ja tarjoa tukea tarvittaessa`,
      `Keskustele oppilaan kanssa säännöllisesti`
    );
  }

  return {
    category: topCareers.length > 0 ? topCareers[0].title : 'Yleinen ohjaus',
    questions: questions.slice(0, 8), // Limit to top 8
    talkingPoints,
    actionItems: actionItems.slice(0, 5) // Limit to top 5
  };
}

/**
 * Generate parent meeting talking points
 */
export function generateParentMeetingTalkingPoints(profile: StudentProfile): string[] {
  const { topCareers, dimensions, educationPath, cohort } = profile;
  const points: string[] = [];

  if (topCareers.length > 0) {
    const topCareer = topCareers[0];
    points.push(
      `${profile.name}:n testin mukaan ${topCareer.title} sopii hänelle hyvin (${Math.round((topCareer.score || 0) * 100)}% yhteensopivuus)`,
      `Testi näyttää, että ${profile.name} on kiinnostunut useista eri uravalinnoista, mikä on hyvä merkki`
    );
  }

  if (dimensions.interests > 60) {
    points.push(
      `${profile.name}:lla on selkeät kiinnostukset, mikä auttaa urapolun suunnittelussa`
    );
  }

  if (cohort === 'YLA' && educationPath) {
    const pathNames: Record<string, string> = {
      'lukio': 'Lukio',
      'ammattikoulu': 'Ammattikoulu',
      'kansanopisto': 'Kansanopisto'
    };
    const pathName = pathNames[educationPath.primary] || educationPath.primary;
    points.push(
      `Testin mukaan ${pathName} voisi sopia ${profile.name}:lle hyvin`,
      `Suosittelemme keskustelemaan ${pathName.toLowerCase()}n vaihtoehdoista`
    );
  }

  const avgScore = (dimensions.interests + dimensions.values + dimensions.workstyle + dimensions.context) / 4;
  if (avgScore < 50) {
    points.push(
      `${profile.name} tarvitsee vielä tukea kiinnostuksen kohteiden löytämisessä - tämä on täysin normaalia`,
      `Voimme yhdessä auttaa ${profile.name}a löytämään sopivia urasuuntia`
    );
  }

  points.push(
    `Voimme jatkaa keskustelua tulevaisuudensuunnitelmista ja tarjota tukea tarvittaessa`
  );

  return points;
}

