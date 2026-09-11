import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import API from '../api/axios'
import { Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useIsMobile } from '../hooks/useIsMobile'

const Sales = () => {
    const isMobile = useIsMobile()
    const [medicines, setMedicines] = useState([])
    const [search, setSearch] = useState('')
    const [cart, setCart] = useState([])
    const [discount, setDiscount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [salesHistory, setSalesHistory] = useState([])

    const fetchSalesHistory = async () => {
        try {
            const res = await API.get('/api/sales')
            setSalesHistory(res.data.reverse())
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const res = await API.get('/api/medicines')
                setMedicines(res.data)
            } catch (error) {
                toast.error('Failed to load medicines')
            } finally {
                setLoading(false)
            }
        }
        fetchMedicines()
        fetchSalesHistory()
    }, [])

    const filteredMedicines = medicines.filter(med =>
        med.name.toLowerCase().includes(search.toLowerCase()) && med.quantity > 0
    )

    const addToCart = (medicine) => {
        const existing = cart.find(item => item.medicine === medicine._id)
        if (existing) {
            if (existing.quantity >= medicine.quantity) {
                toast.error('Not enough stock available')
                return
            }
            setCart(cart.map(item =>
                item.medicine === medicine._id ? { ...item, quantity: item.quantity + 1 } : item
            ))
        } else {
            setCart([...cart, {
                medicine: medicine._id,
                name: medicine.name,
                price: medicine.price,
                quantity: 1,
                maxQuantity: medicine.quantity
            }])
        }
    }

    const updateQuantity = (medicineId, delta) => {
        setCart(cart.map(item => {
            if (item.medicine === medicineId) {
                const newQty = item.quantity + delta
                if (newQty < 1) return item
                if (newQty > item.maxQuantity) {
                    toast.error('Not enough stock available')
                    return item
                }
                return { ...item, quantity: newQty }
            }
            return item
        }))
    }

    const removeFromCart = (medicineId) => {
        setCart(cart.filter(item => item.medicine !== medicineId))
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const discountAmount = (subtotal * discount) / 100
    const total = subtotal - discountAmount

    const handleCompleteSale = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty')
            return
        }
        setProcessing(true)
        try {
            await API.post('/api/sales', {
                medicines: cart.map(item => ({
                    medicine: item.medicine,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: subtotal,
                discount: discountAmount,
                finalAmount: total
            })
            toast.success('Sale completed successfully!')
            setCart([])
            setDiscount(0)
            const res = await API.get('/api/medicines')
            setMedicines(res.data)
            fetchSalesHistory()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to complete sale')
        } finally {
            setProcessing(false)
        }
    }

    const cardStyle = {
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border-card)',
        borderRadius: '16px',
        padding: '20px'
    }

    return (
        <Layout title="Sales / Billing">
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: '20px', alignItems: 'start' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={cardStyle}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--bg-input)', border: '0.5px solid var(--border-card)',
                            borderRadius: '8px', padding: '0 14px', height: '44px', marginBottom: '16px'
                        }}>
                            <Search size={16} color='var(--text-muted)' />
                            <input
                                type="text"
                                placeholder="Search medicines to sell..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    background: 'transparent', border: 'none', outline: 'none',
                                    color: 'var(--text-primary)', fontSize: '13px', width: '100%'
                                }}
                            />
                        </div>

                        {loading ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading medicines...</p>
                        ) : filteredMedicines.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No medicines found.</p>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: isMobile ? '8px' : '12px'
                            }}>
                                {filteredMedicines.map(med => (
                                    <motion.div
                                        key={med._id}
                                        whileHover={{ y: -3 }}
                                        style={{
                                            background: 'var(--bg-input)', border: '0.5px solid var(--border-card)',
                                            borderRadius: '10px', padding: isMobile ? '10px' : '14px', cursor: 'pointer'
                                        }}
                                        onClick={() => addToCart(med)}
                                    >
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                            {med.name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                                            Stock: {med.quantity}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0EA5E9' }}>PKR {med.price}</span>
                                            <span style={{
                                                width: '28px', height: '28px', borderRadius: '6px',
                                                background: 'rgba(14,165,233,0.15)', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Plus size={14} color='#0EA5E9' />
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {salesHistory.length > 0 && (
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' }}>
                                Recent Sales
                            </h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '0.5px solid var(--border-card)' }}>
                                            {['Date', 'Items', 'Discount', 'Total'].map(h => (
                                                <th key={h} style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesHistory.slice(0, 10).map(sale => (
                                            <tr key={sale._id} style={{ borderBottom: '0.5px solid var(--border-card)' }}>
                                                <td style={{ padding: '10px 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                    {new Date(sale.createdAt).toLocaleString()}
                                                </td>
                                                <td style={{ padding: '10px 8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                                                    {sale.medicines.map(m => `${m.name} x${m.quantity}`).join(', ')}
                                                </td>
                                                <td style={{ padding: '10px 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                    PKR {sale.discount.toFixed(2)}
                                                </td>
                                                <td style={{ padding: '10px 8px', fontSize: '13px', color: '#22C55E', fontWeight: '600' }}>
                                                    PKR {sale.finalAmount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ ...cardStyle, position: isMobile ? 'static' : 'sticky', top: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <ShoppingCart size={18} color='var(--text-primary)' />
                        <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>Live Cart</h3>
                    </div>

                    {cart.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0', textAlign: 'center' }}>
                            Cart is empty. Click a medicine to add it.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', maxHeight: '320px', overflowY: 'auto' }}>
                            <AnimatePresence>
                                {cart.map(item => (
                                    <motion.div
                                        key={item.medicine}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '10px', background: 'var(--bg-input)', borderRadius: '8px'
                                        }}
                                    >
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.name}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PKR {item.price} each</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <button onClick={() => updateQuantity(item.medicine, -1)} style={{
                                                width: '22px', height: '22px', border: 'none', borderRadius: '4px',
                                                background: 'var(--border-card)', color: 'var(--text-primary)', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}><Minus size={12} /></button>
                                            <span style={{ fontSize: '12px', color: 'var(--text-primary)', width: '18px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.medicine, 1)} style={{
                                                width: '22px', height: '22px', border: 'none', borderRadius: '4px',
                                                background: 'var(--border-card)', color: 'var(--text-primary)', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}><Plus size={12} /></button>
                                            <button onClick={() => removeFromCart(item.medicine)} style={{
                                                background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', marginLeft: '4px'
                                            }}><Trash2 size={14} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    <div style={{ borderTop: '0.5px solid var(--border-card)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            <span>Subtotal</span><span>PKR {subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            <span>Discount (%)</span>
                            <input
                                type="number" min="0" max="100" value={discount}
                                onChange={e => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                                style={{
                                    width: '60px', height: '28px', background: 'var(--bg-input)',
                                    border: '0.5px solid var(--border-card)', borderRadius: '6px',
                                    color: 'var(--text-primary)', textAlign: 'right', padding: '0 8px', fontSize: '12px'
                                }}
                            />
                        </div>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', fontSize: '16px',
                            fontWeight: '700', color: 'var(--text-primary)', paddingTop: '8px',
                            borderTop: '0.5px solid var(--border-card)'
                        }}>
                            <span>Total</span><span>PKR {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCompleteSale}
                        disabled={processing || cart.length === 0}
                        style={{
                            width: '100%', height: '46px', marginTop: '16px',
                            background: cart.length === 0 ? '#334155' : 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                            border: 'none', borderRadius: '8px', color: '#fff',
                            fontSize: '14px', fontWeight: '600',
                            cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                            boxShadow: cart.length === 0 ? 'none' : '0 0 20px rgba(14,165,233,0.3)'
                        }}
                    >
                        {processing ? 'Processing...' : 'Complete Sale'}
                    </motion.button>
                </div>

            </div>
        </Layout>
    )
}

export default Sales
