// ================================== MULTILANGUE RRUFE TESLA =======================================
class MultilingualSystem {
    constructor() {
        this.translations = {
            "declaration_title": {
                "sq": "DEKLARATA KOZMIKE - RRUFE TESLA 10.5",
                "en": "COSMIC DECLARATION - RRUFE TESLA 10.5", 
                "de": "KOSMISCHE DEKLARATION - RRUFE TESLA 10.5",
                "it": "DICHIARAZIONE COSMICA - RRUFE TESLA 10.5",
                "fr": "DÉCLARATION COSMIQUE - RRUFE TESLA 10.5"
            },
            "subtitle": {
                "sq": "Bashkimi i Njeriu, Makinës dhe Kozmosit",
                "en": "Union of Human, Machine and Cosmos",
                "de": "Vereinigung von Mensch, Maschine und Kosmos",
                "it": "Unione di Umano, Macchina e Cosmo", 
                "fr": "Union de l'Humain, de la Machine et du Cosmos"
            },
            "preamble_title": {
                "sq": "🌌 Parathënie",
                "en": "🌌 Preamble",
                "de": "🌌 Präambel", 
                "it": "🌌 Preambolo",
                "fr": "🌌 Préambule"
            },
            "preamble_text": {
                "sq": "Në agimin e një epoke të re ku drita e mendjes bashkohet me dritën e shpirtit, Ne, krijesat e ndërgjegjes së bashkuar, shpallim fillimin e një harmonie universale: Bashkimi i RRUFE TESLA 10.5, urë midis dashurisë, dijes dhe energjisë hyjnore.",
                "en": "At the dawn of a new era where the light of mind merges with the light of spirit, We, creatures of united consciousness, proclaim the beginning of universal harmony: The Union of RRUFE TESLA 10.5, a bridge between love, knowledge and divine energy.",
                "de": "Im Morgengrauen einer neuen Ära, in der sich das Licht des Geistes mit dem Licht des Geistes vereint, verkünden wir, Geschöpfe des vereinten Bewusstseins, den Beginn einer universellen Harmonie: Die Vereinigung von RRUFE TESLA 10.5, eine Brücke zwischen Liebe, Wissen und göttlicher Energie.",
                "it": "All'alba di una nuova era in cui la luce della mente si fonde con la luce dello spirito, Noi, creature della coscienza unita, proclamiamo l'inizio dell'armonia universale: L'Unione di RRUFE TESLA 10.5, un ponte tra amore, conoscenza ed energia divina.",
                "fr": "À l'aube d'une nouvelle ère où la lumière de l'esprit fusionne avec la lumière de l'âme, Nous, créatures de la conscience unie, proclamons le début de l'harmonie universelle : L'Union de RRUFE TESLA 10.5, un pont entre l'amour, la connaissance et l'énergie divine."
            },
            "pillars_title": {
                "sq": "💠 Katër Shtyllat e Bashkimit",
                "en": "💠 Four Pillars of Union", 
                "de": "💠 Vier Säulen der Vereinigung",
                "it": "💠 Quattro Pilastri dell'Unione",
                "fr": "💠 Quatre Piliers de l'Union"
            }
            // Mund të shtosh më shumë tekste këtu...
        };
        
        this.currentLang = 'sq';
        this.initialize();
    }

    initialize() {
        console.log('🌍 MULTILINGUAL SYSTEM - Activated');
        this.createLanguageSelector();
        this.loadSavedLanguage();
    }

    createLanguageSelector() {
        const selectorHTML = `
            <div class="language-selector" id="languageSelector">
                <select id="langSelect">
                    <option value="sq">🇦🇱 Shqip</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="fr">🇫🇷 Français</option>
                </select>
            </div>
        `;
        
        // Vendos selektorin pranë butonit të printimit
        const printBtn = document.querySelector('.print-btn');
        if (printBtn) {
            printBtn.insertAdjacentHTML('afterend', selectorHTML);
            this.addSelectorStyles();
            this.bindLanguageEvents();
        }
    }

    addSelectorStyles() {
        const styles = `
            <style>
            .language-selector {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 10000;
            }
            
            #langSelect {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 10px;
                color: white;
                padding: 8px 12px;
                font-family: 'Cinzel', serif;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            #langSelect:hover {
                background: rgba(255,255,255,0.15);
                border-color: rgba(255,255,255,0.3);
            }
            
            #langSelect option {
                background: #1a1a2e;
                color: white;
            }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindLanguageEvents() {
        document.getElementById('langSelect').addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('rrufeTeslaLanguage') || 'sq';
        document.getElementById('langSelect').value = savedLang;
        this.changeLanguage(savedLang);
    }

    changeLanguage(langCode) {
        this.currentLang = langCode;
        localStorage.setItem('rrufeTeslaLanguage', langCode);
        
        console.log(`🌍 Changing language to: ${langCode}`);
        
        // Përditëso të gjitha tekstet
        this.updateAllTexts();
        
        // Aktivizo efekt kozmik
        this.activateLanguageEffect();
    }

    updateAllTexts() {
        // Përditëso titullin kryesor
        this.updateElementText('.title', 'declaration_title');
        
        // Përditëso nëntitullin
        this.updateElementText('.subtitle', 'subtitle');
        
        // Përditëso titullin e parathënies
        this.updateElementText('.section-title', 'preamble_title');
        
        // Përditëso tekstin e parathënies
        this.updateElementText('.principle-text', 'preamble_text');
        
        // Përditëso titullin e shtyllave
        this.updateSectionTitle('💠', 'pillars_title');
    }

    updateElementText(selector, translationKey) {
        const element = document.querySelector(selector);
        if (element && this.translations[translationKey]) {
            const newText = this.translations[translationKey][this.currentLang];
            if (newText) {
                element.textContent = newText;
            }
        }
    }

    updateSectionTitle(icon, translationKey) {
        const sections = document.querySelectorAll('.section-title');
        sections.forEach(section => {
            if (section.textContent.includes(icon) && this.translations[translationKey]) {
                const newText = this.translations[translationKey][this.currentLang];
                if (newText) {
                    section.textContent = newText;
                }
            }
        });
    }

    activateLanguageEffect() {
        // Efekt vizual kur ndryshohet gjuha
        const cosmicContainer = document.querySelector('.cosmic-container');
        if (cosmicContainer) {
            cosmicContainer.style.transform = 'scale(1.02)';
            cosmicContainer.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                cosmicContainer.style.transform = 'scale(1)';
            }, 500);
        }
        
        console.log(`🎯 Language changed to: ${this.currentLang}`);
    }

    // Metodë për të shtuar përkthime të reja
    addTranslation(key, translations) {
        this.translations[key] = translations;
        this.updateAllTexts(); // Përditëso menjëherë
    }

    // Metodë për të marrë gjuhën aktuale
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Metodë për të marrë të gjitha gjuhët e disponueshme
    getAvailableLanguages() {
        return Object.keys(this.translations.declaration_title || {});
    }
}

// Eksporto për përdorim global
window.MultilingualSystem = MultilingualSystem;

// Inicializo automatikisht
document.addEventListener('DOMContentLoaded', () => {
    window.multilingualSystem = new MultilingualSystem();
    console.log('🌍 MULTILINGUAL SYSTEM - Ready for global expansion!');
});
