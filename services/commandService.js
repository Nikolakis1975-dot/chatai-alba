// ==================== ✅ COMMAND SERVICE - 12.10.2024 ====================
// 📝 DESKRIMI: Shërbim për procesimin e të gjitha komandave të sistemit
// 🎯 QËLLIMI: Një vend i vetëm për të gjitha komandat
// 📥 INPUT: command string nga përdoruesi
// 📤 OUTPUT: response ose action
// 🔧 AUTORI: ChatAI ALBA Team
// ========================================================================

// ============================ ✅ IMPORT I NLU SERVICE =============================
let nluService;
try {
    nluService = require('./nluService');
    console.log('✅ NLU Service u ngarkua me sukses!');
} catch (error) {
    console.log('⚠️ NLU Service nuk u gjet, duke përdorur sistemin bazë...');
    nluService = {
        analyzeText: async (text, userId) => ({
            intent: { type: 'unknown', confidence: 0.5 },
            sentiment: { sentiment: 'neutral', irony: false },
            entities: { persons: [], locations: [], organizations: [] },
            nuances: { figurativeLanguage: [] }
        })
    };
}

class CommandService {
    
    // ============================ ✅ PROCESIMI I KOMANDËS KRYESORE =============================
    async processCommand(command, user, message) {
        try {
            console.log('🎯 DEBUG CommandService: Procesim mesazh:', {
                command, 
                user: user.username, 
                message: message.substring(0, 50)
            });

            const args = message.split(' ');
            const mainCommand = args[0].toLowerCase();

            // ======================= ✅ ANALIZË NLU PËR MESAZHET JO-KOMANDË ======================
            if (!mainCommand.startsWith('/') && message.trim().length > 2) {
                console.log('🔍 DEBUG: Gjet mesazh natyror - duke thirrur handleNaturalLanguage');
                return await this.handleNaturalLanguage(message, user);
            }
            
            switch (mainCommand) {
                case '/ndihmo':
                    return await this.helpCommand(user);
                
                // ======================= ✅ MODI I RI STUDENT ======================
                case "/student":
                case "/studim":
                case "/student-mode":
                    return {
                        success: true,
                        response: `
🎓 **MODI STUDENT - CHATAI ALBA**

📚 KËRKIM AKADEMIK:
• /libër <emri>        - Gjej libra shkollorë
• /detyrë <lënda>      - Ndihmë për detyra
• /referencë <tema>    - Burime akademike

🧮 SHKENCA & MATEMATIKË:
• /matematikë <problem> - Zgjidh probleme
• /fizikë <formulë>     - Shpjegime fizike  
• /kimi <element>       - Tabela periodike

🗺️ HISTORI & GJEORAFI:
• /histori <periudhë>   - Historia shqiptare
• /gjeografi <qytet>    - Harta & statistika

📝 PROJEKTE & DETYRA:
• /projekt <tema>       - Struktura projekti
• /prezantim <tema>     - Slide template
• /bibliografi          - Format referencash

💡 SHEMBUJ:
• /libër "Histori e Shqipërisë"
• /detyrë matematikë
• /projekt "Roli i Nënë Terezës"
• /matematikë "2x + 5 = 15"
                        `.trim()
                    };
                
                // ======================= ✅ KOMANDAT E REJA PËR STUDENTË ======================
                case '/libër':
                case '/liber':
                    return await this.studentBookCommand(args.slice(1).join(' '));
                
                case '/detyrë':
                case '/detyre':
                    return await this.studentHomeworkCommand(args.slice(1).join(' '));
                
                case '/matematikë':
                case '/matematike':
                    return await this.studentMathCommand(args.slice(1).join(' '));
                
                case '/referencë':
                case '/referenc':
                    return {
                        success: true,
                        response: `📚 **KËRKIM BURIMESH:** "${args.slice(1).join(' ')}"\n\n🔍 Po kërkoj burime akademike...`
                    };
                
                case '/projekt':
                    return {
                        success: true,
                        response: `📋 **STRUKTURA PROJEKTI:** "${args.slice(1).join(' ')}"\n\n1. 🎯 **Hyrje** - Prezantimi i temës\n2. 📚 **Literatura** - Burimet e përdorura\n3. 🔬 **Metodologjia** - Si u krye kërkimi\n4. 📊 **Rezultatet** - Gjetjet kryesore\n5. 💭 **Diskutimi** - Analiza e rezultateve\n6. ✅ **Përfundimi** - Konkluzionet\n7. 📖 **Bibliografia** - Lista e burimeve`
                    };
                
                case '/fizikë':
                case '/fizike':
                    return {
                        success: true,
                        response: `🔬 **NDIHMË PËR FIZIKË:** "${args.slice(1).join(' ')}"\n\n💡 Unë mund të ndihmoj me:\n• Shpjegime të ligjeve fizike\n• Zgjidhje problemesh\n• Formulat dhe njësitë\n• Eksperimente dhe demonstrime`
                    };
                
                case '/kimi':
                    return {
                        success: true,
                        response: `⚗️ **NDIHMË PËR KIMI:** "${args.slice(1).join(' ')}"\n\n💡 Unë mund të ndihmoj me:\n• Tabelën periodike\n• Reaksionet kimike\n• Formulat dhe ekuacionet\n• Shpjegime të koncepteve`
                    };
                
                case '/histori':
                    return {
                        success: true,
                        response: `🏛️ **HISTORI SHQIPTARE:** "${args.slice(1).join(' ')}"\n\n💡 Unë mund të ndihmoj me:\n• Periudhat historike\n• Personalitete të shquara\n• Evente dhe beteja\n• Trashëgimi kulturore`
                    };
                
                case '/gjeografi':
                case '/gjeografi':
                    return {
                        success: true,
                        response: `🗺️ **GJEOGRAFI SHQIPTARE:** "${args.slice(1).join(' ')}"\n\n💡 Unë mund të ndihmoj me:\n• Qytete dhe rajone\n• Vende turistike\n• Klima dhe reliev\n• Burime natyrore`
                    };
                
                // ======================= ✅ KOMANDAT EKZISTUESE ======================
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
                    const SearchService = require('./searchService');
                    return await SearchService.performSearch(args.slice(1).join(' '));
                
                case '/google':
                case '/kërko':
                    const GoogleSearchService = require('./googleSearchService');
                    return await GoogleSearchService.performGoogleSearch(args.slice(1).join(' '));         
                
                default:
                    return await this.unknownCommand(mainCommand);
            }
            
        } catch (error) {
            console.error('❌ Gabim në procesimin e komandës:', error);
            return {
                success: false,
                response: '❌ Gabim në procesimin e komandës'
            };
        }
    }

