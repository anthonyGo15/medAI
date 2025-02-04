import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axiosConfig'; // Importa la configuración de Axios

function RegistrarCita() {
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    paciente: '',
    edad: '',
    celular: '',
    email: '',
    sintomas: '',
    doctor: '',
    notas: '',
  });
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica si el usuario entró en modo invitado
  const isGuestMode = new URLSearchParams(location.search).get('modo') === 'invitado';

  // Generar lista de horarios permitidos
  const horariosPermitidos = Array.from({ length: 15 }, (_, i) => {
    const hora = 8 + i; // Desde las 8:00 AM hasta las 10:00 PM
    return `${hora.toString().padStart(2, '0')}:00`;
  });

  useEffect(() => {
    if (formData.fecha) {
      axios
        .get(`/citas/horarios-ocupados?fecha=${formData.fecha}`)
        .then((response) => {
          setHorariosOcupados(response.data);
        })
        .catch((error) => {
          console.error('Error al cargar horarios ocupados:', error);
        });
    }
  }, [formData.fecha]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (horariosOcupados.includes(formData.hora)) {
      alert('La hora seleccionada ya está ocupada. Por favor, elige otra hora.');
      return;
    }

    try {
      await axios.post('/citas', formData);
      alert('Cita registrada exitosamente.');
      navigate('/historial'); // Redirige al historial médico
    } catch (error) {
      console.error('Error al registrar la cita:', error);
      alert('Ocurrió un error al registrar la cita.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#BBDEFB',
        padding: 3,
      }}
    >
      {/* Título con icono */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
          padding: '15px 25px',
          borderRadius: '16px',
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
          mb: 4,
        }}
      >
        <EventIcon
          sx={{
            color: 'white',
            fontSize: '40px',
            mr: 2,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: 'white',
            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          Registrar Nueva Cita
        </Typography>
      </Box>

      {/* Formulario */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '90%',
          maxWidth: '600px',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
        }}
      >
        {[
          { label: 'Fecha', type: 'date', name: 'fecha', shrink: true },
          { label: 'Hora', type: 'select', name: 'hora', options: horariosPermitidos },
          { label: 'Paciente', type: 'text', name: 'paciente' },
          { label: 'Edad', type: 'number', name: 'edad' },
          { label: 'Número Celular', type: 'tel', name: 'celular' },
          { label: 'Email', type: 'email', name: 'email' },
          { label: 'Síntomas', type: 'multiline', name: 'sintomas', rows: 3 },
          { label: 'Doctor', type: 'select', name: 'doctor', options: ['Dr. Hugo Pérez', 'Dra. Ana Martínez', 'Dr. Daniel Gómez'] },
          { label: 'Notas', type: 'multiline', name: 'notas', rows: 3 },
        ].map(({ label, type, name, shrink, options, rows }, idx) => (
          <TextField
            key={idx}
            label={label}
            name={name}
            fullWidth
            margin="normal"
            select={type === 'select'}
            multiline={type === 'multiline'}
            rows={rows}
            type={type !== 'select' && type !== 'multiline' ? type : undefined}
            InputLabelProps={shrink ? { shrink: true } : undefined}
            value={formData[name]}
            onChange={handleChange}
            required={name !== 'notas'}
            sx={{
              '& .MuiInputBase-root': { borderRadius: '12px' },
            }}
          >
            {options &&
              options.map((option, idx) => (
                <MenuItem
                  key={idx}
                  value={option}
                  disabled={type === 'select' && horariosOcupados.includes(option)}
                  style={{
                    color: horariosOcupados.includes(option) ? 'red' : 'green',
                  }}
                >
                  {option} {horariosOcupados.includes(option) ? '(Ocupado)' : '(Disponible)'}
                </MenuItem>
              ))}
          </TextField>
        ))}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 3,
            fontWeight: 'bold',
            borderRadius: '12px',
            padding: '12px 20px',
            background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #42A5F5, #64B5F6)',
              boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          Guardar
        </Button>
      </Box>

      {/* Botón dinámico basado en el modo */}
      <Box display="flex" justifyContent="center" mt={4}>
        {isGuestMode ? (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: '30px',
              fontWeight: 'bold',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #D32F2F, #E57373)',
              '&:hover': {
                background: 'linear-gradient(45deg, #E57373, #EF9A9A)',
                transform: 'scale(1.05)',
              },
            }}
          >
            Regresar al Login
          </Button>
        ) : (
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
        )}
      </Box>
    </Box>
  );
}

export default RegistrarCita;
