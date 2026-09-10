import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import API from '../api/axios'
import { Line, Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js'
import { motion } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler)

const Reports = () => {
    const isMobile = useIsMobile()
    const [medicines, setMedicines] = useState([])
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medsRes, salesRes] = await Promise.all([
                    API.get('/api/medicines'),
                    API.get('/api/sales')
                ])
                setMedicines(medsRes.data)
                setSales(salesRes.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Sales grouped by day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return d
    })

    const salesByDay = last7Days.map(day => {
        const dayStr = day.toDateString()
        return sales
            .filter(s => new Date(s.createdAt).toDateString() === dayStr)
            .reduce((sum, s) => sum + s.finalAmount, 0)
    })

    const lineData = {
        labels: last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'short' })),
        datasets: [{
            label: 'Sales (PKR)',
            data: salesByDay,
            borderColor: '#06B6D4',
            backgroundColor: 'rgba(6,182,212,0.15)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0EA5E9',
            pointBorderColor: '#0EA5E9',
            pointRadius: 4
        }]
    }

    // Stock value by category
    const categoryTotals = {}
    medicines.forEach(med => {
        const value = med.price * med.quantity
        categoryTotals[med.category] = (categoryTotals[med.category] || 0) + value
    })

    const categoryColors = ['#0EA5E9', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16', '#A855F7']

    const doughnutData = {
        labels: Object.keys(categoryTotals),
        datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: categoryColors,
            borderWidth: 0
        }]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#94A3B8', font: { size: 11 } }
            }
        },
        scales: {
            x: { ticks: { color: '#475569' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#475569' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: isMobile ? 'bottom' : 'right',
                labels: { color: '#94A3B8', font: { size: 11 }, boxWidth: 12, padding: 12 }
            }
        }
    }

    const topSelling = {}
    sales.forEach(sale => {
        sale.medicines.forEach(item => {
            topSelling[item.name] = (topSelling[item.name] || 0) + item.quantity
        })
    })
    const topSellingSorted = Object.entries(topSelling).sort((a, b) => b[1] - a[1]).slice(0, 5)

    const cardStyle = {
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border-card)',
        borderRadius: '16px',
        padding: '20px'
    }

    const totalRevenue = sales.reduce((sum, s) => sum + s.finalAmount, 0)

    return (
        <Layout title="Reports & Analytics">
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ ...cardStyle, flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>TOTAL SALES</div>
                    <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>{sales.length}</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    style={{ ...cardStyle, flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>TOTAL REVENUE</div>
                    <div style={{ fontSize: '26px', fontWeight: '700', color: '#22C55E' }}>PKR {totalRevenue.toLocaleString()}</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{ ...cardStyle, flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>AVG SALE VALUE</div>
                    <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        PKR {sales.length ? Math.round(totalRevenue / sales.length).toLocaleString() : 0}
                    </div>
                </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={cardStyle}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                        Weekly Sales Trend
                    </h3>
                    <div style={{ height: '260px' }}>
                        {loading ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</p>
                        ) : (
                            <Line data={lineData} options={chartOptions} />
                        )}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={cardStyle}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                        Stock Value by Category
                    </h3>
                    <div style={{ height: '260px' }}>
                        {loading ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</p>
                        ) : Object.keys(categoryTotals).length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No medicines yet.</p>
                        ) : (
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        )}
                    </div>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={cardStyle}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    Top Selling Medicines
                </h3>
                {topSellingSorted.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No sales recorded yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {topSellingSorted.map(([name, qty], i) => {
                            const maxQty = topSellingSorted[0][1]
                            const percent = (qty / maxQty) * 100
                            return (
                                <div key={name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                        <span style={{ color: 'var(--text-primary)' }}>{name}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{qty} sold</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.1 }}
                                            style={{
                                                height: '100%',
                                                background: 'linear-gradient(90deg, #0EA5E9, #06B6D4)',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </motion.div>
        </Layout>
    )
}

export default Reports
