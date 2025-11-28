// 🔥 OPENAI RADICAL SERVICE - VERSION I PASTËR
import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

console.log('🚀 OPENAI RADICAL SERVICE - Initializing...');

class OpenAIRadicalService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.model = "gpt-3.5-turbo";
        console.log('✅ OPENAI RADICAL - Ready! API Key exists:', !!process.env.OPENAI_API_KEY);
    }

    async processMessage(message) {
        try {
            console.log('🔮 OPENAI RADICAL - Processing:', message.substring(0, 50));
            
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('NO_API_KEY - Check DigitalOcean environment variables');
            }

            const completion = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { 
                        role: "system", 
                        content: "You are RRUFE-TESLA AI. Respond in Albanian. Be helpful and creative." 
                    },
                    { 
                        role: "user", 
                        content: message 
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            });

            const response = completion.choices[0].message.content;
            console.log('✅ OPENAI RADICAL - Success!');
            
            return {
                success: true,
                response: `🔮 **OpenAI RRUFE-TESLA**: ${response}`,
                source: 'OPENAI_RADICAL'
            };

        } catch (error) {
            console.error('❌ OPENAI RADICAL - Error:', error.message);
            return {
                success: false,
                error: `OPENAI_RADICAL: ${error.message}`,
                source: 'OPENAI_RADICAL'
            };
        }
    }
}

// Eksporto instancë të vetme
export default new OpenAIRadicalService();
