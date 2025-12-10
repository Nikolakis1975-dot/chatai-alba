const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// ==================== ✅ DETECTION I DATABASE PATH ====================
console.log('🔍 Detecting database path...');

// ✅ LISTA E TË GJITHA PATH-EVE TË MUNDSHME
const possiblePaths = [
    // 1. Environment Variables
    process.env.DATABASE_PATH,
    process.env.DB_PATH,
    process.env.SQLITE_PATH,
    
    // 2. DigitalOcean default paths
    '/var/www/chat-server/db/chat.db',
    '/var/www/chat-server/tmp/chat.db',
    '/var/www/chat-server/data/chat.db',
    
    // 3. Project relative paths
    path.join(__dirname, 'db', 'chat.db'),
    path.join(__dirname, 'tmp', 'chat.db'),
    path.join(__dirname, 'data', 'chat.db'),
    
    // 4. Current directory paths
    './db/chat.db',
    './tmp/chat.db',
    './data/chat.db',
    
    // 5. Absolute paths for production
    '/tmp/chat.db',
    '/home/chat.db',
    '/opt/chat.db'
];

// ✅ FUNKSION PËR TË KONTROLLUAR PATH
function findDatabasePath() {
    console.log('🔍 Checking possible database paths...');
    
    for (const possiblePath of possiblePaths) {
        if (!possiblePath) continue;
        
        try {
            // Normalizo path-in
            const normalizedPath = path.normalize(possiblePath);
            
            // Kontrollo nëse ekziston
            if (fs.existsSync(normalizedPath)) {
                console.log(`✅ Found existing database at: ${normalizedPath}`);
                return normalizedPath;
            }
            
            // Kontrollo nëse directory ekziston (mund të krijojmë file)
            const dir = path.dirname(normalizedPath);
            if (fs.existsSync(dir)) {
                console.log(`📁 Directory exists, can create db at: ${normalizedPath}`);
                return normalizedPath;
            }
            
        } catch (error) {
            console.log(`ℹ️ Path check failed for ${possiblePath}: ${error.message}`);
        }
    }
    
    // ✅ NËSE NUK GJETËM, PËRDOR DEFAULT PËR DIGITALOCEAN
    const defaultPath = '/var/www/chat-server/db/chat.db';
    console.log(`⚠️ No existing database found, using default: ${defaultPath}`);
    
    // Krijo directory nëse nuk ekziston
    const defaultDir = path.dirname(defaultPath);
    if (!fs.existsSync(defaultDir)) {
        try {
            fs.mkdirSync(defaultDir, { recursive: true });
            console.log(`✅ Created directory: ${defaultDir}`);
        } catch (mkdirError) {
            console.error(`❌ Failed to create directory ${defaultDir}:`, mkdirError);
        }
    }
    
    return defaultPath;
}

// ✅ GJEDH DATABASE PATH
const dbPath = findDatabasePath();
console.log(`🚀 Final database path: ${dbPath}`);

// ==================== ✅ CREATE DATABASE CONNECTION ====================
console.log('🔗 Creating database connection...');

// Krijo një instance të re të bazës së të dhënave
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('❌ DATABASE CONNECTION ERROR:', err.message);
        console.error('🔍 Error details:', err);
        
        // Provo të krijosh databasen në rast gabimi
        console.log('🔄 Trying alternative connection method...');
        createDatabaseWithRetry();
    } else {
        console.log(`✅ Connected to SQLite database at: ${dbPath}`);
        initializeDatabase();
    }
});

// ✅ FUNKSION BACKUP PËR KRIJIMIN E DATABASE
function createDatabaseWithRetry() {
    const backupPath = '/var/www/chat-server/backup_chat.db';
    console.log(`🔄 Trying backup path: ${backupPath}`);
    
    const backupDb = new sqlite3.Database(backupPath, (err) => {
        if (err) {
            console.error('❌ Backup database also failed:', err.message);
            console.error('🔧 CRITICAL: Cannot connect to any database!');
            console.log('📋 Please check:');
            console.log('   1. Disk space on server');
            console.log('   2. File permissions');
            console.log('   3. Database file integrity');
        } else {
            console.log(`✅ Connected to backup database at: ${backupPath}`);
            // Zëvendëso db objektin
            module.exports = backupDb;
            initializeDatabase(backupDb);
        }
    });
}

