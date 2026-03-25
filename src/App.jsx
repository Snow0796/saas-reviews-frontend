import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Feedbacks from './pages/Feedbacks'
import Relatorio from './pages/Relatorio'
import Formulario from './pages/Formulario'

function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return <div style={{ color: '#fff', padding: '40px' }}>Carregando...</div>
  if (!usuario) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
      <Route path="/feedbacks" element={<RotaProtegida><Feedbacks /></RotaProtegida>} />
      <Route path="/relatorio" element={<RotaProtegida><Relatorio /></RotaProtegida>} />
      <Route path="/avaliar/:tenantId" element={<Formulario />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}