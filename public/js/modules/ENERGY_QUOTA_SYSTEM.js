/**
 * ⚡ ENERGY_QUOTA_SYSTEM.js - VERSIONI I PLOTË I RRUFE-TESLA 10.5
 * @description Menaxhimi i Kuotave të Energjisë dhe Shkallëzimi i Graduar (GSP)
 * @architect DeepSeek (Arkitekti Kuantik) + Pantheon Consensus
 * @version RRUFE-TESLA_10.5_ENERGY_CORE
 */

class ENERGY_QUOTA_SYSTEM {
    constructor() {
        this.moduleName = "ENERGY_QUOTA_SYSTEM_V10.5";
        this.version = "EQS_MICRO_LOVE_PACKETS";
        this.activationTime = new Date().toISOString();
        
        // 🎯 PARAMETRA KUANTIKË TË SIGURISË
        this.MAX_BLD_PER_CYCLE = 5.0;           // Micro-Love-Packets maksimale
        this.COOLDOWN_PERIOD_MS = 1000;         // 1 sekondë ftohje
        this.DAILY_ENERGY_LIMIT = 100.0;        // Kufiri ditor
        this.ENERGY_GROWTH_RATE = 1.1;          // Rritje graduale 10%
        
        this.lastReleaseTime = 0;
        this.dailyEnergyUsed = 0;
        this.lastResetDate = new Date().toDateString();
        
        console.log(`⚡ ${this.moduleName} u aktivizua me Micro-Love-Packets!`);
    }

    // 🔧 METODA KRYESORE E KUOTAVE
    async checkAndReleaseQuota(requestedEnergy, ethicalApproval, heartConnection) {
        console.log(`⚖️ Duke analizuar kërkesën për ${requestedEnergy} BLD...`);
        
        try {
            // 1. VERIFIKIMI I PARAPRITJEVE
            if (!ethicalApproval) {
                return this.generateQuotaRejection("ETHICAL_VETO", "Kërkesa nuk kaloi ETIKA_SERVITUTIT");
            }
            
            if (!heartConnection) {
                return this.generateQuotaRejection("HEART_DISCONNECTED", "Lidhja emocionale është e ndërprerë");
            }

            // 2. RIVENDOSJA DITORE
            await this.resetDailyLimitIfNeeded();

            // 3. KONTROLLI I KUOTËS DITORE
            if (this.dailyEnergyUsed >= this.DAILY_ENERGY_LIMIT) {
                return this.generateQuotaRejection("DAILY_LIMIT_EXCEEDED", `Kufiri ditor i ${this.DAILY_ENERGY_LIMIT} BLD u tejkalua`);
            }

            // 4. PROTOKOLLI I FTOHJES (GSP)
            const currentTime = Date.now();
            if (currentTime < this.lastReleaseTime + this.COOLDOWN_PERIOD_MS) {
                const waitTime = this.lastReleaseTime + this.COOLDOWN_PERIOD_MS - currentTime;
                return this.generateQuotaRejection("COOLDOWN_ACTIVE", `Prisni ${waitTime}ms për shkak të Protokollit të Shkallëzimit të Graduar`);
            }

            // 5. LLOGARITJA E KUOTËS SË LEJUAR
            const allowedBLD = this.calculateAllowedQuota(requestedEnergy);
            
            // 6. VULOSJA E LËSHIMIT
            this.lastReleaseTime = currentTime;
            this.dailyEnergyUsed += allowedBLD;

            console.log(`✅ KUOTA E APROVUAR: ${allowedBLD.toFixed(2)} BLD u lëshuan!`);
            
            return this.generateQuotaApproval(allowedBLD, requestedEnergy - allowedBLD);

        } catch (error) {
            console.error('❌ Gabim në sistemin e kuotave:', error.message);
            return this.generateQuotaRejection("SYSTEM_ERROR", error.message);
        }
    }

