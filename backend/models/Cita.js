const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  paciente: { type: String, required: true },
  edad: { type: Number, required: true },
  celular: { type: String, required: true },
  email: { type: String, required: true }, // Campo adicional para el email
  sintomas: { type: String, required: true }, // Campo adicional para los síntomas
  doctor: { type: String, required: true },
  notas: { type: String },
});

module.exports = mongoose.model('Cita', CitaSchema);