const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 📌 Generar y guardar el PDF con un diseño aún más profesional
router.post('/sendPdf', async (req, res) => {
  
  const { paciente, fecha, hora, edad, celular, email, sintomas, sexo, doctor, notas } = req.body;
  
  if (!paciente || !fecha || !hora) {
    return res.status(400).send('Faltan datos para generar el PDF.');
  }

  const pdfPath = path.join(uploadsDir, `${paciente}_${Date.now()}.pdf`);
  const doc = new PDFDocument({ margin: 50 });

  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // 📌 Agregar logo si existe
  const logoPath = path.join(__dirname, '../frontend/assets/logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 220, 30, { width: 150 }).moveDown(1);
  }

  // 📌 Encabezado con título estilizado
  doc
    .font('Helvetica-Bold')
    .fontSize(22)
    .fillColor('#0047AB')
    .text('Reporte Médico', { align: 'center' })
    .moveDown(1);

  // 📌 Línea divisoria más elegante
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor('#0047AB')
    .lineWidth(2)
    .stroke()
    .moveDown(2);

  // 📌 Tabla de Información del Paciente
  doc
    .fontSize(14)
    .fillColor('#000000')
    .text('Datos del Paciente', { underline: true })
    .moveDown(1)
    .fontSize(12);

  const patientInfo = [
    ['Nombre:', paciente],
    ['Fecha:', fecha],
    ['Hora:', hora],
    ['Edad:', `${edad} años`],
    ['Email:', email],
    ['Celular:', celular],
    ['Sexo:', sexo || 'No especificado']
  ];

  patientInfo.forEach(([label, value]) => {
    doc
      .font('Helvetica-Bold')
      .text(label, { continued: true })
      .font('Helvetica')
      .text(` ${value}`)
      .moveDown(0.3);
  });

  doc.moveDown(1);

  // 📌 Línea divisoria más elegante
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor('#CCCCCC')
    .lineWidth(1)
    .stroke()
    .moveDown(2);

  // 📌 Diagnóstico Médico con estilo mejorado
  doc
    .fontSize(14)
    .fillColor('#000000')
    .text('Diagnóstico Médico', { underline: true })
    .moveDown(1)
    .fontSize(12);

  const diagnosisInfo = [
    ['Síntomas:', sintomas || 'No especificados'],
    ['Doctor:', doctor || 'No especificado'],
    ['Notas:', notas || 'No especificadas']
  ];

  diagnosisInfo.forEach(([label, value]) => {
    doc
      .font('Helvetica-Bold')
      .text(label, { continued: true })
      .font('Helvetica')
      .text(` ${value}`)
      .moveDown(0.3);
  });

  doc.moveDown(2);

  // 📌 Pie de página mejorado con información del sistema
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor('#0047AB')
    .lineWidth(1)
    .stroke()
    .moveDown(1);

  doc
    .fontSize(10)
    .fillColor('gray')
    .text('Este reporte ha sido generado automáticamente por el sistema MedAI.', { align: 'center' })
    .moveDown(0.5)
    .text('Fecha de emisión: ' + new Date().toLocaleDateString(), { align: 'center' });

  doc.end();

  writeStream.on('finish', () => {
    console.log(`PDF generado en: ${pdfPath}`);
    res.status(200).send({ message: 'PDF generado y guardado correctamente.', pdfPath });
  });

  writeStream.on('error', (err) => {
    console.error('❌ Error al guardar el PDF:', err);
    res.status(500).send('Error al generar o guardar el PDF.');
  });
});

module.exports = router;
