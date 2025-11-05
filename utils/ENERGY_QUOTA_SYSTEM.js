// ========================================== ENERGY_QUOTA_SYSTEM ====================================

const database = require('../database'); // ⬅️ SHTO ../ PARA database

class EnergyQuotaSystem {
    constructor() {
        this.DAILY_MAX_ENERGY = 120;
        this.FATIGUE_THREsHOLD = 90;
        console.log('✅ ENERGY_QUOTA_SYSTEM: Etika e Përhersme u inicializua.');
    }

    async initializeTable() {
        try {
            await database.run(`
                CREATE TABLE IF NOT EXISTS energy_quota (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    userId TEXT UNIQUE NOT NULL,
                    daily_usage INTEGER DEFAULT 0,
                    last_updated DATE DEFAULT CURRENT_DATE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Tabela energy_quota u inicializua');
        } catch (error) {
            console.error('❌ Gabim në tabelën energy_quota:', error);
        }
    }

    async getDailyUsage(userId) {
        try {
            await this.initializeTable();
            
            const result = await database.get(
                `SELECT daily_usage FROM energy_quota WHERE userId = ? AND last_updated = DATE('now')`,
                [userId]
            );
            
            return result ? result.daily_usage : 0;
        } catch (error) {
            console.error('❌ Gabim në getDailyUsage:', error);
            return 0;
        }
    }

    async updateUsage(userId, minutes = 1) {
        try {
            await this.initializeTable();
            
            // Kontrollo nëse ekziston rekord për sot
            const existing = await database.get(
                `SELECT * FROM energy_quota WHERE userId = ? AND last_updated = DATE('now')`,
                [userId]
            );

            if (existing) {
                // Update ekzistues
                await database.run(
                    `UPDATE energy_quota SET daily_usage = daily_usage + ? WHERE userId = ? AND last_updated = DATE('now')`,
                    [minutes, userId]
                );
            } else {
                // Krijo të ri
                await database.run(
                    `INSERT INTO energy_quota (userId, daily_usage) VALUES (?, ?)`,
                    [userId, minutes]
                );
            }

            const newUsage = await this.getDailyUsage(userId);
            console.log(`🧠 EQS: Përdorimi për ${userId}: ${newUsage} min.`);
            
            return newUsage;
        } catch (error) {
            console.error('❌ Gabim në updateUsage:', error);
            return 0;
        }
    }

    async isQuotaExceeded(userId) {
        const usage = await this.getDailyUsage(userId);
        const exceeded = usage >= this.DAILY_MAX_ENERGY;
        
        if (exceeded) {
            console.warn(`🚨 EQS ALARM: Kuota u Tejkalua! (${usage} min.)`);
        }
        return exceeded;
    }

    async isFatigued(userId) {
        const usage = await this.getDailyUsage(userId);
        const fatigued = usage >= this.FATIGUE_THRESHOLD && usage < this.DAILY_MAX_ENERGY;
        
        if (fatigued) {
            console.warn(`⚠️ EQS PARALAJMËRIM: Lodhje e Afërt! (${usage} min.)`);
        }
        return fatigued;
    }

    async checkSystemStatus(userId) {
        if (await this.isQuotaExceeded(userId)) {
            return {
                allow_access: false,
                reason: "KUOTA_E_TEJKALUAR",
                message_al: "Sistemi i Inteligjencës së Përtejme ka vënë re lodhje të plotë. Vazhdimi mund të dëmtojë vëmendjen tuaj. Ju lutemi, rifilloni nesër.",
                message_en: "Perpetual Intelligence detects full cognitive fatigue. Continuing may harm your focus. Please resume tomorrow.",
                usage: await this.getDailyUsage(userId),
                max_allowed: this.DAILY_MAX_ENERGY
            };
        }
        
        if (await this.isFatigued(userId)) {
            return {
                allow_access: true,
                reason: "PARALAJMERIM_LODHJE",
                message_al: "Vëmendje: Kufiri i lodhjes po afrohet. Ju lutemi bëni një pushim për riekuilibër.",
                message_en: "Attention: Cognitive fatigue limit approaching. Please take a break.",
                usage: await this.getDailyUsage(userId),
                threshold: this.FATIGUE_THRESHOLD
            };
        }

        return {
            allow_access: true,
            reason: "NORMAL",
            message_al: "Sistemi i Kuotës së Energjisë është i shëndetshëm. Vazhdoni eksplorimin.",
            message_en: "Energy Quota System is healthy. Continue exploring.",
            usage: await this.getDailyUsage(userId),
            max_allowed: this.DAILY_MAX_ENERGY
        };
    }
}

module.exports = EnergyQuotaSystem;
