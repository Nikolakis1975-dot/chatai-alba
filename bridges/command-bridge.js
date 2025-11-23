// ==================== ✅ COMMAND BRIDGE - UPDATED WITH OPENAI SUPPORT ====================
// 📝 DESKRIMI: Ura midis sistemit të vjetër dhe të ri të komandave + OpenAI integration
// 🎯 QËLLIMI: Lidhja pa rrezik e CommandService dhe OpenAI me sistemin ekzistues
// 🔧 AUTORI: ChatAI ALBA Team
// 🏗️ VERSION: 2.0 - Me OpenAI Support
// =========================================================================

const CommandService = require('../services/commandService');

// 🆕 IMPORT OPENAI SERVICE
let openai;
let getModel;

try {
    // Provo të importosh OpenAI service
    const openaiModule = require('../services/openaiService');
    openai = openaiModule.openai;
    getModel = openaiModule.getModel;
    console.log('✅ OpenAI service u ngarkua me sukses në CommandBridge');
} catch (error) {
    console.log('⚠️ OpenAI service nuk u gjet ose ka gabim:', error.message);
    openai = null;
    getModel = null;
}

class CommandBridge {
    
    // ✅ PROVO SISTEMIN E RI, NËSE DËSHTO KTHEHU TE I VJETERI
    static async processCommandSafe(text, user) {
        try {
            console.log(`🔗 Duke provuar sistemin e ri të komandave...`);
            
            // ✅ PROVO KOMANDËN ME SISTEMIN E RI
            const newSystemResult = await CommandService.processCommand('/', user, text);
            
            // ✅ KONTROLLO NËSE SISTEMI I RI FUNKSIONON
            if (newSystemResult && newSystemResult.success !== false) {
                console.log(`✅ Sistemi i ri funksionon për: ${text}`);
                return newSystemResult;
            }
            
            // ❌ NËSE SISTEMI I RI DËSHTON, KTHEHU TE I VJETERI
            throw new Error('Sistemi i ri kthen rezultat të pavlefshëm');
            
        } catch (error) {
            console.log(`🔄 Sistemi i ri dështoi, duke u kthyer te sistemi i vjetër: ${error.message}`);
            
            // ✅ KTHEHU TE SISTEMI I VJETËR I PROVUAR
            return await this.fallbackToOldSystem(text, user);
        }
    }
    
    // ✅ SISTEMI I VJETËR I SIGURT (FALLBACK)
    static async fallbackToOldSystem(text, user) {
        // Këtu vendosim logjikën e vjetër të komandave
        // që dimë që funksionon perfekt
        const parts = text.trim().split(" ");
        const cmd = parts[0];
        
        // Implementimi i vjetër i provuar
        switch (cmd) {
            case "/ndihmo":
                return {
                    success: true,
                    response: "📌 Komandat: /ndihmo, /wiki <fjale>, /perkthim <gjuha> <tekst>, /meso <pyetje>|<përgjigje>, /moti <qyteti>, /eksporto, /importo, /dil, /apikey"
                };
            // ... komandat e tjera ekzistuese
            default:
                return {
                    success: false,
                    response: "❌ Komandë e panjohur"
                };
        }
    }

    // 🆕 ==================== OPENAI BRIDGE INTEGRATION ====================

    // ✅ KONTROLLO STATUSIN E OPENAI SERVICE
    static async checkOpenAIStatus() {
        try {
            // Kontrollo nëse OpenAI service është i ngarkuar
            if (!openai) {
                return {
                    available: false,
                    status: 'service_not_loaded',
                    message: 'OpenAI service nuk është ngarkuar në sistem'
                };
            }
            
            // Kontrollo nëse API Key është konfiguruar
            if (!process.env.OPENAI_API_KEY) {
                return {
                    available: false,
                    status: 'api_key_missing',
                    message: 'OPENAI_API_KEY nuk është vendosur në .env'
                };
            }
            
            // Testo lidhjen me OpenAI me një pyetje të thjeshtë
            console.log('🔮 Duke testuar lidhjen me OpenAI...');
            const testCompletion = await openai.chat.completions.create({
                model: getModel('chat'),
                messages: [
                    {
                        role: "user",
                        content: "Pergjigju me 'OK' nëse funksionon"
                    }
                ],
                max_tokens: 5,
                temperature: 0.1
            });

            const testResponse = testCompletion.choices[0].message.content;
            
            return {
                available: true,
                status: 'active',
                message: 'OpenAI service është operative',
                model: getModel('chat'),
                test_response: testResponse,
                tokens: testCompletion.usage?.total_tokens || 0
            };
            
        } catch (error) {
            console.error('❌ OpenAI status check failed:', error);
            return {
                available: false,
                status: 'error',
                message: `OpenAI error: ${error.message}`,
                suggestion: 'Kontrollo OPENAI_API_KEY në .env file'
            };
        }
    }

