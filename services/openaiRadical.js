// 🔥 OPENAI RADICAL SERVICE - COMMONJS VERSION - RRUFE TESLA
const OpenAI = require("openai");

console.log('🚀 OPENAI RADICAL SERVICE - RRUFE TESLA - Initializing...');

class OpenAIRadicalService {
    constructor() {
        console.log('🎯 Checking OpenAI API Key from DigitalOcean...');
        console.log('🔑 API Key exists:', !!process.env.OPENAI_API_KEY);
        console.log('🔑 API Key first chars:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 20) + '...' : 'MISSING');
        
        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ CRITICAL: OPENAI_API_KEY is missing in DigitalOcean environment!');
            throw new Error('OPENAI_API_KEY not found in environment variables');
        }

        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        this.model = "gpt-3.5-turbo";
        console.log('✅ OPENAI RADICAL - RRUFE TESLA Ready! Model:', this.model);
    }

    async processMessage(message) {
        try {
            console.log('🔮 OPENAI RADICAL - Processing message:', message.substring(0, 100));
            
            // ✅ VERIFIKIM I DYTË I API KEY
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('NO_API_KEY_IN_PROCESS - Environment variable missing');
            }

            console.log('🌐 OPENAI RADICAL - Calling OpenAI API...');
            
            const completion = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { 
                        role: "system", 
                        content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip. Je i zgjuar, kreativ dhe i dobishëm. Përgjigju si një asistencë inteligjente e avancuar." 
                    },
                    { 
                        role: "user", 
                        content: message 
                    }
                ],
                max_tokens: 800,
                temperature: 0.7
            });

            const response = completion.choices[0].message.content;
            console.log('✅ OPENAI RADICAL - SUCCESS! Response length:', response.length);
            
            return {
                success: true,
                response: `🔮 **OpenAI RRUFE-TESLA**: ${response}`,
                source: 'OPENAI_RADICAL',
                tokens: completion.usage.total_tokens
            };

        } catch (error) {
            console.error('❌ OPENAI RADICAL - ERROR:', error.message);
            console.error('❌ ERROR DETAILS:', error);
            
            return {
                success: false,
                error: `OPENAI_RADICAL_ERROR: ${error.message}`,
                source: 'OPENAI_RADICAL',
                suggestion: 'Check DigitalOcean environment variables for OPENAI_API_KEY'
            };
        }
    }

    // ✅ METODË TEST E THJESHTË
    async testConnection() {
        try {
            console.log('🧪 OPENAI RADICAL - Testing connection...');
            
            const result = await this.processMessage('Përshëndetje! Test lidhje RRUFE-TESLA.');
            
            return {
                test: true,
                connected: result.success,
                message: result.success ? 'OpenAI connection successful!' : 'OpenAI connection failed',
                details: result
            };
        } catch (error) {
            return {
                test: true,
                connected: false,
                message: 'OpenAI test failed',
                error: error.message
            };
        }
    }
}

// ✅ EKSPORTO INSTANCË TË VETME - COMMONJS
const openaiRadicalInstance = new OpenAIRadicalService();
module.exports = openaiRadicalInstance;
