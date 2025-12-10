const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// ==================== ✅ DIGITALOCEAN DATABASE DETECTION ====================
console.log('🔍 [DATABASE] Starting DigitalOcean database detection...');

// ✅ PATH-ET SPECIFIKE PËR DIGITALOCEAN
const digitalOceanPaths = [
    // 1. Primary DigitalOcean path
    '/var/www/chat-server/db/chat.db',
    
    // 2. Backup paths
    '/var/www/chat-server/tmp/chat.db',
    '/var/www/chat-server/data/chat.db',
    
    // 3. Project relative paths
    path.join(__dirname, 'db', 'chat.db'),
    path.join(__dirname, 'tmp', 'chat.db'),
    path.join(__dirname, 'data', 'chat.db'),
    
    // 4. Environment variables (nëse janë vendosur)
    process.env.DATABASE_PATH,
    process.env.DB_PATH,
    
    // 5. Fallback paths
    '/tmp/chat.db',
    './chat.db'
];

// ✅ FUNKSION PËR TË GJETUR DATABASE
function findDatabaseForDigitalOcean() {
    console.log('🔍 [DATABASE] Checking DigitalOcean paths...');
    
    // Provo së pari path-et specifike të DigitalOcean
    for (const possiblePath of digitalOceanPaths) {
        if (!possiblePath) continue;
        
        try {
            const normalizedPath = path.normalize(possiblePath);
            console.log(`   🔎 Checking: ${normalizedPath}`);
            
            // Kontrollo nëse file ekziston
            if (fs.existsSync(normalizedPath)) {
                const stats = fs.statSync(normalizedPath);
                console.log(`   ✅ FOUND! Size: ${stats.size} bytes`);
                return normalizedPath;
            }
            
            // Kontrollo nëse directory ekziston (mund të krijojmë file)
            const dir = path.dirname(normalizedPath);
            if (fs.existsSync(dir)) {
                console.log(`   📁 Directory exists, can create at: ${normalizedPath}`);
                return normalizedPath;
            }
            
        } catch (error) {
            console.log(`   ⚠️ Error checking ${possiblePath}: ${error.message}`);
        }
    }
    
    // ✅ NËSE NUK GJETËM, KRIJO NË DIGITALOCEAN DEFAULT PATH
    const defaultPath = '/var/www/chat-server/db/chat.db';
    console.log(`⚠️ [DATABASE] No existing database found, using default: ${defaultPath}`);
    
    // Krijo directory nëse nuk ekziston
    const defaultDir = path.dirname(defaultPath);
    if (!fs.existsSync(defaultDir)) {
        try {
            fs.mkdirSync(defaultDir, { recursive: true });
            console.log(`✅ [DATABASE] Created directory: ${defaultDir}`);
        } catch (mkdirError) {
            console.error(`❌ [DATABASE] Failed to create directory:`, mkdirError);
        }
    }
    
    return defaultPath;
}

// ✅ GJEDH PATH-IN FINAL
const dbPath = findDatabaseForDigitalOcean();
console.log(`🚀 [DATABASE] Final database path: ${dbPath}`);

// ==================== ✅ CREATE DATABASE CONNECTION ====================
console.log('🔗 [DATABASE] Creating connection...');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('❌ [DATABASE] CONNECTION ERROR:', err.message);
        console.error('   Path attempted:', dbPath);
        
        // Provo alternative
        console.log('🔄 [DATABASE] Trying alternative connection...');
        createAlternativeDatabase();
    } else {
        console.log(`✅ [DATABASE] Connected to SQLite at: ${dbPath}`);
        
        // Test connection immediately
        db.get('SELECT 1 as test', (testErr) => {
            if (testErr) {
                console.error('❌ [DATABASE] Test query failed:', testErr.message);
            } else {
                console.log('✅ [DATABASE] Connection test passed');
            }
        });
        
        // Inicializo tabelat
        initializeDatabaseForDigitalOcean();
    }
});

// ✅ FUNKSION ALTERNATIV PËR KRIJIMIN E DATABASE
function createAlternativeDatabase() {
    const altPath = '/var/www/chat-server/backup_chat.db';
    console.log(`🔄 [DATABASE] Creating alternative at: ${altPath}`);
    
    const altDb = new sqlite3.Database(altPath, (err) => {
        if (err) {
            console.error('❌ [DATABASE] Alternative also failed:', err.message);
            console.error('🔧 [DATABASE] CRITICAL: Database cannot be created!');
        } else {
            console.log(`✅ [DATABASE] Created alternative at: ${altPath}`);
            // Përdor alternative database
            module.exports = altDb;
            initializeDatabaseForDigitalOcean(altDb);
        }
    });
}

// ==================== ✅ FUNKSIONET PËR TABELA ====================

