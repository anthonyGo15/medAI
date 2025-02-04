import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';

function Reportes() {
  const [data, setData] = useState([]); // Datos de diagnósticos
  const [search, setSearch] = useState(''); // Campo de búsqueda
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  // Cargar los datos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/diagnosticos');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  // Filtrar datos según búsqueda
  const filteredData = data.filter((row) =>
    row.paciente.toLowerCase().includes(search.toLowerCase()) ||
    row.edad.toString().includes(search) ||
    row.sexo.toLowerCase().includes(search.toLowerCase()) ||
    row.sintomas.toLowerCase().includes(search.toLowerCase()) ||
    row.enfermedadPredicha.toLowerCase().includes(search.toLowerCase())
  );

  // Función para imprimir un solo diagnóstico
  const handlePrint = (row) => {
    const printableContent = `
      <h1>Reporte de Diagnóstico</h1>
      <p><strong>Fecha:</strong> ${new Date(row.fecha).toLocaleDateString()}</p>
      <p><strong>Paciente:</strong> ${row.paciente}</p>
      <p><strong>Edad:</strong> ${row.edad}</p>
      <p><strong>Sexo:</strong> ${row.sexo}</p>
      <p><strong>Síntomas:</strong> ${row.sintomas}</p>
      <p><strong>Diagnóstico:</strong> ${row.enfermedadPredicha}</p>
      <hr />
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Abrir modal de confirmación de eliminación
  const handleOpenDeleteDialog = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  // Cerrar modal de confirmación
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedId(null);
  };

  // Función para eliminar un diagnóstico
  const handleDelete = async () => {
    if (selectedId) {
      try {
        await fetch(`http://localhost:4000/api/diagnosticos/${selectedId}`, {
          method: 'DELETE',
        });

        // Actualizar la lista de datos después de eliminar
        setData(data.filter((row) => row._id !== selectedId));

        alert('Diagnóstico eliminado correctamente.');
      } catch (error) {
        console.error('Error al eliminar el diagnóstico:', error);
        alert('Ocurrió un error al eliminar el diagnóstico.');
      }
    }
    handleCloseDeleteDialog();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#BBDEFB',
        padding: 3,
      }}
    >
      {/* Botón para regresar al Panel de Control */}
      <Box
        display="flex"
        justifyContent="flex-end"
        sx={{
          mb: 4,
          mt: 2,
          mr: 3,
          ml: 3,
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

      {/* Título */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 5,
          mt: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            background: 'linear-gradient(45deg, #1976D2, #42A5F5)',
            padding: '20px 30px',
            borderRadius: '16px',
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
            width: 'fit-content',
          }}
        >
          <EventIcon
            sx={{
              color: 'white',
              fontSize: '30px',
            }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: 'white',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            Reportes de Diagnósticos
          </Typography>
        </Box>
      </Box>

      {/* Barra de búsqueda */}
      <Box display="flex" justifyContent="center" mt={4} mb={4}>
        <TextField
          label="Buscar"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por paciente, edad, sexo, síntomas o diagnóstico"
          sx={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '5px 10px',
            width: '100%',
            maxWidth: '500px',
          }}
        />
      </Box>

      {/* Tabla de Diagnósticos */}
      <TableContainer component={Paper} sx={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(45deg, #1565C0, #42A5F5)' }}>
              {['Fecha', 'Paciente', 'Edad', 'Sexo', 'Síntomas', 'Diagnóstico', 'Acciones'].map((col) => (
                <TableCell key={col} sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row._id}>
                {[row.fecha, row.paciente, row.edad, row.sexo, row.sintomas, row.enfermedadPredicha].map((cell, index) => (
                  <TableCell key={index} sx={{ textAlign: 'center' }}>
                    {cell}
                  </TableCell>
                ))}
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton color="primary" onClick={() => handlePrint(row)}>
                    <PrintIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDeleteDialog(row._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estás seguro de que deseas eliminar este diagnóstico?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Reportes;
