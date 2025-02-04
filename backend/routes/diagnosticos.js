const express = require('express');
const Diagnostico = require('../models/Diagnostico');

const router = express.Router();

// Guardar un diagnóstico
router.post('/', async (req, res) => {
  try {
    const nuevoDiagnostico = new Diagnostico(req.body);
    await nuevoDiagnostico.save();
    res.status(201).json(nuevoDiagnostico);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los diagnósticos
router.get('/', async (req, res) => {
  try {
    const diagnosticos = await Diagnostico.find();
    res.json(diagnosticos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
