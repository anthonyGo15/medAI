import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Modal,
  Alert,
  Divider,
} from '@mui/material';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import logo from '../assets/logo.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Estados para el modal de validación de clave y registro de usuario
  const [modalOpen, setModalOpen] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }

    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token } = response.data;

      if (token) {
        localStorage.setItem('authToken', token);
        navigate('/dashboard'); // Redirige al dashboard
      } else {
        setError('Error inesperado. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const handleGuestAccess = () => {
    navigate('/registrar-cita?modo=invitado');
  };

  // Modal para validar la clave secreta antes del registro
  const handleOpenModal = () => {
    setModalOpen(true);
    setIsAuthorized(false);
    setSecretKey('');
    setKeyError('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsAuthorized(false);
    setSecretKey('');
    setEmail('');
    setPassword('');
    setError('');
    setRegisterError('');
    setRegisterSuccess(false);
  };

  const handleValidateKey = async () => {
    try {
      const response = await axios.post('/auth/validate-key', { secretKey });
      if (response.data.valid) {
        setIsAuthorized(true);
        setKeyError('');
      } else {
        setKeyError('Clave incorrecta. Inténtalo de nuevo.');
      }
    } catch (err) {
      setKeyError('Clave incorrecta o error de conexión.');
    }
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setRegisterError('Por favor, completa todos los campos.');
      return;
    }

    try {
      await axios.post('/auth/register', { email, password });
      setRegisterSuccess(true);
      setRegisterError('');
      setTimeout(() => {
        handleCloseModal();
      }, 2000); // Cierra el modal después de 2 segundos
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Error al registrar usuario.');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#1E88E5"
    >
      <Box
        p={4}
        bgcolor="white"
        borderRadius={3}
        boxShadow={4}
        width="100%"
        maxWidth="400px"
        textAlign="center"
      >
        {/* Logo */}
        <Box mb={3}>
          <img
            src={logo}
            alt="MedAI Logo"
            style={{
              width: '120px',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              borderRadius: '10px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'inline-block',
            background: 'linear-gradient(45deg, #1E88E5, #64B5F6)',
            padding: '10px 20px',
            borderRadius: '12px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            mb: 3, // Espaciado inferior
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: 'white',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '0.5px',
            }}
          >
            Bienvenido a MedAI
          </Typography>
        </Box>


        {/* Mensaje de Error */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Formulario de Inicio de Sesión */}
        <form onSubmit={handleLogin}>
        <TextField
          label="Correo:"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: '30px',
              height: '45px',
              backgroundColor: 'white',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              padding: '5px 15px',
              fontFamily: "'Poppins', sans-serif",
              '&:focus-within': {
                boxShadow: '0px 0px 8px rgba(21, 101, 192, 0.5)',
                borderColor: '#1565C0',
              },
            },
          }}
          InputLabelProps={{
            sx: {
              fontWeight: 'bold',
              color: '#1565C0',
              fontSize: '13px',
            },
          }}
          sx={{
            margin: '10px 0',
          }}
        />

        <TextField
          label="Contraseña:"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: '30px',
              height: '45px',
              backgroundColor: 'white',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              padding: '5px 15px',
              fontFamily: "'Poppins', sans-serif",
              '&:focus-within': {
                boxShadow: '0px 0px 8px rgba(21, 101, 192, 0.5)',
                borderColor: '#1565C0',
              },
            },
          }}
          InputLabelProps={{
            sx: {
              fontWeight: 'bold',
              color: '#1565C0',
              fontSize: '13px',
            },
          }}
          sx={{
            margin: '10px 0',
          }}
/>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1.00rem',
              padding: '10px 18px',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                background: 'linear-gradient(45deg, #42A5F5, #64B5F6)',
              },
            }}
          >
            Iniciar Sesión
          </Button>

        </form>

        <Divider sx={{ my: 3 }}>O</Divider>

        {/* Acceder como Paciente */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<PersonOutlineIcon />}
          onClick={handleGuestAccess}
          sx={{
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            padding: '8px 16px',
            border: '2px solid #1565C0',
            color: '#1565C0',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(45deg, #E3F2FD, #BBDEFB)',
              transform: 'scale(1.05)',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          Acceder como Paciente
        </Button>

        {/* Registrar Nuevo Usuario */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<PersonAddIcon />}
          onClick={handleOpenModal}
          sx={{
            mt: 2,
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            padding: '8px 16px',
            background: 'linear-gradient(45deg, #2E7D32, #66BB6A)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              background: 'linear-gradient(45deg, #66BB6A, #81C784)',
            },
          }}
        >
          Registrar Nuevo Usuario
        </Button>


      </Box>

      {/* Modal para validar la clave y registrar usuario */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', boxShadow: 4, p: 4, borderRadius: '16px' }}>
          {!isAuthorized ? (
            <>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                <LockOpenIcon sx={{ fontSize: 30, color: '#1565C0', mr: 1 }} />
                Ingresa la Clave Secreta
              </Typography>
              {keyError && <Alert severity="error" sx={{ mt: 2 }}>{keyError}</Alert>}
              <TextField label="Clave Secreta" type="password" fullWidth margin="normal" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
              <Button
                variant="contained"
                color="primary"
                onClick={handleValidateKey}
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: '30px',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    background: 'linear-gradient(45deg, #42A5F5, #64B5F6)',
                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                Validar Clave
              </Button>

            </>
          ) : (
            <>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                Registro de Nuevo Usuario
              </Typography>
              {registerError && <Alert severity="error" sx={{ mt: 2 }}>{registerError}</Alert>}
              {registerSuccess && <Alert severity="success" sx={{ mt: 2 }}>Usuario Registrado Correctamente</Alert>}
              <form onSubmit={handleRegisterUser}>
                <TextField label="Correo" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Contraseña" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{
                    mt: 2,
                    borderRadius: '30px',
                    padding: '10px 20px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #2E7D32, #66BB6A)',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      background: 'linear-gradient(45deg, #66BB6A, #81C784)',
                      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  Registrar Usuario
                </Button>
              </form>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default Login;
