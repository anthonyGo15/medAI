import React, { useState, useEffect } from 'react'; 
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AlertasDeSalud() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [citas, setCitas] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prediccion, setPrediccion] = useState(null); // Nuevo estado para la predicción
  const navigate = useNavigate();

  // Obtener citas desde la base de datos
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await axios.get('/citas');
        setCitas(response.data);
      } catch (error) {
        console.error('Error al obtener las citas:', error);
      }
    };
    fetchCitas();
  }, []);

  const handleCitaSelect = (cita) => {
    setSelectedCita(cita);
    setNombre(cita.paciente);
    setEdad(cita.edad);
    setSexo(cita.sexo || '');
    setSintomas(cita.sintomas || '');
    setDialogOpen(false);
  };

  const handleSexoChange = (e) => {
    const newSexo = e.target.value;
    setSexo(newSexo);

    if (selectedCita) {
      setSelectedCita({ ...selectedCita, sexo: newSexo });
    }
  };

  const handleGeneratePDF = async () => {
    if (!selectedCita) {
      alert('Por favor selecciona una cita primero.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4000/api/sendPdf/sendPdf', {
        paciente: selectedCita.paciente,
        fecha: selectedCita.fecha,
        hora: selectedCita.hora,
        edad: selectedCita.edad,
        celular: selectedCita.celular,
        email: selectedCita.email,
        sintomas: selectedCita.sintomas,
        sexo: selectedCita.sexo,
        doctor: selectedCita.doctor,
        notas: selectedCita.notas,
        enfermedadPredicha: selectedCita.enfermedadPredicha || 'No especificada', // Incluir la enfermedad predicha
      });
  
      alert(response.data.message);
    } catch (error) {
      console.error('Error al guardar el PDF:', error);
      alert('Ocurrió un error al guardar el PDF.');
    }
  };
  
  const handleSendPDF = async () => {
    if (!selectedCita) {
      alert('Por favor selecciona una cita primero.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4000/api/sendEmail/sendEmail', {
        email: selectedCita.email,
      });
  
      alert(response.data.message);
    } catch (error) {
      console.error('Error al enviar el PDF:', error);
      alert('Ocurrió un error al enviar el PDF.');
    }
  };

  const handlePrediction = async () => {
    if (!selectedCita) {
      alert('Por favor selecciona una cita primero.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/predict/predict', {
        sintomas: selectedCita.sintomas || '',
        edad: selectedCita.edad || '',
        sexo: selectedCita.sexo || '',
      });

      setPrediccion(response.data.prediction);
    } catch (error) {
      console.error('Error al generar la predicción:', error);
      alert('Error al generar la predicción.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#BBDEFB',
        padding: '20px',
      }}
    >
      {/* Título principal */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          marginBottom: '24px',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <HealthAndSafetyIcon sx={{ fontSize: '40px' }} />
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
            ml: 2,
          }}
        >
          Alertas de Salud
        </Typography>
      </Box>

      {/* Contenedor para formulario e información */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        {/* Selección de cita */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography variant="h6" color="primary" fontWeight="bold">
            Seleccionar Cita
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDialogOpen(true)}
            sx={{
              padding: '12px 24px',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            Seleccionar Cita
          </Button>

          {/* Formulario */}
          <Box
            component="form"
            onSubmit={(e) => e.preventDefault()}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <TextField
              label="Nombre del Paciente"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{ sx: { borderRadius: '12px' } }}
              required
            />
            <TextField
              label="Edad"
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{ sx: { borderRadius: '12px' } }}
              required
            />
            <TextField
              label="Sexo"
              select
              value={sexo}
              onChange={handleSexoChange}
              fullWidth
              variant="outlined"
              InputProps={{ sx: { borderRadius: '12px' } }}
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
              <MenuItem value="Sin Especificar">Sin Especificar</MenuItem>
            </TextField>
            <TextField
              label="Síntomas (separados por comas)"
              value={sintomas}
              onChange={(e) => setSintomas(e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
          </Box>
        </Box>

        {/* Información de la cita seleccionada */}
        {selectedCita && (
          <Box
            sx={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              padding: '20px',
            }}
          >
            <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
              Información de la Cita Seleccionada
            </Typography>
            <Typography>
              <strong>Paciente:</strong> {selectedCita.paciente}
            </Typography>
            <Typography>
              <strong>Fecha:</strong> {selectedCita.fecha}
            </Typography>
            <Typography>
              <strong>Hora:</strong> {selectedCita.hora}
            </Typography>
            <Typography>
              <strong>Edad:</strong> {selectedCita.edad}
            </Typography>
            <Typography>
              <strong>Email:</strong> {selectedCita.email}
            </Typography>
            <Typography>
              <strong>Celular:</strong> {selectedCita.celular}
            </Typography>
            <Typography>
              <strong>Sexo:</strong> {selectedCita.sexo || 'No especificado'}
            </Typography>
            <Typography>
              <strong>Síntomas:</strong> {selectedCita.sintomas || 'No especificados'}
            </Typography>
            <Typography>
              <strong>Doctor:</strong> {selectedCita.doctor}
            </Typography>
            <Typography>
              <strong>Notas:</strong> {selectedCita.notas}
            </Typography>
            <Typography>
              <strong>Enfermedad Predicha:</strong> {selectedCita.enfermedadPredicha || 'No especificada'}
            </Typography>
            
            <Button
              variant="contained"
              color="info"
              fullWidth
              sx={{ mt: 2, borderRadius: '20px', fontWeight: 'bold' }}
              onClick={handlePrediction}
            >
              Generar Predicción
            </Button>

            {/* Mostrar la predicción si existe */}
            {prediccion && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: '10px',
                  backgroundColor: '#fff',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Posible Diagnóstico:
                </Typography>
                <Typography>{prediccion}</Typography>
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                borderRadius: '20px',
                fontWeight: 'bold',
              }}
              onClick={handleGeneratePDF}
            >
              Guardar PDF
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{
                mt: 2,
                borderRadius: '20px',
                fontWeight: 'bold',
              }}
              onClick={handleSendPDF}
            >
              Enviar PDF
            </Button>
            

            
          </Box>
        )}
      </Box>

      {/* Botón para regresar al Panel de Control */}
      <Box
        display="flex"
        justifyContent="flex-end"
        sx={{
          mb: 4, // Espacio inferior más amplio
          mt: 2, // Espacio superior
          mr: 3, // Espacio derecho (si es necesario)
          ml: 3, // Espacio izquierdo (si es necesario)
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '12px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            padding: '10px 20px',
            background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #42A5F5, #64B5F6)',
            },
          }}
        >
          Panel de Control
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Seleccionar una Cita</DialogTitle>
        <DialogContent>
          <List>
            {citas.map((cita) => (
              <ListItem button onClick={() => handleCitaSelect(cita)} key={cita._id}>
                <ListItemText
                  primary={`${cita.paciente} - ${cita.fecha} - ${cita.hora}`}
                  secondary={`Doctor: ${cita.doctor}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AlertasDeSalud;