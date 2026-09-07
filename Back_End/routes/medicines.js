const express = require('express')
const router = express.Router()
const Medicine = require('../models/Medicine')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    try {
        const medicines = await Medicine.find()
        res.json(medicines)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

router.get('/low-stock', auth, async (req, res) => {
    try {
        const medicines = await Medicine.find({ quantity: { $lt: 10 } })
        res.json(medicines)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

router.get('/expiring-soon', auth, async (req, res) => {
    try {
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
        const medicines = await Medicine.find({ expiryDate: { $lte: thirtyDaysFromNow } })
        res.json(medicines)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id)
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' })
        }
        res.json(medicine)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

router.post('/', auth, async (req, res) => {
    try {
        const medicine = new Medicine(req.body)
        await medicine.save()
        res.status(201).json(medicine)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

router.put('/:id', auth, async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' })
        }
        res.json(medicine)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id)
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' })
        }
        res.json({ message: 'Medicine deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

module.exports = router