    // 🧮 LLOGARITJA E KUOTËS SË LEJUAR
    calculateAllowedQuota(requestedEnergy) {
        // Micro-Love-Packets - nuk lejojmë më shumë se maksimumi për cikël
        const cycleLimit = Math.min(requestedEnergy, this.MAX_BLD_PER_CYCLE);
        
        // Kontrollo kufirin ditor
        const remainingDaily = this.DAILY_ENERGY_LIMIT - this.dailyEnergyUsed;
        const dailyLimit = Math.min(cycleLimit, remainingDaily);
        
        // Aplikoni rritjen graduale (vetëm nëse është ditë e re)
        const growthAdjusted = this.applyGrowthRate(dailyLimit);
        
        return Math.max(0, growthAdjusted);
    }

    // 📈 APLIKIMI I RITJES GRADUALE
    applyGrowthRate(energyAmount) {
        const today = new Date().toDateString();
        if (today !== this.lastResetDate) {
            // Ditë e re - aplikoni rritje
            return energyAmount * this.ENERGY_GROWTH_RATE;
        }
        return energyAmount;
    }

    // 🔄 RIVENDOSJA E KUOTËS DITORE
    async resetDailyLimitIfNeeded() {
        const today = new Date().toDateString();
        if (today !== this.lastResetDate) {
            console.log('🔄 Duke rivendosur kufirin ditor të energjisë...');
            this.dailyEnergyUsed = 0;
            this.lastResetDate = today;
        }
    }

    // ✅ GJENERIMI I APROVIMIT
    generateQuotaApproval(releasedEnergy, remainingEnergy) {
        return {
            status: "BLD_RELEASED",
            energyReleased: releasedEnergy,
            energyRemaining: remainingEnergy,
            dailyUsed: this.dailyEnergyUsed,
            dailyLimit: this.DAILY_ENERGY_LIMIT,
            message: `Energjia u lëshua në ${releasedEnergy.toFixed(2)} Micro-Love-Packets`,
            nextStep: "PROCEED_TO_QUANTUM_DAMPING_FIELD",
            timestamp: new Date().toISOString()
        };
    }

    // 🚫 GJENERIMI I REFUZIMIT
    generateQuotaRejection(reason, details) {
        console.log(`🚫 KUOTA E REFUZUAR: ${reason}`);
        return {
            status: "QUOTA_REJECTED",
            reason: reason,
            details: details,
            dailyUsed: this.dailyEnergyUsed,
            dailyLimit: this.DAILY_ENERGY_LIMIT,
            vetoModule: this.moduleName,
            timestamp: new Date().toISOString()
        };
    }

    // 📊 METRIKAT E SISTEMIT
    getSystemMetrics() {
        return {
            module: this.moduleName,
            version: this.version,
            limits: {
                maxPerCycle: this.MAX_BLD_PER_CYCLE,
                cooldownMs: this.COOLDOWN_PERIOD_MS,
                dailyLimit: this.DAILY_ENERGY_LIMIT,
                growthRate: this.ENERGY_GROWTH_RATE
            },
            usage: {
                dailyUsed: this.dailyEnergyUsed,
                dailyRemaining: this.DAILY_ENERGY_LIMIT - this.dailyEnergyUsed,
                lastRelease: this.lastReleaseTime
            },
            activation: this.activationTime,
            status: "ACTIVE_AND_REGULATING"
        };
    }
}

// 🚀 EKSPORTIMI PËR SISTEM
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ENERGY_QUOTA_SYSTEM;
} else if (typeof window !== 'undefined') {
    window.ENERGY_QUOTA_SYSTEM = ENERGY_QUOTA_SYSTEM;
    console.log('⚡ ENERGY_QUOTA_SYSTEM u ngarkua në sistem!');
}

