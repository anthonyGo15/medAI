const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

//  Enviar PDF por correo
router.post('/sendEmail', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).send('Falta el correo del destinatario.');
    }
  
    // Buscar el PDF más reciente en la carpeta "uploads"
    const files = fs.readdirSync(uploadsDir);
    const latestPDF = files.filter(file => file.endsWith('.pdf')).sort((a, b) => {
      return fs.statSync(path.join(uploadsDir, b)).mtime - fs.statSync(path.join(uploadsDir, a)).mtime;
    })[0];
  
    if (!latestPDF) {
      return res.status(404).send('No se encontró un PDF para enviar.');
    }
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    //  Personalizar el contenido del correo
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Diagnóstico Médico - MedAI `,
        text: `Estimado/a Paciente,

    Hemos generado tu reporte de análisis predictivo médico en formato PDF. En el documento adjunto, encontrarás detalles sobre tu cita médica, síntomas analizados y el diagnóstico generado.

    Si tienes alguna duda o necesitas más información, no dudes en contactarnos.

    Atentamente,
    Equipo MedAI
    `,
        attachments: [{ filename: latestPDF, path: path.join(uploadsDir, latestPDF) }],
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send({ message: 'El PDF ha sido enviado correctamente.' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).send('Error al enviar el PDF por correo.');
    }
  });
  
  module.exports = router;