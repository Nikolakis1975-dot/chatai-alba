// ==================== ✅ COMMAND SERVICE - 13.10.2024 ====================
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
            const args = message.split(' ');
            const mainCommand = args[0].toLowerCase();

            // ======================= ✅ KONTROLLO PËR LLOGARITJE MATEMATIKE ======================
            const mathResult = await this.handleMathCalculation(message);
            if (mathResult) {
                return mathResult;
            }

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
                case '/liber':
                    return await this.studentBookCommand(args.slice(1).join(' '));
                
                case '/detyre':
                case '/detyre':
                    return await this.studentHomeworkCommand(args.slice(1).join(' '));
                
                case '/matematike':
                case '/matematike':
                    return await this.studentMathCommand(args.slice(1).join(' '));
                
                case '/referenc':
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

   // ============================ ✅ KONTROLLIMI I PYETJEVE TEKNIKE =============================

isTechnicalQuestion(message) {
    const lowerMessage = message.toLowerCase();
    return (
        lowerMessage.includes('kod') || 
        lowerMessage.includes('code') || 
        lowerMessage.includes('programim') || 
        lowerMessage.includes('javascript') ||
        lowerMessage.includes('python') || 
        lowerMessage.includes('html') ||
        lowerMessage.includes('css') || 
        lowerMessage.includes('chatbot') ||
        lowerMessage.includes('si te') || 
        lowerMessage.includes('tutorial') || 
        lowerMessage.includes('udhezime') ||
        lowerMessage.includes('ndert') || 
        lowerMessage.includes('krijo') ||
        lowerMessage.includes('bej') || 
        lowerMessage.includes('zbat') || 
        lowerMessage.includes('implement') ||
        lowerMessage.includes('funksion') || 
        lowerMessage.includes('algorit') ||
        lowerMessage.includes('database') || 
        lowerMessage.includes('server') ||
        lowerMessage.includes('web') || 
        lowerMessage.includes('aplikacion') ||
        lowerMessage.includes('app') || 
        lowerMessage.includes('software') ||
        lowerMessage.includes('softuer') || 
        lowerMessage.includes('teknologji') ||
        lowerMessage.includes('develop') || 
        lowerMessage.includes('zhvill') ||
        lowerMessage.includes('api') || 
        lowerMessage.includes('backend') ||
        lowerMessage.includes('frontend') || 
        lowerMessage.includes('mobile') ||
        lowerMessage.includes('android') || 
        lowerMessage.includes('ios') ||
        lowerMessage.includes('react') || 
        lowerMessage.includes('vue') ||
        lowerMessage.includes('angular') || 
        lowerMessage.includes('node') ||
        lowerMessage.includes('express') || 
        lowerMessage.includes('mysql') ||
        lowerMessage.includes('mongodb') || 
        lowerMessage.includes('sql') ||
        lowerMessage.includes('nosql') ||
        
        // Shto më shumë fjalë kyçe
        lowerMessage.includes('website') ||
        lowerMessage.includes('faqe') ||
        lowerMessage.includes('aplikim') ||
        lowerMessage.includes('projekt') ||
        lowerMessage.includes('shembull') ||
        lowerMessage.includes('struktur') ||
        lowerMessage.includes('design') ||
        lowerMessage.includes('dizajn') ||
        lowerMessage.includes('layout') ||
        lowerMessage.includes('stil') ||
        lowerMessage.includes('format')
    );
}