// ✅ FUNKSION I KORRIGJUAR PËR TË SHTUAR KOLONËN UPDATED_AT
function addUpdatedAtColumnToApiKeys() {
    console.log('🔍 Checking if api_keys table has updated_at column...');
    
    db.all("PRAGMA table_info(api_keys)", (err, columns) => {
        if (err) {
            console.error('❌ Error checking columns:', err);
            return;
        }
        
        // ✅ KORRIGJIMI KRYESOR - trajto si array
        const columnNames = Array.isArray(columns) 
            ? columns.map(col => col.name) 
            : [];
        
        console.log('📊 Existing columns in api_keys:', columnNames);
        
        if (!columnNames.includes('updated_at')) {
            console.log('🔄 Adding updated_at column to existing table...');
            
            // ✅ KORRIGJIM: Përdor DEFAULT NULL në vend të CURRENT_TIMESTAMP
            db.run('ALTER TABLE api_keys ADD COLUMN updated_at DATETIME DEFAULT NULL', (err) => {
                if (err) {
                    console.error('❌ Error adding updated_at column:', err);
                } else {
                    console.log('✅ updated_at column added successfully');
                    
                    // ✅ PËRDITËSO REKORDET EKZISTUESE ME VLERËN E created_at
                    db.run('UPDATE api_keys SET updated_at = created_at WHERE updated_at IS NULL', (err) => {
                        if (err) {
                            console.error('❌ Error updating values:', err);
                        } else {
                            console.log('✅ updated_at values updated successfully');
                        }
                    });
                }
            });
        } else {
            console.log('✅ updated_at column already exists in api_keys');
        }
    });
}

// ✅ FUNKSION PËR TË SHTUAR KOLONËN RESPONSE NË MESSAGES
function addResponseColumnToMessages() {
    console.log('🔍 Checking if messages table has response column...');
    
    db.all("PRAGMA table_info(messages)", (err, columns) => {
        if (err) {
            console.error('❌ Error checking columns:', err);
            return;
        }
        
        const columnNames = Array.isArray(columns) 
            ? columns.map(col => col.name) 
            : [];
        
        console.log('📊 Existing columns in messages:', columnNames);
        
        if (!columnNames.includes('response')) {
            console.log('🔄 Adding response column to messages table...');
            
            db.run('ALTER TABLE messages ADD COLUMN response TEXT', (err) => {
                if (err) {
                    console.error('❌ Error adding response column:', err);
                } else {
                    console.log('✅ response column added successfully');
                }
            });
        } else {
            console.log('✅ response column already exists in messages');
        }
    });
}

