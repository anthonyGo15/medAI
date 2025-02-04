import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
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
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function Historial() {
  const [data, setData] = useState([]); // Datos del historial
  const [search, setSearch] = useState(''); // Campo de búsqueda
  const [selectedId, setSelectedId] = useState(null); // ID del registro seleccionado
  const [openDialog, setOpenDialog] = useState(false); // Estado del modal de confirmación de eliminación
  const [editDialogOpen, setEditDialogOpen] = useState(false); // Estado del modal de edición
  const [editData, setEditData] = useState({}); // Datos del registro en edición
  const navigate = useNavigate();

  // Cargar los datos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/citas'); // Obtiene todas las citas
        setData(response.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  // Manejar la apertura del modal de confirmación de eliminación
  const handleOpenDialog = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  // Manejar el cierre del modal de confirmación de eliminación
  const handleCloseDialog = () => {
    setSelectedId(null);
    setOpenDialog(false);
  };

  // Manejar la eliminación de un registro
  const handleDelete = () => {
    axios
      .delete(`/citas/${selectedId}`)
      .then(() => {
        setData(data.filter((row) => row._id !== selectedId));
        handleCloseDialog();
      })
      .catch((error) => {
        console.error('Error al eliminar el registro:', error);
        handleCloseDialog();
      });
  };

  // Manejar la apertura del modal de edición
  const handleEdit = (record) => {
    setEditData(record);
    setEditDialogOpen(true);
  };

  // Manejar el cierre del modal de edición
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditData({});
  };

  // Manejar el cambio de los campos en el formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Guardar los cambios en el registro editado
  const handleSaveEdit = () => {
    axios
      .put(`/citas/${editData._id}`, editData)
      .then((response) => {
        setData((prevData) =>
          prevData.map((item) =>
            item._id === response.data._id ? response.data : item
          )
        );
        handleCloseEditDialog();
      })
      .catch((error) => {
        console.error('Error al actualizar el registro:', error);
      });
  };

  // Manejar la impresión de un registro
  const handlePrint = (record) => {
    const printableContent = `
      <html>
        <head>
          <title>.</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              text-align: center;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }
            .header img {
              width: 80px;
              height: 80px;
              margin-right: 15px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .subtitle {
              font-size: 18px;
              font-weight: bold;
              margin: 20px 0 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
              text-align: center;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/logo.jpg" alt="Logo MedAI" />
            <div>
              <p class="title">MedAI</p>
  
              <p>Historial Médico
              </p>
            </div>
          </div>
  
          <p class="subtitle">Datos de la Cita Médica</p>
  
          <table>
            <tr>
              <th>Fecha</th>
              <td>${record.fecha}</td>
            </tr>
            <tr>
              <th>Hora</th>
              <td>${record.hora}</td>
            </tr>
            <tr>
              <th>Paciente</th>
              <td>${record.paciente}</td>
            </tr>
            <tr>
              <th>Edad</th>
              <td>${record.edad}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>${record.email}</td>
            </tr>
            <tr>
              <th>Número Celular</th>
              <td>${record.celular}</td>
            </tr>
            <tr>
              <th>Doctor</th>
              <td>${record.doctor}</td>
            </tr>
            <tr>
              <th>Notas</th>
              <td>${record.notas}</td>
            </tr>
          </table>
  
          <div class="footer">
            <p>Generado automáticamente por el sistema MedAI</p>
          </div>
        </body>
      </html>
    `;
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Filtrar los datos según la búsqueda
  const filteredData = data.filter(
    (row) =>
      row.edad.toString().includes(search) ||
      row.celular.includes(search) ||
      row.paciente.toLowerCase().includes(search.toLowerCase()) ||
      row.fecha.includes(search) ||
      (row.email && row.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box p={3} minHeight="100vh" bgcolor="#BBDEFB" color="black">
{/* Botón para regresar al Panel de Control */}
<Box display="flex" justifyContent="flex-end" mb={3}>
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
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    mt: 6, // Mayor margen superior para despegarlo del botón de búsqueda
    mb: 4, // Margen inferior para mantener la separación del contenido inferior
    background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
    borderRadius: '16px',
    padding: '20px 40px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    width: 'fit-content',
    margin: '0 auto', // Centra horizontalmente el contenedor
  }}
>
  <img
    src="https://img.icons8.com/fluency/48/medical-doctor.png"
    alt="Historial Médico"
    style={{ width: 40, height: 40, marginRight: '16px' }}
  />
  <Typography
    variant="h4"
    sx={{
      fontWeight: 'bold',
      color: 'white',
      textShadow: '1px 1px 4px rgba(0, 0, 0, 0.4)',
    }}
  >
    Historial Médico
  </Typography>
</Box>


      {/* Barra de búsqueda */}
{/* Barra de búsqueda */}
<Box 
  sx={{
    display: 'flex', 
    justifyContent: 'center', 
    mt: 4, // Incrementa el margen superior para alejarlo del título
    mb: 4 // Espaciado inferior opcional
  }}
>
  <TextField
    label="Buscar"
    variant="outlined"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Buscar por paciente, edad, celular, email o fecha"
    InputProps={{
      sx: {
        backgroundColor: 'white',
        borderRadius: '10px', // Redondea más las esquinas
        padding: '5px 10px', // Espaciado interno para hacerlo más amplio
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Sombras suaves
      },
    }}
    InputLabelProps={{
      sx: {
        fontSize: '14px', // Tamaño de fuente de la etiqueta
        fontWeight: 'bold', // Negrita para destacar el campo
      },
    }}
    sx={{
      width: '100%', 
      maxWidth: '500px', // Incrementa el tamaño máximo
      transition: 'all 0.3s', // Animación suave
      '&:hover': {
        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)', // Aumenta la sombra al pasar el mouse
      },
    }}
  />
</Box>


     {/* Tabla */}
<TableContainer
  component={Paper}
  sx={{
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    mt: 4,
  }}
>
  <Table>
    <TableHead>
      <TableRow
        sx={{
          backgroundColor: '#1565C0',
        }}
      >
        {[
          'Fecha',
          'Hora',
          'Paciente',
          'Edad',
          'Email',
          'Número Celular',
          'Doctor',
          'Notas',
          'Acciones',
        ].map((header, index) => (
          <TableCell
            key={index}
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              border: 'none',
              fontSize: '14px',
            }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredData.map((row, index) => (
        <TableRow
          key={row._id}
          sx={{
            backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
          }}
        >
          <TableCell sx={{ textAlign: 'center' }}>{row.fecha}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{row.hora}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{row.paciente}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{row.edad}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>
            {row.email || 'N/A'}
          </TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{row.celular}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{row.doctor}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{row.notas}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>
            <IconButton onClick={() => handleEdit(row)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleOpenDialog(row._id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => handlePrint(row)} color="secondary">
              <PrintIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      {/* Modal de confirmación de eliminación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este registro? Esta acción no se
            puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de edición */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Registro</DialogTitle>
        <DialogContent>
          <TextField
            label="Fecha"
            type="date"
            name="fecha"
            fullWidth
            margin="normal"
            value={editData.fecha || ''}
            onChange={handleEditChange}
          />
          <TextField
            label="Hora"
            name="hora"
            fullWidth
            margin="normal"
            value={editData.hora || ''}
            onChange={handleEditChange}
          />
          <TextField
            label="Paciente"
            name="paciente"
            fullWidth
            margin="normal"
            value={editData.paciente || ''}
            onChange={handleEditChange}
          />
          <TextField
            label="Edad"
            name="edad"
            type="number"
            fullWidth
            margin="normal"
            value={editData.edad || ''}
            onChange={handleEditChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={editData.email || ''}
            onChange={handleEditChange}
          />
          <TextField
            label="Número Celular"
            name="celular"
            type="tel"
            fullWidth
            margin="normal"
            value={editData.celular || ''}
            onChange={handleEditChange}
          />
          <TextField
            label="Doctor"
            name="doctor"
            fullWidth
            margin="normal"
            value={editData.doctor || ''}
            onChange={handleEditChange}
          />
          <TextField
            label="Notas"
            name="notas"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={editData.notas || ''}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Historial;
