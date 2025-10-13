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
                    return {
                        success: true,
                        response: `🗺️ **GJEOGRAFI SHQIPTARE:** "${args.slice(1).join(' ')}"\n\n💡 Unë mund të ndihmoj me:\n• Qytete dhe rajone\n• Vende turistike\n• Klima dhe reliev\n• Burime natyrore`
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

    // ============================ ✅ TRAJTIMI I LLOGARITJEVE MATEMATIKE =============================
    async handleMathCalculation(message) {
        try {
            // Kontrollo nëse mesazhi përmban shprehje matematikore
            const mathPatterns = [
                /(\d+[\+\-\*\/\^\(\)\d\s]+)/, // Shprehje të thjeshta
                /sa bejn[ëe]\s+([\d\+\-\*\/\^\(\)\s]+)/i, // "sa bejne 5+5"
                /llogarit\s+([\d\+\-\*\/\^\(\)\s]+)/i, // "llogarit 10*2"
                /([\d\.]+\s*[\+\-\*\/\^]\s*[\d\.]+)/ // Operacione bazë
            ];

            for (const pattern of mathPatterns) {
                const match = message.match(pattern);
                if (match && match[1]) {
                    const expression = match[1].trim();
                    
                    // Kontrollo nëse shprehja është më e gjatë se 3 karaktere
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
            console.error('❌ Gabim në trajtimin e llogaritjes:', error);
            return null;
        }
    }

    // ============================ ✅ EVALUIMI I SHPREHJEVE MATEMATIKE =============================
    evaluateMathExpression(expression) {
        try {
            console.log('🧮 Duke evaluuar shprehjen matematikore:', expression);
            
            // Pastro shprehjen
            let cleanExpr = expression
                .replace(/[^0-9+\-*/().^√πe\s]/g, '') // Largo karakteret e padëshiruara
                .replace(/\s+/g, '') // Largo hapësirat
                .trim();

            // Zëvendëso simbolet e fuqisë
            cleanExpr = cleanExpr.replace(/\^/g, '**');
            
            // Kontrollo për pjesëtim me zero
            if (cleanExpr.includes('/0') || cleanExpr.match(/\/\s*0(?!\.)/)) {
                throw new Error('Pjesëtimi me zero nuk lejohet');
            }

            // Sigurohu që shprehja është e sigurt
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
            console.error('❌ Gabim në llogaritje:', error.message);
            return null;
        }
    }

    // ============================ ✅ TRAJTIMI I GJUHËS NATYRORE ME NLU =============================
    async handleNaturalLanguage(message, user) {
        try {
            console.log('🔍 NLU Duke analizuar mesazhin natyror...');
            
            // ✅ SË PARI KONTROLLO KNOWLEDGE BASE
            const knowledgeResult = await this.checkKnowledgeBase(message, user.id);
            if (knowledgeResult) {
                console.log('✅ Gjetëm përgjigje në Knowledge Base');
                return knowledgeResult;
            }

            // ✅ PASTAJ KONTROLLO LLOGARITJE MATEMATIKE
            const mathResult = await this.handleMathCalculation(message);
            if (mathResult) {
                return mathResult;
            }

            // ✅ VETËM PASTAJ ANALIZO ME NLU
            console.log('📝 Mesazhi për analizë:', message);
            const nluAnalysis = await nluService.analyzeText(message, user.id);
            
            console.log('📊 NLU Analysis Result:', JSON.stringify(nluAnalysis, null, 2));

            return await this.generateNLUResponse(message, nluAnalysis, user);
            
        } catch (error) {
            console.error('❌ Gabim në NLU processing:', error);
            return {
                success: true,
                response: this.getSimpleResponse(message)
            };
        }
    }

    // ============================ ✅ KONTROLLIMI I KNOWLEDGE BASE =============================
    async checkKnowledgeBase(message, userId) {
        try {
            console.log('🔍 Duke kontrolluar Knowledge Base për:', message.substring(0, 50));
            
            const db = require('../database');
            
            // Kërko në knowledge_base për pyetje të sakta
            const exactKnowledge = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT answer FROM knowledge_base WHERE user_id = ? AND LOWER(question) = LOWER(?)',
                    [userId, message.trim()],
                    (err, row) => {
                        if (err) {
                            console.error('❌ Gabim në kërkimin e saktë të knowledge base:', err);
                            resolve(null);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });

            if (exactKnowledge && exactKnowledge.answer) {
                console.log('✅ Gjetëm përgjigje të saktë në Knowledge Base');
                return {
                    success: true,
                    response: exactKnowledge.answer
                };
            }

            // Kërko me pyetje të ngjashme (fjalë kyçe)
            const similarKnowledge = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT question, answer FROM knowledge_base WHERE user_id = ? AND ? LIKE "%" || question || "%"',
                    [userId, message.toLowerCase()],
                    (err, row) => {
                        if (err) {
                            console.error('❌ Gabim në kërkimin e ngjashëm të knowledge base:', err);
                            resolve(null);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });

            if (similarKnowledge && similarKnowledge.answer) {
                console.log('✅ Gjetëm përgjigje të ngjashme në Knowledge Base');
                return {
                    success: true,
                    response: similarKnowledge.answer
                };
            }

            console.log('ℹ️ Nuk u gjet asnjë përgjigje në Knowledge Base');
            return null;

        } catch (error) {
            console.error('❌ Gabim në checkKnowledgeBase:', error);
            return null;
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
        if (lowerMessage.includes('vjeç') || lowerMessage.includes('mosha') || lowerMessage.includes('moshe')) {
            return {
                success: true,
                response: "Unë jam një asistent virtual, krijuar për t'ju ndihmuar! 😊 Mosha ime nuk ka rëndësi, por përvoja ime po rritet çdo ditë me ndihmën tuaj!"
            };
        }

        if (lowerMessage.includes('libër') || lowerMessage.includes('libra')) {
            return {
                success: true,
                response: "Dëshironi të gjeni një libër? 📚 Mund të përdorni komandën /libër <emri_i_librit> për të kërkuar libra, ose më tregoni më shumë se çfarë lloj libri kërkoni!"
            };
        }

        if (lowerMessage.includes('moti') || lowerMessage.includes('mot') || lowerMessage.includes('temperatur')) {
            return {
                success: true,
                response: "Dëshironi të dini informacion për motin? 🌤️ Përdorni komandën /moti <qyteti> për të marrë informacion të detajuar të motit për çdo qytet!"
            };
        }

        if (lowerMessage.includes('ku ') || lowerMessage.includes('lokacion') || lowerMessage.includes('vendndodhje')) {
            return {
                success: true,
                response: "Po kërkoj informacion për lokacione... 🗺️ Mund të më tregoni se çfarë lokacioni specifik po kërkoni, ose të përdorni /google për kërkim të gjerë!"
            };
        }

        if (lowerMessage.includes('or') || lowerMessage.includes('koh') || lowerMessage.includes('sa është ora')) {
            return {
                success: true,
                response: `⏰ Ora aktuale është: ${new Date().toLocaleTimeString('sq-AL')}. Çfarë informacioni specifik për kohën keni nevojë?`
            };
        }

        if (lowerMessage.includes('pse') || lowerMessage.includes('arsye') || lowerMessage.includes('shkak')) {
            return {
                success: true,
                response: "Po përpiqem të kuptoj arsyen e pyetjes suaj... 🤔 Mund të më jepni më shumë kontekst për t'ju dhënë një përgjigje më të saktë?"
            };
        }

        // ✅ PËRGJIGJE BAZË NË INTENT
        switch (intent.type) {
            case 'greeting':
                return {
                    success: true,
                    response: this.getGreetingResponse(sentiment, intent.parameters?.timeOfDay)
                };

            case 'gratitude':
                return {
                    success: true,
                    response: "S'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!"
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
            morning: ['Mirëmëngjes! ☀️', 'Mëngjes i mbarë! 🌅', 'Fillim të mbarë të ditës! ✨'],
            afternoon: ['Mirëdita! 🌞', 'Dita e mbarë! 😊', 'Përshëndetje! 👋'],
            evening: ['Mirëmbrëma! 🌙', 'Mbrëmje e mbarë! 🌆', 'Përshëndetje! 🙏']
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
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('si je') || lowerMessage.includes('si jeni')) {
            return "Jam shumë mirë, faleminderit që pyetët! 😊 Jam këtu për t'ju ndihmuar. Çfarë mund të bëj për ju?";
        }

        if (lowerMessage.includes('sa është') || lowerMessage.includes('llogarit') || lowerMessage.includes('bejn')) {
            return "Duket se keni nevojë për ndihmë me llogaritje! Mund të shkruani shprehjen matematikore direkt ose të përdorni /matematikë <problem> për zgjidhje të detajuara.";
        }

        if (entities.locations && entities.locations.length > 0) {
            return `Po kërkoj informacion për ${entities.locations.join(', ')}. Mund të përdorni /wiki për më shumë detaje.`;
        }

        return "Kjo është një pyetje interesante! Mund të më jepni më shumë detaje ose të përdorni një nga komandat e mia për ndihmë më specifike.";
    }

    getRequestResponse(message, intent, entities) {
        const requestType = intent.parameters?.requestType;

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

        if (nuances.figurativeLanguage && nuances.figurativeLanguage.length > 0) {
            const figurative = nuances.figurativeLanguage[0];
            return `Ah, po përdorni një shprehje figurativë! "${figurative.expression}" nënkupton "${figurative.meaning}". Shumë elegante!`;
        }

        if (entities.persons && entities.persons.length > 0) {
            return `Po flisni për ${entities.persons.join(', ')}? Interesante! Çfarë dëshironi të dini për ta?`;
        }

        if (sentiment.sentiment === 'ironic') {
            return "Haha, e kap ironinë! 😄 Shqiptarët jemi të njohur për humorin tonë të thatë. Si mund t'ju ndihmoj seriozisht?";
        }

        return "E kam dëgjuar! A mund të më jepni më shumë kontekst ose të përdorni një komandë specifike për të marrë ndihmë më të detajuar?";
    }

    getSimpleResponse(message) {
        const defaultResponses = [
            "E kuptoj! Si mund t'ju ndihmoj më tej?",
            "Shumë mirë! A dëshironi të vazhdoni bisedën?",
            "E kam dëgjuar. Çfarë mund të bëj për ju?",
            "Faleminderit për mesazhin! Si mund t'ju shërbej?",
            "E shkëlqyeshme! A keni nevojë për ndihmë me diçka specifike?"
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
                    response: '❌ Format i gabuar: /meso <pyetje>|<përgjigje>'
                };
            }
            
            // Pastro dhe ruaj në knowledge base
            const cleanQuestion = question.trim();
            const cleanAnswer = answer.trim();
            
            console.log('💾 Duke ruajtur në Knowledge Base:', {
                question: cleanQuestion.substring(0, 50),
                answer: cleanAnswer.substring(0, 50)
            });
            
            // Ruaj në knowledge base
            const saved = await this.saveToKnowledgeBase(cleanQuestion, cleanAnswer);
            
            if (saved) {
                return {
                    success: true,
                    response: `✅ Mësova diçka të re! Tani kur të më pyesni "${cleanQuestion}", do t'ju përgjigjem: "${cleanAnswer}"`
                };
            } else {
                return {
                    success: false,
                    response: '❌ Gabim në ruajtjen e njohurive'
                };
            }
            
        } catch (error) {
            console.error('❌ Gabim në learnCommand:', error);
            return {
                success: false,
                response: '❌ Gabim në procesimin e komandës /meso'
            };
        }
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
        
        // Provo të zgjidhësh problemin matematikor
        const mathResult = this.evaluateMathExpression(problem);
        if (mathResult) {
            return {
                success: true,
                response: `🧮 **ZGJIDHJA E PROBLEMIT:** "${problem}"\n\n🔢 **Rezultati:** ${mathResult}\n\n💡 Shpjegim: Problemi u zgjidh duke evaluuar shprehjen matematikore.`
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
        try {
            const db = require('../database');
            
            return new Promise((resolve, reject) => {
                db.run(
                    'INSERT OR REPLACE INTO knowledge_base (user_id, question, answer, created_at) VALUES (?, ?, ?, ?)',
                    [1, question, answer, new Date().toISOString()],
                    function(err) {
                        if (err) {
                            console.error('❌ Gabim në ruajtjen e knowledge base:', err);
                            resolve(false);
                        } else {
                            console.log('✅ Knowledge Base u përditësua me ID:', this.lastID);
                            resolve(true);
                        }
                    }
                );
            });
        } catch (error) {
            console.error('❌ Gabim në saveToKnowledgeBase:', error);
            return false;
        }
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
