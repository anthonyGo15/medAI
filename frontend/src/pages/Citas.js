import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

function Citas() {
  const [citas, setCitas] = useState([]);
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const agregarCita = () => {
    setCitas([...citas, { fecha, descripcion }]);
    setFecha('');
    setDescripcion('');
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Citas
      </Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={agregarCita}>
          Agregar
        </Button>
      </Box>
      <List>
        {citas.map((cita, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${cita.fecha} - ${cita.descripcion}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Citas;
