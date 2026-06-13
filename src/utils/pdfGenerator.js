import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Captures virtual sheets and compiles them into a high-fidelity, crisp PDF.
 * Aligns layouts to standard A4 printing constraints.
 */
export const generatePDF = async (containerClassName = 'virtual-sheet', fileName = 'my-resume.pdf') => {
  // Prevent screen shifting or scrollbar clipping during capture
  document.body.classList.add('pdf-capturing');

  const pageElements = document.getElementsByClassName(containerClassName);
  
  if (!pageElements || pageElements.length === 0) {
    document.body.classList.remove('pdf-capturing');
    throw new Error('No resume page sheets found to download.');
  }

  // Create standard portrait A4 page
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true // Minimizes download size without losing text sharpness
  });
  
  const pdfWidth = 210;  // Standard A4 width in mm
  const pdfHeight = 297; // Standard A4 height in mm

  // Detect and temporarily suspend parent CSS transformations (e.g., zoom scaling)
  // to prevent html2canvas from capturing off-center or pixelated sections.
  const suspendedParents = [];
  try {
    Array.from(pageElements).forEach((el) => {
      let parent = el.parentElement;
      while (parent) {
        if (parent.style && (parent.style.transform || parent.style.transition)) {
          suspendedParents.push({
            element: parent,
            originalTransform: parent.style.transform,
            originalTransition: parent.style.transition
          });
          // Clear active scale/transition properties during render capture
          parent.style.transform = 'none';
          parent.style.transition = 'none';
        }
        parent = parent.parentElement;
      }
    });

    const options = {
      scale: 2.2, // Balanced crisp text scaling that prevents memory crashes
      useCORS: true, // Captures external images seamlessly
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0
    };

    for (let i = 0; i < pageElements.length; i++) {
      const pageEl = pageElements[i];

      // Ensure colors, borders, and custom background shapes print exactly as displayed
      pageEl.style.printColorAdjust = 'exact';
      pageEl.style.webkitPrintColorAdjust = 'exact';

      const canvas = await html2canvas(pageEl, options);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage();
      }

      // Fill page boundaries perfectly to prevent white margins or alignment slips
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  } finally {
    // Restore parent CSS transformations immediately after canvas processing completes
    suspendedParents.forEach((item) => {
      item.element.style.transform = item.originalTransform;
      item.element.style.transition = item.originalTransition;
    });
    
    document.body.classList.remove('pdf-capturing');
  }
};