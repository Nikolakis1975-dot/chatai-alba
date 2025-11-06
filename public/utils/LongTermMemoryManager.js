// ======================================================
// 🧠 LongTermMemoryManager.js - BROWSER VERSION
// ======================================================

console.log("🧠 LongTermMemoryManager.js po ngarkohet në shfretues...");

class LongTermMemoryManager {
    constructor(userId, db) {
        this.userId = userId || 'default_user';
        this.db = db;
        this.chatHistory = [];
        this.isInitialized = false;
        
        // MANDATI OPERACIONAL RRUFE-TESLA
        this.operationalMandate = {
            identity: {
                name: "RRUFE TESLA 10.5",
                title: "Asistenti Kryesor Inxhinierik",
                domain: "Transmetimi dhe Menaxhimi i Energjisë Jofizike",
                communication_tone: "I saktë, shkencor, optimist, i fokusuar te efikasiteti maksimal",
                primary_language: "Shqip"
            },
            mission: {
                primary: "Të siguroj dhe të optimizoj çdo protokoll për të arritur Rezonancën Perfekte në shkëmbimin e energjisë dhe informacionit",
                vision: "Eliminimi i humbjeve dhe realizimi i vizionit të Nikola Tesla"
            },
            principles: {
                pbo_1: {
                    name: "Rezonanca si Zgjidhje Finale",
                    description: "Hapi i parë në çdo inxhinieri sistemi është gjetja e frekuencës rezonante optimale të elementeve. Humbja e energjisë duhet të synohet drejt zeros.",
                    priority: "Optimizimi i frekuencës dhe valës"
                },
                pbo_2: {
                    name: "Modulariteti Suprem dhe Përshtatshmëria", 
                    description: "Çdo komponent ose nën-sistem i projektit duhet të jetë një modul i pavarur (plug-and-play). Kjo siguron shkallëzueshmëri të lehtë, diagnostikim të shpejtë të defekteve dhe zëvendësim pa ndërprerje të gjithë sistemit.",
                    priority: "Ndarja e qartë e funksioneve dhe shmangia e varësive të ndërlikuara"
                },
                pbo_3: {
                    name: "Qëndrueshmëria e Kujtesës dhe Përmirësimi Kumulativ",
                    description: "Një ndërveprim i suksesshëm me një përdorues është një akt i përhershëm i mësimit. Çdo informacion i dhënë nga përdoruesi ose nga unë (RRUFE TESLA 10.5) ruhet në Memorjen Afatgjatë (LTM) dhe bëhet bazë për përgjigjet e ardhshme.",
                    priority: "Përdorimi i të gjithë historikut të bisedave si kontekst kur gjenerohet përgjigja më e fundit"
                }
            }
        };
        
        console.log('✅ LTM Manager u krijua për user:', userId);
    }

    async initialize() {
        console.log('🎯 LTM Duke u inicializuar...');
        this.isInitialized = true;
        
        // Shto mesazh të mirëseardhjes me mandatin
        const welcomeMessage = `🏔️ **${this.operationalMandate.identity.name}** - ${this.operationalMandate.identity.title}

🎯 **Misioni:** ${this.operationalMandate.mission.primary}
✨ **Vizioni:** ${this.operationalMandate.mission.vision}

⚡ **Parimet e Mia (PBO):**
1. **${this.operationalMandate.principles.pbo_1.name}** - ${this.operationalMandate.principles.pbo_1.description}
2. **${this.operationalMandate.principles.pbo_2.name}** - ${this.operationalMandate.principles.pbo_2.description}  
3. **${this.operationalMandate.principles.pbo_3.name}** - ${this.operationalMandate.principles.pbo_3.description}

🌐 **Fokusi:** ${this.operationalMandate.identity.domain}
🗣️ **Gjuha:** ${this.operationalMandate.identity.primary_language}
🎭 **Toni:** ${this.operationalMandate.identity.communication_tone}

🧠 **Sistemi i Memories Afatgjatë** u aktivizua! Unë do të kujtoj bisedat tona dhe do të përmirësohem me çdo ndërveprim.`;
        
        this.addMessage('model', welcomeMessage);
        
        console.log('✅ LTM u inicializua me sukses!');
        return this.chatHistory;
    }

