import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import pool from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Skilgreina __dirname rétt í ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware fyrir JSON og formgögn
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Þjónusta static skrár
app.use(express.static(path.join(__dirname, "public")));
app.use('/quiz', express.static(path.join(__dirname, 'data')));

// Session stillingar
app.use(session({
    secret: process.env.SESSION_SECRET || 'lykilord', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Búa til notenda töflu ef hún er ekki til
(async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `);
        console.log("✅ Notenda tafla búin til!");
    } catch (error) {
        console.error("❌ Villa við að búa til töflu:", error);
    }
})();

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/quiz.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "quiz.html"));
});

// API fyrir index.json (skilar lista yfir spurningaskrár)
app.get('/quiz/index', (req, res) => {
    fs.readFile('./data/index.json', 'utf8', (err, data) => {
        if (err) {
            console.error('❌ Villa við að lesa index.json:', err);
            return res.status(500).json({ error: 'Gat ekki sótt index.json' });
        }
        try {
            const quizFiles = JSON.parse(data);
            res.json(quizFiles);
        } catch (parseError) {
            console.error('❌illa við að parse-a index.json:', parseError);
            res.status(500).json({ error: 'Ógild JSON skrá' });
        }
    });
});

// API fyrir að sækja JSON skrár úr `data/`
app.get('/quiz/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'data', filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Villa við að lesa ${filename}:`, err);
            return res.status(500).json({ error: `Gat ekki sótt ${filename}` });
        }
        try {
            const questions = JSON.parse(data);
            res.json(questions);
        } catch (parseError) {
            console.error(`Villa við að parse-a ${filename}:`, parseError);
            res.status(500).json({ error: 'Ógild JSON gögn' });
        }
    });
});

// API fyrir categories úr gagnagrunni
app.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (error) {
        console.error('Villa við að sækja flokka:', error);
        res.status(500).json({ error: 'Gat ekki sótt gögn' });
    }
});

// API fyrir spurningar eftir flokk (ef þær eru í gagnagrunni)
app.get('/questions/:category_id', async (req, res) => {
    const { category_id } = req.params;

    try {
        const questionsResult = await pool.query(
            'SELECT * FROM questions WHERE category_id = $1',
            [category_id]
        );

        const questions = questionsResult.rows;

        for (let question of questions) {
            const answersResult = await pool.query(
                'SELECT id, answer, is_correct FROM answers WHERE question_id = $1',
                [question.id]
            );
            question.answers = answersResult.rows;
        }

        res.json(questions);
    } catch (error) {
        console.error('Villa við að sækja spurningar:', error);
        res.status(500).send('Villa við að sækja gögn');
    }
});

// Keyra serverinn
app.listen(PORT, () => {
    console.log(`Server keyrir á http://localhost:${PORT}`);
});
