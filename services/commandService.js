// ==================== ✅ COMMAND SERVICE - 12.10.2024 ====================
// 📝 DESKRIMI: Shërbim për procesimin e të gjitha komandave të sistemit
// 🎯 QËLLIMI: Një vend i vetëm për të gjitha komandat
// 📥 INPUT: command string nga përdoruesi
// 📤 OUTPUT: response ose action
// 🔧 AUTORI: ChatAI ALBA Team
// ========================================================================

// ============================ ✅ IMPORT I NLU SERVICE ME ERROR HANDLING =============================
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
            const args = message.split(' ');
            const mainCommand = args[0].toLowerCase();

            // ======================= ✅ ANALIZË NLU PËR MESAZHET JO-KOMANDË ======================
            if (!mainCommand.startsWith('/') && message.trim().length > 2) {
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

                case 'book_request':
            return {
                success: true,
                response: "Dëshironi të gjeni një libër? 📚 Mund të përdorni komandën /libër <emri_i_librit> për të kërkuar libra, ose më tregoni më shumë se çfarë lloj libri kërkoni!"
            };

        case 'weather_question':
            return {
                success: true,
                response: "Dëshironi të dini informacion për motin? 🌤️ Përdorni komandën /moti <qyteti> për të marrë informacion të detajuar të motit për çdo qytet!"
            };

        case 'location_question':
            return {
                success: true,
                response: "Po kërkoj informacion për lokacione... 🗺️ Mund të më tregoni se çfarë lokacioni specifik po kërkoni, ose të përdorni /google për kërkim të gjerë!"
            };

        case 'time_question':
            return {
                success: true,
                response: `⏰ Ora aktuale është: ${new Date().toLocaleTimeString('sq-AL')}. Çfarë informacioni specifik për kohën keni nevojë?`
            };

        case 'reason_question':
            return {
                success: true,
                response: "Po përpiqem të kuptoj arsyen e pyetjes suaj... 🤔 Mund të më jepni më shumë kontekst për t'ju dhënë një përgjigje më të saktë?"
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
        console.log('📝 Mesazhi për analizë:', message);
        
        // Analizo mesazhin me NLU Service
        const nluAnalysis = await nluService.analyzeText(message, user.id);
        
        console.log('📊 NLU Analysis Result:', JSON.stringify(nluAnalysis, null, 2));

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
    // ============================ ✅ GJENERIMI I PËRGJIGJEVE BAZË NË NLU =============================
    async generateNLUResponse(message, analysis, user) {
    const { intent, sentiment } = analysis;
    const lowerMessage = message.toLowerCase();

    console.log('🎯 Generating NLU Response for:', {
        message: message.substring(0, 50),
        intent: intent.type,
        sentiment: sentiment.sentiment
    });

    // ✅ PËRGJIGJE SPECIFIKE PËR PYETJE TË VEÇANTA
    switch (intent.type) {
        case 'age_question':
            return {
                success: true,
                response: "Unë jam një asistent virtual, krijuar për t'ju ndihmuar! 😊 Mosha ime nuk ka rëndësi, por përvoja ime po rritet çdo ditë me ndihmën tuaj!"
            };

        case 'book_request':
            return {
                success: true,
                response: "Dëshironi të gjeni një libër? 📚 Mund të përdorni komandën /libër <emri_i_librit> për të kërkuar libra, ose më tregoni më shumë se çfarë lloj libri kërkoni!"
            };

        case 'weather_question':
            return {
                success: true,
                response: "Dëshironi të dini informacion për motin? 🌤️ Përdorni komandën /moti <qyteti> për të marrë informacion të detajuar të motit për çdo qytet!"
            };

        case 'location_question':
            return {
                success: true,
                response: "Po kërkoj informacion për lokacione... 🗺️ Mund të më tregoni se çfarë lokacioni specifik po kërkoni, ose të përdorni /google për kërkim të gjerë!"
            };

        case 'time_question':
            return {
                success: true,
                response: `⏰ Ora aktuale është: ${new Date().toLocaleTimeString('sq-AL')}. Çfarë informacioni specifik për kohën keni nevojë?`
            };

        case 'reason_question':
            return {
                success: true,
                response: "Po përpiqem të kuptoj arsyen e pyetjes suaj... 🤔 Mund të më jepni më shumë kontekst për t'ju dhënë një përgjigje më të saktë?"
            };

            case 'question':
                return {
                    success: true,
                    response: this.getQuestionResponse(message, intent, entities)
                };

            case 'request':
                return {
                    success: true,
                    response: this.getRequestResponse(message, intent, entities)
                };

            case 'statement':
                return {
                    success: true,
                    response: this.getStatementResponse(message, sentiment, entities)
                };

            default:
                return {
                    success: true,
                    response: this.getIntelligentResponse(message, analysis)
                };
        }
    }

    // ============================ ✅ METODA PËR PËRGJIGJE SPECIFIKE =============================
    
    getGreetingResponse(sentiment, timeOfDay) {
        const greetings = {
            morning: ['Mirëmëngjes!', 'Mëngjes i mbarë!', 'Fillim të mbarë të ditës!'],
            afternoon: ['Mirëdita!', 'Dita e mbarë!', 'Përshëndetje!'],
            evening: ['Mirëmbrëma!', 'Mbrëmje e mbarë!', 'Përshëndetje!']
        };

        const timeGreetings = greetings[timeOfDay] || greetings.afternoon;
        const randomGreeting = timeGreetings[Math.floor(Math.random() * timeGreetings.length)];

        if (sentiment.sentiment === 'positive') {
            return `${randomGreeting} Jam i lumtur që ju shoh! Si mund t'ju ndihmoj sot?`;
        } else if (sentiment.sentiment === 'negative') {
            return `${randomGreeting} Duket se keni një ditë të vështirë. Si mund t'ju ndihmoj?`;
        }

        return `${randomGreeting} Si mund t'ju shërbej sot?`;
    }

    getQuestionResponse(message, intent, entities) {
        const questionType = intent.parameters.questionType;
        
        if (message.toLowerCase().includes('si je') || message.toLowerCase().includes('si jeni')) {
            return "Jam shumë mirë, faleminderit që pyetët! 😊 Jam këtu për t'ju ndihmuar. Çfarë mund të bëj për ju?";
        }

        if (message.toLowerCase().includes('sa është') || message.toLowerCase().includes('llogarit')) {
            return "Duket se keni nevojë për ndihmë me llogaritje! Mund të përdorni komandën /matematikë <problem> për zgjidhje të detajuara.";
        }

        if (entities.locations.length > 0) {
            return `Po kërkoj informacion për ${entities.locations.join(', ')}. Mund të përdorni /wiki për më shumë detaje.`;
        }

        return "Kjo është një pyetje interesante! Mund të më jepni më shumë detaje ose të përdorni një nga komandat e mia për ndihmë më specifike.";
    }

    getRequestResponse(message, intent, entities) {
        const requestType = intent.parameters.requestType;

        if (requestType === 'help') {
            return "Sigurisht, jam këtu për t'ju ndihmuar! Çfarë saktësisht keni nevojë të dini? Ose mund të përdorni /ndihmo për të parë të gjitha mundësitë.";
        }

        if (requestType === 'information') {
            return "Me kënaqësi! Çfarë lloj informacioni po kërkoni? Mund të përdorni /google për kërkim të gjerë në internet.";
        }

        return "Dëshironi të bëni diçka të veçantë? Mund të më tregoni më shumë ose të përdorni një komandë specifike nga menuja ime.";
    }

    getStatementResponse(message, sentiment, entities) {
        if (sentiment.sentiment === 'positive') {
            return "Kjo është e mrekullueshme! 😊 Faleminderit që e ndërtuat. A ka diçka tjetër me të cilën mund t'ju ndihmoj?";
        }

        if (sentiment.sentiment === 'negative') {
            return "Duket se keni një situatë të vështirë. 😔 Jam këtu për t'ju ndihmuar nëse dëshironi të flisni për të ose të kërkoni ndihmë.";
        }

        if (sentiment.irony) {
            return "Hehe, e kuptoj! 😄 Ironia shqiptare është unike. Si mund t'ju ndihmoj vërtet?";
        }

        return "E kuptoj. A dëshironi të vazhdoni bisedën ose të më kërkoni diçka specifike?";
    }

    getIntelligentResponse(message, analysis) {
        // Përgjigje inteligjente bazuar në analizën e plotë
        const { sentiment, entities, nuances } = analysis;

        if (nuances.figurativeLanguage.length > 0) {
            const figurative = nuances.figurativeLanguage[0];
            return `Ah, po përdorni një shprehje figurativë! "${figurative.expression}" nënkupton "${figurative.meaning}". Shumë elegante!`;
        }

        if (entities.persons.length > 0) {
            return `Po flisni për ${entities.persons.join(', ')}? Interesante! Çfarë dëshironi të dini për ta?`;
        }

        if (sentiment.sentiment === 'ironic') {
            return "Haha, e kap ironinë! 😄 Shqiptarët jemi të njohur për humorin tonë të thatë. Si mund t'ju ndihmoj seriozisht?";
        }

        return "E kam dëgjuar! A mund të më jepni më shumë kontekst ose të përdorni një komandë specifike për të marrë ndihmë më të detajuar?";
    }

    getDefaultResponse(message) {
        const defaultResponses = [
            "E kuptoj! Si mund t'ju ndihmoj më tej?",
            "Shumë mirë! A dëshironi të vazhdoni bisedën?",
            "E kam dëgjuar. Çfarë mund të bëj për ju?",
            "Faleminderit për mesazhin! Si mund t'ju shërbej?",
            "E shkëlqyeshme! A keni nevojë për ndihmë me diçka specifike?"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
        
        // Implementimi i Wikipedia API këtu
        const wikiResult = await this.fetchWikipedia(searchTerm);
        
        return {
            success: true,
            response: wikiResult
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
        
        // Implementimi i shërbimit të përkthimit
        const translation = await this.translateText(text, language);
        
        return {
            success: true,
            response: translation
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
        
        // Ruaj në knowledge base
        await this.saveToKnowledgeBase(question, answer);
        
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
        
        // Implementimi i weather API
        const weatherInfo = await this.fetchWeather(city);
        
        return {
            success: true,
            response: weatherInfo
        };
    }

    // ======================== ✅ KOMANDA /EKSPORTO - EKSPORT I HISTORISË =====================
    async exportCommand(user) {
        const exportData = await this.generateExport(user.id);
        
        return {
            success: true,
            response: `📥 Eksporti u gjenerua! ${exportData}`,
            exportData: exportData
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
        
        // Ruaj API Key në databazë
        await this.saveApiKey(user.id, apiKey);
        
        return {
            success: true,
            response: '✅ API Key u ruajt me sukses! Tani mund të përdorni Gemini AI.'
        };
    }

    // ================================== ✅ METODA NDIHMËSE ===================================
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

    async generateExport(userId) {
        // Implementimi i gjenerimit të eksportit
        return "Eksporti i të dhënave";
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
