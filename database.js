const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Përdor /tmp/ për Render.com, data/ për development
const dbPath = process.env.NODE_ENV === 'production' 
    ? '/tmp/chat.db'
    : path.join(__dirname, 'data', 'chat.db');

// Krijazo një instance të re të bazës së të dhënave
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Gabim gjatë lidhjes me databazën:', err.message);
    } else {
        console.log('U lidhë me sukses me databazën SQLite.');
        initializeDatabase();
    }
});

// ... pjesa tjetër e kodit mbetet e njëjtë ...

// Funksioni për të inicializuar tabelat nëse nuk ekzistojnë
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            profile_picture TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            sender TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS knowledge_base (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        api_key TEXT NOT NULL,
        service_name TEXT NOT NULL DEFAULT 'gemini',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
`);
   
   db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message_id TEXT NOT NULL,
        feedback_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
`);

}

module.exports = db;
