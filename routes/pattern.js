const express = require('express');
const router = express.Router();
const Pattern = require('../models/Pattern');
const { authenticate, authorize } = require('../middleware/auth');

// Create a new pattern
router.post('/', authenticate, async (req, res) => {
    try {
        const { link, type } = req.body;
        const pattern = new Pattern({
            link,
            type,
            createdBy: req.user._id,
        });
        await pattern.save();
        res.status(201).send(pattern);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all patterns for the authenticated user
router.get('/', authenticate, async (req, res) => {
    try {
        const patterns = await Pattern.find({ createdBy: req.user._id });
        res.status(200).send(patterns);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/type/:type', authenticate, async (req, res) => {
    const { type } = req.params;

    try {
        const patterns = await Pattern.find({ type });

        if (!patterns || patterns.length === 0) {
            return res.status(404).json({ error: 'No patterns found for the specified type and user' });
        }

        // Group patterns by user
        const groupedPatterns = {};
        patterns.forEach(pattern => {
            if (!groupedPatterns[pattern.createdBy]) {
                groupedPatterns[pattern.createdBy] = [];
            }
            groupedPatterns[pattern.createdBy].push(pattern);
        });

        res.status(200).json(groupedPatterns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get a specific pattern by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const pattern = await Pattern.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!pattern) {
            return res.status(404).send();
        }
        res.send(pattern);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a pattern by ID
router.patch('/:id', authenticate, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['link', 'type'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const pattern = await Pattern.findOne({ _id: req.params.id, createdBy: req.user._id });

        if (!pattern) {
            return res.status(404).send();
        }

        updates.forEach((update) => pattern[update] = req.body[update]);
        await pattern.save();
        res.send(pattern);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a pattern by ID (only for admins)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const pattern = await Pattern.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

        if (!pattern) {
            return res.status(404).send();
        }

        res.send(pattern);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
