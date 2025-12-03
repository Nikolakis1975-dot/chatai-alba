// db.js - Database e thjeshtë testuese
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'test-data', 'test.db');
console.log(`🗄️  Database testuese: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Gabim në database:', err);
        process.exit(1);
    }
    console.log('✅ U lidh me database testuese');
    initializeDatabase();
});

function initializeDatabase() {
    // Tabela e njohurive - VERSION I THJESHTË
    db.run(`CREATE TABLE IF NOT EXISTS knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në knowledge_base:', err);
        } else {
            console.log('✅ Tabela knowledge_base u krijua');
            
            // Shto disa të dhëna testuese
            db.run(`INSERT OR IGNORE INTO knowledge_base (user_id, question, answer) 
                    VALUES (1, 'test pyetje 1', 'test përgjigje 1')`);
            db.run(`INSERT OR IGNORE INTO knowledge_base (user_id, question, answer) 
                    VALUES (1, 'si jeni?', 'mirë faleminderit')`);
        }
    });
    
    // Tabela e përdoruesve minimal
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT
    )`, () => {
        db.run(`INSERT OR IGNORE INTO users (id, username) VALUES (1, 'testuser')`);
    });
}

module.exports = db;
