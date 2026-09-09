import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/pharmaadmin-logo.svg'
import {
    LayoutDashboard, Package, ShoppingCart,
    BarChart3, Bell, Settings, LogOut
} from 'lucide-react'
import { useState, useEffect } from 'react'
import API from '../api/axios'

const Sidebar = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [alertCount, setAlertCount] = useState(0)

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await API.get('/api/medicines/low-stock')
                setAlertCount(res.data.length)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAlerts()
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/inventory', icon: <Package size={20} />, label: 'Inventory' },
        { path: '/sales', icon: <ShoppingCart size={20} />, label: 'Sales' },
        { path: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
        { path: '/alerts', icon: <Bell size={20} />, label: 'Alerts', count: alertCount },
        { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ]

    return (
        <div style={{
            width: '240px',
            height: '100vh',
            background: 'var(--bg-card)',
            borderRight: '0.5px solid var(--border-card)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
            transition: 'background-color 250ms ease, border-color 250ms ease'
        }}>
            <div style={{
                padding: '28px 24px',
                borderBottom: '0.5px solid var(--border-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <img src={logo} alt="PharmaAdmin" style={{ width: '32px', height: '32px' }} />
                <span style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'var(--accent-primary)'
                }}>PharmaAdmin</span>
            </div>

            <nav style={{ flex: 1, padding: '16px 0' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 20px',
                            textDecoration: 'none',
                            color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                            background: isActive ? 'rgba(14,165,233,0.1)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--accent-teal)' : '3px solid transparent',
                            transition: 'all 150ms ease',
                            fontSize: '14px',
                            fontWeight: '500'
                        })}
                    >
                        {item.icon}
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.count > 0 && (
                            <span style={{
                                background: '#EF4444',
                                color: '#fff',
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontWeight: '600'
                            }}>{item.count}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div style={{ padding: '16px', borderTop: '0.5px solid var(--border-card)' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        borderRadius: '8px',
                        transition: 'all 150ms ease'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = '#EF4444'
                        e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'var(--text-muted)'
                        e.currentTarget.style.background = 'transparent'
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
