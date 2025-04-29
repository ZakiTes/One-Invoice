document.addEventListener('DOMContentLoaded', () => {
    const downloadPdfBtn = document.getElementById('downloadPdf');

    downloadPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    // Set Header Content
    const companyLogo = 'logo.png'; // Replace '...' with your base64 image data for the logo
    const companyName = 'One Day Roofing & Siding Ltd.';
    const address = '122 pineset place NE, Calagary';
    const email = 'habtehani@yahoo.com';
    const phone = '+123 456 7890';
  
    // Header
    const logoX = 10; // X coordinate
    const logoY = 10; // Y coordinate
    const logoWidth = 40; // Wider width
    const logoHeight = 25; // Adjusted height
    doc.addImage(companyLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Add Company Name (centered across top)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const pageWidth = doc.internal.pageSize.width;
    doc.text(companyName, pageWidth / 2, 15, { align: 'center' });

    // Add Contact Details (beneath name, across top)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const detailsY = 22; // Adjust spacing below company name
    doc.text(`${address} | ${email} | ${phone}`, pageWidth / 2, detailsY, {
      align: 'center',
    });

    // Footer Content
    const gstInfo = 'GST Registration Number: 123456789';
    const disclaimer =
      'This is a system-generated invoice. For any discrepancies, contact us immediately.';
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(10);
    doc.text(gstInfo, 10, pageHeight - 20); // Footer GST Info
    doc.text(disclaimer, 10, pageHeight - 15); // Footer Disclaimer

    generateBodyContent(doc);

    // Save PDF
    doc.save('Invoice_Template.pdf'); // File name
  });
});