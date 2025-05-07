const express = require('express');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const docxtemplater = require('docxtemplater');
const path = require('path');
const { format } = require('date-fns');

const app = express();
const port = 8000;

// Helper function to format date
const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd');

// Generate PDF report
const generatePDFReport = (startDate, endDate) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, 'sales_report.pdf');

  doc.pipe(fs.createWriteStream(filePath));

  // Add some content to the PDF
  doc.fontSize(18).text('Sales Report', { align: 'center' });
  doc.fontSize(12).text(`From: ${startDate} To: ${endDate}`, { align: 'center' });
  doc.text('\nSales Data will go here...');

  doc.end();

  return filePath;
};

// Generate DOCX report
const generateDOCXReport = (startDate, endDate) => {
  const doc = new docxtemplater();
  const docTemplate = fs.readFileSync(path.join(__dirname, 'report_template.docx'), 'binary');
  doc.loadZip(docTemplate);

  // Insert dynamic data into the DOCX template
  doc.setData({
    startDate,
    endDate,
    salesData: 'Sales Data Goes Here',  // Replace this with actual sales data
  });

  try {
    doc.render();
  } catch (error) {
    console.error(error);
    return null;
  }

  const buf = doc.getZip().generate({ type: 'nodebuffer' });

  const filePath = path.join(__dirname, 'sales_report.docx');
  fs.writeFileSync(filePath, buf);
  return filePath;
};

// Endpoint to generate and download sales report
app.get('/sales/download', (req, res) => {
  const { start_date, end_date, format } = req.query;

  // Validate the required parameters
  if (!start_date || !end_date || !format) {
    return res.status(400).send('Missing required parameters');
  }

  const formattedStartDate = formatDate(start_date);
  const formattedEndDate = formatDate(end_date);

  let filePath = '';

  if (format === 'pdf') {
    filePath = generatePDFReport(formattedStartDate, formattedEndDate);
  } else if (format === 'docx') {
    filePath = generateDOCXReport(formattedStartDate, formattedEndDate);
  } else {
    return res.status(400).send('Invalid format');
  }

  // Check if the file was generated
  if (!filePath) {
    return res.status(500).send('Error generating the report');
  }

  // Send the generated file as a response
  res.download(filePath, `sales_report.${format}`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error while downloading the report');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://192.168.239.113:${port}`);
});
