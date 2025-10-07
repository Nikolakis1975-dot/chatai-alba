// ==================== ✅ GOOGLE SEARCH SERVICE - 07.10.2024 ====================
// 📝 DESKRIMI: Shërbim për kërkim në internet përmes Google Custom Search API
// 🎯 QËLLIMI: Kërkim i thelluar në web me rezultate nga Google
// 📥 INPUT: query string për kërkim
// 📤 OUTPUT: Rezultate të strukturuara nga interneti
// 🔧 AUTORI: ChatAI ALBA Team
// ==============================================================================

const axios = require('axios');

class GoogleSearchService {
    
    // ✅ KRYERJA E KËRKIMIT GOOGLE
    async performGoogleSearch(query) {
        try {
            console.log(`🔍 Google Search për: "${query}"`);
            
            const googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
            const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
            
            // ✅ KONTROLLO KONFIGURIMIN
            if (!googleApiKey || !searchEngineId || 
                googleApiKey === 'your_google_search_api_key_here' ||
                searchEngineId === 'your_search_engine_id_here') {
                
                return await this.getSimulatedGoogleResults(query);
            }
            
            // ✅ KËRKIM REAL ME GOOGLE API
            const response = await axios.get(
                'https://www.googleapis.com/customsearch/v1',
                {
                    params: {
                        key: googleApiKey,
                        cx: searchEngineId,
                        q: query,
                        num: 5, // 5 rezultate
                        lr: 'lang_sq', // Gjuhë shqipe
                        dateRestrict: 'm[1]' // 1 muaj i fundit
                    },
                    timeout: 15000
                }
            );
            
            const searchResults = response.data.items || [];
            
            if (searchResults.length === 0) {
                return {
                    success: true,
                    response: await this.formatNoResults(query),
                    source: 'Google Search'
                };
            }
            
            // ✅ FORMATO REZULTATET
            const formattedResults = await this.formatGoogleResults(searchResults, query);
            
            return {
                success: true,
                response: formattedResults,
                source: 'Google Search',
                resultsCount: searchResults.length
            };
            
        } catch (error) {
            console.error('❌ Gabim në Google Search:', error.message);
            return await this.getSimulatedGoogleResults(query);
        }
    }
    
    // ✅ FORMATIM I REZULTATEVE GOOGLE
    async formatGoogleResults(results, originalQuery) {
        let formatted = `🔍 **REZULTATET E GOOGLE PËR:** "${originalQuery}"\n\n`;
        
        results.forEach((item, index) => {
            formatted += `**${index + 1}. ${item.title}**\n`;
            formatted += `📝 ${item.snippet || 'Nuk ka përshkrim'}\n`;
            formatted += `🔗 ${item.link}\n`;
            
            // ✅ Shto informacion shtesë nëse ekziston
            if (item.pagemap?.metatags?.[0]?.['og:site_name']) {
                formatted += `🏷️ Faqja: ${item.pagemap.metatags[0]['og:site_name']}\n`;
            }
            
            formatted += `---\n\n`;
        });
        
        formatted += `💡 *Gjetur ${results.length} rezultate nga Google Search*\n`;
        formatted += `🌐 *Kërko direkt: https://www.google.com/search?q=${encodeURIComponent(originalQuery)}*`;
        
        return formatted;
    }
    
