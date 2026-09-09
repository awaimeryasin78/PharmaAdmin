import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import API from '../api/axios'
import { User, Mail, Shield, Sun, Moon, Pill, Lock, Bell, AlertTriangle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const Settings = () => {
    const { user } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [saving, setSaving] = useState(false)

    const [notifLowStock, setNotifLowStock] = useState(() => localStorage.getItem('notifLowStock') !== 'false')
    const [notifExpiry, setNotifExpiry] = useState(() => localStorage.getItem('notifExpiry') !== 'false')

    const toggleNotif = (type) => {
        if (type === 'lowStock') {
            const newVal = !notifLowStock
            setNotifLowStock(newVal)
            localStorage.setItem('notifLowStock', newVal)
        } else {
            const newVal = !notifExpiry
            setNotifExpiry(newVal)
            localStorage.setItem('notifExpiry', newVal)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match')
            return
        }
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters')
            return
        }
        setSaving(true)
        try {
            await API.put('/api/auth/change-password', { currentPassword, newPassword })
            toast.success('Password updated successfully')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password')
        } finally {
            setSaving(false)
        }
    }

    const cardStyle = {
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border-card)',
        borderRadius: '16px',
        padding: '24px'
    }

    const rowStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '0.5px solid var(--border-card)'
    }

    const inputStyle = {
        width: '100%',
        height: '42px',
        background: 'var(--bg-input)',
        border: '0.5px solid var(--border-card)',
        borderRadius: '8px',
        padding: '0 14px',
        color: 'var(--text-primary)',
        fontSize: '13px',
        outline: 'none',
        boxSizing: 'border-box'
    }

    const Toggle = ({ checked, onChange }) => (
        <button
            onClick={onChange}
            style={{
                width: '42px', height: '24px', borderRadius: '9999px',
                background: checked ? 'var(--accent-primary)' : 'var(--border-card)',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 200ms'
            }}
        >
            <motion.div
                animate={{ x: checked ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: '#fff', position: 'absolute', top: '2px'
                }}
            />
        </button>
    )

    return (
        <Layout title="Settings">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                        <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '18px' }}>
                            Account Information
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: 'var(--accent-primary)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: '20px', fontWeight: '700', color: '#fff'
                            }}>
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    {user?.name || 'Admin'}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pharmacy Administrator</div>
                            </div>
                        </div>

                        <div style={rowStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <User size={16} color='var(--text-muted)' />
                                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Full Name</span>
                            </div>
                            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{user?.name || '—'}</span>
                        </div>

                        <div style={rowStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Mail size={16} color='var(--text-muted)' />
                                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Email Address</span>
                            </div>
                            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{user?.email || '—'}</span>
                        </div>

                        <div style={{ ...rowStyle, borderBottom: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Shield size={16} color='var(--text-muted)' />
                                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Role</span>
                            </div>
                            <span style={{
                                fontSize: '11px', fontWeight: '500', color: '#0EA5E9',
                                background: 'rgba(14,165,233,0.12)', padding: '3px 10px', borderRadius: '9999px'
                            }}>Administrator</span>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={cardStyle}>
                        <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '18px' }}>
                            Appearance
                        </h3>

                        <div style={{ ...rowStyle, borderBottom: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {theme === 'dark' ? <Moon size={16} color='var(--text-muted)' /> : <Sun size={16} color='var(--text-muted)' />}
                                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Theme</span>
                            </div>
                            <button
                                onClick={toggleTheme}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 16px', borderRadius: '8px',
                                    background: 'var(--bg-input)', border: '0.5px solid var(--border-card)',
                                    color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer'
                                }}
                            >
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'} — Switch
                            </button>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                            <Pill size={18} color='var(--accent-primary)' />
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>About PharmaAdmin</h3>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            PharmaAdmin is a full-stack pharmacy management system built with the MERN stack
                            (MongoDB, Express, React, Node.js). Manage inventory, process sales, track alerts,
                            and view analytics — all in one place.
                        </p>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
                            Version 1.0.0
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                            <Lock size={18} color='var(--accent-primary)' />
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>Change Password</h3>
                        </div>

                        <form onSubmit={handleChangePassword}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Current Password</label>
                                <input
                                    type="password" required value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>New Password</label>
                                <input
                                    type="password" required value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
                                <input
                                    type="password" required value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <button
                                type="submit" disabled={saving}
                                style={{
                                    width: '100%', height: '42px', borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                                    border: 'none', color: '#fff', fontSize: '13px', fontWeight: '600',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 0 16px rgba(14,165,233,0.3)'
                                }}
                            >
                                {saving ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                            <Bell size={18} color='var(--accent-primary)' />
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>Notification Preferences</h3>
                        </div>

                        <div style={rowStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertTriangle size={16} color='#F59E0B' />
                                <div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Low Stock Alerts</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Notify when stock falls below 10</div>
                                </div>
                            </div>
                            <Toggle checked={notifLowStock} onChange={() => toggleNotif('lowStock')} />
                        </div>

                        <div style={{ ...rowStyle, borderBottom: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock size={16} color='#EF4444' />
                                <div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Expiry Alerts</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Notify for medicines expiring within 30 days</div>
                                </div>
                            </div>
                            <Toggle checked={notifExpiry} onChange={() => toggleNotif('expiry')} />
                        </div>
                    </motion.div>
                </div>

            </div>
        </Layout>
    )
}

export default Settings
