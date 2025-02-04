const express = require('express');
const OpenAI = require('openai'); // Importar directamente OpenAI
require('dotenv').config();

const router = express.Router();

// Verificar que la API key esté configurada
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY no está configurada en el archivo .env');
}

// Configuración de OpenAI (nueva forma)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 📌 Ruta para generar la predicción
router.post('/predict', async (req, res) => {
  try {
    const { sintomas, edad, sexo } = req.body;

    // Validar los datos de entrada
    if (!sintomas || sintomas.length === 0) {
      return res.status(400).json({ error: 'Debe proporcionar síntomas para la predicción.' });
    }

    if (!edad || isNaN(edad) || edad <= 0) {
      return res.status(400).json({ error: 'La edad debe ser un número válido y mayor que 0.' });
    }

    if (!sexo || !['masculino', 'femenino', 'otro'].includes(sexo.toLowerCase())) {
      return res.status(400).json({ error: 'El sexo debe ser "masculino", "femenino" u "otro".' });
    }

    // Generar mensaje de entrada para OpenAI
    const prompt = `
    Un paciente de ${edad} años, sexo ${sexo}, reporta los siguientes síntomas: ${sintomas}.
    Basado en esta información, ¿cuál podría ser el diagnóstico más probable?
    Responde en una oración clara y sencilla sin repetir los síntomas.
    `;

    // Llamar a la API de OpenAI (nueva forma)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Usar el modelo más avanzado
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    // Extraer la predicción del resultado
    const prediction = response.choices[0].message.content.trim();
    res.json({ prediction });

  } catch (error) {
    console.error('Error al generar la predicción:', error);

    // Manejar errores específicos de OpenAI
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    } else {
      return res.status(500).json({ error: 'Ocurrió un error al generar la predicción.' });
    }
  }
});

module.exports = router;