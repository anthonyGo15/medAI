require('dotenv').config(); // Para cargar las variables de entorno
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 🔹 Configurar CORS correctamente
app.use(cors({
  origin: 'http://localhost:3000', // Asegúrate de que esta sea la URL del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true // Si usas autenticación basada en cookies
}));

// 🔹 Middleware para procesar JSON antes de las rutas
app.use(express.json());

// 🔹 Importar rutas
const citaRoutes = require('./routes/citas');
const diagnosticoRoutes = require('./routes/diagnosticos');
const authRoutes = require('./routes/auth');
const sendPdfRouter = require('./routes/sendPdf');
const sendEmailRouter = require('./routes/sendEmail');
const predictRouter = require('./routes/predict'); //Ruta de Prediccion

// 🔹 Conexión a MongoDB (sin opciones obsoletas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));


// 🔹 Definir las rutas de la API
app.use('/api/citas', citaRoutes);
app.use('/api/diagnosticos', diagnosticoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sendPdf', sendPdfRouter);
app.use('/api/sendEmail', sendEmailRouter);
app.use('/api/predict', predictRouter); //Ruta de Prediccion

// 🔹 Ruta raíz para verificar el estado del servidor
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// 🔹 Configuración del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
