const express = require('express')
const router = express.Router()
const Sale = require('../models/Sale')
const Medicine = require('../models/Medicine')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('medicines.medicine', 'name')
            .populate('soldBy', 'name')
        res.json(sales)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

router.post('/', auth, async (req, res) => {
    try {
        const { medicines, totalAmount, discount, finalAmount } = req.body

        for (let item of medicines) {
            const medicine = await Medicine.findById(item.medicine)
            if (!medicine) {
                return res.status(404).json({ message: `Medicine not found` })
            }
            if (medicine.quantity < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${medicine.name}` })
            }
            medicine.quantity -= item.quantity
            await medicine.save()
        }

        const sale = new Sale({
            medicines,
            totalAmount,
            discount,
            finalAmount,
            soldBy: req.user.userId
        })

        await sale.save()
        res.status(201).json(sale)

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

router.get('/stats', auth, async (req, res) => {
    try {
        const totalSales = await Sale.countDocuments()
        const salesData = await Sale.find()
        const totalRevenue = salesData.reduce((sum, sale) => sum + sale.finalAmount, 0)
        res.json({ totalSales, totalRevenue })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

module.exports = router