import { useAuth } from '../context/AuthContext'
import { Search, Bell } from 'lucide-react'
import { useState } from 'react'

const Topbar = ({ title }) => {
    const { user } = useAuth()
    const [search, setSearch] = useState('')

    return (
        <div style={{
            height: '64px',
            background: 'var(--bg-card)',
            borderBottom: '0.5px solid var(--border-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'fixed',
            top: 0,
            left: '240px',
            right: 0,
            zIndex: 99,
            transition: 'background-color 250ms ease, border-color 250ms ease'
        }}>
            <h1 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--text-primary)'
            }}>{title}</h1>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--bg-input)',
                    border: '0.5px solid var(--border-card)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    width: '280px'
                }}>
                    <Search size={16} color='var(--text-muted)' />
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
                            width: '100%'
                        }}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <Bell size={20} color='var(--text-muted)' style={{ cursor: 'pointer' }} />
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
                    }}>3</span>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 12px',
                    background: 'var(--bg-input)',
                    border: '0.5px solid var(--border-card)',
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
                        color: '#fff'
                    }}>
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                            {user?.name || 'Admin'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>● Online</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Topbar