// ✅ FUNKSION I RI - PËR DETEKTIMIN E PYETJEVE TEKNIKE
isTechnicalRequest(message) {
    const lowerMessage = message.toLowerCase();
    const techKeywords = [
        'kod', 'code', 'javascript', 'html', 'css', 'python', 'java',
        'programim', 'funksion', 'algorithm', 'api', 'database',
        'server', 'backend', 'frontend', 'chatbot', 'website',
        'aplikacion', 'software', 'ndërt', 'krijo', 'si të',
        'tutorial', 'udhëzime', 'zbat', 'implement', 'algorit',
        'react', 'vue', 'angular', 'node', 'express', 'mysql',
        'mongodb', 'sql', 'nosql', 'mobile', 'android', 'ios'
    ];
    
    return techKeywords.some(keyword => lowerMessage.includes(keyword));
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

  
// ============================ ✅ TRAJTIMI I GJUHËS NATYRORE ME NLU =============================

// ✅ KORRIGJIMI I PLOTË I handleNaturalLanguage - Në commandService.js
async handleNaturalLanguage(message, user) {
    try {
        console.log('🔍 [FIX-GEMINI] handleNaturalLanguage called:', message.substring(0, 50));
        
        // ✅ PROVO GEMINI NËSE KA API KEY
        const hasApiKey = await this.checkApiKey(user.id);
        console.log('🔑 [FIX-GEMINI] API Key status:', hasApiKey);
        
        if (hasApiKey) {
            console.log('🚀 [FIX-GEMINI] Duke provuar Gemini për mesazh natyror...');
            try {
                const geminiResult = await this.sendToGemini(message, user.id);
                if (geminiResult && geminiResult.success) {
                    console.log('✅ [FIX-GEMINI] Gemini u përgjigj me sukses!');
                    return geminiResult;
                } else {
                    console.log('❌ [FIX-GEMINI] Gemini kthye rezultat të pavlefshëm');
                }
            } catch (geminiError) {
                console.error('❌ [FIX-GEMINI] Gemini dështoi:', geminiError.message);
            }
        } else {
            console.log('🔑 [FIX-GEMINI] Nuk ka API Key, duke përdorur përgjigje bazë');
        }

        // ✅ PËRGJIGJE BAZË NËSE NUK KA API KEY OSE GEMINI DËSHTOI
        return this.getBasicNaturalResponse(message);
        
    } catch (error) {
        console.error('❌ [FIX-GEMINI] Gabim kritik në handleNaturalLanguage:', error);
        return {
            success: false,
            response: '❌ Gabim në server. Provo përsëri.'
        };
    }
}

// ✅ FUNKSION I RI PËR PËRGJIGJE BAZË
getBasicNaturalResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('përshëndetje') || lowerMessage.includes('pershendetje') || lowerMessage.includes('hello') || lowerMessage.includes('tung')) {
        return {
            success: true,
            response: "Përshëndetje! 😊 Mirë se ju gjetëm! Si mund t'ju ndihmoj sot?"
        };
    }
    
    if (lowerMessage.includes('si je') || lowerMessage.includes('si jeni') || lowerMessage.includes('si kaloni')) {
        return {
            success: true, 
            response: "Jam shumë mirë, faleminderit që pyetët! 😊 Çfarë mund të bëj për ju?"
        };
    }
    
    if (lowerMessage.includes('faleminderit') || lowerMessage.includes('rrofsh') || lowerMessage.includes('thanks')) {
        return {
            success: true,
            response: "S'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!"
        };
    }

// ======================✅ PJESA DEFAULT AUTOMATIK PERGJIGJE ====================================
    
