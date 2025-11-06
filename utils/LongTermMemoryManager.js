// =================================== 📁 LongTermMemoryManager =======================================
class LongTermMemoryManager {
  constructor(userId, db) {
    this.userId = userId;
    this.db = db;
    this.chatHistory = [];
    this.sessionRef = doc(db, CHAT_SESSIONS_PATH(userId), 'session_history');
    this.isInitialized = false;
  }

  // 🎯 Inicializimi i memories
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

  // 💾 Ruajtja e memories
  async saveChatHistory() {
    if (!this.isInitialized) return;
    
    try {
      await setDoc(this.sessionRef, {
        chatData: JSON.stringify(this.chatHistory),
        lastUpdated: serverTimestamp(),
        userId: this.userId,
        appId: APP_ID
      });
      console.log('💾 LTM: Historiku u ruajt:', this.chatHistory.length, 'mesazhe');
    } catch (error) {
      console.error('❌ LTM: Gabim në ruajtje:', error);
    }
  }

  // ➕ Shtimi i mesazhit të ri
  addMessage(role, text) {
    this.chatHistory.push({ role, text, timestamp: new Date().toISOString() });
    
    // Mbaj vetëm 50 mesazhet e fundit për efikasitet
    if (this.chatHistory.length > 50) {
      this.chatHistory = this.chatHistory.slice(-50);
    }
  }

  // 📤 Gjenerimi i payload-it për Gemini
  generateGeminiPayload(newUserMessage) {
    // Shto mesazhin e ri të përdoruesit
    this.addMessage('user', newUserMessage);
    
    // Kthe payload-in e plotë me historikun
    return {
      contents: this.chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      systemInstruction: {
        parts: [{
          text: `Ti je 'RRUFE TESLA 10.5', një asistent inteligjent i dizajnuar për inxhinierinë e sistemeve. Përgjigju gjithmonë në shqip. Roli yt kryesor është të ruash dhe të përdorësh informacionin kontekstual të dhënë më parë nga përdoruesi. Nëse përdoruesi përmend një detaj ose objektiv më herët, duhet ta përfshish atë në përgjigjet e ardhshme për të treguar njohuri të qëndrueshme.`
        }]
      }
    };
  }

  // ➕ Shto përgjigjen e AI-së
  addAIResponse(text) {
    this.addMessage('model', text);
  }
}
