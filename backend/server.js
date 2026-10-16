import express from 'express';
import crypto from 'crypto';
import mysql from 'mysql2/promise';

import { RestconfClient } from './restconf.js';

// Заменете това: import { RestconfClient } from './restconf.js';
import { NetconfClient } from './netconf.js';

// Дефинираме приложението (app)
const app = express();
app.use(express.json());

// --- 1. НАСТРОЙКА НА ВРЪЗКАТА С БАЗАТА ДАННИ ---
const dbConfig = {
    host: '192.168.200.2',
    user: 'root',
    password: 'root',
    database: 'platform'
};

let pool;

async function initDB() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log("Успешна връзка с MySQL базата данни!");
    } catch (error) {
        console.error("Грешка при връзка с базата данни:", error.message);
        process.exit(1);
    }
}
initDB();

// --- 2. МАРШРУТ ЗА РЕГИСТРАЦИЯ (SIGN UP) ---
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    console.log(username + " "+ password);
    if (!username || !password) {
        return res.status(400).json({ error: "Моля, въведете потребителско име и парола." });
    }

    try {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const sql = 'INSERT INTO users (username, pass_hash) VALUES (?, ?)';
        const [result] = await pool.execute(sql, [username, hashedPassword]);

        console.log(`Успешно регистриран потребител с ID: ${result.insertId}`);
        return res.status(201).json({ message: "Регистрацията е успешна!" });
    } catch (error) {
        console.error("Грешка при регистрация:", error.message);
        return res.status(500).json({ error: "Възникна грешка в сървъра." });
    }
});

// --- 3. МАРШРУТ ЗА ВХОД (LOGIN) ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    console.log(username + " " + password);
    if (!username || !password) {
        return res.status(400).json({ error: "Моля, въведете потребителско име и парола." });
    }

    try {
        const sql = 'SELECT * FROM users WHERE username = ? LIMIT 1';
        const [rows] = await pool.execute(sql, [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Невалидно потребителско име или парола." });
        }

        const user = rows[0];

        const inputHash = crypto.createHash('sha256').update(password).digest('hex');

        console.log("Хеш от вход:", inputHash);
        console.log("Хеш от MySQL:", user.pass_hash);

        if (inputHash === user.pass_hash) {
            return res.status(200).json({ message: "Успешен вход! Добре дошли." });
        } else {
            return res.status(401).json({ error: "Невалидно потребителско име или парола." });
        }
    } catch (error) {
        console.error("Грешка при вход:", error.message);
        return res.status(500).json({ error: "Възникна грешка в сървъра." });
    }
});


app.post('/api/devices/interfaces', async (req, res) => {
    const { deviceIp, username, password } = req.body;

    if (!deviceIp || !username || !password) {
        return res.status(400).json({ error: "Липсват параметри за устройството." });
    }

    try {
        const client = new NetconfClient(deviceIp, username, password);
        console.log(client);
        const data = await client.getInterfaces();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


app.post('/api/devices/neighbors', async (req, res) => {
    const { deviceIp, username, password } = req.body;

    if (!deviceIp || !username || !password) {
        return res.status(400).json({ error: "Липсват параметри за връзка с устройството." });
    }

    try {
        const client = new NetconfClient(deviceIp, username, password);
        const data = await client.getLLDPNeighbors();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});



// Стартиране на сървъра
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`PoC MySQL Сървърът стартира на http://localhost:${PORT}`);
});
