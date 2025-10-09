// ==================== ✅ COMMAND SERVICE - 07.10.2024 ====================
// 📝 DESKRIMI: Shërbim për procesimin e të gjitha komandave të sistemit
// 🎯 QËLLIMI: Një vend i vetëm për të gjitha komandat
// 📥 INPUT: command string nga përdoruesi
// 📤 OUTPUT: response ose action
// 🔧 AUTORI: ChatAI ALBA Team
// ========================================================================

class CommandService {
    
    // =====================================✅ PROCESIMI I KOMANDËS KRYESORE =======================================================
    async processCommand(command, user, message) {
        try {
            const args = message.split(' ');
            const mainCommand = args[0].toLowerCase();
            const SearchService = require('../services/searchService');
            const GoogleSearchService = require('./googleSearchService');
            
            switch (mainCommand) {
                case '/ndihmo':
                    return await this.helpCommand(user);
                
                case '/wiki':
                    return await this.wikiCommand(args.slice(1).join(' '));
                
                case '/perkthim':
                    return await this.translationCommand(args.slice(1));
                
                case '/meso':
                    return await this.learnCommand(args.slice(1).join(' '));
                
                case '/moti':
                    return await this.weatherCommand(args.slice(1).join(' '));
                
                case '/eksporto':
                    return await this.exportCommand(user);
                
                case '/importo':
                    return await this.importCommand(user, args.slice(1).join(' '));
                
                case '/dil':
                    return await this.logoutCommand(user);
                
                case '/apikey':
                    return await this.apiKeyCommand(user, args.slice(1).join(' '));
                
                case '/gjej':
                    return await SearchService.performSearch(args.slice(1).join(' '));
                
              // ============================== ✅ VAZHDON CASE-KOMANDA TË REJA PËR GOOGLE SEARCH ==============================================
                case '/google':
                case '/kërko':
                case '/search':
                   const searchQuery = args.slice(1).join(' ');
                   if (!searchQuery) {
                     return {
                        success: false,
                        response: '❌ Ju lutem shkruani çfarë të kërkoj: /google <pyetje>'
                     };
                   }
                   return await GoogleSearchService.performGoogleSearch(searchQuery);
            }
            
        } catch (error) {
            console.error('❌ Gabim në procesimin e komandës:', error);
            return {
                success: false,
                response: '❌ Gabim në procesimin e komandës'
            };
        }
    }

    // =================================== ✅ KOMANDA /NDIHMO - LISTA E KOMANDAVE ===========================================
    // ✅ KOMANDA /NDIHMO - VERSION I PËRMIRËSUAR
async helpCommand(user) {
    const commandsList = `
👑 **SISTEMI I KOMANDAVE - CHATAI ALBA** 👑

🔹 **KOMANDAT BAZË:**
• /ndihmo - Shfaq këtë listë komandash
• /wiki <fjale> - Kërko në Wikipedia
• /perkthim <gjuha> <tekst> - Përktih tekst
• /meso <pyetje>|<përgjigje> - Mëso diçka të re
• /moti <qyteti> - Informacion moti
• /eksporto - Eksporto historinë tënde
• /importo <file> - Importo historinë
• /dil - Dil nga llogaria
• /apikey <key> - Vendos API Key për Gemini

🚀 **KOMANDA TË REJA TË KËRKIMIT:**
• /gjej <pyetje> - Kërkim i thelluar në internet
• /google <pyetje> - Kërkim Google
• /kërko <pyetje> - Kërkim në shqip

👑 **KOMANDA ADMIN:**
• /admin - Shfaq komandat e adminit
• /users - Shfaq të gjithë përdoruesit  
• /stats - Statistikat e sistemit
• /clearall - Fshi të gjitha bisedat
• /panel - Shfaq panelin e adminit

💡 **SHEMBUJ:**
• /wiki Albania
• /perkthim anglisht "Mirëdita"
• /meso "Kryeqyteti i Shqipërisë"|"Tirana"
• /moti Tirana
• /gjej Shqipëria
• /google teknologjia 2024
• /apikey API_KEY JOT KETU
    `.trim(); // ✅ .trim() për të larguar hapësirat e panevojshme
    
    return {
        success: true,
        response: commandsList
    };
}

