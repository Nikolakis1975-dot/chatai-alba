// ==================== ✅ COMMAND BRIDGE - 08.10.2024 ====================
// 📝 DESKRIMI: Ura midis sistemit të vjetër dhe të ri të komandave
// 🎯 QËLLIMI: Lidhja pa rrezik e CommandService me sistemin ekzistues
// 🔧 AUTORI: ChatAI ALBA Team
// =========================================================================

const CommandService = require('../services/commandService');

class CommandBridge {
    
    // ✅ PROVO SISTEMIN E RI, NËSE DËSHTO KTHEHU TE I VJETERI
    static async processCommandSafe(text, user) {
        try {
            console.log(`🔗 Duke provuar sistemin e ri të komandave...`);
            
            // ✅ PROVO KOMANDËN ME SISTEMIN E RI
            const newSystemResult = await CommandService.processCommand('/', user, text);
            
            // ✅ KONTROLLO NËSE SISTEMI I RI FUNKSIONON
            if (newSystemResult && newSystemResult.success !== false) {
                console.log(`✅ Sistemi i ri funksionon për: ${text}`);
                return newSystemResult;
            }
            
            // ❌ NËSE SISTEMI I RI DËSHTON, KTHEHU TE I VJETERI
            throw new Error('Sistemi i ri kthen rezultat të pavlefshëm');
            
        } catch (error) {
            console.log(`🔄 Sistemi i ri dështoi, duke u kthyer te sistemi i vjetër: ${error.message}`);
            
            // ✅ KTHEHU TE SISTEMI I VJETËR I PROVUAR
            return await this.fallbackToOldSystem(text, user);
        }
    }
    
    // ✅ SISTEMI I VJETËR I SIGURT (FALLBACK)
    static async fallbackToOldSystem(text, user) {
        // Këtu vendosim logjikën e vjetër të komandave
        // që dimë që funksionon perfekt
        const parts = text.trim().split(" ");
        const cmd = parts[0];
        
        // Implementimi i vjetër i provuar
        switch (cmd) {
            case "/ndihmo":
                return {
                    success: true,
                    response: "📌 Komandat: /ndihmo, /wiki <fjale>, /perkthim <gjuha> <tekst>, /meso <pyetje>|<përgjigje>, /moti <qyteti>, /eksporto, /importo, /dil, /apikey"
                };
            // ... komandat e tjera ekzistuese
            default:
                return {
                    success: false,
                    response: "❌ Komandë e panjohur"
                };
        }
    }
}

module.exports = CommandBridge;
