// ======================================================
// 🧠 KnowledgeDistiller.js - RRUFE-TESLA 10.5 - VERSION ME SQLite
// ======================================================
// SISTEM I RI I MENAXHIMIT TË NJOHURIVE ME SQL DATABASE
// ======================================================

console.log("🚀 Duke ngarkuar KnowledgeDistiller (SQLite Version)...");

class KnowledgeDistiller {
    constructor() {
        this.name = "KnowledgeDistiller-SQL";
        this.version = "2.0-sql";
        this.knowledgeBase = {};
        this.initialized = false;
        this.databaseEnabled = true;
        
        console.log(`🎯 ${this.name} v${this.version} u instancua`);
        this.initialize();
    }

    async initialize() {
        console.log("🔄 Duke inicializuar KnowledgeDistiller me SQLite...");
        
        try {
            // Kontrollo nëse databaza është e disponueshme
            await this.checkDatabaseConnection();
            
            // Ngarko njohuritë nga SQLite
            await this.loadKnowledgeFromDatabase();
            
            this.initialized = true;
            console.log("✅ KnowledgeDistiller u inicializua me SQLite!");
            
        } catch (error) {
            console.error("❌ Gabim në inicializimin me SQLite:", error);
            console.log("🔄 Duke përdorur fallback në localStorage...");
            this.databaseEnabled = false;
            this.loadKnowledgeFromLocalStorage();
        }
    }

    async checkDatabaseConnection() {
        try {
            const response = await fetch('/api/database/status');
            const data = await response.json();
            
            if (data.success && data.database === 'connected') {
                console.log("🗄️ SQLite Database është e lidhur!");
                return true;
            } else {
                throw new Error('Database not connected');
            }
        } catch (error) {
            console.error("❌ Databaza nuk është e disponueshme:", error);
            throw error;
        }
    }

    async loadKnowledgeFromDatabase() {
        try {
            console.log("📥 Duke ngarkuar njohuritë nga SQLite...");
            
            const response = await fetch('/api/knowledge/load', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.knowledge) {
                    this.knowledgeBase = data.knowledge;
                    console.log(`✅ U ngarkuan ${Object.keys(this.knowledgeBase).length} njohuri nga SQLite`);
                } else {
                    console.log("ℹ️ Nuk ka të dhëna në databazë, duke filluar nga zero");
                    this.knowledgeBase = {};
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error("❌ Gabim në ngarkimin nga SQLite:", error);
            throw error;
        }
    }

    loadKnowledgeFromLocalStorage() {
        console.log("📥 Duke ngarkuar njohuritë nga localStorage (fallback)...");
        
        try {
            const stored = localStorage.getItem('rrufe_knowledge');
            if (stored) {
                this.knowledgeBase = JSON.parse(stored);
                console.log(`✅ U ngarkuan ${Object.keys(this.knowledgeBase).length} njohuri nga localStorage`);
            } else {
                this.knowledgeBase = {};
                console.log("ℹ️ Nuk ka të dhëna në localStorage, duke filluar nga zero");
            }
        } catch (error) {
            console.error("❌ Gabim në ngarkimin nga localStorage:", error);
            this.knowledgeBase = {};
        }
    }

    async saveKnowledge() {
        console.log("💾 Duke ruajtur njohuritë...");
        
        try {
            // Priority: SQLite Database
            if (this.databaseEnabled) {
                await this.saveToDatabase();
                console.log("✅ Njohuritë u ruajtën në SQLite Database");
            } else {
                // Fallback: localStorage
                this.saveToLocalStorage();
                console.log("🔄 Njohuritë u ruajtën në localStorage (fallback)");
            }
            
        } catch (error) {
            console.error("❌ Gabim në ruajtjen e njohurive:", error);
            // Fallback emergjent
            this.saveToLocalStorage();
        }
    }

    async saveToDatabase() {
        try {
            const userId = this.getCurrentUserId();
            
            const response = await fetch('/api/knowledge/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    userId: userId,
                    knowledge: this.knowledgeBase,
                    timestamp: new Date().toISOString(),
                    version: this.version
                })
            });
            
