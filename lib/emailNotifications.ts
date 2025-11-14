/**
 * Email Notification System
 * Sends alerts and notifications to teachers
 */

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ClassCompletionAlert {
  teacherEmail: string;
  className: string;
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
  classId: string;
}

export interface AtRiskStudentAlert {
  teacherEmail: string;
  className: string;
  studentName: string;
  studentPIN: string;
  reasons: string[];
  classId: string;
}

export interface WeeklySummary {
  teacherEmail: string;
  className: string;
  weekStart: string;
  weekEnd: string;
  totalTests: number;
  completedThisWeek: number;
  atRiskStudents: number;
  topCareers: Array<{ name: string; count: number }>;
  classId: string;
}

/**
 * Generate email HTML for class completion alert
 */
export function generateClassCompletionEmail(data: ClassCompletionAlert): EmailNotification {
  const completionPercent = Math.round(data.completionRate);
  const isComplete = data.completedStudents === data.totalStudents;
  
  const subject = isComplete 
    ? `✅ Kaikki oppilaat ovat suorittaneet testin - ${data.className}`
    : `📊 Testin edistyminen - ${data.className}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .stat-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .stat-number { font-size: 32px; font-weight: bold; color: #2563eb; }
        .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Urakompassi</h1>
          <p>Testin edistymisen ilmoitus</p>
        </div>
        <div class="content">
          <h2>${data.className}</h2>
          
          <div class="stat-box">
            <div class="stat-number">${completionPercent}%</div>
            <p>Testin suorittanut: <strong>${data.completedStudents} / ${data.totalStudents}</strong> oppilasta</p>
          </div>
          
          ${isComplete ? `
            <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>✅ Kaikki oppilaat ovat suorittaneet testin!</strong>
              <p>Voit nyt tarkastella tuloksia ja aloittaa oppilaiden kanssa keskustelut.</p>
            </div>
          ` : `
            <p>${data.totalStudents - data.completedStudents} oppilasta ei ole vielä suorittanut testiä.</p>
          `}
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://urakompassi.com'}/teacher/classes/${data.classId}" class="button">
            Näytä tulokset →
          </a>
          
          <div class="footer">
            <p>Urakompassi - Urapolun löytäminen AI:n avulla</p>
            <p>Tämä on automaattinen ilmoitus. Älä vastaa tähän viestiin.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Urakompassi - Testin edistyminen
${data.className}

Testin suorittanut: ${data.completedStudents} / ${data.totalStudents} oppilasta (${completionPercent}%)

${isComplete ? '✅ Kaikki oppilaat ovat suorittaneet testin!' : `${data.totalStudents - data.completedStudents} oppilasta ei ole vielä suorittanut testiä.`}

Näytä tulokset: ${process.env.NEXT_PUBLIC_APP_URL || 'https://urakompassi.com'}/teacher/classes/${data.classId}
  `;

  return {
    to: data.teacherEmail,
    subject,
    html,
    text
  };
}

/**
 * Generate email HTML for at-risk student alert
 */
