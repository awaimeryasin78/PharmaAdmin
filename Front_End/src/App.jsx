import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'
import Reports from './pages/Reports'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth()
    if (loading) return (
        <div style={{
            minHeight: '100vh',
            background: '#060D1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0EA5E9',
            fontSize: '16px'
        }}>Loading...</div>
    )
    return token ? children : <Navigate to="/login" />
}

const AppRoutes = () => {
    const { token } = useAuth()
    return (
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    )
}

function App() {
    return (
        <ThemeProvider>
        <AuthProvider>
            <BrowserRouter>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#0A1628',
                            color: '#E2E8F0',
                            border: '0.5px solid #1E3A5F'
                        }
                    }}
                />
                <AppRoutes />
                       <ThemeToggle />
            </BrowserRouter>
        </AuthProvider>
        </ThemeProvider>
    )
}

export default App