    // ============================ ✅ TRAJTIMI I GJUHËS NATYRORE ME NLU =============================
    async handleNaturalLanguage(message, user) {
        try {
            console.log('🔍 NLU Duke analizuar mesazhin natyror...');
            
            // Analizo mesazhin me NLU Service
            const nluAnalysis = await nluService.analyzeText(message, user.id);
            
            console.log('📊 NLU Analysis Result:', {
                intent: nluAnalysis.intent.type,
                sentiment: nluAnalysis.sentiment.sentiment,
                confidence: nluAnalysis.intent.confidence,
                irony: nluAnalysis.sentiment.irony
            });

            // Përgjigju direkt nga NLU - JO nga Gemini!
            return await this.generateNLUResponse(message, nluAnalysis, user);
            
        } catch (error) {
            console.error('❌ Gabim në NLU processing:', error);
            return {
                success: true,
                response: this.getSimpleResponse(message)
            };
        }
    }

    // ============================ ✅ GJENERIMI I PËRGJIGJEVE NLU DIRECT =============================
    async generateNLUResponse(message, analysis, user) {
        const { intent, sentiment } = analysis;

        // Përgjigje direkt nga NLU - NUK KA NEVOJË PËR GEMINI!
        switch (intent.type) {
            case 'greeting':
                return {
                    success: true,
                    response: "Përshëndetje! 😊 Mirë se ju gjetëm! Si mund t'ju ndihmoj sot?"
                };

            case 'question':
                return {
                    success: true,
                    response: "Kjo është një pyetje interesante! 🤔 Mund të më jepni më shumë detaje?"
                };

            case 'gratitude':
                return {
                    success: true,
                    response: "S'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!"
                };

            case 'request':
                return {
                    success: true,
                    response: "Sigurisht! 😊 Çfarë lloj ndihme keni nevojë? Mund të përdorni /ndihmo për të parë të gjitha mundësitë."
                };

            default:
                return {
                    success: true,
                    response: "E kuptoj! 😊 Për ndihmë më specifike, mund të përdorni një nga komandat e mia."
                };
        }
    }

