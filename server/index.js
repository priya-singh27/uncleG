import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import roastRoutes from './routes/roast.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', roastRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'UncleG is ready to roast! 🔥' });
});

app.listen(PORT, () => {
    console.log(`🔥 UncleG server running on http://localhost:${PORT}`);
});