    // ========================================= ✅ KOMANDA /WIKI - KËRKIM WIKIPEDIA =========================================
    async wikiCommand(searchTerm) {
        if (!searchTerm) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani termin për kërkim: /wiki <fjale>'
            };
        }
        
        // Implementimi i Wikipedia API këtu
        const wikiResult = await this.fetchWikipedia(searchTerm);
        
        return {
            success: true,
            response: wikiResult
        };
    }

    // ===========================================✅ KOMANDA /PERKTHIM - PËRKTHIM I TEKSTIT =======================================
    async translationCommand(args) {
        const [language, ...textParts] = args;
        const text = textParts.join(' ');
        
        if (!language || !text) {
            return {
                success: false,
                response: '❌ Format i gabuar: /perkthim <gjuha> <tekst>'
            };
        }
        
        // Implementimi i shërbimit të përkthimit
        const translation = await this.translateText(text, language);
        
        return {
            success: true,
            response: translation
        };
    }

    // =============================================✅ KOMANDA /MESO - MËSIM I RI PËR AI ============================================
    async learnCommand(data) {
        const [question, answer] = data.split('|');
        
        if (!question || !answer) {
            return {
                success: false,
                response: '❌ Format i gabuar: /meso <pyetje>|<përgjigje>'
            };
        }
        
        // Ruaj në knowledge base
        await this.saveToKnowledgeBase(question, answer);
        
        return {
            success: true,
            response: '✅ U mësua me sukses! Tani AI di për: ' + question
        };
    }

    // ===========================================✅ KOMANDA /MOTI - INFORMACION MOTI ==============================================
    async weatherCommand(city) {
        if (!city) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani qytetin: /moti <qyteti>'
            };
        }
        
        // Implementimi i weather API
        const weatherInfo = await this.fetchWeather(city);
        
        return {
            success: true,
            response: weatherInfo
        };
    }

    // =========================================✅ KOMANDA /EKSPORTO - EKSPORT I HISTORISË ===========================================
    async exportCommand(user) {
        const exportData = await this.generateExport(user.id);
        
        return {
            success: true,
            response: `📥 Eksporti u gjenerua! ${exportData}`,
            exportData: exportData
        };
    }

    // ========================================✅ KOMANDA /APIKEY - KONFIGURIM API KEY ==============================================
    async apiKeyCommand(user, apiKey) {
        if (!apiKey) {
            return {
                success: false,
                response: '❌ Ju lutem jepni API Key: /apikey <key_jote>'
            };
        }
        
        // Ruaj API Key në databazë
        await this.saveApiKey(user.id, apiKey);
        
        return {
            success: true,
            response: '✅ API Key u ruajt me sukses! Tani mund të përdorni Gemini AI.'
        };
    }

    // =============================================✅ METODA NDIHMËSE ===============================================================
    async fetchWikipedia(term) {
        // Implementimi i Wikipedia API
        return `📚 Wikipedia për "${term}": Informacioni do të shfaqet këtu...`;
    }
    
    async translateText(text, language) {
        // Implementimi i përkthimit
        return `🌍 Përkthim (${language}): "${text}" → [Rezultati]`;
    }
    
    async fetchWeather(city) {
        // Implementimi i weather API
        return `🌤️ Moti në ${city}: Temperatura, Kushtet...`;
    }
    
    async saveToKnowledgeBase(question, answer) {
        // Implementimi i ruajtjes
        console.log(`💾 Ruajtur: ${question} -> ${answer}`);
    }
    
    async saveApiKey(userId, apiKey) {
        // Implementimi i ruajtjes së API Key
        console.log(`🔑 Ruajtur API Key për user ${userId}`);
    }

    // ===================================================✅ KOMANDË E PANJOHUR ======================================================
    async unknownCommand(command) {
        return {
            success: false,
            response: `❌ Komandë e panjohur: ${command}. Përdorni /ndihmo për listën.`
        };
    }
}

module.exports = new CommandService();
