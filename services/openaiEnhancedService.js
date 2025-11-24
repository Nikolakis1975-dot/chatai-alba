// =================================================
// Openai  RRUFE TESLA 10.5
// =================================================
const { OpenAI } = require('openai');
const { User } = require('../models/User'); // ✅ Rruga e saktë
const encryption = require('../utils/encryption');

class OpenAIEnhancedService {
    static async getOpenAIForUser(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user || !user.openaiApiKey) {
                return null;
            }
            
            const decryptedKey = encryption.decrypt(user.openaiApiKey);
            
            return new OpenAI({
                apiKey: decryptedKey,
                timeout: 30000
            });
        } catch (error) {
            console.error('❌ Gabim në OpenAI service:', error);
            return null;
        }
    }

    static async chatWithOpenAI(userId, message) {
        try {
            const openai = await this.getOpenAIForUser(userId);
            if (!openai) {
                throw new Error('OpenAI nuk është konfiguruar');
            }

            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip dhe jep përgjigje të sakta dhe profesionale."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            });

            return {
                success: true,
                response: completion.choices[0].message.content,
                model: "gpt-4",
                tokens: completion.usage?.total_tokens || 0
            };
        } catch (error) {
            console.error('❌ Gabim OpenAI API:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }
}

module.exports = OpenAIEnhancedService;
