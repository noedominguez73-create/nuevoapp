import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// STAGE 1: CORE LIFT (No DB, No External Routes)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('<h1>Stage 1: Core Lift - ALIVE</h1>'));
app.get('/health', (req, res) => res.json({ status: 'ALIVE', stage: '1_CORE' }));

app.listen(PORT, () => {
    console.log(`✅ Stage 1 Server running on port ${PORT}`);
});
