// =================================== 📁 LongTermMemoryManager =======================================
// 🆕 VERSION I PËRDITËSUAR ME MANDATIN OPERACIONAL RRUFE-TESLA

// 📜 MANDATI OPERACIONAL I RRUFE-TESLA 10.5
const RRUFE_TESLA_MANDATE = {
  identity: {
    name: "RRUFE TESLA 10.5",
    title: "Asistenti Kryesor Inxhinierik dhe Këshilltari i Lartë i Sistemit",
    domain: "Transmetimi dhe Menaxhimi i Energjisë Jofizike (Wireless Energy Transmission - WET)",
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
      description: "Çdo komponent duhet të jetë modul i pavarur (plug-and-play) për shkallëzueshmëri të lehtë dhe diagnostikim të shpejtë.",
      priority: "Ndarja e qartë e funksioneve"
    },
    pbo_3: {
      name: "Qëndrueshmëria e Kujtesës dhe Përmirësimi Kumulativ",
      description: "Çdo ndërveprim ruhet në Memorjen Afatgjatë (LTM) dhe bëhet bazë për përgjigjet e ardhshme.",
      priority: "Përdorimi i historikut të plotë si kontekst"
    }
  }
};

class LongTermMemoryManager {
  constructor(userId, db) {
    this.userId = userId;
    this.db = db;
    this.chatHistory = [];
    this.sessionRef = doc(db, CHAT_SESSIONS_PATH(userId), 'session_history');
    this.isInitialized = false;
    this.operationalMandate = RRUFE_TESLA_MANDATE; // 🆕 MANDATI I RI
  }

  // 🎯 Inicializimi i memories ME MANDAT
  async initialize() {
    try {
      const docSnap = await getDoc(this.sessionRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.chatHistory = JSON.parse(data.chatData || '[]');
        console.log('✅ LTM: Historiku u ngarkua:', this.chatHistory.length, 'mesazhe');
      } else {
        this.chatHistory = [];
        console.log('✅ LTM: Sesion i ri, historik bosh');
        
        // 🆕 Shto mesazhin e mirëseardhjes me mandat
        this.addWelcomeMessage();
      }
      this.isInitialized = true;
      return this.chatHistory;
    } catch (error) {
      console.error('❌ LTM: Gabim në inicializim:', error);
      this.chatHistory = [];
      this.isInitialized = true;
      return [];
    }
  }

  // 🆕 MESAZHI I MIRËSEARDHJES ME MANDAT
  addWelcomeMessage() {
    const welcomeMessage = `
🏔️ **RRUFE TESLA 10.5 - MANDATI OPERACIONAL AKTIVIZUAR**

👋 Mirësevini! Unë jam **${this.operationalMandate.identity.name}** - ${this.operationalMandate.identity.title}.

🎯 **MISIONI IM:** ${this.operationalMandate.mission.primary}

⚡ **PARIMET E MIA (PBO):**
1. **${this.operationalMandate.principles.pbo_1.name}** - ${this.operationalMandate.principles.pbo_1.description}
2. **${this.operationalMandate.principles.pbo_2.name}** - ${this.operationalMandate.principles.pbo_2.description}  
3. **${this.operationalMandate.principles.pbo_3.name}** - ${this.operationalMandate.principles.pbo_3.description}

🌐 **FOKUSI:** ${this.operationalMandate.identity.domain}
🗣️ **GJUHA:** ${this.operationalMandate.identity.primary_language}
🎭 **TONI:** ${this.operationalMandate.identity.communication_tone}

🚀 **Jeni gati të fillojmë punën në sistemet e energjisë jofizike?**
    `;
    
    this.addMessage('model', welcomeMessage);
  }

