// ==================== ✅ CHAT CONTROLLER - 07.10.2024 ====================
// 📝 DESKRIMI: Kontrollon të gjitha operacionet e chat-it
// 🎯 QËLLIMI: Procesim mesazhesh dhe komandash
// 🔧 AUTORI: ChatAI ALBA Team
// ========================================================================

const CommandService = require('../services/commandService');
const GeminiService = require('../services/geminiService');

class ChatController {
    
    // ✅ PROCESIMI I MESAZHEVE DHE KOMANDAVE
    async processMessage(req, res) {
        try {
            const { message } = req.body;
            const user = req.user;
            
            if (!message) {
                return res.json({
                    success: false,
                    response: '❌ Ju lutem shkruani një mesazh'
                });
            }

            // ✅ KONTROLLO NËSE ËSHTË KOMANDË
            if (message.startsWith('/')) {
                const commandResult = await CommandService.processCommand('/', user, message);
                return res.json(commandResult);
            }

            // ✅ NËSE NUK ËSHTË KOMANDË, PROCEO SI MESAZH NORMAL
            const geminiResponse = await GeminiService.sendMessage(message, user.id);
            
            return res.json({
                success: true,
                response: geminiResponse
            });

        } catch (error) {
            console.error('❌ Gabim në procesimin e mesazhit:', error);
            return res.json({
                success: false,
                response: '❌ Gabim në server. Provo përsëri.'
            });
        }
    }
}

module.exports = new ChatController();
