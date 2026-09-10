import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard, Package, ShoppingCart,
    BarChart3, Bell, Settings, LogOut, X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import API from '../api/axios'
import logo from '../assets/pharmaadmin-logo.svg'

const Sidebar = ({ isMobile, isOpen, onClose }) => {
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

    const handleNavClick = () => {
        if (isMobile) onClose()
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
        <>
            {isMobile && isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(6,13,26,0.7)', backdropFilter: 'blur(2px)',
                        zIndex: 199
                    }}
                />
            )}

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
                zIndex: 200,
                transition: 'transform 250ms ease, background-color 250ms ease, border-color 250ms ease',
                transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
                boxShadow: isMobile && isOpen ? '0 0 40px rgba(0,0,0,0.5)' : 'none'
            }}>
                <div style={{
                    padding: '28px 24px',
                    borderBottom: '0.5px solid var(--border-card)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <img src={logo} alt="PharmaAdmin" style={{ width: '28px', height: '28px' }} />
                    <span style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: 'var(--accent-primary)',
                        flex: 1
                    }}>PharmaAdmin</span>
                    {isMobile && (
                        <button onClick={onClose} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-muted)', padding: '4px'
                        }}>
                            <X size={20} />
                        </button>
                    )}
                </div>

                <nav style={{ flex: 1, padding: '16px 0' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={handleNavClick}
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
        </>
    )
}

export default Sidebar