// ✅ KRIJO TABELËN RADICAL_KNOWLEDGE (MË E RËNDËSISHMJA!)
function createRadicalKnowledgeTable(database = db) {
    console.log('🔍 [DATABASE] Creating radical_knowledge table...');
    
    database.run(`CREATE TABLE IF NOT EXISTS radical_knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ [DATABASE] Failed to create radical_knowledge:', err.message);
        } else {
            console.log('✅ [DATABASE] radical_knowledge table ready');
            
            // Kontrollo nëse ka të dhëna
            database.get('SELECT COUNT(*) as count FROM radical_knowledge', (countErr, row) => {
                if (!countErr && row) {
                    console.log(`📊 [DATABASE] radical_knowledge has ${row.count} entries`);
                }
            });
        }
    });
}

// ✅ KRIJO TABELËN KNOWLEDGE (SISTEMI I VJETËR)
function createKnowledgeTable(database = db) {
    database.run(`CREATE TABLE IF NOT EXISTS knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ [DATABASE] Failed to create knowledge table:', err.message);
        } else {
            console.log('✅ [DATABASE] knowledge table ready');
        }
    });
}

// ✅ KRIJO TABELËN KNOWLEDGE_BASE (SISTEMI TJETËR)
function createKnowledgeBaseTable(database = db) {
    database.run(`CREATE TABLE IF NOT EXISTS knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ [DATABASE] Failed to create knowledge_base:', err.message);
        } else {
            console.log('✅ [DATABASE] knowledge_base table ready');
        }
    });
}

// ==================== ✅ INICIALIZIMI I PLOTË ====================
function initializeDatabaseForDigitalOcean(database = db) {
    console.log('🔄 [DATABASE] Initializing DigitalOcean database...');
    
    // ✅ KRIJO SË PARI TABELAT MË TË RËNDËSISHME
    createRadicalKnowledgeTable(database);
    createKnowledgeTable(database);
    createKnowledgeBaseTable(database);
    
    // ✅ TABELA E PËRDORUESVE
    database.run(`CREATE TABLE IF NOT EXISTS users (
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
            console.error('❌ [DATABASE] Failed to create users table:', err.message);
        } else {
            console.log('✅ [DATABASE] users table ready');
        }
    });

    // ✅ TABELA E API_KEYS
    database.run(`CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        api_key TEXT NOT NULL,
        service_name TEXT NOT NULL DEFAULT 'gemini',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ [DATABASE] Failed to create api_keys:', err.message);
        } else {
            console.log('✅ [DATABASE] api_keys table ready');
        }
    });

    // ✅ TABELA E MESAZHEVE
    database.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        sender TEXT NOT NULL,
        response TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ [DATABASE] Failed to create messages:', err.message);
        } else {
            console.log('✅ [DATABASE] messages table ready');
        }
    });

    // ✅ TABELA E FEEDBACK-UT
    database.run(`CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message_id TEXT NOT NULL,
        feedback_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ [DATABASE] Failed to create feedback:', err.message);
        } else {
            console.log('✅ [DATABASE] feedback table ready');
        }
    });

    console.log('✅ [DATABASE] Initialization completed!');
    
    // ✅ VERIFIKIMI FINAL
    setTimeout(() => {
        verifyAllTables(database);
    }, 3000);
}

// ✅ FUNKSION PËR VERIFIKIMIN E TABELAVE
function verifyAllTables(database = db) {
    console.log('🔍 [DATABASE] Verifying all tables...');
    
    const essentialTables = [
        'radical_knowledge',
        'knowledge', 
        'knowledge_base',
        'users',
        'api_keys',
        'messages'
    ];
    
    let verifiedCount = 0;
    
    essentialTables.forEach(tableName => {
        database.get(
            `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`,
            (err, row) => {
                if (err) {
                    console.error(`❌ [DATABASE] Error checking ${tableName}:`, err.message);
                } else if (row) {
                    console.log(`✅ [DATABASE] ${tableName}: EXISTS`);
                    verifiedCount++;
                } else {
                    console.log(`❌ [DATABASE] ${tableName}: MISSING!`);
                    
                    // Krijo menjëherë nëse mungon
                    if (tableName === 'radical_knowledge') {
                        createRadicalKnowledgeTable(database);
                    }
                }
                
                // Nëse kemi kontrolluar të gjitha
                if (verifiedCount === essentialTables.length) {
                    console.log(`🎉 [DATABASE] ${verifiedCount}/${essentialTables.length} essential tables verified`);
                }
            }
        );
    });
}

// ✅ FUNKSION TEST PËR DATABASE
db.testDatabase = function() {
    return new Promise((resolve, reject) => {
        this.get('SELECT 1 as test', (err) => {
            if (err) {
                console.error('❌ [DATABASE] Test failed:', err.message);
                reject(err);
            } else {
                console.log('✅ [DATABASE] Test passed');
                resolve(true);
            }
        });
    });
};

// ✅ EKZEKUTO TEST MENJËHERË
setTimeout(() => {
    db.testDatabase().catch(() => {
        console.log('⚠️ [DATABASE] Test failed, but continuing...');
    });
}, 2000);

// ✅ SHTO NJË FUNKSION PËR TË KRIJUAR TABELAT NËSE NUK EKZISTOJNË
db.ensureTables = function() {
    return new Promise((resolve) => {
        console.log('🔧 [DATABASE] Ensuring tables exist...');
        initializeDatabaseForDigitalOcean(this);
        setTimeout(() => resolve(true), 1000);
    });
};

// Eksporto db object
module.exports = db;

// ✅ LOG FINAL
console.log(`📁 [DATABASE] Module loaded for path: ${dbPath}`);
