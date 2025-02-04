import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History'; // Importa el ícono de historial
import EventNoteIcon from '@mui/icons-material/EventNote'; 
import HomeIcon from '@mui/icons-material/Home'; // Importa un ícono representativo de inicio

function Dashboard() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  // Abrir el diálogo de confirmación
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Cerrar el diálogo de confirmación
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Confirmar cerrar sesión
  const handleLogout = () => {
    setOpenDialog(false);
    navigate('/login'); // Redirige al login
  };

  return (
<Box
  p={4}
  sx={{
    minHeight: '100vh',
    bgcolor: '#BBDEFB', // Azul más profundo y llamativo
    color: 'white',
  }}
>

    
      {/* Botón de Cerrar Sesión */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="outlined"
          color="error"
          size="medium"
          onClick={handleOpenDialog} // Abre el modal
          sx={{
            textTransform: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            fontWeight: 'bold',
            fontSize: '1rem',
            border: '2px solid',
            borderColor: '#C62828', // Rojo oscuro para el borde
            color: '#C62828', // Rojo oscuro para el texto
            transition: 'all 0.3s ease',
            '&:hover': {
              background: '#FFEBEE', // Rojo claro al hacer hover
              borderColor: '#E53935', // Rojo vibrante al hacer hover
              color: '#E53935', // Rojo vibrante en el texto
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>


{/* Título del Dashboard */}
<Box
  mb={4}
  textAlign="center"
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2, // Espaciado entre el ícono y el título
  }}
>
  {/* Icono grande */}
  <Box
    sx={{
      width: '80px',
      height: '80px',
      background: 'linear-gradient(45deg, #1565C0, #42A5F5)', // Gradiente azul llamativo
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
    }}
  >
    <HomeIcon
      sx={{
        color: 'white',
        fontSize: '40px',
      }}
    />
  </Box>

  {/* Título */}
  <Typography
    variant="h3"
    fontWeight="bold"
    sx={{
      background: 'linear-gradient(45deg, #42A5F5, #64B5F6)', // Fondo degradado azul claro
      color: 'white',
      padding: '10px 40px',
      borderRadius: '12px',
      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', // Sombra en el texto
      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)', // Sombra suave para destacar
      width: 'fit-content', // Ajusta el ancho automáticamente al contenido
    }}
  >
    Inicio
  </Typography>
</Box>


      {/* Contenido del Dashboard */}
      <Grid container spacing={4}>
        {/* Próximas Citas */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={5}
            sx={{
              padding: '20px',
              borderRadius: '15px',
              background: 'linear-gradient(to bottom right, #ffffff, #d7e1ec)',
              color: '#1565C0',
              textAlign: 'center',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s',
              },
            }}
          >
            <EventIcon sx={{ fontSize: 50, color: '#1565C0', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Próximas Citas
            </Typography>
            <Typography>Aquí puedes ver las próximas citas agendadas.</Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{
                marginTop: '16px',
                textTransform: 'none',
                borderRadius: '20px',
              }}
              onClick={() => navigate('/citas')} // Redirige a la página de Próximas Citas
            >
              Aquí puedes ver la disponibilidad de citas
            </Button>
          </Paper>
        </Grid>

        {/* Alertas de Salud */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={5}
            sx={{
              padding: '20px',
              borderRadius: '15px',
              background: 'linear-gradient(to bottom right, #ffffff, #fce4ec)',
              color: '#d81b60',
              textAlign: 'center',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s',
              },
            }}
          >
            <HealthAndSafetyIcon sx={{ fontSize: 50, color: '#d81b60', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Pronóstico de Salud
            </Typography>
            <Typography>Analiza tu información de salud predictiva aquí.</Typography>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{
                marginTop: '16px',
                textTransform: 'none',
                borderRadius: '20px',
              }}
              onClick={() => navigate('/alertas')} // Redirige a la página de Alertas de Salud
            >
              Ver Detalles
            </Button>
          </Paper>
        </Grid>

        {/* Reportes */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={5}
            sx={{
              padding: '20px',
              borderRadius: '15px',
              background: 'linear-gradient(to bottom right, #ffffff, #e8f5e9)',
              color: '#2e7d32',
              textAlign: 'center',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s',
              },
            }}
          >
            <AssessmentIcon sx={{ fontSize: 50, color: '#2e7d32', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Diagnosticos
            </Typography>
            <Typography>Genera reportes sobre citas y resultados médicos.</Typography>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{
                marginTop: '16px',
                textTransform: 'none',
                borderRadius: '20px',
              }}
              onClick={() => navigate('/reportes')} // Redirige a la página de Reportes
            >
              Generar Reporte
            </Button>
          </Paper>
        </Grid>
      </Grid>

{/* Botones adicionales */}
<Box
  mt={5}
  display="flex"
  justifyContent="center"
  gap={3}
>
  <Button
    variant="contained"
    color="primary"
    startIcon={<HistoryIcon />} // Ícono para historial médico
    sx={{
      textTransform: 'none',
      padding: '12px 24px',
      borderRadius: '25px',
      fontWeight: 'bold',
      fontSize: '1rem',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
      '&:hover': {
        background: 'linear-gradient(45deg, #42A5F5, #64B5F6)',
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
      },
    }}
    onClick={() => navigate('/historial')} // Ruta al historial médico
  >
    Ir al Historial Médico
  </Button>
  <Button
    variant="outlined"
    color="secondary"
    startIcon={<EventNoteIcon />} // Ícono para registro de cita
    sx={{
      textTransform: 'none',
      padding: '12px 24px',
      borderRadius: '25px',
      fontWeight: 'bold',
      fontSize: '1rem',
      border: '2px solid',
      borderColor: '#1565C0',
      color: '#1565C0',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: '#E3F2FD',
        borderColor: '#42A5F5',
        color: '#42A5F5',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      },
    }}
    onClick={() => navigate('/registrar-cita')} // Ruta al registro de citas
  >
    Registrar Nueva Cita
  </Button>
</Box>


      {/* Diálogo de Confirmación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Cierre de Sesión</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cerrar sesión? Perderás el acceso al panel de control.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="error">
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;