// ✅ FUNKSION PËR TË KRIJUAR TABELËN RADICAL_KNOWLEDGE
function createRadicalKnowledgeTable() {
    console.log('🔍 Checking radical_knowledge table...');
    
    db.run(`CREATE TABLE IF NOT EXISTS radical_knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating radical_knowledge table:', err);
        } else {
            console.log('✅ radical_knowledge table is ready');
            
            // Kontrollo nëse ka të dhëna
            db.get('SELECT COUNT(*) as count FROM radical_knowledge', (err, row) => {
                if (err) {
                    console.error('❌ Error counting radical_knowledge:', err);
                } else {
                    console.log(`📊 radical_knowledge has ${row.count} entries`);
                }
            });
        }
    });
}

// ==================== ✅ FUNKSIONI I PLOTË PËR INICIALIZIM ====================
function initializeDatabase(database = db) {
    console.log('🔄 Initializing database tables...');
    
    // 🆕 TABELA E RE: SOUL PROFILES - RRUFE-TESLA 10.5
    database.run(`CREATE TABLE IF NOT EXISTS soul_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT UNIQUE NOT NULL,
        signatureTime DATETIME DEFAULT CURRENT_TIMESTAMP,
        enlightenmentPoints INTEGER DEFAULT 100,
        lastResonanceUpdate DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating soul_profiles:', err);
        } else {
            console.log('✅ soul_profiles table initialized - RRUFE-TESLA 10.5');
        }
    });
    
    // ✅ TABELA E PËRDORUESVE - VERSION I THJESHTUAR
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
            console.error('❌ Error creating users table:', err);
        } else {
            console.log('✅ users table initialized');
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
            console.error('❌ Error creating api_keys table:', err);
        } else {
            console.log('✅ api_keys table initialized');
        }
    });

    // ✅ TABELA E MESAZHEVE - ME KOLONËN RESPONSE
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
            console.error('❌ Error creating messages table:', err);
        } else {
            console.log('✅ messages table initialized');
        }
    });

    // ✅ TABELA E NJOHURIVE (VJETËR)
    database.run(`CREATE TABLE IF NOT EXISTS knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating knowledge_base table:', err);
        } else {
            console.log('✅ knowledge_base table initialized');
        }
    });

    // 🆕 TABELA E RE: RADICAL_KNOWLEDGE (SISTEMI I RI)
    database.run(`CREATE TABLE IF NOT EXISTS radical_knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating radical_knowledge table:', err);
        } else {
            console.log('✅ radical_knowledge table initialized - New System');
        }
    });

    // 🆕 TABELA E RE: USER_KNOWLEDGE - PËR KNOWLEDGE DISTILLER
    database.run(`CREATE TABLE IF NOT EXISTS user_knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        knowledge_data TEXT NOT NULL,
        version TEXT DEFAULT '1.0',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating user_knowledge table:', err);
        } else {
            console.log('✅ user_knowledge table initialized - Knowledge Distiller');
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
            console.error('❌ Error creating feedback table:', err);
        } else {
            console.log('✅ feedback table initialized');
        }
    });

    console.log('✅ Database initialization completed!');
    
    // ✅ THIRRE FUNKSIONET SHTESË PAS INICIALIZIMIT
    setTimeout(() => {
        addUpdatedAtColumnToApiKeys();
        addResponseColumnToMessages();
        createRadicalKnowledgeTable();
        
        // ✅ VERIFIKIMI FINAL I DATABASE
        verifyDatabaseStructure();
    }, 3000);
}

// ✅ FUNKSION PËR VERIFIKIMIN E STRUKTURËS SË DATABASE
function verifyDatabaseStructure() {
    console.log('🔍 Verifying database structure...');
    
    const tablesToCheck = [
        'users',
        'api_keys', 
        'messages',
        'knowledge_base',
        'radical_knowledge',
        'user_knowledge',
        'feedback',
        'soul_profiles'
    ];
    
    tablesToCheck.forEach(tableName => {
        db.get(`SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='${tableName}'`, (err, row) => {
            if (err) {
                console.error(`❌ Error checking ${tableName}:`, err);
            } else {
                if (row.count > 0) {
                    console.log(`✅ ${tableName}: EXISTS`);
                    
                    // Kontrollo rekordet
                    db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (countErr, countRow) => {
                        if (!countErr) {
                            console.log(`   📊 Records: ${countRow.count}`);
                        }
                    });
                } else {
                    console.log(`❌ ${tableName}: MISSING!`);
                }
            }
        });
    });
}

// ✅ FUNKSION PËR TESTIMIN E DATABASE
db.testConnection = function() {
    return new Promise((resolve, reject) => {
        this.get('SELECT 1 as test', (err, row) => {
            if (err) {
                console.error('❌ Database test failed:', err);
                reject(err);
            } else {
                console.log('✅ Database connection test passed');
                resolve(true);
            }
        });
    });
};

// ✅ EKZEKUTO TEST MENJËHERË
setTimeout(() => {
    db.testConnection().catch(() => {
        console.log('⚠️ Database test failed, but continuing...');
    });
}, 5000);

// Eksporto db object
module.exports = db;
