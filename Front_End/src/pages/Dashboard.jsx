import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import API from '../api/axios'
import { Package, DollarSign, AlertTriangle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const StatCard = ({ icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
       style={{
    background: 'var(--bg-card)',
    border: '0.5px solid var(--border-card)',
    borderRadius: '16px',
    padding: '20px 24px',
    borderTop: `3px solid ${color}`,
    flex: 1,
    minWidth: '220px',
    boxShadow: `0 4px 20px ${color}40, 0 0 0 1px ${color}20`,
    position: 'relative',
    overflow: 'hidden'
}}
    >
        <div style={{
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '100%',
    background: `linear-gradient(180deg, ${color}12 0%, transparent 40%)`,
    pointerEvents: 'none'
}} />
        <div style={{
            width: '40px', height: '40px',
            borderRadius: '8px',
           background: `${color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px'
        }}>
            {icon}
        </div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)' }}>{value}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{label}</div>
    </motion.div>
)

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        totalValue: 0,
        lowStock: 0,
        expiringSoon: 0
    })
    const [lowStockMeds, setLowStockMeds] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medsRes, lowStockRes, expiringRes] = await Promise.all([
                    API.get('/api/medicines'),
                    API.get('/api/medicines/low-stock'),
                    API.get('/api/medicines/expiring-soon')
                ])

                const totalValue = medsRes.data.reduce((sum, m) => sum + (m.price * m.quantity), 0)

                setStats({
                    total: medsRes.data.length,
                    totalValue,
                    lowStock: lowStockRes.data.length,
                    expiringSoon: expiringRes.data.length
                })
                setLowStockMeds(lowStockRes.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const getStatusBadge = (medicine) => {
        const isExpired = new Date(medicine.expiryDate) < new Date()
        const isLow = medicine.quantity < 10

        if (isExpired) return { text: 'Expired', bg: 'rgba(239,68,68,0.12)', color: '#EF4444' }
        if (isLow) return { text: 'Low Stock', bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' }
        return { text: 'In Stock', bg: 'rgba(34,197,94,0.12)', color: '#22C55E' }
    }

    return (
        <Layout title="Dashboard">
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                

                <StatCard
                    icon={<Package size={20} color='#0EA5E9' />}
                    label="Total Medicines"
                    value={loading ? '...' : stats.total}
                    color="#0EA5E9"
                    delay={0.1}
                />
                <StatCard
                    icon={<DollarSign size={20} color='#8B5CF6' />}
                    label="Total Value"
                    value={loading ? '...' : `PKR ${stats.totalValue.toLocaleString()}`}
                    color="#8B5CF6"
                    delay={0.15}
                />
                <StatCard
                    icon={<AlertTriangle size={20} color='#F59E0B' />}
                    label="Low Stock"
                    value={loading ? '...' : stats.lowStock}
                    color="#F59E0B"
                    delay={0.2}
                />
                
                <StatCard
                    icon={<Clock size={20} color='#EF4444' />}
                    label="Expiring Soon"
                    value={loading ? '...' : stats.expiringSoon}
                    color="#EF4444"
                    delay={0.25}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{
                    background: 'var(--bg-card)',
                    border: '0.5px solid var(--border-card)',
                    borderRadius: '16px',
                    padding: '24px'
                }}
            >
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    Low Stock Alerts
                </h3>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</p>
                ) : lowStockMeds.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                        No low stock medicines. Add some medicines from the Inventory page to get started.
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '0.5px solid #1E3A5F' }}>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Medicine Name</th>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Quantity</th>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Status</th>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Expiry Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockMeds.map((med) => {
                                    const badge = getStatusBadge(med)
                                    return (
                                        <tr key={med._id} style={{ borderBottom: '0.5px solid #111C2E' }}>
                                            <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-primary)' }}>{med.name}</td>
                                            <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>{med.quantity}</td>
                                            <td style={{ padding: '12px 8px' }}>
                                                <span style={{
                                                    fontSize: '11px', padding: '3px 10px',
                                                    borderRadius: '9999px', fontWeight: '500',
                                                    background: badge.bg, color: badge.color
                                                }}>{badge.text}</span>
                                            </td>
                                            <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                {new Date(med.expiryDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </Layout>
    )
}

export default Dashboard
