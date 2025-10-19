// models/VoiceMemory.js - VERSION SQLite
const db = require('../database');

class VoiceMemory {
    static async findOne({ userId }) {
        return new Promise((resolve, reject) => {
            try {
                db.get(
                    'SELECT * FROM voice_memory WHERE user_id = ?',
                    [userId],
                    (err, row) => {
                        if (err) {
                            console.error('❌ Gabim në marrjen e voice memory:', err);
                            resolve(null);
                        } else {
                            // Parse JSON strings back to objects
                            if (row) {
                                row.voice_profile = row.voice_profile ? JSON.parse(row.voice_profile) : null;
                                row.preferences = row.preferences ? JSON.parse(row.preferences) : null;
                                row.adaptation_history = row.adaptation_history ? JSON.parse(row.adaptation_history) : null;
                                row.usage_statistics = row.usage_statistics ? JSON.parse(row.usage_statistics) : null;
                            }
                            resolve(row || null);
                        }
                    }
                );
            } catch (error) {
                console.error('❌ Gabim në findOne voice memory:', error);
                resolve(null);
            }
        });
    }

    static async create(voiceMemoryData) {
        return new Promise((resolve, reject) => {
            try {
                const { userId, voiceProfile, preferences, adaptationHistory, usageStatistics } = voiceMemoryData;
                
                db.run(
                    `INSERT INTO voice_memory 
                     (user_id, voice_profile, preferences, adaptation_history, usage_statistics) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        userId, 
                        JSON.stringify(voiceProfile), 
                        JSON.stringify(preferences), 
                        JSON.stringify(adaptationHistory), 
                        JSON.stringify(usageStatistics)
                    ],
                    function(err) {
                        if (err) {
                            console.error('❌ Gabim në krijimin e voice memory:', err);
                            reject(err);
                        } else {
                            resolve({ 
                                id: this.lastID, 
                                ...voiceMemoryData 
                            });
                        }
                    }
                );
            } catch (error) {
                console.error('❌ Gabim në create voice memory:', error);
                reject(error);
            }
        });
    }

    static async update(userId, updates) {
        return new Promise((resolve, reject) => {
            try {
                const { voiceProfile, preferences, adaptationHistory, usageStatistics } = updates;
                
                db.run(
                    `UPDATE voice_memory 
                     SET voice_profile = ?, preferences = ?, adaptation_history = ?, 
                         usage_statistics = ?, last_updated = datetime('now')
                     WHERE user_id = ?`,
                    [
                        JSON.stringify(voiceProfile), 
                        JSON.stringify(preferences), 
                        JSON.stringify(adaptationHistory), 
                        JSON.stringify(usageStatistics),
                        userId
                    ],
                    function(err) {
                        if (err) {
                            console.error('❌ Gabim në përditësimin e voice memory:', err);
                            reject(err);
                        } else {
                            resolve(this.changes > 0);
                        }
                    }
                );
            } catch (error) {
                console.error('❌ Gabim në update voice memory:', error);
                reject(error);
            }
        });
    }
}

module.exports = VoiceMemory;