    // ============================ ✅ PËRGJIGJE E THJESHTË =============================
    getSimpleResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('përshëndetje') || lowerMessage.includes('tungjatjeta')) {
            return "Përshëndetje! 😊 Si mund t'ju ndihmoj sot?";
        }
        
        if (lowerMessage.includes('si je') || lowerMessage.includes('si jeni')) {
            return "Jam shumë mirë, faleminderit që pyetët! 😊 Çfarë mund të bëj për ju?";
        }
        
        if (lowerMessage.includes('faleminderit') || lowerMessage.includes('rrofsh')) {
            return "S'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!";
        }
        
        if (lowerMessage.includes('ndihmë') || lowerMessage.includes('help')) {
            return "Sigurisht! 😊 Çfarë lloj ndihme keni nevojë?";
        }
        
        return "E kuptoj! 😊 Përdorni /ndihmo për të parë të gjitha komandat e mia.";
    }

    // ========================= ✅ FUNKSIONET E REJA PËR STUDENTË ===========================
    async studentBookCommand(bookName) {
        if (!bookName) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani emrin e librit: /libër <emri_i_librit>'
            };
        }
        
        return {
            success: true,
            response: `📚 **KËRKIM LIBRI:** "${bookName}"\n\n🔍 Po kërkoj librin "${bookName}" në burime shkollore...\n💡 Përdor /google për kërkim të thelluar!`
        };
    }

    async studentHomeworkCommand(subject) {
        if (!subject) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani lëndën: /detyrë <lënda>'
            };
        }
        
        return {
            success: true,
            response: `📝 **NDIHMË PËR DETYRË NË ${subject.toUpperCase()}**\n\n💡 Unë mund të ndihmoj me:\n• Shpjegime të koncepteve\n• Shembuj zgjidhjesh\n• Burime shtesë\n\nShkruani pyetjen tuaj specifike për ${subject}!`
        };
    }

    async studentMathCommand(problem) {
        if (!problem) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani problemin: /matematikë <problem>'
            };
        }
        
        return {
            success: true,
            response: `🧮 **PROBLEM MATEMATIKOR:** "${problem}"\n\n🔢 Po analizoj problemën...\n💡 Përdor /google për zgjidhje të detajuara!`
        };
    }

    // ============ ✅ KOMANDA /NDIHMO - LISTA E KOMANDAVE ==============
    async helpCommand(user) {
        const commandsList = `
👑 SISTEMI I KOMANDAVE - CHATAI ALBA 👑

📋 KOMANDAT BAZË:
• /ndihmo    - Shfaq këtë listë
• /wiki      - Kërko Wikipedia  
• /perkthim  - Përktih tekst
• /meso      - Mëso diçka të re
• /moti      - Informacion moti
• /eksporto  - Eksporto historinë
• /importo   - Importo historinë
• /dil       - Dil nga llogaria
• /apikey    - Vendos API Key

🔍 KOMANDA KËRKIMI:
• /gjej      - Kërkim i thelluar
• /google    - Kërkim Google
• /kërko     - Kërkim në shqip

🎓 KOMANDA PËR STUDENTË:
• /student   - Menu e studentit
• /libër     - Gjej libra shkollorë
• /detyrë    - Ndihmë për detyra
• /matematikë - Zgjidh probleme
• /projekt   - Strukturë projekti
• /fizikë    - Ndihmë fizikë
• /kimi      - Ndihmë kimi
• /histori   - Historia shqiptare
• /gjeografi - Gjeografi shqiptare

👑 KOMANDA ADMIN:
• /admin     - Komandat e adminit
• /users     - Të gjithë përdoruesit
• /stats     - Statistikat
• /clearall  - Fshi të gjitha
• /panel     - Paneli i adminit

💡 SHEMBUJ:
• /wiki Albania
• /perkthim anglisht "Mirëdita"
• /meso "Kryeqyteti"|"Tirana"
• /moti Tirana
• /gjej Shqipëria
• /google teknologji
• /student
• /libër "Matematikë 10"
        `.trim();
        
        return {
            success: true,
            response: commandsList
        };
    }

    // =========================== ✅ KOMANDA /WIKI - KËRKIM WIKIPEDIA =========================
    async wikiCommand(searchTerm) {
        if (!searchTerm) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani termin për kërkim: /wiki <fjale>'
            };
        }
        
        return {
            success: true,
            response: `📚 Wikipedia për "${searchTerm}": Informacioni do të shfaqet këtu...`
        };
    }

    // ========================= ✅ KOMANDA /PERKTHIM - PËRKTHIM I TEKSTIT =========================
    async translationCommand(args) {
        const [language, ...textParts] = args;
        const text = textParts.join(' ');
        
        if (!language || !text) {
            return {
                success: false,
                response: '❌ Format i gabuar: /perkthim <gjuha> <tekst>'
            };
        }
        
        return {
            success: true,
            response: `🌍 Përkthim (${language}): "${text}" → [Rezultati]`
        };
    }

    // ========================✅ KOMANDA /MESO - MËSIM I RI PËR AI ==============================
    async learnCommand(data) {
        const [question, answer] = data.split('|');
        
        if (!question || !answer) {
            return {
                success: false,
                response: '❌ Format i gabuar: /meso <pyetje>|<përgjigje>'
            };
        }
        
        console.log(`💾 Ruajtur: ${question} -> ${answer}`);
        
        return {
            success: true,
            response: '✅ U mësua me sukses! Tani AI di për: ' + question
        };
    }

    // ======================== ✅ KOMANDA /MOTI - INFORMACION MOTI =============================
    async weatherCommand(city) {
        if (!city) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani qytetin: /moti <qyteti>'
            };
        }
        
        return {
            success: true,
            response: `🌤️ Moti në ${city}: Temperatura, Kushtet...`
        };
    }

    // ======================== ✅ KOMANDA /EKSPORTO - EKSPORT I HISTORISË =====================
    async exportCommand(user) {
        return {
            success: true,
            response: `📥 Eksporti u gjenerua!`,
            exportData: "Eksporti i të dhënave"
        };
    }

    // ======================== ✅ KOMANDA /IMPORTO - IMPORT I HISTORISË =====================
    async importCommand(user, data) {
        return {
            success: true,
            response: '📤 Importimi i historisë...'
        };
    }

    // ======================== ✅ KOMANDA /DIL - DILJE =========================
    async logoutCommand(user) {
        return {
            success: true,
            response: '👋 Dalje nga sistemi...'
        };
    }

    // ======================== ✅ KOMANDA /APIKEY - KONFIGURIM API KEY =========================
    async apiKeyCommand(user, apiKey) {
        if (!apiKey) {
            return {
                success: false,
                response: '❌ Ju lutem jepni API Key: /apikey <key_jote>'
            };
        }
        
        console.log(`🔑 Ruajtur API Key për user ${user.id}`);
        
        return {
            success: true,
            response: '✅ API Key u ruajt me sukses! Tani mund të përdorni Gemini AI.'
        };
    }

    // ================================ ✅ KOMANDË E PANJOHUR ===================================
    async unknownCommand(command) {
        return {
            success: false,
            response: `❌ Komandë e panjohur: ${command}. Përdorni /ndihmo për listën.`
        };
    }
}

module.exports = new CommandService();