            if (!response.ok) {
                throw new Error(`Database error: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Unknown database error');
            }
            
            return result;
            
        } catch (error) {
            console.error("❌ Gabim në ruajtjen në databazë:", error);
            throw error;
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('rrufe_knowledge', JSON.stringify(this.knowledgeBase));
            console.log("💾 Njohuritë u ruajtën në localStorage");
        } catch (error) {
            console.error("❌ Gabim në ruajtjen në localStorage:", error);
        }
    }

    async addKnowledge(key, value, category = 'general') {
        console.log(`🧠 Duke shtuar njohuri: ${key}`);
        
        if (!this.knowledgeBase[category]) {
            this.knowledgeBase[category] = {};
        }
        
        this.knowledgeBase[category][key] = {
            value: value,
            timestamp: new Date().toISOString(),
            usageCount: 0
        };
        
        // Ruaj automatikisht
        await this.saveKnowledge();
        
        return true;
    }

    async learnFromInteraction(question, answer, context = {}) {
        console.log("🎓 Duke mësuar nga interaksioni...");
        
        const knowledgeKey = this.generateKnowledgeKey(question);
        const category = context.category || 'conversation';
        
        await this.addKnowledge(knowledgeKey, {
            question: question,
            answer: answer,
            context: context,
            learnedAt: new Date().toISOString()
        }, category);
        
        console.log("✅ U mësua nga interaksioni!");
    }

    getKnowledge(key, category = 'general') {
        if (this.knowledgeBase[category] && this.knowledgeBase[category][key]) {
            // Rrit numrin e përdorimeve
            this.knowledgeBase[category][key].usageCount++;
            return this.knowledgeBase[category][key].value;
        }
        return null;
    }

    searchKnowledge(query, category = null) {
        const results = [];
        const searchTerms = query.toLowerCase().split(' ');
        
        const categories = category ? [category] : Object.keys(this.knowledgeBase);
        
        categories.forEach(cat => {
            if (this.knowledgeBase[cat]) {
                Object.entries(this.knowledgeBase[cat]).forEach(([key, data]) => {
                    const keyLower = key.toLowerCase();
                    const valueLower = JSON.stringify(data.value).toLowerCase();
                    
                    const matchScore = searchTerms.reduce((score, term) => {
                        if (keyLower.includes(term)) score += 3;
                        if (valueLower.includes(term)) score += 1;
                        return score;
                    }, 0);
                    
                    if (matchScore > 0) {
                        results.push({
                            key: key,
                            category: cat,
                            data: data.value,
                            score: matchScore,
                            usageCount: data.usageCount || 0
                        });
                    }
                });
            }
        });
        
        // Rendit sipas relevancës
        return results.sort((a, b) => b.score - a.score);
    }

    generateKnowledgeKey(question) {
        // Krijo një çelës unik bazuar në pyetjen
        const cleanQuestion = question.toLowerCase().trim().replace(/[^\w\s]/g, '');
        const words = cleanQuestion.split(/\s+/).slice(0, 5); // Merr 5 fjalët e para
        return words.join('_');
    }

    getCurrentUserId() {
        try {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                return user.username || user.id || 'anonymous';
            }
        } catch (e) {
            console.error('Gabim në marrjen e user ID:', e);
        }
        return 'anonymous';
    }

    getStats() {
        const totalEntries = Object.values(this.knowledgeBase).reduce(
            (sum, category) => sum + Object.keys(category).length, 0
        );
        
        const categories = Object.keys(this.knowledgeBase);
        const totalUsage = Object.values(this.knowledgeBase).reduce(
            (sum, category) => sum + Object.values(category).reduce(
                (catSum, entry) => catSum + (entry.usageCount || 0), 0
            ), 0
        );
        
        return {
            name: this.name,
            version: this.version,
            initialized: this.initialized,
            databaseEnabled: this.databaseEnabled,
            totalEntries: totalEntries,
            categories: categories,
            totalUsage: totalUsage,
            storage: this.databaseEnabled ? 'SQLite' : 'localStorage'
        };
    }

    async exportKnowledge() {
        const exportData = {
            version: this.version,
            exportedAt: new Date().toISOString(),
            knowledge: this.knowledgeBase,
            stats: this.getStats()
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    async importKnowledge(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            this.knowledgeBase = importData.knowledge || {};
            
            // Ruaj në storage-in aktual
            await this.saveKnowledge();
            
            console.log("✅ Njohuritë u importuan me sukses!");
            return true;
            
        } catch (error) {
            console.error("❌ Gabim në importimin e njohurive:", error);
            return false;
        }
    }
}

// ==================== EKSPORTIM ====================

window.KnowledgeDistiller = KnowledgeDistiller;
window.knowledgeDistiller = new KnowledgeDistiller();

// Auto-inicializim
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM u ngarkua - KnowledgeDistiller është gati!");
});

console.log("✅ KnowledgeDistiller (SQLite Version) u ngarkua!");

// ==================== TESTIM ====================

window.testKnowledgeDistiller = async function() {
    console.log("🧪 TEST I KNOWLEDGE DISTILLER:");
    
    const stats = window.knowledgeDistiller.getStats();
    console.log("📊 Stats:", stats);
    
    // Test shtimi i njohurive
    await window.knowledgeDistiller.addKnowledge('test_key', {
        question: 'Test pyetje',
        answer: 'Test përgjigje',
        type: 'test'
    }, 'test');
    
    // Test kërkimi
    const results = window.knowledgeDistiller.searchKnowledge('test');
    console.log("🔍 Rezultatet e kërkimit:", results);
    
    return stats;
};
