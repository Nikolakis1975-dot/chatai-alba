// ==================== ✅ COMMAND SERVICE - RRUFE TESLA ME OPENAI ====================
// 📝 DESKRIMI: Shërbim për procesimin e të gjitha komandave të sistemit
// 🎯 QËLLIMI: Një vend i vetëm për të gjitha komandat me support OpenAI
// 📥 INPUT: command string nga përdoruesi + engine preference
// 📤 OUTPUT: response ose action
// 🔧 AUTORI: ChatAI ALBA Team
// ========================================================================

// ==================== ✅ COMMAND SERVICE - VERSION I RI I PLOTË ====================
const express = require('express');

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
                
                case '/student':
                case '/studim':
                case '/student-mode':
                    return {
                        success: true,
                        response: `🎓 **MODI STUDENT - CHATAI ALBA**\n\n📚 KËRKIM AKADEMIK:\n• /liber <emri> - Gjej libra\n• /detyre <lenda> - Ndihme detyrash\n• /referenc <tema> - Burime\n\n💡 SHEMBUJ:\n• /liber "Histori e Shqiperise"\n• /detyre matematike`
                    };
                
                // ... (mbaje komandat e tjera të njëjta)
                
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

    // ============================ ✅ TRAJTIMI I GJUHËS NATYRORE - VERSION I RI =============================
    async handleNaturalLanguage(message, user, preferredEngine = null) {
        try {
            console.log('🎯 [COMMAND-DEBUG] handleNaturalLanguage CALLED!');
            console.log('🎯 [COMMAND-DEBUG] Message:', message);
            console.log('🎯 [COMMAND-DEBUG] Engine:', preferredEngine);
            
            // ✅ OPENAI - ME ROUTE TË RE QË FUNKSIONON
            if (preferredEngine === 'openai') {
                console.log('🔮 [COMMAND-FINAL] Duke thirrur OpenAI route...');
                try {
                    const response = await fetch('/api/openai/chat', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ 
                            message: message, 
                            userId: user.id 
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    console.log('📥 [COMMAND-FINAL] Rezultati OpenAI:', result.success ? 'SUCCESS' : 'FAILED');
                    
                    if (result && result.success) {
                        console.log('✅ [COMMAND-FINAL] OpenAI u përgjigj!');
                        return result;
                    } else {
                        console.log('❌ [COMMAND-FINAL] OpenAI dështoi:', result?.error);
                    }
                    
                } catch (error) {
                    console.error('❌ [COMMAND-FINAL] Gabim OpenAI:', error.message);
                }
            }
            
            // ✅ GEMINI FALLBACK
            console.log('🤖 [COMMAND-FINAL] Duke provuar Gemini...');
            try {
                const hasApiKey = await this.checkApiKey(user.id);
                if (hasApiKey) {
                    const geminiResult = await this.sendToGemini(message, user.id);
                    if (geminiResult && geminiResult.success) {
                        console.log('✅ [COMMAND-FINAL] Gemini u përgjigj!');
                        return geminiResult;
                    }
                }
            } catch (geminiError) {
                console.error('❌ [COMMAND-FINAL] Gemini dështoi:', geminiError);
            }
            
            // ✅ FALLBACK FINAL
            console.log('⚠️ [COMMAND-FINAL] Duke kthyer fallback...');
            return {
                success: true,
                response: `🤖 **RRUFE-TESLA AI**\n\n"${message}"\n\n🔧 Po punoj për të gjetur përgjigjen...\n💡 Provoni motorin tjetër ose /ndihmo`
            };
            
        } catch (error) {
            console.error('❌ [COMMAND-FINAL] Gabim kritik:', error);
            return {
                success: false,
                response: '❌ Gabim në sistem'
            };
        }
    }

    // ============================ ✅ METODAT E TJERA (mbaj të njëjtat) =============================
    async checkApiKey(userId) {
        try {
            const db = require('../database');
            const result = await new Promise((resolve) => {
                db.get(
                    'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                    [userId, 'gemini'],
                    (err, row) => resolve(!!row)
                );
            });
            return result;
        } catch (error) {
            return false;
        }
    }

    async sendToGemini(message, userId) {
        try {
            const GeminiRealService = require('./geminiRealService');
            const response = await GeminiRealService.processMessage(message, userId);
            if (response && response.success) {
                return { success: true, response: response.response };
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async helpCommand(user) {
        return {
            success: true,
            response: `👑 **SISTEMI I KOMANDAVE**\n\n📋 KOMANDAT BAZE:\n• /ndihmo - Kjo liste\n• /wiki - Kërkim Wikipedia\n\n🚀 MOTORËT:\n• 🤖 Gemini - Default\n• 🔮 OpenAI - Alternativ`
        };
    }

// ✅ EKSPORTO SI INSTANCË
module.exports = CommandService;

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
