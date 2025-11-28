// 🔥 OPENAI RADICAL SERVICE - RRUFE TESLA - COMMONJS VERSION
const OpenAI = require("openai");

console.log('🚀 OPENAI RADICAL SERVICE - RRUFE TESLA - Initializing...');

class OpenAIRadicalService {
    constructor() {
        console.log('🎯 Checking OpenAI API Key from DigitalOcean...');
        
        // ✅ KONTROLLO RADIKAL I API KEY
        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ CRITICAL: OPENAI_API_KEY is missing in environment!');
            console.error('❌ Check DigitalOcean environment variables!');
            throw new Error('OPENAI_API_KEY_NOT_FOUND');
        }
        
        console.log('✅ API Key exists! Length:', process.env.OPENAI_API_KEY.length);
        console.log('🔑 API Key starts with:', process.env.OPENAI_API_KEY.substring(0, 20) + '...');

        // ✅ KRIJO OPENAI CLIENT
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        this.model = "gpt-3.5-turbo";
        console.log('✅ OPENAI RADICAL - Service Ready! Model:', this.model);
    }

    async processMessage(message) {
        try {
            console.log(' ');
            console.log('🔮 OPENAI RADICAL - Processing message:', message);
            console.log('🔑 Using API Key:', process.env.OPENAI_API_KEY.substring(0, 15) + '...');
            
            // ✅ VERIFIKIM I DYTË
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('API_KEY_MISSING_DURING_PROCESS');
            }

            console.log('🌐 Calling OpenAI API with model:', this.model);
            
            // ✅ THIRR OPENAI API
            const completion = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { 
                        role: "system", 
                        content: "Ti je RRUFE-TESLA AI, një sistem i avancuar i inteligjencës artificiale. Përgjigju në shqip. Ji i zgjuar, kreativ dhe shumë i dobishëm. Përdor emrin RRUFE-TESLA në përgjigje." 
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
            console.log('✅ OPENAI RADICAL - SUCCESS!');
            console.log('📝 Response length:', response.length);
            console.log('💾 Tokens used:', completion.usage.total_tokens);
            
            return {
                success: true,
                response: `🔮 **OpenAI RRUFE-TESLA**: ${response}`,
                source: 'OPENAI_RADICAL',
                tokens: completion.usage.total_tokens,
                model: this.model
            };

        } catch (error) {
            console.error('❌ OPENAI RADICAL - ERROR:');
            console.error('❌ Error message:', error.message);
            console.error('❌ Error type:', error.type);
            console.error('❌ Error code:', error.code);
            
            let errorMessage = error.message;
            if (error.code === 'invalid_api_key') {
                errorMessage = 'API Key i pavlefshëm! Kontrollo DigitalOcean environment variables.';
            } else if (error.code === 'rate_limit_exceeded') {
                errorMessage = 'Kufizim në shpejtësi. Provoni përsëri më vonë.';
            } else if (error.code === 'insufficient_quota') {
                errorMessage = 'Nuk ka kredite të mbetura në OpenAI account.';
            }
            
            return {
                success: false,
                error: `OPENAI_RADICAL: ${errorMessage}`,
                source: 'OPENAI_RADICAL',
                errorCode: error.code,
                suggestion: 'Check OPENAI_API_KEY in DigitalOcean environment variables'
            };
        }
    }

    // ✅ METODË TEST
    async testConnection() {
        console.log('🧪 OPENAI RADICAL - Testing connection...');
        
        const testMessage = "Përshëndetje RRUFE-TESLA! A funksionon OpenAI API?";
        const result = await this.processMessage(testMessage);
        
        return {
            test: true,
            connected: result.success,
            message: result.success ? '✅ OpenAI connection successful!' : '❌ OpenAI connection failed',
            details: result
        };
    }
}

// ✅ KRIJO DHE EKSPORTO INSTANCË
console.log('🔧 Creating OpenAI Radical instance...');
const openaiRadicalInstance = new OpenAIRadicalService();
console.log('✅ OpenAI Radical instance created successfully!');

module.exports = openaiRadicalInstance;