    // ✅ PROCESO KOMANDË OPENAI ME SHËRBIMIN E VËRTETË
    static async processOpenAICommand(message, user) {
        try {
            console.log(`🔮 OpenAI Bridge: Duke procesuar "${message.substring(0, 50)}..."`);
            
            // Kontrollo statusin e OpenAI përpara se të procesosh
            const status = await this.checkOpenAIStatus();
            if (!status.available) {
                console.log('⚠️ OpenAI nuk është disponues, duke përdorur fallback');
                return await this.openAIFallback(message, user, status);
            }
            
            // ✅ PËRDOR OPENAI SERVICE TË VËRTETË
            console.log('🔮 Duke thirrur OpenAI API...');
            const completion = await openai.chat.completions.create({
                model: getModel('chat'),
                messages: [
                    {
                        role: "system",
                        content: `Ti je RRUFE-TESLA AI, një asistent inteligjent shqip. 
                                Përgjigju në shqip dhe jep përgjigje të dobishme, të sakta dhe miqësore.
                                Përdorur: ${new Date().toLocaleDateString('sq-AL')}
                                Përdoruesi: ${user?.username || 'User'}`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 1500,
                temperature: 0.7,
                top_p: 0.9
            });

            const response = completion.choices[0].message.content;
            const usage = completion.usage;
            
            console.log(`✅ OpenAI Bridge: Përgjigje e suksesshme (${usage?.total_tokens || 'N/A'} tokens)`);
            
            return {
                success: true,
                response: `🔮 **OpenAI**\n\n${response}`,
                model: getModel('chat'),
                tokens: usage?.total_tokens || 0,
                bridge: 'openai-service',
                timestamp: new Date().toISOString(),
                usage: {
                    prompt_tokens: usage?.prompt_tokens || 0,
                    completion_tokens: usage?.completion_tokens || 0,
                    total_tokens: usage?.total_tokens || 0
                }
            };
            
        } catch (error) {
            console.error('❌ OpenAI Service Error:', error);
            
            // ✅ FALLBACK - CommandService nëse OpenAI dështon
            return await this.openAIFallback(message, user, {
                available: false,
                status: 'error',
                message: error.message
            });
        }
    }

    // ✅ OPENAI FALLBACK SYSTEM - ASNJËHERË NUK DËSHTO
    static async openAIFallback(message, user, status) {
        console.log('🔄 Duke përdorur OpenAI fallback system...');
        
        // ✅ FALLBACK 1: Provo CommandService
        try {
            const result = await CommandService.processCommand('openai', user, message);
            
            if (result && result.success) {
                console.log('✅ OpenAI Fallback: CommandService dha përgjigje');
                return {
                    ...result,
                    response: `🔮 **OpenAI (via CommandService)**\n\n${result.response}`,
                    bridge: 'openai-commandservice-fallback',
                    fallback_reason: status.message,
                    timestamp: new Date().toISOString()
                };
            }
        } catch (cmdError) {
            console.error('❌ CommandService fallback failed:', cmdError);
        }
        
        // ✅ FALLBACK 2: Provo sistemin e vjetër të komandave
        try {
            const oldSystemResult = await this.fallbackToOldSystem(message, user);
            if (oldSystemResult.success) {
                return {
                    ...oldSystemResult,
                    response: `🔮 **OpenAI (via Old System)**\n\n${oldSystemResult.response}`,
                    bridge: 'openai-oldsystem-fallback',
                    fallback_reason: status.message,
                    timestamp: new Date().toISOString()
                };
            }
        } catch (oldError) {
            console.error('❌ Old system fallback failed:', oldError);
        }
        
        // ✅ FALLBACK 3: Test response final
        console.log('🔄 Duke përdorur test response fallback...');
        return {
            success: true,
            response: `🔮 **OpenAI Test Mode**\n\n"${message}"\n\n💡 *OpenAI service is being configured*\n\n**Status:** ${status.message}\n**Këshillë:** Kontrolloni OPENAI_API_KEY në .env file`,
            bridge: 'openai-test-fallback',
            fallback_reason: status.message,
            timestamp: new Date().toISOString()
        };
    }

    // ✅ METODË PËR TË PROCESUAR ÇDO LLOJ KOMANDE (UNIVERSAL)
    static async processUniversalCommand(commandType, message, user) {
        console.log(`🎯 Universal Command Bridge: ${commandType} - "${message.substring(0, 50)}..."`);
        
        switch (commandType) {
            case 'openai':
                return await this.processOpenAICommand(message, user);
                
            case 'chat':
                return await this.processCommandSafe(message, user);
                
            case 'status':
                return await this.checkOpenAIStatus();
                
            default:
                return {
                    success: false,
                    response: `❌ Lloj i panjohur komande: ${commandType}`,
                    bridge: 'universal-command-error'
                };
        }
    }
}

// 🆕 EKSPORTO METODAT SHTESË
module.exports = CommandBridge;
module.exports.checkOpenAIStatus = CommandBridge.checkOpenAIStatus;
module.exports.processOpenAICommand = CommandBridge.processOpenAICommand;
module.exports.processUniversalCommand = CommandBridge.processUniversalCommand;