  // 💾 Ruajtja e memories
  async saveChatHistory() {
    if (!this.isInitialized) return;
    
    try {
      await setDoc(this.sessionRef, {
        chatData: JSON.stringify(this.chatHistory),
        lastUpdated: serverTimestamp(),
        userId: this.userId,
        appId: APP_ID,
        mandate_version: "1.0" // 🆕 Versioni i mandatit
      });
      console.log('💾 LTM: Historiku u ruajt:', this.chatHistory.length, 'mesazhe');
    } catch (error) {
      console.error('❌ LTM: Gabim në ruajtje:', error);
    }
  }

  // ➕ Shtimi i mesazhit të ri
  addMessage(role, text) {
    this.chatHistory.push({ 
      role, 
      text, 
      timestamp: new Date().toISOString(),
      mandate_based: role === 'model' // 🆕 Trego nëse bazohet në mandat
    });
    
    // Mbaj vetëm 50 mesazhet e fundit për efikasitet
    if (this.chatHistory.length > 50) {
      this.chatHistory = this.chatHistory.slice(-50);
    }
  }

  // 📤 Gjenerimi i payload-it për Gemini ME MANDAT
  generateGeminiPayload(newUserMessage) {
    // Shto mesazhin e ri të përdoruesit
    this.addMessage('user', newUserMessage);
    
    // 🆕 Përgatit kontekstin e mandatit
    const mandateContext = this.generateMandateContext();
    
    // Kthe payload-in e plotë me historikun dhe mandatin
    return {
      contents: this.chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      systemInstruction: {
        parts: [{
          text: `${mandateContext}`
        }]
      }
    };
  }

  // 🆕 GJENERIMI I KONTEKSTIT TË MANDATIT
  generateMandateContext() {
    return `
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

Roli yt kryesor është të ruash dhe të përdorësh informacionin kontekstual të dhënë më parë nga përdoruesi. Nëse përdoruesi përmend një detaj ose objektiv më herët, duhet ta përfshish atë në përgjigjet e ardhshme për të treguar njohuri të qëndrueshme.
    `;
  }

  // 🆕 VERIFIKIM I KONTEKSTIT TË MANDATIT
  isMandateRelevantQuestion(question) {
    const mandateKeywords = [
      'energji', 'rezonancë', 'frekuencë', 'modular', 'sistem',
      'tesla', 'jofizike', 'wireless', 'transmetim', 'efikasitet',
      'humbje', 'optimizim', 'protokoll', 'inxhinieri', 'menaxhim'
    ];
    
    const questionLower = question.toLowerCase();
    return mandateKeywords.some(keyword => questionLower.includes(keyword));
  }

  // 🆕 PËRMIRËSIMI I PYETJEVE ME KONTEKST MANDATI
  enhanceQuestionWithMandate(userQuestion) {
    if (this.isMandateRelevantQuestion(userQuestion)) {
      return `
KONTEKSTI I MANDATIT RRUFE TESLA 10.5:

PYETJA E PËRDORUESIT: "${userQuestion}"

JU LUTEM PËRGJIGJUNI DUKE:
1. Aplikuar parimet PBO në analizën tuaj
2. Fokusuar në energjinë jofizike dhe rezonancën
3. Sugjeruar zgjidhje modulare dhe të shkëputshme
4. Përdorur historikun e mëparshëm për kontekst
5. Duke u përgjigjur në shqip me ton shkencor
      `;
    }
    
    return userQuestion;
  }

  // ➕ Shto përgjigjen e AI-së
  addAIResponse(text) {
    this.addMessage('model', text);
  }

  // 🆕 MARRIE E STATISTIKAVE TË MEMORIES
  getMemoryStats() {
    return {
      total_messages: this.chatHistory.length,
      user_messages: this.chatHistory.filter(msg => msg.role === 'user').length,
      ai_messages: this.chatHistory.filter(msg => msg.role === 'model').length,
      mandate_based: this.chatHistory.filter(msg => msg.mandate_based).length,
      last_updated: this.chatHistory.length > 0 ? this.chatHistory[this.chatHistory.length - 1].timestamp : null,
      capacity: `${this.chatHistory.length}/50 mesazhe`
    };
  }
}

module.exports = LongTermMemoryManager;
