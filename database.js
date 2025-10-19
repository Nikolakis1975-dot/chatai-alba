const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Krijo drejtorinë data nëse nuk ekziston
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ U krijua drejtoria data/');
}

// Përdor /tmp/ për Render.com, data/ për development
const dbPath = process.env.NODE_ENV === 'production' 
    ? '/tmp/chat.db'
    : path.join(__dirname, 'data', 'chat.db');

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

// ✅ FUNKSION PËR TË KRIJUAR TABELAT E REJA PËR CONTEXT MEMORY
function createContextTables() {
    console.log('🔄 Duke krijuar tabelat e reja për Context Memory System...');
    
    // ✅ TABELA E RE PËR CONVERSATION CONTEXTS
    db.run(`CREATE TABLE IF NOT EXISTS conversation_contexts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        context TEXT NOT NULL,
        memory_strength REAL DEFAULT 1.0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën conversation_contexts:', err);
        } else {
            console.log('✅ Tabela conversation_contexts u krijua');
        }
    });

    // ✅ TABELA E RE PËR VOICE MEMORY
    db.run(`CREATE TABLE IF NOT EXISTS voice_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        voice_profile TEXT,
        preferences TEXT,
        adaptation_history TEXT,
        usage_statistics TEXT,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën voice_memory:', err);
        } else {
            console.log('✅ Tabela voice_memory u krijua');
        }
    });

    // ✅ KRIJO INDEX PËR PERFORMANCË
    db.run(`CREATE INDEX IF NOT EXISTS idx_context_user_session ON conversation_contexts(user_id, session_id)`, (err) => {
        if (err) {
            console.error('❌ Gabim në krijimin e index:', err);
        } else {
            console.log('✅ Index u krijua për conversation_contexts');
        }
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_voice_memory_user ON voice_memory(user_id)`, (err) => {
        if (err) {
            console.error('❌ Gabim në krijimin e index:', err);
        } else {
            console.log('✅ Index u krijua për voice_memory');
        }
    });

    // ✅ KRIJO INDEX PËR KOHËN E PËRDITËSIMIT
    db.run(`CREATE INDEX IF NOT EXISTS idx_context_last_updated ON conversation_contexts(last_updated)`, (err) => {
        if (err) {
            console.error('❌ Gabim në krijimin e index:', err);
        } else {
            console.log('✅ Index u krijua për last_updated');
        }
    });
}

// ✅ FUNKSION PËR TË KONTROLLUAR TABELAT E REJA
function checkNewTables() {
    console.log('🔍 Duke kontrolluar tabelat e reja për Context Memory...');
    
    // Kontrollo nëse tabela conversation_contexts ekziston
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='conversation_contexts'", (err, rows) => {
        if (err) {
            console.error('❌ Gabim në kontrollimin e tabelave:', err);
        } else if (rows.length === 0) {
            console.log('❌ Tabela conversation_contexts NUK ekziston! Duke krijuar...');
            createContextTables();
        } else {
            console.log('✅ Tabela conversation_contexts ekziston');
            
            // Kontrollo nëse tabela voice_memory ekziston
            db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='voice_memory'", (err, voiceRows) => {
                if (err) {
                    console.error('❌ Gabim në kontrollimin e voice_memory:', err);
                } else if (voiceRows.length === 0) {
                    console.log('❌ Tabela voice_memory NUK ekziston! Duke krijuar...');
                    createContextTables();
                } else {
                    console.log('✅ Tabela voice_memory ekziston');
                    console.log('🎉 Të gjitha tabelat e Context Memory System ekzistojnë!');
                }
            });
        }
    });
}

// Funksioni për të inicializuar tabelat nëse nuk ekzistojnë
function initializeDatabase() {
    console.log('🔄 Duke inicializuar databazën...');
    
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

    // ✅ TABELA E RE PËR CONVERSATION CONTEXTS
    db.run(`CREATE TABLE IF NOT EXISTS conversation_contexts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        context TEXT NOT NULL,
        memory_strength REAL DEFAULT 1.0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën conversation_contexts:', err);
        } else {
            console.log('✅ Tabela conversation_contexts u inicializua');
        }
    });

    // ✅ TABELA E RE PËR VOICE MEMORY
    db.run(`CREATE TABLE IF NOT EXISTS voice_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        voice_profile TEXT,
        preferences TEXT,
        adaptation_history TEXT,
        usage_statistics TEXT,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Gabim në tabelën voice_memory:', err);
        } else {
            console.log('✅ Tabela voice_memory u inicializua');
        }
    });

    console.log('✅ Inicializimi i databazës përfundoi!');
    
    // ✅ THIRRE FUNKSIONET PËR SHTIMIN E KOLONAVE PAS INICIALIZIMIT
    setTimeout(() => {
        addUpdatedAtColumnToApiKeys();
        addResponseColumnToMessages();
        
        // ✅ KONTROLLO DHE KRIJO INDEX PËR TABELAT E REJA
        setTimeout(() => {
            // ✅ KRIJO INDEX PËR PERFORMANCË
            db.run(`CREATE INDEX IF NOT EXISTS idx_context_user_session ON conversation_contexts(user_id, session_id)`, (err) => {
                if (err) {
                    console.error('❌ Gabim në krijimin e index:', err);
                } else {
                    console.log('✅ Index u krijua për conversation_contexts');
                }
            });

            db.run(`CREATE INDEX IF NOT EXISTS idx_voice_memory_user ON voice_memory(user_id)`, (err) => {
                if (err) {
                    console.error('❌ Gabim në krijimin e index:', err);
                } else {
                    console.log('✅ Index u krijua për voice_memory');
                }
            });

            db.run(`CREATE INDEX IF NOT EXISTS idx_context_last_updated ON conversation_contexts(last_updated)`, (err) => {
                if (err) {
                    console.error('❌ Gabim në krijimin e index:', err);
                } else {
                    console.log('✅ Index u krijua për last_updated');
                }
            });

            console.log('🎉 Të gjitha tabelat dhe index-et e Context Memory System janë gati!');
        }, 1000);
    }, 2000);
}

// ✅ FUNKSION PËR TESTIMIN E DATABAZËS
function testDatabaseConnection() {
    console.log('🧪 Duke testuar lidhjen me databazën...');
    
    db.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
        if (err) {
            console.error('❌ Testi i lidhjes dështoi:', err);
        } else {
            console.log('✅ Lidhja me databazën është funksionale');
            
            // Listo të gjitha tabelat
            db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
                if (err) {
                    console.error('❌ Gabim në listimin e tabelave:', err);
                } else {
                    console.log('📊 Tabelat në databazë:');
                    tables.forEach(table => {
                        console.log(`   - ${table.name}`);
                    });
                }
            });
        }
    });
}

// ✅ THIRRE TESTIN PAS INICIALIZIMIT
setTimeout(() => {
    testDatabaseConnection();
}, 5000);

// Eksporto db object
module.exports = db;
