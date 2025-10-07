// ==================== ✅ USER MODEL - 07.10.2024 ====================
// 📝 DESKRIMI: Modeli i përdoruesit për databazën
// 🎯 QËLLIMI: Menaxhim i të dhënave të përdoruesve
// 🔧 AUTORI: ChatAI ALBA Team
// ====================================================================

class User {
    constructor(userData) {
        this.id = userData.id;
        this.username = userData.username;
        this.email = userData.email;
        // ... të tjera
    }
}

module.exports = User;
