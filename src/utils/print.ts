import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FormData } from '../types/form';

const formatDate = (date: string) => {
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return date;
  }
};

const createPDFTemplate = (formData: FormData, eligibilityResult: any) => {
  const template = document.createElement('div');
  template.style.width = '800px'; // Fixed width for consistent rendering
  template.style.padding = '40px';
  template.style.backgroundColor = '#ffffff';
  template.style.fontFamily = 'Arial, sans-serif';

  template.innerHTML = `
    <div style="max-width: 100%; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px;">
        <h1 style="color: #0ea5e9; margin: 0; font-size: 24px;">Scholarship Application Report</h1>
        <p style="color: #64748b; margin: 10px 0 0 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
        <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Application Code: ${formData.applicationCode || 'N/A'}</p>
      </div>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0 0 15px 0; font-size: 18px;">Personal Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; width: 50%; color: #64748b;">Full Name:</td>
            <td style="padding: 8px; color: #0f172a;">${formData.personalInfo.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #64748b;">Email:</td>
            <td style="padding: 8px; color: #0f172a;">${formData.personalInfo.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #64748b;">Phone:</td>
            <td style="padding: 8px; color: #0f172a;">${formData.personalInfo.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #64748b;">Date of Birth:</td>
            <td style="padding: 8px; color: #0f172a;">${formatDate(formData.personalInfo.dateOfBirth)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #64748b;">Location:</td>
            <td style="padding: 8px; color: #0f172a;">${formData.personalInfo.city}, ${formData.personalInfo.country}</td>
          </tr>
        </table>
      </div>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0 0 15px 0; font-size: 18px;">Education Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; color: #64748b;">Previous Education Level:</td>
            <td style="padding: 8px; color: #0f172a;">${formData.previousEducationLevel.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #64748b;">Future Education Level:</td>
            <td style="padding: 8px; color: #0f172a;">${formData.futureEducationLevel.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #64748b;">Degree Title / Major:</td>
            <td style="padding: 8px; color: #0f172a;">${formData.previousEducation.degree}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #64748b;">University:</td>
            <td style="padding: 8px; color: #0f172a;">${formData.previousEducation.university}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #64748b;">Grade:</td>
            <td style="padding: 8px; color: #0f172a;">${formData.previousEducation.grade} (${formData.previousEducation.gradeType.toUpperCase()})</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #64748b;">Graduation Year:</td>
            <td style="padding: 8px; color: #0f172a;">${formData.previousEducation.graduationYear}</td>
          </tr>
        </table>
      </div>

      ${formData.workExperience?.hasExperience ? `
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0 0 15px 0; font-size: 18px;">Work Experience</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; color: #64748b;">Years of Experience:</td>
              <td style="padding: 8px; color: #0f172a;">${formData.workExperience.years} years</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #64748b;">Details:</td>
              <td style="padding: 8px; color: #0f172a;">${formData.workExperience.details}</td>
            </tr>
          </table>
        </div>
      ` : ''}

      <div style="background: ${eligibilityResult.eligible ? '#f0fdf4' : '#fef2f2'}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0 0 15px 0; font-size: 18px;">Eligibility Results</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: 600; color: ${eligibilityResult.eligible ? '#166534' : '#991b1b'};">
              ${eligibilityResult.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
            </td>
          </tr>
          ${eligibilityResult.eligible ? `
            <tr>
              <td style="padding: 8px; color: #64748b;">Scholarship Type:</td>
              <td style="padding: 8px; color: #0f172a;">${eligibilityResult.type}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #64748b;">Success Chance:</td>
              <td style="padding: 8px; color: #0f172a;">${eligibilityResult.chance}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #64748b;">Eligible Countries:</td>
              <td style="padding: 8px; color: #0f172a;">${eligibilityResult.countries?.join(', ')}</td>
            </tr>
          ` : `
            <tr>
              <td style="padding: 8px; color: #991b1b;">${eligibilityResult.message}</td>
            </tr>
          `}
        </table>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; color: #64748b; font-size: 12px;">
          This report was generated by OC Global Consultancy Scholarship System
        </p>
      </div>
    </div>
  `;

  return template;
};

export const generatePDF = async (formData: FormData, eligibilityResult: any) => {
  const template = createPDFTemplate(formData, eligibilityResult);
  document.body.appendChild(template);
  
  try {
    const canvas = await html2canvas(template, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: 800,
      width: 800,
      height: template.offsetHeight
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // If content is longer than one page, create multiple pages
    const maxHeight = pdf.internal.pageSize.getHeight();
    if (pdfHeight > maxHeight) {
      let remainingHeight = pdfHeight;
      let currentPosition = 0;
      let pageNumber = 1;
      
      while (remainingHeight > 0) {
        // Add new page if not first page
        if (pageNumber > 1) {
          pdf.addPage();
        }
        
        const currentHeight = Math.min(maxHeight, remainingHeight);
        pdf.addImage(
          imgData,
          'PNG',
          0,
          pageNumber === 1 ? 0 : -currentPosition,
          pdfWidth,
          pdfHeight
        );
        
        remainingHeight -= maxHeight;
        currentPosition += maxHeight;
        pageNumber++;
      }
    } else {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    
    pdf.save(`scholarship-application-${formData.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  } finally {
    document.body.removeChild(template);
  }
};