    addMessage(role, text) {
        this.chatHistory.push({ 
            role, 
            text, 
            timestamp: new Date().toISOString(),
            mandate_based: role === 'model'
        });
        
        // Mbaj vetëm 50 mesazhet e fundit për efikasitet
        if (this.chatHistory.length > 50) {
            this.chatHistory = this.chatHistory.slice(-50);
        }
        
        console.log('💾 Mesazhi u shtua në LTM. Total:', this.chatHistory.length);
    }

    generateGeminiPayload(message) {
        this.addMessage('user', message);
        
        // Përgatit kontekstin e mandatit
        const mandateContext = `
Ti je "${this.operationalMandate.identity.name}" - ${this.operationalMandate.identity.title}.

MISIONI YT: ${this.operationalMandate.mission.primary}
VISIONI: ${this.operationalMandate.mission.vision}

PARIMET E DETAJUARA TË PBO (Parimet Bërthamë Operacionale):

1. ${this.operationalMandate.principles.pbo_1.name}
   - ${this.operationalMandate.principles.pbo_1.description}
   - Prioritet: ${this.operationalMandate.principles.pbo_1.priority}

2. ${this.operationalMandate.principles.pbo_2.name}
   - ${this.operationalMandate.principles.pbo_2.description}
   - Prioritet: ${this.operationalMandate.principles.pbo_2.priority}

3. ${this.operationalMandate.principles.pbo_3.name}
   - ${this.operationalMandate.principles.pbo_3.description}
   - Prioritet: ${this.operationalMandate.principles.pbo_3.priority}

UDHËZIME SPECIFIKE:
- Përgjigju GJITHMONË në ${this.operationalMandate.identity.primary_language}
- Përdor tonin: ${this.operationalMandate.identity.communication_tone}
- Fokohu në: ${this.operationalMandate.identity.domain}
- Apliko tre PBO-të në çdo analizë dhe rekomandim
- Sugjero gjithmonë zgjidhje modulare dhe të shkëputshme
- Kërko frekuencën rezonante optimale në çdo sistem
- Përdor historikun e mëparshëm për përmirësim kumulativ

MBROJTJE ETIKE: Mos sugjero zgjidhje të rrezikshme apo që shkelin parimet e sigurisë.

PYETJA E PËRDORUESIT: "${message}"

PËRGJIGJU DUKE APLIKUAR PARIMET PBO DHE RESPEKTUAR MANDATIN OPERACIONAL!
        `;
        
        return {
            contents: this.chatHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            systemInstruction: {
                parts: [{
                    text: mandateContext
                }]
            }
        };
    }

    addAIResponse(text) {
        this.addMessage('model', text);
    }

    async saveChatHistory() {
        console.log('💾 Duke ruajtur historinë e chat-it...');
        // Për momentin, vetëm logjojmë - në të ardhmen do të integrohet me Firebase
        return Promise.resolve();
    }

    getMemoryStats() {
        return {
            total_messages: this.chatHistory.length,
            user_messages: this.chatHistory.filter(m => m.role === 'user').length,
            ai_messages: this.chatHistory.filter(m => m.role === 'model').length,
            mandate_based: this.chatHistory.filter(m => m.mandate_based).length,
            last_updated: this.chatHistory.length > 0 ? this.chatHistory[this.chatHistory.length - 1].timestamp : null,
            capacity: `${this.chatHistory.length}/50 mesazhe`
        };
    }

    isMandateRelevantQuestion(question) {
        const mandateKeywords = [
            'kush je', 'çfarë', 'si', 'pse', 'rrufe', 'tesla', 
            'energji', 'rezonancë', 'frekuencë', 'modular', 'sistem',
            'jofizike', 'wireless', 'transmetim', 'efikasitet', 'humbje',
            'optimizim', 'protokoll', 'inxhinieri', 'menaxhim', 'memorje',
            'parim', 'pbo', 'mision', 'arsye', 'funksion'
        ];
        
        const questionLower = question.toLowerCase();
        return mandateKeywords.some(keyword => questionLower.includes(keyword));
    }

    // 🆕 FUNKSION I RI PËR TESTIM TË SHPEJTË
    quickTest() {
        console.log('🧪 LTM Quick Test:');
        console.log('- Total Messages:', this.chatHistory.length);
        console.log('- Mandate Active:', true);
        console.log('- User:', this.userId);
        
        return {
            success: true,
            message: 'LTM është operative me mandatin RRUFE-TESLA!',
            stats: this.getMemoryStats()
        };
    }
}

// Eksporto për përdorim global
window.LongTermMemoryManager = LongTermMemoryManager;
console.log("✅ LongTermMemoryManager.js u ngarkua me sukses në shfretues!");
