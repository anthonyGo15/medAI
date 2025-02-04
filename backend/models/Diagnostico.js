const mongoose = require('mongoose');

const diagnosticoSchema = new mongoose.Schema({
  paciente: { type: String, required: true },
  edad: { type: Number, required: true },
  sexo: { type: String, required: true },
  peso: { type: Number, required: true },
  altura: { type: Number, required: true },
  sintomas: { type: String, required: true },
  enfermedadPredicha: { type: String, required: true },
});

module.exports = mongoose.model('Diagnostico', diagnosticoSchema);
