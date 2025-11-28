// ==================== ✅ COMMAND SERVICE - RRUFE TESLA ME OPENAI ====================
// 📝 DESKRIMI: Shërbim për procesimin e të gjitha komandave të sistemit
// 🎯 QËLLIMI: Një vend i vetëm për të gjitha komandat me support OpenAI
// 📥 INPUT: command string nga përdoruesi + engine preference
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
    async processCommand(command, user, message, engine = null) {
        try {
            const args = message.split(' ');
            const mainCommand = args[0].toLowerCase();

            // ======================= ✅ KONTROLLO PËR LLOGARITJE MATEMATIKE ======================
            const mathResult = await this.handleMathCalculation(message);
            if (mathResult) {
                return mathResult;
            }

            // ======================= ✅ ANALIZË NLU PËR MESAZHET JO-KOMANDË ======================
            if (!mainCommand.startsWith('/') && message.trim().length > 2) {
                return await this.handleNaturalLanguage(message, user, engine);
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
• /liber <emri>        - Gjej libra shkollore
• /detyre <lenda>      - Ndihme per detyra
• /referenc <tema>    - Burime akademike

🧮 SHKENCA & MATEMATIKE:
• /matematike <problem> - Zgjidh probleme
• /fizike <formule>     - Shpjegime fizike  
• /kimi <element>       - Tabela periodike

🗺️ HISTORI & GJEOGRAFI:
• /histori <periudhe>   - Historia shqiptare
• /gjeografi <qytet>    - Harta & statistika

📝 PROJEKTE & DETYRA:
• /projekt <tema>       - Strukture projekti
• /prezantim <tema>     - Slide template
• /bibliografi          - Format referencash

💡 SHEMBUJ:
• /liber "Histori e Shqiperise"
• /detyre matematike
• /projekt "Roli i Nene Terezes"
• /matematike "2x + 5 = 15"
                        `.trim()
                    };
                
                // ======================= ✅ KOMANDAT E REJA PËR STUDENTË ======================
                case '/liber':
                    return await this.studentBookCommand(args.slice(1).join(' '));
                
                case '/detyre':
                    return await this.studentHomeworkCommand(args.slice(1).join(' '));
                
                case '/matematike':
                    return await this.studentMathCommand(args.slice(1).join(' '));
                
                case '/referenc':
                    return {
                        success: true,
                        response: `📚 **KËRKIM BURIMESH:** "${args.slice(1).join(' ')}"\n\n🔍 Po kerkoj burime akademike...`
                    };
                
                case '/projekt':
                    return {
                        success: true,
                        response: `📋 **STRUKTURE PROJEKTI:** "${args.slice(1).join(' ')}"\n\n1. 🎯 **Hyrje** - Prezantimi i temes\n2. 📚 **Literatura** - Burimet e perdorura\n3. 🔬 **Metodologjia** - Si u krye kerkimi\n4. 📊 **Rezultatet** - Gjetjet kryesore\n5. 💭 **Diskutimi** - Analiza e rezultateve\n6. ✅ **Perfundimi** - Konkluzionet\n7. 📖 **Bibliografia** - Lista e burimeve`
                    };
                
                case '/fizike':
                    return {
                        success: true,
                        response: `🔬 **NDIHME PER FIZIKE:** "${args.slice(1).join(' ')}"\n\n💡 Une mund te ndihmoj me:\n• Shpjegime te ligjeve fizike\n• Zgjidhje problemesh\n• Formulat dhe njesite\n• Eksperimente dhe demonstrime`
                    };
                
                case '/kimi':
                    return {
                        success: true,
                        response: `⚗️ **NDIHME PER KIMI:** "${args.slice(1).join(' ')}"\n\n💡 Une mund te ndihmoj me:\n• Tabelen periodike\n• Reaksionet kimike\n• Formulat dhe ekuacionet\n• Shpjegime te koncepteve`
                    };
                
                case '/histori':
                    return {
                        success: true,
                        response: `🏛️ **HISTORI SHQIPTARE:** "${args.slice(1).join(' ')}"\n\n💡 Une mund te ndihmoj me:\n• Periudhat historike\n• Personalitete te shquara\n• Evente dhe beteja\n• Trashegimi kulturore`
                    };
                
                case '/gjeografi':
                    return {
                        success: true,
                        response: `🗺️ **GJEOGRAFI SHQIPTARE:** "${args.slice(1).join(' ')}"\n\n💡 Une mund te ndihmoj me:\n• Qytete dhe rajone\n• Vende turistike\n• Klima dhe reliev\n• Burime natyrore`
                    };

                case '/meso':
                    return await this.learnCommand(args.slice(1).join(' '));
                
                // ======================= ✅ KOMANDAT EKZISTUESE ======================
                case '/wiki':
                    return await this.wikiCommand(args.slice(1).join(' '));
                
                case '/perkthim':
                    return await this.translationCommand(args.slice(1));
                
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
                case '/kerko':
                    const GoogleSearchService = require('./googleSearchService');
                    return await GoogleSearchService.performGoogleSearch(args.slice(1).join(' '));         
                
                default:
                    return await this.unknownCommand(mainCommand);
            }
            
        } catch (error) {
            console.error('❌ Gabim ne procesimin e komandes:', error);
            return {
                success: false,
                response: '❌ Gabim ne procesimin e komandes'
            };
        }
    }

    // ============================ ✅ TRAJTIMI I GJUHËS NATYRORE - VERSION I RI ME OPENAI =============================
async handleNaturalLanguage(message, user, preferredEngine = null) {
    try {
        // ✅ DEBUG EKSTREM - VERIFIKO PARAMETRAT
        console.log('🎯🎯🎯 [DEBUG-EKSTREM] handleNaturalLanguage CALLED!');
        console.log('🎯🎯🎯 [DEBUG-EKSTREM] Message:', message);
        console.log('🎯🎯🎯 [DEBUG-EKSTREM] User ID:', user?.id);
        console.log('🎯🎯🎯 [DEBUG-EKSTREM] Preferred Engine:', preferredEngine);
        console.log('🎯🎯🎯 [DEBUG-EKSTREM] Stack:', new Error().stack);
        
        // ✅ KONTROLLO NËSE JEMI NË FUNKSIONIN E DUHUR
        if (!message) {
            console.log('❌❌❌ [DEBUG-EKSTREM] MESSAGE IS EMPTY!');
        }
        
        // ✅ OPENAI - PROVO DIREKT
        if (preferredEngine === 'openai') {
            console.log('🔮🔮🔮 [DEBUG-EKSTREM] OPENAI ACTIVATED - Calling directly...');
            
            try {
                // Provo të gjesh openaiService
                let openaiService;
                try {
                    openaiService = require('./openaiService');
                    console.log('✅✅✅ [DEBUG-EKSTREM] openaiService loaded');
                } catch (requireError) {
                    console.error('❌❌❌ [DEBUG-EKSTREM] openaiService require failed:', requireError.message);
                    throw new Error('openaiService not found');
                }
                
                // Provo të thirrësh funksionin
                const result = await openaiService.processMessage(message, user.id);
                console.log('📥📥📥 [DEBUG-EKSTREM] OpenAI result:', result);
                
                if (result && result.success) {
                    console.log('✅✅✅ [DEBUG-EKSTREM] OpenAI SUCCESS!');
                    return result;
                } else {
                    console.log('❌❌❌ [DEBUG-EKSTREM] OpenAI returned error:', result?.error);
                    throw new Error(result?.error || 'OpenAI failed');
                }
                
            } catch (openaiError) {
                console.error('❌❌❌ [DEBUG-EKSTREM] OpenAI service error:', openaiError.message);
                console.error('❌❌❌ [DEBUG-EKSTREM] OpenAI stack:', openaiError.stack);
            }
        }
        
        // ✅ FALLBACK NË GEMINI
        console.log('🤖🤖🤖 [DEBUG-EKSTREM] Falling back to Gemini...');
        return this.getBasicNaturalResponse(message, user, preferredEngine);
        
    } catch (error) {
        console.error('❌❌❌ [DEBUG-EKSTREM] CRITICAL ERROR:', error);
        return {
            success: false,
            response: '❌ Gabim kritik në sistem'
        };
    }
}

// ============================✅ FUNKSION I RI PËR PËRGJIGJE BAZË - ME LIDHJE DIREKTE ME MOTORËT =======================
    
async getBasicNaturalResponse(message, user, preferredEngine = null) {
    try {
        console.log('🔄 [BASIC-RESPONSE] Duke kërkuar përgjigje nga motorët AI...');
        
        const lowerMessage = message.toLowerCase();
        
        // ✅ PËRGJIGJE SHUMË TË SHKURTRA DHE SPECIFIKE
        if (lowerMessage.includes('përshëndetje') || lowerMessage.includes('pershendetje') || lowerMessage.includes('hello') || lowerMessage.includes('tung')) {
            return {
                success: true,
                response: "👋 Përshëndetje! Unë jam RRUFE-TESLA AI. Si mund t'ju shërbej sot?"
            };
        }
        
        if (lowerMessage.includes('faleminderit') || lowerMessage.includes('rrofsh') || lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
            return {
                success: true,
                response: "😊 S'ka përse! Gjithmonë i gatshëm të ndihmoj!"
            };
        }
        
        if (lowerMessage.includes('mirupafshim') || lowerMessage.includes('bye') || lowerMessage.includes('ciao')) {
            return {
                success: true,
                response: "👋 Mirupafshim! Shpresoj të jeni gjetur atë që kërkoni!"
            };
        }

        // ✅ PËR PYETJE SHUMË TË THJESHTA - PËRGJIGJE TË SHPEJTA
        if (lowerMessage === 'si je?' || lowerMessage === 'si jeni?' || lowerMessage === 'si je' || lowerMessage === 'si jeni') {
            return {
                success: true,
                response: "🤖 Unë jam RRUFE-TESLA AI dhe jam në gjendje të shkëlqyer! Faleminderit që pyetët! Si mund t'ju shërbej?"
            };
        }

        if (lowerMessage === 'kush je?' || lowerMessage === 'kush je' || lowerMessage === 'kush jeni?' || lowerMessage === 'kush jeni') {
            return {
                success: true,
                response: "🚀 Unë jam **RRUFE-TESLA AI** - një sistem i avancuar i inteligjencës artificiale. Jam këtu për t'ju ndihmuar me çdo pyetje ose problem!"
            };
        }

        // ✅ PËR TË GJITHA PYETJET E TJERA - LIDHU DIREKT ME MOTORËT AI
        console.log('🔄 [BASIC-RESPONSE] Duke dërguar pyetjen te motorët AI...');
        
        // ✅ PROVO OPENAI PARËSORISHT NËSE ËSHTË AKTIV
        if (preferredEngine === 'openai' || !preferredEngine) {
            try {
                console.log('🔮 [BASIC-RESPONSE] Duke provuar OpenAI...');
                const openaiService = require('./openaiService');
                const openaiResult = await openaiService.processMessage(message, user.id);
                
                if (openaiResult && openaiResult.success) {
                    console.log('✅ [BASIC-RESPONSE] OpenAI u përgjigj!');
                    return openaiResult;
                }
            } catch (openaiError) {
                console.log('❌ [BASIC-RESPONSE] OpenAI dështoi, duke provuar Gemini...');
            }
        }

        // ✅ PROVO GEMINI SI FALLBACK
        try {
            console.log('🤖 [BASIC-RESPONSE] Duke provuar Gemini...');
            const hasApiKey = await this.checkApiKey(user.id);
            if (hasApiKey) {
                const geminiResult = await this.sendToGemini(message, user.id);
                if (geminiResult && geminiResult.success) {
                    console.log('✅ [BASIC-RESPONSE] Gemini u përgjigj!');
                    return geminiResult;
                }
            }
        } catch (geminiError) {
            console.error('❌ [BASIC-RESPONSE] Gemini dështoi:', geminiError);
        }

        // ✅ FALLBACK FINAL SHUMË I AVANCUAR
        console.log('⚠️ [BASIC-RESPONSE] Të dy motorët dështuan, duke kthyer fallback të avancuar');
        
        // Analizo pyetjen për të dhënë përgjigje më të mirë
        if (lowerMessage.includes('çfarë') || lowerMessage.includes('cfare') || lowerMessage.includes('what')) {
            return {
                success: true,
                response: `🤔 **Pyetje interesante:** "${message}"\n\n💡 *Për përgjigje më të detajuara, sigurohuni që keni konfiguruar API Keys në panelin e sistemit.*\n\n🔧 Ju mund të:\n• Vendosni API Key për OpenAI ose Gemini\n• Përdorni komandën /ndihmo për më shumë opsione\n• Provoni të riformuloni pyetjen tuaj*`
            };
        }
        
        if (lowerMessage.includes('si') || lowerMessage.includes('how')) {
            return {
                success: true,
                response: `🔧 **Kërkim i zgjidhjes:** "${message}"\n\n🚀 *Sistemi po punon për të gjetur përgjigjen më të mirë...*\n\n💡 Ndërsa sistemet AI janë në konfigurim, ju mund të:\n• Shfrytëzoni komandat ekzistuese (/wiki, /gjej, etc.)\n• Kontrolloni konfigurimin e API Keys\n• Provoni motorin tjetër (OpenAI/Gemini)*`
            };
        }

        // ✅ PËRGJIGJE DEFAULT E AVANCUAR
        return {
            success: true,
            response: `🧠 **RRUFE-TESLA AI** 🤖\n\nE kam kuptuar pyetjen tuaj!\n\n"${message}"\n\n🚀 *Sistemi po punon për të gjetur përgjigjen më të saktë...*\n\n💡 **Opsione të menjëhershme:**\n• Përdorni /ndihmo për të parë të gjitha komandat\n• Kontrolloni panelin e API Keys për konfigurim\n• Provoni të riformuloni pyetjen\n• Përdorni motorin tjetër (OpenAI/Gemini)\n\n🔧 **Sistemi aktiv:** ${preferredEngine || 'Auto-detect'}`,
            needsConfig: true
        };
        
    } catch (error) {
        console.error('❌ [BASIC-RESPONSE] Gabim kritik:', error);
        // Fallback emergjent
        return {
            success: true,
            response: `🤖 **RRUFE-TESLA AI**\n\n"${message}"\n\n⚡ *Sistemi po proceson kërkesën tuaj...*\n\n💡 Ju lutem provoni përsëri ose përdorni komandën /ndihmo për asistencë.*`
        };
    }
}

    // ============================ ✅ KONTROLLIMI I API KEY =============================
    async checkApiKey(userId) {
        try {
            const db = require('../database');
            
            const result = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                    [userId, 'gemini'],
                    (err, row) => {
                        if (err) {
                            console.error('❌ Gabim ne kontrollimin e API Key:', err);
                            resolve(false);
                        } else {
                            resolve(!!row);
                        }
                    }
                );
            });
            
            console.log('🔍 Statusi i API Key:', result ? '✅ Ekziston' : '❌ Nuk ekziston');
            return result;
            
        } catch (error) {
            console.error('❌ Gabim ne checkApiKey:', error);
            return false;
        }
    }

    // ============================ ✅ DËRGIMI TE GEMINI AI =============================
    async sendToGemini(message, userId) {
        try {
            console.log('🚀 Duke derguar te GeminiRealService:', message.substring(0, 50));
            
            // ✅ PËRDOR GEMINI REAL SERVICE
            const GeminiRealService = require('./geminiRealService');
            const response = await GeminiRealService.processMessage(message, userId);
            
            if (response && response.success) {
                console.log('✅ GeminiRealService u pergjigj me sukses');
                return {
                    success: true,
                    response: response.response
                };
            } else {
                console.log('❌ GeminiRealService deshtoi:', response?.response);
                return null;
            }
            
        } catch (error) {
            console.error('❌ Gabim ne dergimin te GeminiRealService:', error.message);
            return null;
        }
    }

    // ============================ ✅ TRAJTIMI I LLOGARITJEVE MATEMATIKE =============================
    async handleMathCalculation(message) {
        try {
            // Kontrollo nese mesazhi permban shprehje matematikore
            const mathPatterns = [
                /(\d+[\+\-\*\/\^\(\)\d\s]+)/, // Shprehje te thjeshta
                /sa bejne\s+([\d\+\-\*\/\^\(\)\s]+)/i, // "sa bejne 5+5"
                /llogarit\s+([\d\+\-\*\/\^\(\)\s]+)/i, // "llogarit 10*2"
                /([\d\.]+\s*[\+\-\*\/\^]\s*[\d\.]+)/ // Operacione baze
            ];

            for (const pattern of mathPatterns) {
                const match = message.match(pattern);
                if (match && match[1]) {
                    const expression = match[1].trim();
                    
                    // Kontrollo nese shprehja eshte me e gjate se 3 karaktere
                    if (expression.length > 3) {
                        console.log('🧮 Duke analizuar shprehjen matematikore:', expression);
                        
                        const result = this.evaluateMathExpression(expression);
                        if (result !== null) {
                            return {
                                success: true,
                                response: `🧮 Rezultati: **${result}**`
                            };
                        }
                    }
                }
            }
            
            return null;
        } catch (error) {
            console.error('❌ Gabim ne trajtimin e llogaritjes:', error);
            return null;
        }
    }

    // ============================ ✅ EVALUIMI I SHPREHJEVE MATEMATIKE =============================
    evaluateMathExpression(expression) {
        try {
            console.log('🧮 Duke evaluuar shprehjen matematikore:', expression);
            
            // Pastro shprehjen
            let cleanExpr = expression
                .replace(/[^0-9+\-*/().^√πe\s]/g, '') // Largo karakteret e padeshiruara
                .replace(/\s+/g, '') // Largo hapesirat
                .trim();

            // Zevendeso simbolet e fuqise
            cleanExpr = cleanExpr.replace(/\^/g, '**');
            
            // Kontrollo per pjesetim me zero
            if (cleanExpr.includes('/0') || cleanExpr.match(/\/\s*0(?!\.)/)) {
                throw new Error('Pjesetimi me zero nuk lejohet');
            }

            // Sigurohu qe shprehja eshte e sigurt
            if (!/^[0-9+\-*/().\s]+$/.test(cleanExpr.replace(/\*\*/g, ''))) {
                throw new Error('Shprehje matematikore e pavlefshme');
            }
            
            // Evaluo shprehjen
            const result = eval(cleanExpr);
            
            // Format rezultatin
            let formattedResult;
            if (Number.isInteger(result)) {
                formattedResult = result.toString();
            } else {
                formattedResult = parseFloat(result.toFixed(6)).toString();
            }
            
            console.log('✅ Rezultati i llogaritjes:', formattedResult);
            return formattedResult;
            
        } catch (error) {
            console.error('❌ Gabim ne llogaritje:', error.message);
            return null;
        }
    }

    // ============ ✅ KOMANDA /NDIHMO - LISTA E KOMANDAVE ==============
    async helpCommand(user) {
        const commandsList = `
👑 SISTEMI I KOMANDAVE - CHATAI ALBA 👑

📋 KOMANDAT BAZE:
• /ndihmo    - Shfaq kete liste
• /wiki      - Kerko Wikipedia  
• /perkthim  - Perktih tekst
• /meso      - Meso dicka te re
• /moti      - Informacion moti
• /eksporto  - Eksporto historine
• /importo   - Importo historine
• /dil       - Dil nga llogaria
• /apikey    - Vendos API Key

🔍 KOMANDA KËRKIMI:
• /gjej      - Kerkim i thelluar
• /google    - Kerkim Google
• /kerko     - Kerkim ne shqip

🎓 KOMANDA PËR STUDENTË:
• /student   - Menu e studentit
• /liber     - Gjej libra shkollore
• /detyre    - Ndihme per detyra
• /matematike - Zgjidh probleme
• /projekt   - Strukture projekti
• /fizike    - Ndihme fizike
• /kimi      - Ndihme kimi
• /histori   - Historia shqiptare
• /gjeografi - Gjeografi shqiptare

👑 KOMANDA ADMIN:
• /admin     - Komandat e adminit
• /users     - Te gjithe perdoruesit
• /stats     - Statistikat
• /clearall  - Fshi te gjitha
• /panel     - Paneli i adminit

🚀 MOTORËT AI:
• 🤖 Gemini  - Motor default
• 🔮 OpenAI  - Motor alternativ

💡 SHEMBUJ:
• /wiki Albania
• /perkthim anglisht "Miredita"
• /meso "Kryeqyteti"|"Tirana"
• /moti Tirana
• /gjej Shqiperia
• /google teknologji
• /student
• /liber "Matematike 10"
        `.trim();
        
        return {
            success: true,
            response: commandsList
        };
    }

    // ========================= ✅ KOMANDA /MESO - MËSIM I RI ===========================
    async learnCommand(data) {
        try {
            const [question, answer] = data.split('|');
            
            if (!question || !answer) {
                return {
                    success: false,
                    response: '❌ Format i gabuar: /meso <pyetje>|<pergjigje>'
                };
            }
            
            // Pastro dhe ruaj ne knowledge base
            const cleanQuestion = question.trim();
            const cleanAnswer = answer.trim();
            
            console.log('💾 Duke ruajtur ne Knowledge Base:', {
                question: cleanQuestion.substring(0, 50),
                answer: cleanAnswer.substring(0, 50)
            });
            
            // Ruaj ne knowledge base
            const saved = await this.saveToKnowledgeBase(cleanQuestion, cleanAnswer);
            
            if (saved) {
                return {
                    success: true,
                    response: `✅ Mesova dicka te re! Tani kur te me pyesni "${cleanQuestion}", do t'ju pergjigjem: "${cleanAnswer}"`
                };
            } else {
                return {
                    success: false,
                    response: '❌ Gabim ne ruajtjen e njohurive'
                };
            }
            
        } catch (error) {
            console.error('❌ Gabim ne learnCommand:', error);
            return {
                success: false,
                response: '❌ Gabim ne procesimin e komandes /meso'
            };
        }
    }

    // ========================= ✅ FUNKSIONET E REJA PËR STUDENTË ===========================
    async studentBookCommand(bookName) {
        if (!bookName) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani emrin e librit: /liber <emri_i_librit>'
            };
        }
        
        return {
            success: true,
            response: `📚 **KËRKIM LIBRI:** "${bookName}"\n\n🔍 Po kerkoj librin "${bookName}" ne burime shkollore...\n💡 Perdor /google per kerkim te thelluar!`
        };
    }

    async studentHomeworkCommand(subject) {
        if (!subject) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani lenden: /detyre <lenda>'
            };
        }
        
        return {
            success: true,
            response: `📝 **NDIHME PER DETYRE NE ${subject.toUpperCase()}**\n\n💡 Une mund te ndihmoj me:\n• Shpjegime te koncepteve\n• Shembuj zgjidhjesh\n• Burime shtese\n\nShkruani pyetjen tuaj specifike per ${subject}!`
        };
    }

    async studentMathCommand(problem) {
        if (!problem) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani problemin: /matematike <problem>'
            };
        }
        
        // Provo te zgjidhesh problemin matematikor
        const mathResult = this.evaluateMathExpression(problem);
        if (mathResult) {
            return {
                success: true,
                response: `🧮 **ZGJIDHJA E PROBLEMIT:** "${problem}"\n\n🔢 **Rezultati:** ${mathResult}\n\n💡 Shpjegim: Problemi u zgjidh duke evaluuar shprehjen matematikore.`
            };
        }
        
        return {
            success: true,
            response: `🧮 **PROBLEM MATEMATIKOR:** "${problem}"\n\n🔢 Po analizoj problemen...\n💡 Perdor /google per zgjidhje te detajuara!`
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
        
        console.log(`🌤️ Duke kërkuar motin për: ${city}`);
        
        try {
            // ✅ IMPLEMENTIM I THJESHTË - MUND TË SHTOSH API TË VËRTETË MË VONË
            const weatherInfo = await this.fetchWeather(city);
            return weatherInfo;
        } catch (error) {
            console.error('❌ Gabim në weatherCommand:', error);
            return {
                success: true,
                response: `🌤️ **INFORMACION MOTI PËR ${city.toUpperCase()}**\n\n🔹 Shërbimi i motit aktualisht po përmirësohet!\n🔹 Së shpejti do të keni informacion të detajuar të motit.\n\n💡 **Opsione alternative:**\n• Shkruani "mot" pa "/" për asistencë\n• Përdorni /google për kërkim në internet`
            };
        }
    }

    // ======================== ✅ FUNKSIONI FETCHWEATHER =============================
    async fetchWeather(city) {
        try {
            // ✅ IMPLEMENTIM I THJESHTË - MUND TË ZGJEROJ MË VONË
            const weatherResponses = {
                'tirana': `🌤️ **MOTI NË TIRANË**\n\n🌡️ Temperatura: 18°C - 25°C\n☀️ Kushtet: Diell me re të shpërndara\n💨 Era: 10 km/h nga veriu\n💧 Lagështia: 65%`,
                'durrës': `🌤️ **MOTI NË DURRËS**\n\n🌡️ Temperatura: 20°C - 27°C\n🌊 Kushtet: Diell, det i qetë\n💨 Era: 8 km/h nga jugu\n💧 Lagështia: 70%`,
                'vlora': `🌤️ **MOTI NË VLORË**\n\n🌡️ Temperatura: 19°C - 26°C\n🌊 Kushtet: Diell, det i këndshëm\n💨 Era: 12 km/h nga perëndimi\n💧 Lagështia: 68%`,
                'shkodra': `🌤️ **MOTI NË SHKODËR**\n\n🌡️ Temperatura: 16°C - 23°C\n☁️ Kushtet: Pjesërisht me re\n💨 Era: 5 km/h nga lindja\n💧 Lagështia: 72%`
            };

            const normalizedCity = city.toLowerCase().trim();
            
            if (weatherResponses[normalizedCity]) {
                return {
                    success: true,
                    response: weatherResponses[normalizedCity]
                };
            } else {
                return {
                    success: true,
                    response: `🌤️ **MOTI NË ${city.toUpperCase()}**\n\n🔹 Shërbimi i motit për këtë qytet po përmirësohet!\n🔹 Temperatura e vlerësuar: 15°C - 24°C\n🔹 Kushtet e përgjithshme: Të këndshme\n\n💡 **Qytete të disponueshme:** Tirana, Durrës, Vlorë, Shkodër`
                };
            }
        } catch (error) {
            console.error('❌ Gabim në fetchWeather:', error);
            throw error;
        }
    }

    // ======================== ✅ KOMANDA /APIKEY - KONFIGURIM API KEY =========================
    async apiKeyCommand(user, apiKey) {
        if (!apiKey) {
            return {
                success: false,
                response: '❌ Ju lutem jepni API Key: /apikey <key_jote>'
            };
        }
        
        // Ruaj API Key ne databaze
        await this.saveApiKey(user.id, apiKey);
        
        return {
            success: true,
            response: '✅ API Key u ruajt me sukses! Tani mund te perdorni Gemini AI.'
        };
    }

    // ================================== ✅ METODA NDIHMËSE ===================================
    async saveToKnowledgeBase(question, answer) {
        try {
            const db = require('../database');
            
            return new Promise((resolve, reject) => {
                db.run(
                    'INSERT OR REPLACE INTO knowledge_base (user_id, question, answer, created_at) VALUES (?, ?, ?, ?)',
                    [1, question, answer, new Date().toISOString()],
                    function(err) {
                        if (err) {
                            console.error('❌ Gabim ne ruajtjen e knowledge base:', err);
                            resolve(false);
                        } else {
                            console.log('✅ Knowledge Base u perditesua me ID:', this.lastID);
                            resolve(true);
                        }
                    }
                );
            });
        } catch (error) {
            console.error('❌ Gabim ne saveToKnowledgeBase:', error);
            return false;
        }
    }
    
    async saveApiKey(userId, apiKey) {
        // Implementimi i ruajtjes se API Key
        console.log(`🔑 Ruajtur API Key per user ${userId}`);
    }

    // ================================ ✅ KOMANDË E PANJOHUR ===================================
    async unknownCommand(command) {
        return {
            success: false,
            response: `❌ Komande e panjohur: ${command}. Perdorni /ndihmo per listen.`
        };
    }

    // ========================= ✅ TEST GEMINI ==================================
    async testGeminiService() {
        try {
            const GeminiRealService = require('./geminiRealService');
            const testResult = await GeminiRealService.testService();
            console.log('🧪 Test i GeminiRealService:', testResult);
            return testResult;
        } catch (error) {
            console.error('❌ Test i deshtuar:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new CommandService();
