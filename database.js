// =================================================
// ✅ DATABASE RRUFE TESLA 10.5
// =================================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🚀 RRUFE-TESLA: Database System Initializing...');
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// ==================== ✅ FIX KRYESOR: DATABASE PATH PËR PRODUKSION ====================

// Përcakto rrugën e databazës bazuar në mjedisin
let dbPath;

if (process.env.NODE_ENV === 'production') {
    // ✅ NË PRODUKSION: Përdor një vendndodhje të qëndrueshme në DigitalOcean
    const prodDataDir = '/var/www/chat-server/data';
    
    // Krijo dosjen nëse nuk ekziston
    if (!fs.existsSync(prodDataDir)) {
        fs.mkdirSync(prodDataDir, { recursive: true });
        console.log('✅ U krijua drejtoria e prodhimit:', prodDataDir);
    }
    
    dbPath = path.join(prodDataDir, 'chat.db');
    console.log('🚀 PRODUKSION: Database do të ruhet në vendndodhje të qëndrueshme:', dbPath);
    
    // Kopjo të dhënat ekzistuese nga /tmp/ (nëse ekzistojnë)
    const tmpDbPath = '/tmp/chat.db';
    if (fs.existsSync(tmpDbPath) && !fs.existsSync(dbPath)) {
        try {
            fs.copyFileSync(tmpDbPath, dbPath);
            console.log('📂 U kopjuan të dhënat ekzistuese nga /tmp/ në vendndodhjen e re');
            
            // Verifiko kopjimin
            const tmpSize = fs.statSync(tmpDbPath).size;
            const newSize = fs.statSync(dbPath).size;
            console.log(`📊 Madhësitë: /tmp/chat.db = ${tmpSize} bytes, ${dbPath} = ${newSize} bytes`);
        } catch (copyError) {
            console.error('❌ Gabim gjatë kopjimit të database:', copyError.message);
        }
    } else if (fs.existsSync(tmpDbPath)) {
        console.log('ℹ️ Database ekziston tashmë në vendndodhjen e re, nuk u krye kopjim');
    }
    
} else {
    // ✅ NË DEVELOPMENT
    const devDataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(devDataDir)) {
        fs.mkdirSync(devDataDir, { recursive: true });
        console.log('✅ U krijua drejtoria e zhvillimit:', devDataDir);
    }
    
    dbPath = path.join(devDataDir, 'chat.db');
    console.log('🔧 DEVELOPMENT: Database në:', dbPath);
}

console.log(`🗄️  Rruga përfundimtare e databazës: ${dbPath}`);

// Krijo një instance të re të bazës së të dhënave
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('❌ Gabim gjatë lidhjes me databazën:', err.message);
        console.error('❌ Detajet e gabimit:', err);
        
        // Provo backup në rast të dështimit
        console.log('🔄 Duke provuar backup path...');
        const backupPath = path.join(__dirname, 'chat-backup.db');
        const backupDb = new sqlite3.Database(backupPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (backupErr) => {
            if (backupErr) {
                console.error('❌ Backup database failed too');
                process.exit(1);
            } else {
                console.log('✅ U lidh me backup database');
                // Replace db with backup (në kod real, duhet të export/import)
            }
        });
    } else {
        console.log('✅ U lidhë me sukses me databazën SQLite.');
        
        // Verifiko lidhjen
        db.get("SELECT 1 as test", (err, row) => {
            if (err) {
                console.error('❌ Test query failed:', err.message);
            } else {
                console.log('✅ Database connection test passed');
                initializeDatabase();
            }
        });
    }
});

// ==================== ✅ FUNKSIONE NDIHMËSE ====================

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