    // ✅ REZULTATE SIMULUESE (FALLBACK)
    async getSimulatedGoogleResults(query) {
        const simulatedResults = [
            {
                title: `Informacione për "${query}"`,
                snippet: `Rezultate të plota për '${query}' do të ishin të disponueshme me Google Custom Search API. Kjo kërkon konfigurim të Google Search API key.`,
                link: 'https://developers.google.com/custom-search'
            },
            {
                title: `Si të konfigurohet Google Search API`,
                snippet: `Për të përdorur kërkimin e vërtetë të Google, duhet të krijoni një Custom Search Engine dhe të merrni API Key nga Google Cloud Console.`,
                link: 'https://developers.google.com/custom-search/v1/introduction'
            }
        ];
        
        let formatted = `🔍 **REZULTATET E GOOGLE PËR:** "${query}"\n\n`;
        formatted += `*💡 Google Search API nuk është konfigruar ende*\n\n`;
        
        simulatedResults.forEach((item, index) => {
            formatted += `**${index + 1}. ${item.title}**\n`;
            formatted += `📝 ${item.snippet}\n`;
            formatted += `🔗 ${item.link}\n`;
            formatted += `---\n\n`;
        });
        
        formatted += `🔧 **Për të konfiguruar:**\n`;
        formatted += `1. Shko në Google Cloud Console\n`;
        formatted += `2. Aktivizo Custom Search API\n`;
        formatted += `3. Krijo Search Engine\n`;
        formatted += `4. Vendos API Key në DigitalOcean\n`;
        
        return {
            success: true,
            response: formatted,
            source: 'Google Search (Simulated)',
            message: 'Konfiguro Google Search API për rezultate reale'
        };
    }
    
    // ✅ FORMATIM KUR NUK KA REZULTATE
    async formatNoResults(query) {
        return `🔍 **KËRKIM GOOGLE PËR:** "${query}"\n\n` +
               `❌ Nuk u gjetën rezultate për kërkimin tuaj.\n\n` +
               `💡 **Këshilla:**\n` +
               `• Provoni terma më të thjeshtë\n` +
               `• Kontrolloni shkrimin\n` +
               `• Përdorni fjalë kyçe më specifike\n\n` +
               `🌐 [Kërkoni direkt në Google](https://www.google.com/search?q=${encodeURIComponent(query)})`;
    }
    
    // ✅ KËRKIM I SPECIALIZUAR PËR LAJME
    async searchNews(query) {
        try {
            const googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
            const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
            
            if (!googleApiKey || !searchEngineId) {
                return await this.getSimulatedGoogleResults(query);
            }
            
            const response = await axios.get(
                'https://www.googleapis.com/customsearch/v1',
                {
                    params: {
                        key: googleApiKey,
                        cx: searchEngineId,
                        q: `${query} lajme 2024`,
                        num: 5,
                        lr: 'lang_sq',
                        sort: 'date', // Rendit sipas datave
                        dateRestrict: 'w[1]' // 1 javë e fundit
                    },
                    timeout: 15000
                }
            );
            
            const newsResults = response.data.items || [];
            return await this.formatNewsResults(newsResults, query);
            
        } catch (error) {
            console.error('❌ Gabim në Google News search:', error);
            return await this.getSimulatedGoogleResults(query);
        }
    }
    
    // ✅ FORMATIM I REZULTATEVE TË LAJMEVE
    async formatNewsResults(results, query) {
        let formatted = `📰 **LAJME TË FUNDIT PËR:** "${query}"\n\n`;
        
        if (results.length === 0) {
            formatted += `❌ Nuk u gjetën lajme të freskëta për këtë temë.\n`;
            return formatted;
        }
        
        results.forEach((item, index) => {
            formatted += `**${index + 1}. ${item.title}**\n`;
            
            // ✅ Ekstrakto datën nëse është e disponueshme
            const dateInfo = this.extractDateInfo(item);
            if (dateInfo) {
                formatted += `📅 ${dateInfo}\n`;
            }
            
            formatted += `📝 ${item.snippet || 'Nuk ka përshkrim'}\n`;
            formatted += `🔗 ${item.link}\n`;
            formatted += `---\n\n`;
        });
        
        formatted += `📊 *Gjetur ${results.length} lajme të fundit*`;
        return formatted;
    }
    
    // ✅ EKSTRAKTIM I INFORMACIONIT TË DATËS
    extractDateInfo(searchItem) {
        try {
            // Provojmë të ekstraktojmë datën nga metatags
            const metatags = searchItem.pagemap?.metatags?.[0];
            if (metatags) {
                return metatags['article:published_time'] || 
                       metatags['og:article:published_time'] ||
                       metatags['date'] ||
                       null;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}

module.exports = new GoogleSearchService();
