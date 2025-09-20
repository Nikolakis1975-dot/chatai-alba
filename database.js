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

// Funksioni për të inicializuar tabelat nëse nuk ekzistojnë
function initializeDatabase() {
    // Tabela e përdoruesve
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            profile_picture TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela e mesazheve
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

    // Tabela e njohurive (ME user_id të shtuar)
    db.run(`
        CREATE TABLE IF NOT EXISTS knowledge_base (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // Tabela e API Keys
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
   
    // Tabela e feedback-ut
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

    console.log('Tabelat e databazës janë inicializuar me sukses.');
}

// Funksion për të kontrolluar nëse një tabelë ekziston
function tableExists(tableName, callback) {
    db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        [tableName],
        (err, row) => {
            if (err) {
                callback(err, false);
            } else {
                callback(null, !!row);
            }
        }
    );
}

// Funksion për të shtuar kolonën user_id nëse knowledge_base ekziston pa të
function addUserIdToKnowledgeBase() {
    db.all(
        "PRAGMA table_info(knowledge_base)",
        (err, rows) => {
            if (err) {
                console.error('Gabim gjatë kontrollimit të strukturës së tabelës:', err);
                return;
            }

            const hasUserId = rows.some(row => row.name === 'user_id');
            
            if (!hasUserId) {
                console.log('Shtohet kolona user_id në tabelën knowledge_base...');
                db.run(
                    "ALTER TABLE knowledge_base ADD COLUMN user_id INTEGER NOT NULL DEFAULT 1",
                    (err) => {
                        if (err) {
                            console.error('Gabim gjatë shtimit të kolonës user_id:', err);
                        } else {
                            console.log('Kolona user_id u shtua me sukses në knowledge_base.');
                        }
                    }
                );
            }
        }
    );
}

// Kontrollo dhe përditëso tabelat nëse është e nevojshme
tableExists('knowledge_base', (err, exists) => {
    if (err) {
        console.error('Gabim gjatë kontrollimit të tabelës knowledge_base:', err);
        return;
    }
    
    if (exists) {
        addUserIdToKnowledgeBase();
    }
});

module.exports = db;