// ✅ FUNKSION PËR BACKUP AUTOMATIK
function setupAutoBackup() {
    console.log('💾 Duke konfiguruar sistemin e backup automatik...');
    
    // Backup çdo 6 orë (21600000 ms)
    setInterval(() => {
        const backupDir = '/var/www/chat-server/backups';
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `chat-backup-${timestamp}.db`);
        
        db.backup(backupPath, (err) => {
            if (err) {
                console.error('❌ Backup failed:', err.message);
            } else {
                const size = fs.statSync(backupPath).size;
                console.log(`✅ Backup created: ${backupPath} (${size} bytes)`);
                
                // Fshi backup-et e vjetra (mban vetëm 5 të fundit)
                fs.readdir(backupDir, (readErr, files) => {
                    if (!readErr && files.length > 5) {
                        const backupFiles = files
                            .filter(f => f.startsWith('chat-backup-'))
                            .sort()
                            .map(f => path.join(backupDir, f));
                        
                        // Fshi të vjetrat
                        for (let i = 0; i < backupFiles.length - 5; i++) {
                            fs.unlinkSync(backupFiles[i]);
                            console.log(`🗑️  Fshi backup të vjetër: ${backupFiles[i]}`);
                        }
                    }
                });
            }
        });
    }, 21600000); // 6 orë
    
    console.log('✅ Sistemi i backup automatik u konfigurua (çdo 6 orë)');
}

// ==================== ✅ INICIALIZIMI I DATABASE ====================

// Funksioni për të inicializuar tabelat nëse nuk ekzistojnë
function initializeDatabase() {
    console.log('🔄 Duke inicializuar databazën RRUFE-TESLA 10.5...');
    
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

    // ✅ TABELA E API_KEYS
    db.run(`CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        api_key TEXT NOT NULL,
        service_name TEXT NOT NULL DEFAULT 'gemini',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT NULL,
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

    // ✅✅✅ TABELA E NJOHURIVE - KRYESORE PËR PROBLEMIN E /meso
    db.run(`CREATE TABLE IF NOT EXISTS knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        search_count INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën knowledge_base:', err);
        } else {
            console.log('✅✅✅ Tabela knowledge_base u inicializua - KY ËSHTË THEMELI!');
            
            // Krijo indeks për kërkim më të shpejtë
            db.run('CREATE INDEX IF NOT EXISTS idx_knowledge_user_question ON knowledge_base(user_id, question)');
            console.log('✅ Indeksi për kërkim të shpejtë u krijua');
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

    // ✅ VERIFIKO TABELAT E KRIJUARA
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error('❌ Gabim në marrjen e tabelave:', err);
        } else {
            console.log('📊 Tabelat e krijuara në database:');
            tables.forEach(table => console.log(`   - ${table.name}`));
        }
    });

    console.log('✅ Inicializimi i databazës RRUFE-TESLA përfundoi!');
    
    // ✅ THIRRE FUNKSIONET PAS INICIALIZIMIT
    setTimeout(() => {
        addUpdatedAtColumnToApiKeys();
        addResponseColumnToMessages();
        setupAutoBackup();
        
        // VERIFIKO KNOWLEDGE_BASE
        db.get("SELECT COUNT(*) as count FROM knowledge_base", (err, row) => {
            if (err) {
                console.error('❌ Gabim në verifikim:', err);
            } else {
                console.log(`🔍 Verifikim: knowledge_base ka ${row.count} rreshta`);
            }
        });
    }, 3000);
}

// ==================== ✅ FUNKSIONE SHTESË PËR DEBUG ====================

// Funksion për të kontrolluar statusin e database
function checkDatabaseStatus() {
    console.log('🔍 Duke kontrolluar statusin e database...');
    
    db.get("SELECT COUNT(*) as total_tables FROM sqlite_master WHERE type='table'", (err, tablesRow) => {
        if (err) {
            console.error('❌ Gabim në kontroll të tabelave:', err);
            return;
        }
        
        console.log(`📊 Total tabela: ${tablesRow.total_tables}`);
        
        // Kontrollo secilën tabelë
        const importantTables = ['knowledge_base', 'users', 'messages', 'api_keys'];
        
        importantTables.forEach(tableName => {
            db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
                if (err) {
                    console.log(`   ${tableName}: ❌ Gabim - ${err.message}`);
                } else {
                    console.log(`   ${tableName}: ${row.count} rreshta`);
                }
            });
        });
    });
}

// Eksporto db object dhe funksione shtesë
module.exports = db;
module.exports.checkDatabaseStatus = checkDatabaseStatus;
module.exports.getDbPath = () => dbPath;
