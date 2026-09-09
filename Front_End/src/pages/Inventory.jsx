import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import API from '../api/axios'
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const CATEGORIES = ['Antibiotic', 'Analgesic', 'Vitamin', 'Antacid', 'Antihistamine', 'Anti-inflammatory', 'Proton Pump Inhibitor', 'Antidiabetic', 'Other']

const emptyForm = {
    name: '', genericName: '', category: 'Analgesic', price: '',
    quantity: '', manufacturer: '', expiryDate: '', description: ''
}

const Inventory = () => {
    const [medicines, setMedicines] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)

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

    useEffect(() => {
        fetchMedicines()
    }, [])

    const getStatus = (medicine) => {
        const isExpired = new Date(medicine.expiryDate) < new Date()
        const daysToExpiry = (new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        const isExpiringSoon = daysToExpiry <= 30 && daysToExpiry > 0
        const isLow = medicine.quantity < 10

        if (isExpired) return { text: 'Expired', bg: 'rgba(239,68,68,0.12)', color: '#EF4444' }
        if (isExpiringSoon) return { text: 'Expiring Soon', bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }
        if (isLow) return { text: 'Low Stock', bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' }
        return { text: 'In Stock', bg: 'rgba(34,197,94,0.12)', color: '#22C55E' }
    }

    const filteredMedicines = medicines.filter(med => {
        const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase()) ||
            med.genericName?.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = categoryFilter === 'All' || med.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const openAddModal = () => {
        setForm(emptyForm)
        setEditingId(null)
        setShowModal(true)
    }

    const openEditModal = (medicine) => {
        setForm({
            name: medicine.name,
            genericName: medicine.genericName || '',
            category: medicine.category,
            price: medicine.price,
            quantity: medicine.quantity,
            manufacturer: medicine.manufacturer || '',
            expiryDate: medicine.expiryDate?.split('T')[0] || '',
            description: medicine.description || ''
        })
        setEditingId(medicine._id)
        setShowModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editingId) {
                await API.put(`/api/medicines/${editingId}`, form)
                toast.success('Medicine updated successfully')
            } else {
                await API.post('/api/medicines', form)
                toast.success('Medicine added successfully')
            }
            setShowModal(false)
            fetchMedicines()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this medicine?')) return
        try {
            await API.delete(`/api/medicines/${id}`)
            toast.success('Medicine deleted')
            fetchMedicines()
        } catch (error) {
            toast.error('Failed to delete medicine')
        }
    }

    const inputStyle = {
        width: '100%',
        height: '44px',
        background: 'var(--bg-input)',
        border: '0.5px solid var(--border-card)',
        borderRadius: '8px',
        padding: '0 14px',
        color: 'var(--text-primary)',
        fontSize: '13px',
        outline: 'none',
        boxSizing: 'border-box'
    }

    return (
        <Layout title="Inventory">
            <div style={{
                display: 'flex', gap: '12px', marginBottom: '20px',
                flexWrap: 'wrap', alignItems: 'center'
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'var(--bg-input)', border: '0.5px solid var(--border-card)',
                    borderRadius: '8px', padding: '0 14px', height: '42px', flex: 1, minWidth: '200px'
                }}>
                    <Search size={16} color='var(--text-muted)' />
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            background: 'transparent', border: 'none', outline: 'none',
                            color: 'var(--text-primary)', fontSize: '13px', width: '100%'
                        }}
                    />
                </div>

                <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    style={{
                        height: '42px', background: 'var(--bg-input)',
                        border: '0.5px solid var(--border-card)', borderRadius: '8px',
                        padding: '0 12px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none'
                    }}
                >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={openAddModal}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        height: '42px', padding: '0 20px',
                        background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                        border: 'none', borderRadius: '8px', color: '#fff',
                        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(14,165,233,0.3)'
                    }}
                >
                    <Plus size={16} /> Add Medicine
                </motion.button>
            </div>

            <div style={{
                background: 'var(--bg-card)', border: '0.5px solid var(--border-card)',
                borderRadius: '16px', padding: '8px', overflowX: 'auto'
            }}>
                {loading ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px' }}>Loading...</p>
                ) : filteredMedicines.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px' }}>
                        No medicines found. Click "Add Medicine" to get started.
                    </p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ borderBottom: '0.5px solid var(--border-card)' }}>
                                {['Medicine Name', 'Category', 'Price', 'Quantity', 'Expiry Date', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredMedicines.map((med) => {
                                    const status = getStatus(med)
                                    return (
                                        <motion.tr
                                            key={med._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ borderBottom: '0.5px solid var(--border-card)' }}
                                        >
                                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary)' }}>
                                                {med.name}
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{med.genericName}</div>
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{med.category}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>PKR {med.price}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{med.quantity}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                {new Date(med.expiryDate).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{
                                                    fontSize: '11px', padding: '3px 10px', borderRadius: '9999px',
                                                    fontWeight: '500', background: status.bg, color: status.color
                                                }}>{status.text}</span>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => openEditModal(med)} style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: 'var(--text-muted)', padding: '4px'
                                                    }}><Pencil size={15} /></button>
                                                    <button onClick={() => handleDelete(med._id)} style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: '#EF4444', padding: '4px'
                                                    }}><Trash2 size={15} /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(6,13,26,0.75)', backdropFilter: 'blur(4px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                width: '520px', maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto',
                                background: 'var(--bg-card)', border: '0.5px solid var(--border-card)',
                                borderRadius: '16px', padding: '28px 32px', boxSizing: 'border-box'
                            }}
                        >
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderBottom: '0.5px solid var(--border-card)', paddingBottom: '16px', marginBottom: '20px'
                            }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    {editingId ? 'Edit Medicine' : 'Add New Medicine'}
                                </h3>
                                <button onClick={() => setShowModal(false)} style={{
                                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                                }}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSave}>
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Medicine Name</label>
                                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Generic Name</label>
                                    <input value={form.genericName} onChange={e => setForm({ ...form, genericName: e.target.value })} style={inputStyle} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Category</label>
                                        <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Manufacturer</label>
                                        <input value={form.manufacturer} onChange={e => setForm({ ...form, manufacturer: e.target.value })} style={inputStyle} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Price (PKR)</label>
                                        <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Quantity</label>
                                        <input required type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} style={inputStyle} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Expiry Date</label>
                                    <input required type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} style={inputStyle} />
                                </div>

                                <div style={{ marginBottom: '22px' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Description</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, height: 'auto', padding: '10px 14px', resize: 'vertical' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{
                                        padding: '10px 20px', borderRadius: '8px', background: 'transparent',
                                        border: '0.5px solid var(--border-card)', color: 'var(--text-secondary)',
                                        fontSize: '13px', cursor: 'pointer'
                                    }}>Cancel</button>
                                    <button type="submit" disabled={saving} style={{
                                        padding: '10px 24px', borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                                        border: 'none', color: '#fff', fontSize: '13px', fontWeight: '600',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 0 16px rgba(14,165,233,0.3)'
                                    }}>{saving ? 'Saving...' : 'Save Medicine'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    )
}

export default Inventory
