// ==================== ✅ COMMAND SERVICE - PA NLU ====================
// 📝 DESKRIMI: Shërbim për procesimin e të gjitha komandave të sistemit
// 🎯 QËLLIMI: Një vend i vetëm për të gjitha komandat
// 🔧 AUTORI: ChatAI ALBA Team
// ========================================================================

class CommandService {
    
    // ============================ ✅ PROCESIMI I KOMANDËS KRYESORE =============================
    async processCommand(command, user, message) {
        try {
            const args = message.split(' ');
            const mainCommand = args[0].toLowerCase();

            // ======================= ✅ TRAJTIMI I MESAZHEVE JO-KOMANDË ======================
            if (!mainCommand.startsWith('/') && message.trim().length > 2) {
                return await this.handleNaturalLanguage(message, user);
            }
            
            switch (mainCommand) {
                case '/ndihmo':
                    return await this.helpCommand(user);
                
                // ... (MBAJ TË GJITHA KOMANDAT E TJERA TË NJËJTA)
