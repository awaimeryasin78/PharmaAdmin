import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import { Pill, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import pillBackground from '../assets/pill_background_v2.svg'
import logo from '../assets/pharmaadmin-logo.svg'
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await API.post('/api/auth/login', { email, password })
            login(res.data.user, res.data.token)
            toast.success('Welcome back!')
            navigate('/dashboard')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = (focused) => ({
        width: '100%',
        height: '48px',
        background: focused ? 'rgba(14,165,233,0.08)' : '#0D1830',
        border: focused ? '1px solid #0EA5E9' : '0.5px solid #1E3A5F',
        borderRadius: '8px',
        padding: '0 16px',
        color: '#E2E8F0',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 200ms ease',
        boxShadow: focused ? '0 0 0 3px rgba(14,165,233,0.15)' : 'none',
        boxSizing: 'border-box'
    })

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: `#060D1A url(${pillBackground}) center center / cover no-repeat`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{
                    scale: 1.015,
                    boxShadow: '0 0 80px rgba(6,182,212,0.18), 0 0 0 0.5px rgba(14,165,233,0.6)'
                }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                style={{
                    width: '440px',
                    maxWidth: '90vw',
                    boxSizing: 'border-box',
                    background: 'rgba(10,22,40,0.45)',
                    border: '0.5px solid rgba(30,58,95,0.5)',
                    borderRadius: '20px',
                    padding: '40px',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    position: 'relative',
                    zIndex: 10,
                    boxShadow: '0 0 60px rgba(6,182,212,0.08), 0 0 0 0.5px rgba(30,58,95,0.5)'
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '8px'
                    }}>
                   <img src={logo} alt="PharmaAdmin" style={{ width: '32px', height: '32px' }} />
                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#0EA5E9' }}>
                        PharmaAdmin
                    </span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        fontSize: '26px', fontWeight: '700',
                        color: '#E2E8F0', textAlign: 'center', marginBottom: '8px'
                    }}>
                    Welcome back
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    style={{
                        fontSize: '13px', color: '#475569',
                        textAlign: 'center', marginBottom: '32px'
                    }}>
                    Sign in to your pharmacy dashboard
                </motion.p>

                <form onSubmit={handleLogin}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ marginBottom: '16px' }}
                    >
                        <label style={{
                            fontSize: '13px', color: '#94A3B8',
                            display: 'block', marginBottom: '6px'
                        }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            placeholder="you@example.com"
                            required
                            style={inputStyle(emailFocused)}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                        style={{ marginBottom: '28px' }}
                    >
                        <label style={{
                            fontSize: '13px', color: '#94A3B8',
                            display: 'block', marginBottom: '6px'
                        }}>Password</label>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                placeholder="••••••••"
                                required
                                style={{ ...inputStyle(passwordFocused), paddingRight: '48px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '14px',
                                    top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none',
                                    cursor: 'pointer', color: '#475569'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: '0 0 30px rgba(14,165,233,0.5)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', height: '48px',
                            background: loading
                                ? '#0284C7'
                                : 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                            border: 'none', borderRadius: '8px',
                            color: '#fff', fontSize: '15px', fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 0 20px rgba(14,165,233,0.35)',
                            transition: 'all 200ms ease',
                            letterSpacing: '0.3px',
                            boxSizing: 'border-box'
                        }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                                />
                                Signing in...
                            </span>
                        ) : 'Sign in'}
                    </motion.button>
                </form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    style={{
                        textAlign: 'center', marginTop: '20px',
                        fontSize: '13px', color: '#475569',
                        cursor: 'pointer', transition: 'color 200ms'
                    }}
                    onMouseEnter={e => e.target.style.color = '#0EA5E9'}
                    onMouseLeave={e => e.target.style.color = '#475569'}
                >
                    Forgot password?
                </motion.p>
            </motion.div>
        </div>
    )
}

export default Login
