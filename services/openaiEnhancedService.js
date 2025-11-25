// =================================================
// Openai  RRUFE TESLA 10.5
// =================================================
const { OpenAI } = require('openai');
const { User } = require('../models/User');
const encryption = require('../utils/encryption');

class OpenAIEnhancedService {
    static async sendMessage(message, userId) {
        try {
            console.log('🔮 OpenAI Enhanced Service - User:', userId);
            
            // 1. Merr user nga database
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // 2. Kontrollo nëse ka OpenAI API Key
            if (!user.openaiApiKey) {
                return {
                    success: false,
                    response: '❌ OpenAI nuk është i konfiguruar. Ju lutem vendosni API Key në panelin OpenAI.',
                    fallback: true
                };
            }

            // 3. ✅ DEKRIPTO API KEY-N (kjo është çelësi!)
            let openaiApiKey;
            try {
                openaiApiKey = encryption.decrypt(user.openaiApiKey);
                console.log('🔑 API Key decrypted successfully');
            } catch (decryptError) {
                console.error('❌ API Key decryption failed:', decryptError);
                return {
                    success: false,
                    response: '❌ Gabim në dekriptimin e API Key. Ju lutem rivendosni API Key.',
                    fallback: true
                };
            }

            // 4. Krijo OpenAI client me API Key të dekriptuar
            const openai = new OpenAI({ 
                apiKey: openaiApiKey 
            });

            console.log('💬 Duke dërguar mesazh në OpenAI...');

            // 5. Dërgo mesazhin
            const completion = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: "system", 
                        content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip dhe jep përgjigje të dobishme, kreative dhe intuitive."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            });

            const response = completion.choices[0].message.content;
            
            console.log('✅ OpenAI response received');

            return {
                success: true,
                response: `🔮 **OpenAI GPT-4**: ${response}`,
                fallback: false
            };
            
        } catch (error) {
            console.error('❌ OpenAI Enhanced Service Error:', error.message);
            
            // Nëse është gabim authentication të OpenAI
            if (error.message.includes('Incorrect API key') || error.message.includes('authentication')) {
                return {
                    success: false,
                    response: '❌ OpenAI API Key është i pavlefshëm. Ju lutem kontrolloni API Key-n në panelin OpenAI.',
                    fallback: true
                };
            }
            
            // Gabime të tjera
            return {
                success: false,
                response: `❌ Gabim OpenAI: ${error.message}. Provo përsëri më vonë.`,
                fallback: true
            };
        }
    }

    // Test connection me API Key të userit
    static async testConnection(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user || !user.openaiApiKey) {
                return { success: false, message: 'No OpenAI API Key configured' };
            }

            // Dekripto API Key
            const openaiApiKey = encryption.decrypt(user.openaiApiKey);
            
            const openai = new OpenAI({ apiKey: openaiApiKey });
            
            // Test me një pyetje të thjeshtë
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: "user", content: "Say 'TEST SUCCESS' only" }
                ],
                max_tokens: 10
            });

            return { 
                success: true, 
                message: 'OpenAI connection test successful' 
            };
            
        } catch (error) {
            return { 
                success: false, 
                message: 'OpenAI test failed: ' + error.message 
            };
        }
    }
}

module.exports = OpenAIEnhancedService;
