import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Historial from './pages/Historial';
import RegistrarCita from './pages/RegistrarCita';
import ProximasCitas from './pages/ProximasCitas';
import AlertasDeSalud from './pages/alertasDeSalud';
import Reportes from './pages/Reportes';



function App() {
  return (
    <Router>
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/historial" element={<Historial />} />
  <Route path="/alertas" element={<AlertasDeSalud />} />
  <Route path="/registrar-cita" element={<RegistrarCita />} />
  <Route path="/citas" element={<ProximasCitas />} />
  <Route path="/reportes" element={<Reportes />} />
</Routes>

    </Router>
  );
}

export default App;
