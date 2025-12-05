// =================================================
// ✅ DATABASE RRUFE TESLA 10.5
// =================================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Krijo drejtorinë data nëse nuk ekziston
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ U krijua drejtoria data/');
}

// ==================== ✅ SIMPLE FIX FOR DIGITALOCEAN ====================

// Përcakto rrugën e databazës
let dbPath;

if (process.env.NODE_ENV === 'production') {
    // ✅ NË DIGITALOCEAN: Përdor /tmp/ (e vetmja opsion)
    dbPath = '/tmp/chat.db';
    console.log('🚀 DIGITALOCEAN: Database në /tmp/chat.db');
    
} else {
    // Në development
    const devDataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(devDataDir)) {
        fs.mkdirSync(devDataDir, { recursive: true });
        console.log('✅ U krijua drejtoria data/');
    }
    
    dbPath = path.join(devDataDir, 'chat.db');
    console.log('🔧 DEVELOPMENT: Database në:', dbPath);
}

console.log(`🗄️  Rruga e databazës: ${dbPath}`);

// Krijo një instance të re të bazës së të dhënave
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('❌ Gabim gjatë lidhjes me databazën:', err.message);
        console.error('❌ Detajet e gabimit:', err);
        process.exit(1); // Ndalo aplikacionin nëse nuk lidhet me databazën
    } else {
        console.log('✅ U lidhë me sukses me databazën SQLite.');
        initializeDatabase();
    }
});

// ✅ FUNKSION I KORRIGJUAR PËR TË SHTUAR KOLONËN UPDATED_AT
function addUpdatedAtColumnToApiKeys() {
    console.log('🔍 Duke kontrolluar nëse tabela api_keys ka kolonën updated_at...');
    
    db.all("PRAGMA table_info(api_keys)", (err, columns) => {
        if (err) {
            console.error('❌ Gabim në kontrollimin e kolonave:', err);
            return;
        }
        
        // ✅ KORRIGJIMI KRYESOR - trajto si array
        const columnNames = Array.isArray(columns) 
            ? columns.map(col => col.name) 
            : [];
        
        console.log('📊 Kolonat ekzistuese në api_keys:', columnNames);
        
        if (!columnNames.includes('updated_at')) {
            console.log('🔄 Duke shtuar kolonën updated_at në tabelën ekzistuese...');
            
            // ✅ KORRIGJIM: Përdor DEFAULT NULL në vend të CURRENT_TIMESTAMP
            db.run('ALTER TABLE api_keys ADD COLUMN updated_at DATETIME DEFAULT NULL', (err) => {
                if (err) {
                    console.error('❌ Gabim në shtimin e kolonës updated_at:', err);
                } else {
                    console.log('✅ Kolona updated_at u shtua me sukses në tabelën ekzistuese');
                    
                    // ✅ PËRDITËSO REKORDET EKZISTUESE ME VLERËN E created_at
                    db.run('UPDATE api_keys SET updated_at = created_at WHERE updated_at IS NULL', (err) => {
                        if (err) {
                            console.error('❌ Gabim në përditësimin e vlerave:', err);
                        } else {
                            console.log('✅ Vlerat e updated_at u përditësuan me sukses');
                        }
                    });
                }
            });
        } else {
            console.log('✅ Kolona updated_at ekziston tashmë në api_keys');
        }
    });
}

// ✅ FUNKSION PËR TË SHTUAR KOLONËN RESPONSE NË MESSAGES
function addResponseColumnToMessages() {
    console.log('🔍 Duke kontrolluar nëse tabela messages ka kolonën response...');
    
    db.all("PRAGMA table_info(messages)", (err, columns) => {
        if (err) {
            console.error('❌ Gabim në kontrollimin e kolonave:', err);
            return;
        }
        
        const columnNames = Array.isArray(columns) 
            ? columns.map(col => col.name) 
            : [];
        
        console.log('📊 Kolonat ekzistuese në messages:', columnNames);
        
        if (!columnNames.includes('response')) {
            console.log('🔄 Duke shtuar kolonën response në tabelën messages...');
            
            db.run('ALTER TABLE messages ADD COLUMN response TEXT', (err) => {
                if (err) {
                    console.error('❌ Gabim në shtimin e kolonës response:', err);
                } else {
                    console.log('✅ Kolona response u shtua me sukses në tabelën messages');
                }
            });
        } else {
            console.log('✅ Kolona response ekziston tashmë në messages');
        }
    });
}

// Funksioni për të inicializuar tabelat nëse nuk ekzistojnë
function initializeDatabase() {
    console.log('🔄 Duke inicializuar databazën...');
    
    // 🆕 TABELA E RE: SOUL PROFILES - RRUFE-TESLA 10.5
    db.run(`CREATE TABLE IF NOT EXISTS soul_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT UNIQUE NOT NULL,
        signatureTime DATETIME DEFAULT CURRENT_TIMESTAMP,
        enlightenmentPoints INTEGER DEFAULT 100,
        lastResonanceUpdate DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën soul_profiles:', err);
        } else {
            console.log('✅ Tabela soul_profiles u inicializua - RRUFE-TESLA 10.5');
        }
    });
    
    // ✅ TABELA E PËRDORUESVE - VERSION I THJESHTUAR
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        verification_token TEXT,
        verification_token_expires DATETIME,
        is_verified BOOLEAN DEFAULT FALSE,
        profile_picture TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën users:', err);
        } else {
            console.log('✅ Tabela users u inicializua');
        }
    });

    // ✅ TABELA E API_KEYS PA KOLONËN UPDATED_AT (DO E SHTOJME ME VONE)
    db.run(`CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        api_key TEXT NOT NULL,
        service_name TEXT NOT NULL DEFAULT 'gemini',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën api_keys:', err);
        } else {
            console.log('✅ Tabela api_keys u inicializua');
        }
    });

    // ✅ TABELA E MESAZHEVE - ME KOLONËN RESPONSE
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        sender TEXT NOT NULL,
        response TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën messages:', err);
        } else {
            console.log('✅ Tabela messages u inicializua');
        }
    });

    // Tabela e njohurive
    db.run(`CREATE TABLE IF NOT EXISTS knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën knowledge_base:', err);
        } else {
            console.log('✅ Tabela knowledge_base u inicializua');
        }
    });

// 🆕 TABELA E RE: USER_KNOWLEDGE - PËR KNOWLEDGE DISTILLER
db.run(`CREATE TABLE IF NOT EXISTS user_knowledge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    knowledge_data TEXT NOT NULL,
    version TEXT DEFAULT '1.0',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) {
        console.error('❌ Gabim në tabelën user_knowledge:', err);
    } else {
        console.log('✅ Tabela user_knowledge u inicializua - Knowledge Distiller');
    }
});

    // Tabela e feedback-ut
    db.run(`CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message_id TEXT NOT NULL,
        feedback_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën feedback:', err);
        } else {
            console.log('✅ Tabela feedback u inicializua');
        }
    });

    console.log('✅ Inicializimi i databazës përfundoi!');
    
    // ✅ THIRRE FUNKSIONET PËR SHTIMIN E KOLONAVE PAS INICIALIZIMIT
    setTimeout(() => {
        addUpdatedAtColumnToApiKeys();
        addResponseColumnToMessages();
    }, 2000);
}

// Eksporto db object
module.exports = db;
