import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import API from '../api/axios'
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

const Alerts = () => {
    const isMobile = useIsMobile()
    const [lowStock, setLowStock] = useState([])
    const [expiringSoon, setExpiringSoon] = useState([])
    const [loading, setLoading] = useState(true)

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
            } finally {
                setLoading(false)
            }
        }
        fetchAlerts()
    }, [])

    const cardStyle = {
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border-card)',
        borderRadius: '16px',
        padding: '20px'
    }

    const AlertSection = ({ title, icon, items, color, emptyText, renderDetail }) => (
        <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: `${color}22`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    {icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</h3>
                <span style={{
                    marginLeft: 'auto', fontSize: '12px', fontWeight: '600',
                    color, background: `${color}18`, padding: '3px 10px', borderRadius: '9999px'
                }}>{items.length}</span>
            </div>

            {loading ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</p>
            ) : items.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{emptyText}</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {items.map((med, i) => (
                        <motion.div
                            key={med._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 14px', background: 'var(--bg-input)', borderRadius: '10px',
                                borderLeft: `3px solid ${color}`,
                                animation: 'pulseGlow 2.5s ease-in-out infinite'
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{med.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    {renderDetail(med)}
                                </div>
                            </div>
                            <span style={{
                                fontSize: '11px', color, background: `${color}18`,
                                padding: '4px 12px', borderRadius: '9999px', fontWeight: '500',
                                whiteSpace: 'nowrap'
                            }}>
                                {renderDetail === lowStockDetail ? `${med.quantity} left` : 'Expiring'}
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )

    const lowStockDetail = (med) => `Category: ${med.category} · Reorder recommended`
    const expiringDetail = (med) => `Expires ${new Date(med.expiryDate).toLocaleDateString()}`

    return (
        <Layout title="Alerts">
            <style>{`
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 0 rgba(245,158,11,0); }
                    50% { box-shadow: 0 0 16px rgba(245,158,11,0.15); }
                }
            `}</style>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                <AlertSection
                    title="Low Stock"
                    icon={<AlertTriangle size={18} color='#F59E0B' />}
                    items={lowStock}
                    color="#F59E0B"
                    emptyText="No low stock medicines right now. Everything is well stocked."
                    renderDetail={lowStockDetail}
                />
                <AlertSection
                    title="Expiring Soon"
                    icon={<Clock size={18} color='#EF4444' />}
                    items={expiringSoon}
                    color="#EF4444"
                    emptyText="No medicines expiring in the next 30 days."
                    renderDetail={expiringDetail}
                />
            </div>
        </Layout>
    )
}

export default Alerts