export function generateAtRiskStudentEmail(data: AtRiskStudentAlert): EmailNotification {
  const reasonsList = data.reasons.map(r => `• ${r}`).join('\n');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .alert-box { background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .reasons { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Oppilaan tuki tarvitaan</h1>
        </div>
        <div class="content">
          <h2>${data.className}</h2>
          
          <div class="alert-box">
            <h3>Oppilas: ${data.studentName}</h3>
            <p>PIN: ${data.studentPIN}</p>
          </div>
          
          <div class="reasons">
            <h4>Miksi tuki tarvitaan:</h4>
            <pre style="white-space: pre-wrap; font-family: inherit;">${reasonsList}</pre>
          </div>
          
          <p><strong>Suositus:</strong> Ota yhteyttä oppilaaseen ja keskustele hänen kiinnostuksistaan ja tulevaisuudensuunnitelmistaan.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://urakompassi.com'}/teacher/classes/${data.classId}" class="button">
            Näytä oppilaan raportti →
          </a>
          
          <div class="footer">
            <p>Urakompassi - Urapolun löytäminen AI:n avulla</p>
            <p>Tämä on automaattinen ilmoitus. Älä vastaa tähän viestiin.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Urakompassi - Oppilaan tuki tarvitaan
${data.className}

Oppilas: ${data.studentName}
PIN: ${data.studentPIN}

Miksi tuki tarvitaan:
${reasonsList}

Suositus: Ota yhteyttä oppilaaseen ja keskustele hänen kiinnostuksistaan.

Näytä oppilaan raportti: ${process.env.NEXT_PUBLIC_APP_URL || 'https://urakompassi.com'}/teacher/classes/${data.classId}
  `;

  return {
    to: data.teacherEmail,
    subject: `⚠️ Oppilaan tuki tarvitaan - ${data.studentName}`,
    html,
    text
  };
}

/**
 * Generate email HTML for weekly summary
 */
export function generateWeeklySummaryEmail(data: WeeklySummary): EmailNotification {
  const topCareersList = data.topCareers.slice(0, 5).map((c, i) => `${i + 1}. ${c.name} (${c.count} oppilasta)`).join('\n');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .stat-box { background: white; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 28px; font-weight: bold; color: #2563eb; }
        .careers-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Viikon yhteenveto</h1>
          <p>${data.weekStart} - ${data.weekEnd}</p>
        </div>
        <div class="content">
          <h2>${data.className}</h2>
          
          <div class="stat-grid">
            <div class="stat-box">
              <div class="stat-number">${data.totalTests}</div>
              <p>Testejä yhteensä</p>
            </div>
            <div class="stat-box">
              <div class="stat-number">${data.completedThisWeek}</div>
              <p>Suoritettu tällä viikolla</p>
            </div>
            <div class="stat-box">
              <div class="stat-number">${data.atRiskStudents}</div>
              <p>Tukea tarvitsevia</p>
            </div>
            <div class="stat-box">
              <div class="stat-number">${data.topCareers.length > 0 ? data.topCareers[0].count : 0}</div>
              <p>Suosituin ura</p>
            </div>
          </div>
          
          ${data.topCareers.length > 0 ? `
            <div class="careers-list">
              <h3>Yleisimmät ammatit:</h3>
              <pre style="white-space: pre-wrap; font-family: inherit;">${topCareersList}</pre>
            </div>
          ` : ''}
          
          ${data.atRiskStudents > 0 ? `
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>⚠️ ${data.atRiskStudents} oppilasta tarvitsee tukea</strong>
              <p>Tarkista oppilaiden raportit ja ota yhteyttä tarvittaessa.</p>
            </div>
          ` : ''}
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://urakompassi.com'}/teacher/classes/${data.classId}" class="button">
            Näytä kaikki tulokset →
          </a>
          
          <div class="footer">
            <p>Urakompassi - Urapolun löytäminen AI:n avulla</p>
            <p>Tämä on automaattinen viikon yhteenveto. Älä vastaa tähän viestiin.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Urakompassi - Viikon yhteenveto
${data.className}
${data.weekStart} - ${data.weekEnd}

Tilastot:
- Testejä yhteensä: ${data.totalTests}
- Suoritettu tällä viikolla: ${data.completedThisWeek}
- Tukea tarvitsevia: ${data.atRiskStudents}

${data.topCareers.length > 0 ? `Yleisimmät ammatit:\n${topCareersList}` : ''}

${data.atRiskStudents > 0 ? `⚠️ ${data.atRiskStudents} oppilasta tarvitsee tukea. Tarkista oppilaiden raportit.` : ''}

Näytä kaikki tulokset: ${process.env.NEXT_PUBLIC_APP_URL || 'https://urakompassi.com'}/teacher/classes/${data.classId}
  `;

  return {
    to: data.teacherEmail,
    subject: `📊 Viikon yhteenveto - ${data.className}`,
    html,
    text
  };
}