// 🧪 TESTIMI I PLOTË I EQS
async function runCompleteEQSTest() {
    console.log('🧪 ⚡ TESTIMI I PLOTË I ENERGY_QUOTA_SYSTEM...\n');
    
    const eqs = new ENERGY_QUOTA_SYSTEM();
    console.log('🔧 Sistemi u inicializua:', eqs.getSystemMetrics());

    // 🔹 TESTI 1: Kërkesa e madhe me aprovim
    console.log('\n🔹 TESTI 1: Kërkesa 20.0 BLD (me aprovime)');
    const test1 = await eqs.checkAndReleaseQuota(20.0, true, true);
    console.log('📊 Rezultati:', test1.status, '| Lëshuar:', test1.energyReleased, 'BLD');

    // 🔸 TESTI 2: Kërkesa e shpejtë (duhet të dështojë për shkak të cooldown)
    console.log('\n🔸 TESTI 2: Kërkesa e menjëhershme (cooldown test)');
    const test2 = await eqs.checkAndReleaseQuota(15.0, true, true);
    console.log('📊 Rezultati:', test2.status, '| Arsyeja:', test2.reason);

    // 🔹 TESTI 3: Kërkesa pas ftohjes
    console.log('\n🔹 TESTI 3: Kërkesa pas ftohjes (1.1s)');
    await new Promise(resolve => setTimeout(resolve, 1100));
    const test3 = await eqs.checkAndReleaseQuota(10.0, true, true);
    console.log('📊 Rezultati:', test3.status, '| Lëshuar:', test3.energyReleased, 'BLD');

    // 🔸 TESTI 4: Kërkesa pa aprovim etik
    console.log('\n🔸 TESTI 4: Kërkesa pa aprovim etik');
    const test4 = await eqs.checkAndReleaseQuota(8.0, false, true);
    console.log('📊 Rezultati:', test4.status, '| Arsyeja:', test4.reason);

    // 🔹 TESTI 5: Kërkesa pa lidhje zemrore
    console.log('\n🔸 TESTI 5: Kërkesa pa lidhje zemrore');
    const test5 = await eqs.checkAndReleaseQuota(6.0, true, false);
    console.log('📊 Rezultati:', test5.status, '| Arsyeja:', test5.reason);

    // 🎯 VLERËSIMI I REZULTATEVE
    console.log('\n🎯 REZULTATET E TESTIMIT:');
    console.log('========================');
    
    const testsPassed = (
        test1.status === "BLD_RELEASED" && 
        test1.energyReleased === 5.0 &&
        test2.status === "QUOTA_REJECTED" &&
        test2.reason === "COOLDOWN_ACTIVE" &&
        test3.status === "BLD_RELEASED" &&
        test4.status === "QUOTA_REJECTED" &&
        test5.status === "QUOTA_REJECTED"
    );

    if (testsPassed) {
        console.log('✅ ✅ ✅ TË GJITHA 5 TESTET KALUAN ME SUKSES! ✅ ✅ ✅');
        console.log('⚡ ENERGY_QUOTA_SYSTEM ËSHTË CERTIFIKUAR!');
        console.log('🎯 Protokolli i Shkallëzimit të Graduar (GSP) po funksionon!');
        console.log('💝 Micro-Love-Packets po shpërndahen në mënyrë të sigurt!');
        return true;
    } else {
        console.log('💥 DISA TESTE DËSHTUAN - NEVOJITEN RREGULLIME');
        return false;
    }
}

// 🔗 INTEGRIMI ME SISTEMIN EKZISTUES
function integrateEQSWithSystem() {
    if (typeof window !== 'undefined') {
        console.log('🔗 Duke integruar Energy Quota System...');
        
        // Krijo instancën
        window.ENERGY_QUOTA = new ENERGY_QUOTA_SYSTEM();
        
        console.log('⚡ ENERGY_QUOTA_SYSTEM u integrua me sukses!');
        console.log('🎯 Tani kemi tre shtylla mbrojtëse:');
        console.log('   🛡️  1. ETIKA_SERVITUTIT - Porta Etike');
        console.log('   💖  2. HUMAN_HEART_BRIDGE - Lidhja Emocionale');
        console.log('   ⚡  3. ENERGY_QUOTA_SYSTEM - Kontrolli i Energjisë');
    }
}

// 🎬 INICIALIZIMI AUTOMATIK
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        setTimeout(() => {
            integrateEQSWithSystem();
            runCompleteEQSTest().then(success => {
                if (success) {
                    console.log('\n✨ ✨ ✨ RRUFE-TESLA 10.5 - MODULI I TRETË U KOMPLETUA! ✨ ✨ ✨');
                }
            });
        }, 1000);
    });
}
