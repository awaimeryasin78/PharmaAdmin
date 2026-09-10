import { useAuth } from '../context/AuthContext'
import { Search, Bell, Menu, AlertTriangle, Clock } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

const Topbar = ({ title, isMobile, onMenuClick }) => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [notifOpen, setNotifOpen] = useState(false)
    const [lowStock, setLowStock] = useState([])
    const [expiringSoon, setExpiringSoon] = useState([])
    const notifRef = useRef(null)

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const [lowRes, expRes] = await Promise.all([
                    API.get('/api/medicines/low-stock'),
                    API.get('/api/medicines/expiring-soon')
                ])
                setLowStock(lowRes.data)
                setExpiringSoon(expRes.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAlerts()
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const totalAlerts = lowStock.length + expiringSoon.length

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (search.trim()) {
            navigate(`/inventory?search=${encodeURIComponent(search.trim())}`)
            if (isMobile) setSearch('')
        }
    }

    return (
        <div style={{
            height: '64px',
            background: 'var(--bg-card)',
            borderBottom: '0.5px solid var(--border-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '0 16px' : '0 32px',
            position: 'fixed',
            top: 0,
            left: isMobile ? 0 : '240px',
            right: 0,
            zIndex: 100,
            transition: 'background-color 250ms ease, border-color 250ms ease',
            gap: '12px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                {isMobile && (
                    <button onClick={onMenuClick} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-primary)', padding: '4px', flexShrink: 0
                    }}>
                        <Menu size={22} />
                    </button>
                )}
                <h1 style={{
                    fontSize: isMobile ? '16px' : '20px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>{title}</h1>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '10px' : '16px',
                flexShrink: 0
            }}>
                {!isMobile && (
                    <form onSubmit={handleSearchSubmit} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--bg-input)',
                        border: '0.5px solid var(--border-card)',
                        borderRadius: '8px',
                        padding: '0 14px',
                        width: '280px'
                    }}>
                        <Search size={16} color='var(--text-muted)' style={{ cursor: 'pointer' }} onClick={handleSearchSubmit} />
                        <input
                            type="text"
                            placeholder="Search medicines and orders..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '13px',
                                width: '100%',
                                height: '40px'
                            }}
                        />
                    </form>
                )}

                <div ref={notifRef} style={{ position: 'relative' }}>
                    <div onClick={() => setNotifOpen(!notifOpen)} style={{ cursor: 'pointer', position: 'relative' }}>
                        <Bell size={20} color='var(--text-muted)' />
                        {totalAlerts > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                background: '#EF4444',
                                color: '#fff',
                                fontSize: '9px',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '600'
                            }}>{totalAlerts}</span>
                        )}
                    </div>

                    {notifOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '32px',
                            right: isMobile ? '-16px' : 0,
                            width: isMobile ? '280px' : '320px',
                            maxHeight: '360px',
                            overflowY: 'auto',
                            background: 'var(--bg-card)',
                            border: '0.5px solid var(--border-card)',
                            borderRadius: '12px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                            zIndex: 300,
                            padding: '10px'
                        }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', padding: '4px 8px 10px' }}>
                                Notifications
                            </div>

                            {totalAlerts === 0 ? (
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '12px 8px' }}>
                                    No alerts right now. All good!
                                </div>
                            ) : (
                                <>
                                    {lowStock.slice(0, 4).map(med => (
                                        <div key={med._id} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '8px', borderRadius: '8px', cursor: 'pointer'
                                        }} onClick={() => { setNotifOpen(false); navigate('/alerts') }}>
                                            <AlertTriangle size={15} color='#F59E0B' />
                                            <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                                                {med.name} — low stock ({med.quantity} left)
                                            </div>
                                        </div>
                                    ))}
                                    {expiringSoon.slice(0, 4).map(med => (
                                        <div key={med._id} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '8px', borderRadius: '8px', cursor: 'pointer'
                                        }} onClick={() => { setNotifOpen(false); navigate('/alerts') }}>
                                            <Clock size={15} color='#EF4444' />
                                            <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                                                {med.name} — expiring soon
                                            </div>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => { setNotifOpen(false); navigate('/alerts') }}
                                        style={{
                                            textAlign: 'center', fontSize: '12px', color: 'var(--accent-primary)',
                                            padding: '10px 8px 4px', cursor: 'pointer', borderTop: '0.5px solid var(--border-card)', marginTop: '6px'
                                        }}
                                    >
                                        View all alerts
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: isMobile ? '4px' : '6px 12px',
                    background: isMobile ? 'transparent' : 'var(--bg-input)',
                    border: isMobile ? 'none' : '0.5px solid var(--border-card)',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#fff',
                        flexShrink: 0
                    }}>
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    {!isMobile && (
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                                {user?.name || 'Admin'}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>● Online</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Topbar
