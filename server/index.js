import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import roastRoutes from './routes/roast.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting: 10 roasts per IP per hour
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000 * 24, // 1 hour
    max: 10, // 10 requests per hour
    message: {
        success: false,
        error: 'Too many roasts! UncleG needs a break. Try again tomorrow. 🔥'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Middleware
app.use(cors());
app.use(express.json());

// Apply rate limiting to roast endpoint
app.use('/api/roast', limiter);

// Routes
app.use('/api', roastRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'UncleG is ready to roast! 🔥' });
});

app.listen(PORT, () => {
    console.log(`🔥 UncleG server running on http://localhost:${PORT}`);
});
