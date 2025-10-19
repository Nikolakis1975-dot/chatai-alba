// models/ConversationContext.js - VERSION SQLite
const db = require('../database'); // ✅ Përdor database ekzistues të ChatAI Alba

class ConversationContext {
    static async findOne({ userId, sessionId }) {
        return new Promise((resolve, reject) => {
            try {
                db.get(
                    'SELECT * FROM conversation_contexts WHERE user_id = ? AND session_id = ?',
                    [userId, sessionId],
                    (err, row) => {
                        if (err) {
                            console.error('❌ Gabim në marrjen e kontekstit:', err);
                            resolve(null);
                        } else {
                            resolve(row || null);
                        }
                    }
                );
            } catch (error) {
                console.error('❌ Gabim në findOne:', error);
                resolve(null);
            }
        });
    }

    static async create(contextData) {
        return new Promise((resolve, reject) => {
            try {
                const { userId, sessionId, context, memoryStrength = 1.0 } = contextData;
                
                db.run(
                    `INSERT INTO conversation_contexts 
                     (user_id, session_id, context, memory_strength, last_updated) 
                     VALUES (?, ?, ?, ?, datetime('now'))`,
                    [userId, sessionId, JSON.stringify(context), memoryStrength],
                    function(err) {
                        if (err) {
                            console.error('❌ Gabim në krijimin e kontekstit:', err);
                            reject(err);
                        } else {
                            resolve({ 
                                id: this.lastID, 
                                ...contextData 
                            });
                        }
                    }
                );
            } catch (error) {
                console.error('❌ Gabim në create:', error);
                reject(error);
            }
        });
    }

// ✅ METODË E KORRIGJUAR - GJITHË SESIONET PËR NJË USER
static async findAllByUserId(userId) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`🔍 Duke kërkuar të gjitha sessionet për ${userId}`);
            
            db.all(
                'SELECT session_id, last_updated, created_at FROM conversation_contexts WHERE user_id = ? ORDER BY last_updated DESC',
                [userId],
                (err, rows) => {
                    if (err) {
                        console.error('❌ Gabim në query për sessionet:', err);
                        console.error('❌ Detajet e gabimit:', err.message);
                        reject(err); // ✅ NDRYSHIMI KRYESOR - përdor reject në vend të resolve
                    } else {
                        console.log(`✅ Gjetur ${rows ? rows.length : 0} sesione për ${userId}`);
                        resolve(rows || []);
                    }
                }
            );
        } catch (error) {
            console.error('❌ Gabim i papritur në findAllByUserId:', error);
            reject(error); // ✅ NDRYSHIMI KRYESOR - përdor reject
        }
    });
}

// ✅ METODË E RE - GJET SESSIONIN E FUNDIT PËR USER
static async findLatestSessionByUserId(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT session_id FROM conversation_contexts 
             WHERE user_id = ? 
             ORDER BY last_updated DESC 
             LIMIT 1`,
            [userId],
            (err, row) => {
                if (err) {
                    console.error('❌ Gabim në findLatestSession:', err);
                    resolve(null);
                } else if (row) {
                    console.log(`✅ Gjetur session i fundit për ${userId}: ${row.session_id}`);
                    resolve(row.session_id);
                } else {
                    console.log(`ℹ️ Nuk ka session ekzistues për ${userId}`);
                    resolve(null);
                }
            }
        );
    });
}

    static async update(userId, sessionId, updates) {
        return new Promise((resolve, reject) => {
            try {
                const { context, memoryStrength } = updates;
                
                db.run(
                    `UPDATE conversation_contexts 
                     SET context = ?, memory_strength = ?, last_updated = datetime('now')
                     WHERE user_id = ? AND session_id = ?`,
                    [JSON.stringify(context), memoryStrength, userId, sessionId],
                    function(err) {
                        if (err) {
                            console.error('❌ Gabim në përditësimin e kontekstit:', err);
                            reject(err);
                        } else {
                            resolve(this.changes > 0);
                        }
                    }
                );
            } catch (error) {
                console.error('❌ Gabim në update:', error);
                reject(error);
            }
        });
    }

    static async delete(userId, sessionId) {
        return new Promise((resolve, reject) => {
            try {
                db.run(
                    'DELETE FROM conversation_contexts WHERE user_id = ? AND session_id = ?',
                    [userId, sessionId],
                    function(err) {
                        if (err) {
                            console.error('❌ Gabim në fshirjen e kontekstit:', err);
                            reject(err);
                        } else {
                            resolve(this.changes > 0);
                        }
                    }
                );
            } catch (error) {
                console.error('❌ Gabim në delete:', error);
                reject(error);
            }
        });
    }
}

module.exports = ConversationContext;
