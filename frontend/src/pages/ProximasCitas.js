import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import es from 'date-fns/locale/es'; // Localización en español
import { Box, Typography, Modal, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig'; // Importa la configuración de Axios
import EventIcon from '@mui/icons-material/Event';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function ProximasCitas() {
  const [events, setEvents] = useState([]); // Estado para las citas
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado
  const [modalOpen, setModalOpen] = useState(false); // Estado del modal
  const navigate = useNavigate(); // Navegación para regresar al Dashboard

  // Cargar datos de citas desde el backend
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await axios.get('/citas');
        const citas = response.data.map((cita) => ({
          id: cita._id,
          title: `${cita.paciente} - ${cita.doctor}`,
          start: new Date(`${cita.fecha}T${cita.hora}`),
          end: new Date(`${cita.fecha}T${cita.hora}`), // Para simplificar, la cita termina a la misma hora
          allDay: false,
          details: cita.notas,
        }));
        setEvents(citas);
      } catch (error) {
        console.error('Error al cargar las citas:', error);
      }
    };
    fetchCitas();
  }, []);

  // Manejar la selección de eventos
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalOpen(true); // Abrir modal con información del evento
  };

  // Manejar el cierre del modal
  const handleCloseModal = () => {
    setSelectedEvent(null);
    setModalOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#BBDEFB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
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
        <EventIcon sx={{ fontSize: '40px' }} />
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
            ml: 2,
          }}
        >
          Próximas Citas
        </Typography>
      </Box>

      {/* Calendario */}
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: '8px',
          p: 3,
          boxShadow: 3,
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 600,
            margin: '0 auto',
          }}
          views={['month']}
          defaultView="month"
          messages={{
            next: 'Sig.',
            previous: 'Ant.',
            today: 'Hoy',
            month: 'Mes',
            noEventsInRange: 'No hay citas en este rango',
          }}
          onSelectEvent={handleSelectEvent} // Evento al seleccionar una cita
        />
      </Box>

      {/* Botón para regresar al Panel de Control */}
      <Box
        display="flex"
        justifyContent="flex-end"
        sx={{
          mb: 4,
          mt: 2,
          
          width: '15%',
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

      {/* Modal para mostrar detalles */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 450,
            bgcolor: 'white',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
            p: 4,
            borderRadius: '16px',
          }}
        >
          {selectedEvent && (
            <>
              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                gutterBottom
                sx={{
                  color: '#1565C0',
                  mb: 2,
                  borderBottom: '2px solid #BBDEFB',
                  pb: 1,
                }}
              >
                {selectedEvent.title}
              </Typography>
              <Typography
                gutterBottom
                sx={{
                  fontSize: '1rem',
                  color: '#424242',
                  mb: 1.5,
                }}
              >
                <strong>Fecha:</strong>{' '}
                {selectedEvent.start.toLocaleDateString()} -{' '}
                {selectedEvent.start.toLocaleTimeString()}
              </Typography>
              <Typography
                gutterBottom
                sx={{
                  fontSize: '1rem',
                  color: '#424242',
                  mb: 3,
                }}
              >
                <strong>Detalles:</strong>{' '}
                {selectedEvent.details || 'Sin detalles.'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseModal}
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #42A5F5, #64B5F6)',
                  },
                }}
              >
                Cerrar
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default ProximasCitas;
