import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import pool from './db.js';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'lykilord', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

(async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `);
        console.log("Notenda tafla búin til!");
    } catch (error) {
        console.error("Villa við að búa til töflu:", error);
    }
})();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/quiz.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "quiz.html"));
});


app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Vinsamlegast fylltu út öll svæði" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        req.session.user = { id: result.rows[0].id, username: result.rows[0].username };
        res.json({ message: "Notandi búinn til!" });
    } catch (error) {
        console.error("Villa við nýskráningu:", error);
        res.status(500).json({ error: "Gat ekki búið til notanda" });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Vinsamlegast fylltu út öll svæði" });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rowCount === 0) {
            return res.status(401).json({ error: "Rangt notandanafn eða lykilorð" });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Rangt notandanafn eða lykilorð" });
        }

        req.session.user = { id: user.id, username: user.username };
        res.json({ message: "Innskráning tókst!" });
    } catch (error) {
        console.error("Villa við innskráningu:", error);
        res.status(500).json({ error: "Gat ekki skráð inn notanda" });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Gat ekki skráð út" });
        }
        res.json({ message: "Útskráning tókst!" });
    });
});

app.get('/auth/check', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (error) {
        console.error('Villa við að sækja flokka:', error);
        res.status(500).json({ error: 'Gat ekki sótt gögn' });
    }
});

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



app.post('/questions', async (req, res) => {
    const { category_id, question, answers } = req.body;

    if (!category_id || !question || !answers || answers.length < 2) {
        return res.status(400).json({ error: "Ógild gögn, vinsamlegast fylltu út öll svæði" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO questions (category_id, question) VALUES ($1, $2) RETURNING id',
            [category_id, question]
        );

        const questionId = result.rows[0].id;

        for (let answer of answers) {
            await pool.query(
                'INSERT INTO answers (question_id, answer, correct) VALUES ($1, $2, $3)',
                [questionId, answer.answer, answer.correct]
            );
        }

        res.status(201).json({ message: "Spurning bætt við!" });
    } catch (error) {
        console.error('Villa við að bæta við spurningu:', error);
        res.status(500).json({ error: 'Gat ekki vistað spurningu' });
    }
});

app.delete('/questions', async (req, res) => {
    try {
        await pool.query('DELETE FROM answers');
        await pool.query('DELETE FROM questions');
        res.json({ message: "Öllum spurningum eytt!" });
    } catch (error) {
        console.error('Villa við að eyða spurningum:', error);
        res.status(500).json({ error: 'Gat ekki eytt spurningum' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server keyrir á http://localhost:${PORT}`);
});
