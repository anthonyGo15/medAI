const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');

require('dotenv').config(); // Importar variables de entorno
const twilio = require('twilio'); // Importar Twilio

// Configurar Twilio con las credenciales
const accountSid = process.env.TWILIO_ACCOUNT_SID; // SID de tu cuenta Twilio
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Token de autenticación
const client = twilio(accountSid, authToken);
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER; // Número de Twilio

// Obtener todas las citas
router.get('/', async (req, res) => {
  try {
    const citas = await Cita.find();
    res.json(citas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Crear una nueva cita y enviar notificación por SMS
router.post('/', async (req, res) => {
  const { fecha, hora, paciente, edad, celular, email, sintomas, doctor, notas } = req.body;
  const nuevaCita = new Cita({ fecha, hora, paciente, edad, celular, email, sintomas, doctor, notas });

  try {
    const citaGuardada = await nuevaCita.save();
    
    // Enviar SMS usando Twilio
    const messageBody = `
      Hola ${paciente}, su cita ha sido programada.
      Fecha: ${fecha}
      Hora: ${hora}
      Doctor: ${doctor}
      ¡Gracias por confiar en MedAI!
    `;

    await client.messages.create({
      body: messageBody,
      from: TWILIO_PHONE_NUMBER, // Tu número de Twilio
      to: celular, // Número del paciente
    });

    console.log('SMS enviado correctamente.');
    

    res.status(201).json(citaGuardada);
  } catch (err) {
    console.error('Error al registrar la cita o enviar el SMS:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Actualizar una cita
router.put('/:id', async (req, res) => {
  try {
    const citaActualizada = await Cita.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(citaActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar una cita
router.delete('/:id', async (req, res) => {
  try {
    await Cita.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cita eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener horarios ocupados en una fecha específica
router.get('/horarios-ocupados', async (req, res) => {
  const { fecha } = req.query;

  try {
    console.log('Fecha recibida:', fecha);
    const citas = await Cita.find({ fecha });
    // console.log('Citas encontradas:', citas);
    const horariosOcupados = citas.map((cita) => cita.hora);
    // console.log('Horarios ocupados:', horariosOcupados);
    res.json(horariosOcupados);
  } catch (err) {
    // console.error('Error al obtener los horarios ocupados:', err);
    res.status(500).json({ message: 'Error al obtener los horarios ocupados' });
  }
});

module.exports = router;
