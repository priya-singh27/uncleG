import express from 'express';

const router = express.Router();

// Placeholder route - will be implemented in Phase 2
router.post('/roast', async (req, res) => {
    res.json({
        message: 'Roast endpoint ready! Implementation coming in Phase 2.',
        received: req.body
    });
});

export default router;
