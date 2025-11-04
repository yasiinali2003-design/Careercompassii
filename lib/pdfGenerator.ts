/**
 * PDF Generation Utilities
 * Generates professional PDF reports for students and classes
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface StudentReportData {
  name: string;
  pin: string;
  date: string;
  className: string;
  cohort?: string;
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
  profile?: string;
}

export interface ClassSummaryData {
  className: string;
  date: string;
  totalTests: number;
  topCareers: Array<{ name: string; count: number }>;
  educationPathDistribution: {
    lukio: number;
    ammattikoulu: number;
    kansanopisto: number;
  };
  dimensionAverages: {
    interests: number;
    values: number;
    workstyle: number;
    context: number;
  };
  cohortDistribution: Record<string, number>;
}

/**
 * Generate a professional PDF report for a single student
 */
export async function generateStudentPDF(data: StudentReportData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Header with logo/company name
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Blue color
  doc.setFont('helvetica', 'bold');
  doc.text('CareerCompassi', margin, yPos);
  
  yPos += 8;
  doc.setFontSize(14);
  doc.setTextColor(75, 85, 99); // Gray color
  doc.setFont('helvetica', 'normal');
  doc.text('Oppilaan Uraprofiili', margin, yPos);
  
  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Student Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Oppilaan tiedot:', margin, yPos);
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nimi: ${data.name || '—'}`, margin, yPos);
  yPos += 5;
  doc.text(`PIN: ${data.pin}`, margin, yPos);
  yPos += 5;
  doc.text(`Päivämäärä: ${data.date}`, margin, yPos);
  yPos += 5;
  doc.text(`Luokka: ${data.className}`, margin, yPos);
  if (data.cohort) {
    yPos += 5;
    doc.text(`Kohortti: ${data.cohort}`, margin, yPos);
  }
  yPos += 8;

  // Top Careers
  if (data.topCareers.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Suosituimmat urat:', margin, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.topCareers.slice(0, 5).forEach((career, index) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }
      const scoreText = typeof career.score === 'number' ? ` (${Math.round(career.score * 100)}%)` : '';
      doc.text(`${index + 1}. ${career.title}${scoreText}`, margin + 5, yPos);
      yPos += 5;
    });
    yPos += 5;
  }

  // Education Path (for YLA)
  if (data.educationPath && data.cohort === 'YLA') {
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Koulutuspolkusuositus:', margin, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const pathNames: Record<string, string> = {
      'lukio': 'Lukio',
      'ammattikoulu': 'Ammattikoulu',
      'kansanopisto': 'Kansanopisto'
    };
    const pathName = pathNames[data.educationPath.primary] || data.educationPath.primary;
    const scoreText = data.educationPath.score ? ` (${Math.round(data.educationPath.score)}%)` : '';
    doc.text(`${pathName}${scoreText}`, margin + 5, yPos);
    yPos += 8;
  }

  // Dimensions
  if (yPos > pageHeight - 30) {
    doc.addPage();
    yPos = margin;
  }
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Personaaliset dimensiot:', margin, yPos);
  yPos += 7;

  const dimensions = [
    { label: 'Kiinnostukset', value: data.dimensions.interests },
    { label: 'Arvot', value: data.dimensions.values },
    { label: 'Työtapa', value: data.dimensions.workstyle },
    { label: 'Konteksti', value: data.dimensions.context }
  ];

  dimensions.forEach((dim) => {
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${dim.label}:`, margin + 5, yPos);
    doc.text(`${Math.round(dim.value)}%`, pageWidth - margin - 20, yPos);
    
    // Draw progress bar
    const barWidth = contentWidth - 30;
    const barHeight = 4;
    const fillWidth = (barWidth * dim.value) / 100;
    
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(200, 200, 200);
    doc.rect(margin + 5, yPos - 3, barWidth, barHeight, 'FD');
    
    doc.setFillColor(37, 99, 235); // Blue fill
    doc.rect(margin + 5, yPos - 3, fillWidth, barHeight, 'F');
    
    yPos += 8;
  });

  // Profile summary if available
  if (data.profile && yPos < pageHeight - 30) {
    yPos += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Profiiliyhteenveto:', margin, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const profileLines = doc.splitTextToSize(data.profile, contentWidth - 10);
    doc.text(profileLines, margin + 5, yPos);
    yPos += profileLines.length * 5 + 5;
  }

  // Footer
  const footerY = pageHeight - 10;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'italic');
  doc.text('CareerCompassi - Urapolun löytäminen AI:n avulla', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Luotu: ${new Date().toLocaleDateString('fi-FI')}`, pageWidth / 2, footerY + 5, { align: 'center' });

  return doc.output('blob');
}

/**
 * Generate a professional PDF report for class summary
 */
export async function generateClassSummaryPDF(data: ClassSummaryData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.text('CareerCompassi', margin, yPos);
  
  yPos += 8;
  doc.setFontSize(14);
  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'normal');
  doc.text('Luokan Yhteenveto', margin, yPos);
  
  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Class Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Luokan tiedot:', margin, yPos);
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Luokka: ${data.className}`, margin, yPos);
  yPos += 5;
  doc.text(`Päivämäärä: ${data.date}`, margin, yPos);
  yPos += 5;
  doc.text(`Testejä yhteensä: ${data.totalTests}`, margin, yPos);
  yPos += 8;

  // Top Careers
  if (data.topCareers.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Yleisimmät ammatit:', margin, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.topCareers.slice(0, 10).forEach((career, index) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(`${index + 1}. ${career.name} (${career.count} oppilasta)`, margin + 5, yPos);
      yPos += 5;
    });
    yPos += 5;
  }

  // Education Path Distribution
  const totalYLA = data.educationPathDistribution.lukio + 
                   data.educationPathDistribution.ammattikoulu + 
                   data.educationPathDistribution.kansanopisto;
  
  if (totalYLA > 0) {
    if (yPos > pageHeight - 25) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Koulutuspolut (YLA):', margin, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Lukio: ${data.educationPathDistribution.lukio} oppilasta`, margin + 5, yPos);
    yPos += 5;
    doc.text(`Ammattikoulu: ${data.educationPathDistribution.ammattikoulu} oppilasta`, margin + 5, yPos);
    yPos += 5;
    doc.text(`Kansanopisto: ${data.educationPathDistribution.kansanopisto} oppilasta`, margin + 5, yPos);
    yPos += 8;
  }

  // Dimension Averages
  if (yPos > pageHeight - 35) {
    doc.addPage();
    yPos = margin;
  }
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Luokan keskimääräiset dimensiot:', margin, yPos);
  yPos += 7;

  const dimensions = [
    { label: 'Kiinnostukset', value: data.dimensionAverages.interests },
    { label: 'Arvot', value: data.dimensionAverages.values },
    { label: 'Työtapa', value: data.dimensionAverages.workstyle },
    { label: 'Konteksti', value: data.dimensionAverages.context }
  ];

  dimensions.forEach((dim) => {
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${dim.label}:`, margin + 5, yPos);
    doc.text(`${Math.round(dim.value)}%`, pageWidth - margin - 20, yPos);
    
    // Draw progress bar
    const barWidth = contentWidth - 30;
    const barHeight = 4;
    const fillWidth = (barWidth * dim.value) / 100;
    
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(200, 200, 200);
    doc.rect(margin + 5, yPos - 3, barWidth, barHeight, 'FD');
    
    doc.setFillColor(37, 99, 235);
    doc.rect(margin + 5, yPos - 3, fillWidth, barHeight, 'F');
    
    yPos += 8;
  });

  // Cohort Distribution
  if (Object.keys(data.cohortDistribution).length > 0) {
    if (yPos > pageHeight - 25) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Kohorttijakauma:', margin, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    Object.entries(data.cohortDistribution).forEach(([cohort, count]) => {
      doc.text(`${cohort}: ${count} oppilasta`, margin + 5, yPos);
      yPos += 5;
    });
  }

  // Footer
  const footerY = pageHeight - 10;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'italic');
  doc.text('CareerCompassi - Urapolun löytäminen AI:n avulla', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Luotu: ${new Date().toLocaleDateString('fi-FI')}`, pageWidth / 2, footerY + 5, { align: 'center' });

  return doc.output('blob');
}

/**
 * Download PDF helper
 */
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