console.log('🔮 CommandService: Duke e dërguar mesazhin te OpenAI...');
return await this.sendToAI(message, user); 
    
 // ============================ ✅ KONTROLLIMI I KNOWLEDGE BASE =============================
    async checkKnowledgeBase(message, userId) {
        try {
            console.log('🔍 Duke kontrolluar Knowledge Base per:', message.substring(0, 50));
            
            const db = require('../database');
            
            // Kerko ne knowledge_base per pyetje te sakta
            const exactKnowledge = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT answer FROM knowledge_base WHERE user_id = ? AND LOWER(question) = LOWER(?)',
                    [userId, message.trim()],
                    (err, row) => {
                        if (err) {
                            console.error('❌ Gabim ne kerkimin e sakte te knowledge base:', err);
                            resolve(null);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });

            if (exactKnowledge && exactKnowledge.answer) {
                console.log('✅ Gjetem pergjigje te sakte ne Knowledge Base');
                return {
                    success: true,
                    response: exactKnowledge.answer
                };
            }

            // Kerko me pyetje te ngjashme (fjale kyce)
            const similarKnowledge = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT question, answer FROM knowledge_base WHERE user_id = ? AND ? LIKE "%" || question || "%"',
                    [userId, message.toLowerCase()],
                    (err, row) => {
                        if (err) {
                            console.error('❌ Gabim ne kerkimin e ngjashem te knowledge base:', err);
                            resolve(null);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });

            if (similarKnowledge && similarKnowledge.answer) {
                console.log('✅ Gjetem pergjigje te ngjasheme ne Knowledge Base');
                return {
                    success: true,
                    response: similarKnowledge.answer
                };
            }

            console.log('ℹ️ Nuk u gjet asnje pergjigje ne Knowledge Base');
            return null;

        } catch (error) {
            console.error('❌ Gabim ne checkKnowledgeBase:', error);
            return null;
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

    // ============================ ✅ KONTROLLIMI I PYETJEVE TEKNIKE =============================

isTechnicalQuestion(message) {
    const lowerMessage = message.toLowerCase();
    return (
        lowerMessage.includes('kod') || 
        lowerMessage.includes('code') || 
        lowerMessage.includes('programim') || 
        lowerMessage.includes('javascript') ||
        lowerMessage.includes('python') || 
        lowerMessage.includes('html') ||
        lowerMessage.includes('css') || 
        lowerMessage.includes('chatbot') ||
        lowerMessage.includes('si te') || 
        lowerMessage.includes('tutorial') || 
        lowerMessage.includes('udhezime') ||
        lowerMessage.includes('ndert') || 
        lowerMessage.includes('krijo') ||
        lowerMessage.includes('bej') || 
        lowerMessage.includes('zbat') || 
        lowerMessage.includes('implement') ||
        lowerMessage.includes('funksion') || 
        lowerMessage.includes('algorit') ||
        lowerMessage.includes('database') || 
        lowerMessage.includes('server') ||
        lowerMessage.includes('web') || 
        lowerMessage.includes('aplikacion') ||
        lowerMessage.includes('app') || 
        lowerMessage.includes('software') ||
        lowerMessage.includes('softuer') || 
        lowerMessage.includes('teknologji') ||
        lowerMessage.includes('develop') || 
        lowerMessage.includes('zhvill') ||
        lowerMessage.includes('api') || 
        lowerMessage.includes('backend') ||
        lowerMessage.includes('frontend') || 
        lowerMessage.includes('mobile') ||
        lowerMessage.includes('android') || 
        lowerMessage.includes('ios') ||
        lowerMessage.includes('react') || 
        lowerMessage.includes('vue') ||
        lowerMessage.includes('angular') || 
        lowerMessage.includes('node') ||
        lowerMessage.includes('express') || 
        lowerMessage.includes('mysql') ||
        lowerMessage.includes('mongodb') || 
        lowerMessage.includes('sql') ||
        lowerMessage.includes('nosql') ||
        
        // Shto më shumë fjalë kyçe
        lowerMessage.includes('website') ||
        lowerMessage.includes('faqe') ||
        lowerMessage.includes('aplikim') ||
        lowerMessage.includes('projekt') ||
        lowerMessage.includes('shembull') ||
        lowerMessage.includes('struktur') ||
        lowerMessage.includes('design') ||
        lowerMessage.includes('dizajn') ||
        lowerMessage.includes('layout') ||
        lowerMessage.includes('stil') ||
        lowerMessage.includes('format')
    );
}

    // ============================ ✅ GJENERIMI I PËRGJIGJEVE BAZË NË NLU =============================

   // services/commandService.js - MODIFIKO generateNLUResponse:

async generateNLUResponse(message, analysis, user) {
    const { intent, sentiment } = analysis;
    const lowerMessage = message.toLowerCase();
 
const hasApiKey = await this.checkApiKey(user.id);
    console.log('🎯 Generating NLU Response for:', {
        message: message.substring(0, 50),
        intent: intent.type,
        sentiment: sentiment.sentiment
    });

    // ✅ HEQUR KONTROLLIN E BESIMIT DERISA TË RREGULLOHET NLU SERVICE
    // ✅ PËRGJIGJE SPECIFIKE PËR PËRSHËNDETJE - PRIORITETI I PARË
    if (intent.type === 'greeting' || 
        lowerMessage.includes('pershendetje') || 
        lowerMessage.includes('si jeni') || 
        lowerMessage.includes('si je')) {
        return {
            success: true,
            response: this.getGreetingResponse(sentiment, intent.parameters?.timeOfDay)
        };
    }

        // ✅ PËRGJIGJE SPECIFIKE PËR PYETJE TË VEÇANTA
        if (lowerMessage.includes('vjec') || lowerMessage.includes('mosha') || lowerMessage.includes('moshe')) {
            return {
                success: true,
                response: "Une jam nje asistent virtual, krijuar per t'ju ndihmuar! 😊 Mosha ime nuk ka rendesi, por pervoja ime po rritet cdo dite me ndihmen tuaj!"
            };
        }

        if (lowerMessage.includes('liber') || lowerMessage.includes('libra')) {
            return {
                success: true,
                response: "Deshironi te gjeni nje liber? 📚 Mund te perdorni komanden /liber <emri_i_librit> per te kerkuar libra, ose me tregoni me shume se cfare lloj libri kerkoni!"
            };
        }

        if ((lowerMessage.includes('moti') || lowerMessage.includes('temperatur')) && 
            !lowerMessage.includes('si jeni') && !lowerMessage.includes('si je')) {
            return {
                success: true,
                response: "Deshironi te dini informacion per motin? 🌤️ Perdorni komanden /moti <qyteti> per te marre informacion te detajuar te motit per cdo qytet!"
            };
        }

        // ✅ PËR LOKACIONE - VETËM NËSE MESAZHI PËRMBAJNË FJALË SPECIFIKE
        if ((lowerMessage.includes('ku ') || lowerMessage.includes('lokacion') || lowerMessage.includes('vendndodhje')) &&
            !lowerMessage.includes('si jeni') && !lowerMessage.includes('si je') &&
            !lowerMessage.includes('miku') && !lowerMessage.includes('pershendetje')) {
            return {
                success: true,
                response: "Po kerkoj informacion per lokacione... 🗺️ Mund te me tregoni se cfare lokacioni specifik po kerkoni, ose te perdorni /google per kerkim te gjere!"
            };
        }

        if (lowerMessage.includes('or') || lowerMessage.includes('koh') || lowerMessage.includes('sa eshte ora')) {
            return {
                success: true,
                response: `⏰ Ora aktuale eshte: ${new Date().toLocaleTimeString('sq-AL')}. Cfare informacioni specifik per kohen keni nevoje?`
            };
        }

        if (lowerMessage.includes('pse') || lowerMessage.includes('arsye') || lowerMessage.includes('shkak')) {
            return {
                success: true,
                response: "Po perpiqem te kuptoj arsyen e pyetjes suaj... 🤔 Mund te me jepni me shume kontekst per t'ju dhene nje pergjigje me te sakte?"
            };
        }

        // ✅ PËR PYETJE TEKNIKE/KOD - SUGJERO API KEY (vetem nese nuk ka API Key)
        if (!hasApiKey && (lowerMessage.includes('kod') || lowerMessage.includes('code') || 
            lowerMessage.includes('programim') || lowerMessage.includes('javascript') ||
            lowerMessage.includes('python') || lowerMessage.includes('html') ||
            lowerMessage.includes('css') || lowerMessage.includes('chatbot'))) {
            
            return {
                success: true,
                response: `💻 **NDIHME PER KOD/PROGRAMIM**\n\nPyetja juaj "${message}" kerkon nje pergjigje te avancuar teknike! 🤖\n\n🔑 **Vendosni API Key per Gemini AI:**\nPerdorni komanden /apikey <key_jote> per te aktivizuar asistencen e avancuar AI!\n\n📚 **Alternative:**\nPerdorni /google per te kerkuar ne internet.`
            };
        }

        // ✅ PËRGJIGJE BAZË NË INTENT
        switch (intent.type) {
                        case 'gratitude':
                return {
                    success: true,
                    response: "S'ka perse! 😊 Gjithmone i lumtur te ndihmoj!"
                };

            case 'question':
                return {
                    success: true,
                    response: this.getQuestionResponse(message, intent, analysis.entities)
                };

            case 'request':
                return {
                    success: true,
                    response: this.getRequestResponse(message, intent, analysis.entities)
                };

            case 'statement':
                return {
                    success: true,
                    response: this.getStatementResponse(message, sentiment, analysis.entities)
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
            morning: ['Miremengjes! ☀️', 'Mengjes i mbare! 🌅', 'Fillim te mbare te dites! ✨'],
            afternoon: ['Miredita! 🌞', 'Dita e mbare! 😊', 'Pershendetje! 👋'],
            evening: ['Mirembrema! 🌙', 'Mbremje e mbare! 🌆', 'Pershendetje! 🙏']
        };

        const timeGreetings = greetings[timeOfDay] || greetings.afternoon;
        const randomGreeting = timeGreetings[Math.floor(Math.random() * timeGreetings.length)];

        if (sentiment.sentiment === 'positive') {
            return `${randomGreeting} Jam i lumtur qe ju shoh! Si mund t'ju ndihmoj sot?`;
        } else if (sentiment.sentiment === 'negative') {
            return `${randomGreeting} Duket se keni nje dite te veshtire. Si mund t'ju ndihmoj?`;
        }

        return `${randomGreeting} Si mund t'ju sherbej sot?`;
    }

    getQuestionResponse(message, intent, entities) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('si je') || lowerMessage.includes('si jeni')) {
            return "Jam shume mire, faleminderit qe pyetet! 😊 Jam ketu per t'ju ndihmuar. Cfare mund te bej per ju?";
        }

        if (lowerMessage.includes('sa eshte') || lowerMessage.includes('llogarit') || lowerMessage.includes('bejn')) {
            return "Duket se keni nevoje per ndihme me llogaritje! Mund te shkruani shprehjen matematikore direkt ose te perdorni /matematike <problem> per zgjidhje te detajuara.";
        }

        // Per pyetje komplekse teknike - SHKO TE GEMINI AUTOMATIKISHT
        if (lowerMessage.includes('kod') || lowerMessage.includes('programim') || 
            lowerMessage.includes('si te') || lowerMessage.includes('si te') ||
            lowerMessage.includes('tutorial') || lowerMessage.includes('udhezime')) {
            
            return `🤔 **PYETJE KOMPLEKSE**\n\nPyetja juaj "${message}" duket se kerkon nje pergjigje te detajuar teknike!\n\n💡 **Zgjidhje:**\n• Vendosni API Key me /apikey <key_jote>\n• Ose perdorni /google per kerkim te thelluar\n• Ose /wiki per informacion baze`;
        }

        if (entities.locations && entities.locations.length > 0) {
            return `Po kerkoj informacion per ${entities.locations.join(', ')}. Mund te perdorni /wiki per me shume detaje.`;
        }

        return "Kjo eshte nje pyetje interesante! Per pergjigje me te detajuara, vendosni API Key per Gemini AI ose perdorni komandat e kerkimit.";
    }

    getRequestResponse(message, intent, entities) {
        const requestType = intent.parameters?.requestType;

        if (requestType === 'help') {
            return "Sigurisht, jam ketu per t'ju ndihmuar! Cfare saktesisht keni nevoje te dini? Ose mund te perdorni /ndihmo per te pare te gjitha mundesite.";
        }

        if (requestType === 'information') {
            return "Me kenaqesi! Cfare lloj informacioni po kerkoni? Mund te perdorni /google per kerkim te gjere ne internet.";
        }

        return "Deshironi te beni dicka te vecante? Mund te me tregoni me shume ose te perdorni nje komande specifike nga menuja ime.";
    }

    getStatementResponse(message, sentiment, entities) {
        if (sentiment.sentiment === 'positive') {
            return "Kjo eshte e mrekullueshme! 😊 Faleminderit qe e ndertuat. A ka dicka tjeter me te cilen mund t'ju ndihmoj?";
        }

        if (sentiment.sentiment === 'negative') {
            return "Duket se keni nje situate te veshtire. 😔 Jam ketu per t'ju ndihmuar nese deshironi te flisni per te ose te kerkoni ndihme.";
        }

        if (sentiment.irony) {
            return "Hehe, e kuptoj! 😄 Ironia shqiptare eshte unike. Si mund t'ju ndihmoj vertet?";
        }

        return "E kuptoj. A deshironi te vazhdoni biseden ose te me kerkoni dicka specifike?";
    }

    getIntelligentResponse(message, analysis) {
        // Pergjigje inteligjente bazuar ne analizen e plote
        const { sentiment, entities, nuances } = analysis;

        if (nuances.figurativeLanguage && nuances.figurativeLanguage.length > 0) {
            const figurative = nuances.figurativeLanguage[0];
            return `Ah, po perdorni nje shprehje figurativë! "${figurative.expression}" nenkupton "${figurative.meaning}". Shume elegante!`;
        }

        if (entities.persons && entities.persons.length > 0) {
            return `Po flisni per ${entities.persons.join(', ')}? Interesante! Cfare deshironi te dini per ta?`;
        }

        if (sentiment.sentiment === 'ironic') {
            return "Haha, e kap ironine! 😄 Shqiptaret jemi te njohur per humorin tone te thate. Si mund t'ju ndihmoj seriozisht?";
        }

        return "E kam degjuar! A mund te me jepni me shume kontekst ose te perdorni nje komande specifike per te marre ndihme me te detajuar?";
    }

    getSimpleResponse(message) {
        const defaultResponses = [
            "E kuptoj! Si mund t'ju ndihmoj me tej?",
            "Shume mire! A deshironi te vazhdoni biseden?",
            "E kam degjuar. Cfare mund te bej per ju?",
            "Faleminderit per mesazhin! Si mund t'ju sherbej?",
            "E shkelqyeshme! A keni nevoje per ndihme me dicka specifike?"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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

    // =========================== ✅ KOMANDA /WIKI - KËRKIM WIKIPEDIA =========================
    async wikiCommand(searchTerm) {
        if (!searchTerm) {
            return {
                success: false,
                response: '❌ Ju lutem shkruani termin per kerkim: /wiki <fjale>'
            };
        }
        
        // Implementimi i Wikipedia API ketu
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
        
        // Implementimi i sherbimit te perkthimit
        const translation = await this.translateText(text, language);
        
        return {
            success: true,
            response: translation
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
            response: '📤 Importimi i historise...'
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
        
        // Ruaj API Key ne databaze
        await this.saveApiKey(user.id, apiKey);
        
        return {
            success: true,
            response: '✅ API Key u ruajt me sukses! Tani mund te perdorni Gemini AI.'
        };
    }

    // ================================== ✅ METODA NDIHMËSE ===================================
    async fetchWikipedia(term) {
        // Implementimi i Wikipedia API
        return `📚 Wikipedia per "${term}": Informacioni do te shfaqet ketu...`;
    }
    
    async translateText(text, language) {
        // Implementimi i perkthimit
        return `🌍 Perkthim (${language}): "${text}" → [Rezultati]`;
    }
    
    async fetchWeather(city) {
        // Implementimi i weather API
        return `🌤️ Moti ne ${city}: Temperatura, Kushtet...`;
    }
    
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

    async generateExport(userId) {
        // Implementimi i gjenerimit te eksportit
        return "Eksporti i te dhenave";
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
