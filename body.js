document.addEventListener('DOMContentLoaded', () => {
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const addItemBtn = document.querySelector('.addItemBtn');
    const itemContainer = document.getElementById('itemContainer');
  
    // Function to add a new item row with its own Add and Remove buttons
function addItemRow() {
  const newItemRow = document.createElement('div');
  newItemRow.classList.add('itemRow');
  newItemRow.innerHTML = `
    <input type="text" name="itemDescription[]" placeholder="Item Description" required>
    <input type="number" name="itemQuantity[]" placeholder="Quantity" required>
    <input type="number" name="itemPrice[]" placeholder="Price" required>
    <button type="button" class="removeItemBtn">Remove</button>
    <button type="button" class="addItemBtn">Add Item</button>
  `;
  itemContainer.appendChild(newItemRow);

  // Add event listener for the remove button
  const removeItemBtn = newItemRow.querySelector('.removeItemBtn');
  removeItemBtn.addEventListener('click', () => {
    newItemRow.remove();
  });

  // Add event listener for the add button inside the new row
  const newAddItemBtn = newItemRow.querySelector('.addItemBtn');
  newAddItemBtn.addEventListener('click', addItemRow);

  // Scroll to the newly added row
  newItemRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// Initially set the add button event listener for the first item row
//const addItemBtn = document.querySelector('.addItemBtn'); 
addItemBtn.addEventListener('click', addItemRow);


        // Format phone number function
        function formatPhoneNumber(phoneNumber) {
          // Remove all non-numeric characters
          const cleaned = phoneNumber.replace(/\D/g, '');
          
          // Check if the cleaned number has the correct length (10 digits for a US phone number)
          if (cleaned.length <= 10) {
              const match = cleaned.match(/(\d{3})(\d{3})(\d{4})/);
              if (match) {
                  return `(${match[1]}) ${match[2]}-${match[3]}`;
              }
          }
          return phoneNumber; // Return the unformatted phone number if it doesn't match the expected format
      }
  
      // Format phone number as user types
      const customerPhoneInput = document.getElementById('customerPhone');
      customerPhoneInput.addEventListener('input', () => {
          customerPhoneInput.value = formatPhoneNumber(customerPhoneInput.value);
      });
  
    // Generate PDF functionality
    generatePdfBtn.addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
  
      // Get form data
      const customerName = document.getElementById('customerName').value;
      const customerAddress = document.getElementById('customerAddress').value;
      const customerEmail = document.getElementById('customerEmail').value;
      const customerPhone = document.getElementById('customerPhone').value;
      const invoiceNumber = document.getElementById('invoiceNumber').value;
      const items = document.querySelectorAll('.itemRow');
  
      // Generate dynamic date and invoice number
      const today = new Date().toLocaleDateString();
  
      // Header (Logo + Company Details)
      const logo = '/logo.png'; // Adjust path as needed
      doc.addImage(logo, 'PNG', 10, 10, 40, 25); // Logo
      doc.setFontSize(16).setFont('helvetica', 'bold');
      doc.text('One Day Roofing & Siding Ltd.', 60, 15);
      doc.setFontSize(10).setFont('helvetica', 'normal');
      doc.text('122 Pineset Place NE, Calgary | habtehani@yahoo.com | +1-403-971-9075', 60, 22);
  
      // Invoice Metadata
      doc.setFontSize(12).setFont('helvetica', 'bold');
      const pageWidth = doc.internal.pageSize.width;
      doc.text(`Invoice Number: ${invoiceNumber}`,pageWidth - 50, 50); // Invoice Number
      doc.text(`Date: ${today}`, pageWidth - 50, 60); // Date on the right
  
      // Customer Information
      doc.setFontSize(12).setFont('helvetica', 'bold');
      doc.text('Customer Info:', 10, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${customerName}`, 10, 67);
      doc.text(`Address: ${customerAddress}`, 10, 74);
      doc.text(`Email: ${customerEmail}`, 10, 81);
      doc.text(`Phone: ${customerPhone}`, 10, 88);
  
      // Table Header
      let yPos = 110;
      doc.setFontSize(12).setFont('helvetica', 'bold');
      doc.text('Description', 10, yPos);
      doc.text('Quantity', 100, yPos, { align: 'right' });
      doc.text('Price', 150, yPos, { align: 'right' });
      doc.text('Total', 190, yPos, { align: 'right' });
  
      // Table Rows
      yPos += 7;
      doc.setFontSize(10).setFont('helvetica', 'normal');
      let totalWithoutGST = 0;
      items.forEach((item) => {
        const description = item.querySelector('input[name="itemDescription[]"]').value;
        const quantity = parseInt(item.querySelector('input[name="itemQuantity[]"]').value) || 0;
        const price = parseFloat(item.querySelector('input[name="itemPrice[]"]').value) || 0;
        const total = quantity * price;
        totalWithoutGST += total;
  
        doc.text(description, 10, yPos);
        doc.text(quantity.toString(), 100, yPos, { align: 'right' });
        doc.text(price.toFixed(2), 150, yPos, { align: 'right' });
        doc.text(total.toFixed(2), 190, yPos, { align: 'right' });
  
        yPos += 7;
        if (yPos > 270) {
          doc.addPage();
          yPos = 10;
        }
      });

      // Check if there’s enough space for the subtotal, GST, and total
function checkAndAddPage(doc, yPos) {
  if (yPos > 270) { // Check if the position is beyond the bottom of the page
      doc.addPage();
      yPos = 10; // Reset y position to the top of the new page
  }
  return yPos;
}
  
      // GST and Totals
      let gst = totalWithoutGST * 0.05;
let totalWithGST = totalWithoutGST + gst;

doc.setFontSize(12).setFont('helvetica', 'bold');

// Check space before adding totals
yPos = checkAndAddPage(doc, yPos);

doc.text('Subtotal:', 150, yPos, { align: 'right' });
doc.text(totalWithoutGST.toFixed(2), 190, yPos, { align: 'right' });

yPos += 7;
yPos = checkAndAddPage(doc, yPos); // Check again if there's enough space

doc.text('GST (5%):', 150, yPos, { align: 'right' });
doc.text(gst.toFixed(2), 190, yPos, { align: 'right' });

yPos += 7;
yPos = checkAndAddPage(doc, yPos); // Check once more before final total

doc.text('Total:', 150, yPos, { align: 'right' });
doc.text(totalWithGST.toFixed(2), 190, yPos, { align: 'right' });


      // Footer Positioning
const pageHeight = doc.internal.pageSize.height; // Get page height
const footerHeight = 20; // Approximate footer height in units
const minYPosition = pageHeight - footerHeight; // Bottom margin

if (yPos < minYPosition) {
  yPos = minYPosition; // Adjust to bottom of the page
} else {
  doc.addPage();
  yPos = minYPosition;
}
  
      // Footer
      //yPos += 100;
      doc.setFontSize(10).setFont('helvetica', 'normal');
      doc.text('GST Registration Number: 789224904RT0001', 10, yPos);
      yPos += 5;
      doc.text('We appreciate your business. Please direct any inquiries about this invoice to habtehani@yahoo.com / +1-403-971-9075.', 10, yPos);
  
      // Open in Browser
      window.open(doc.output('bloburl'), '_blank');
    });
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  