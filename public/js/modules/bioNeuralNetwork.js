// ======================= BIO-NEURAL NETWORK =======================
// 🧬 MODULI: BioNeuralNetwork - Rrjet Biologjik Nervor
// 📍 /public/js/modules/bioNeuralNetwork.js
// ===============================================================

console.log('🧬 BIO-NEURAL NETWORK u ngarkua!');

class BioNeuralNetwork {
    constructor(contextMemory) {
        this.contextMemory = contextMemory;
        this.neurons = new Map();
        this.synapses = new Map();
        this.neuralActivity = 0.7;
        
        console.log('🧠 BioNeuralNetwork u inicializua!');
        
        // Krijo neuronet fillestare
        this.initializeBaseNeurons();
    }

    // ✅ INICIALIZO NEURONET BAZË
    initializeBaseNeurons() {
        const baseNeurons = [
            { id: 'neuron_greeting', type: 'input', keywords: ['përshëndetje', 'si', 'jeni'] },
            { id: 'neuron_question', type: 'input', keywords: ['si', 'ku', 'kur', 'pse', 'kush'] },
            { id: 'neuron_location', type: 'concept', keywords: ['tiranë', 'shqipëri', 'qytet', 'vend'] },
            { id: 'neuron_weather', type: 'concept', keywords: ['mot', 'temperaturë', 'shi', 'diell'] }
        ];

        baseNeurons.forEach(neuronConfig => {
            this.createNeuron(neuronConfig.id, neuronConfig.type, neuronConfig.keywords);
        });

        console.log('🔄 Inicializuam', baseNeurons.length, 'neurone bazë');
    }

    // ✅ KRIJO NEURON
    createNeuron(neuronId, neuronType = 'pyramidal', keywords = []) {
        const neuron = {
            id: neuronId,
            type: neuronType,
            membranePotential: -70, // mV
            threshold: -55, // mV
            fired: false,
            lastFired: null,
            keywords: keywords,
            connections: new Set()
        };

        this.neurons.set(neuronId, neuron);
        console.log('🧠 Krijuam neuron:', neuronId, 'Tipi:', neuronType);
        return neuron;
    }

    // ✅ KRIJO SINAPSË
    createSynapse(preNeuronId, postNeuronId, weight = 0.5) {
        const synapseId = `synapse_${preNeuronId}_${postNeuronId}`;
        
        this.synapses.set(synapseId, {
            preNeuron: preNeuronId,
            postNeuron: postNeuronId,
            weight: weight,
            strength: this.calculateSynapticStrength(preNeuronId, postNeuronId),
            lastActivated: null
        });

        // Lidh neuronet
        this.neurons.get(preNeuronId)?.connections.add(postNeuronId);
        this.neurons.get(postNeuronId)?.connections.add(preNeuronId);

        console.log('🔄 Krijuam sinapsë:', synapseId);
        return synapseId;
    }

    // ✅ LLOGARIT FORCË SINAPSE
    calculateSynapticStrength(neuronA, neuronB) {
        const neuron1 = this.neurons.get(neuronA);
        const neuron2 = this.neurons.get(neuronB);
        
        if (!neuron1 || !neuron2) return 0;

        const sharedKeywords = neuron1.keywords.filter(keyword => 
            neuron2.keywords.includes(keyword)
        );
        
        return sharedKeywords.length / Math.max(neuron1.keywords.length, neuron2.keywords.length);
    }

    // ✅ SIMULO GJUAJTJE NEURONI
    stimulateNeuron(neuronId, inputStrength) {
        const neuron = this.neurons.get(neuronId);
        if (!neuron) return false;

        // Rrit potencialin e membranës
        neuron.membranePotential += inputStrength;

        // Kontrollo nëse neuroni gjuaj
        if (neuron.membranePotential >= neuron.threshold) {
            neuron.fired = true;
            neuron.lastFired = new Date();
            neuron.membranePotential = -70; // Reset
            
            console.log('⚡ Neuroni u aktivizua:', neuronId);
            
            // Aktivizo neuronët e lidhur
            this.activateConnectedNeurons(neuronId);
            return true;
        }

        return false;
    }

    // ✅ AKTIVIZO NEURONËT E LIDHUR
    activateConnectedNeurons(sourceNeuronId) {
        const sourceNeuron = this.neurons.get(sourceNeuronId);
        if (!sourceNeuron) return;

        sourceNeuron.connections.forEach(targetNeuronId => {
            const synapseId = `synapse_${sourceNeuronId}_${targetNeuronId}`;
            const synapse = this.synapses.get(synapseId);
            
            if (synapse) {
                // Aktivizo neuronin e synuar me forcë të sinapsës
                this.stimulateNeuron(targetNeuronId, synapse.strength * 10);
                
                // Forco sinapsën (neuroplasticitet)
                synapse.strength += 0.05;
                synapse.lastActivated = new Date();
            }
        });
    }

    // ✅ PROÇESO MESAZH NËPËR RRJET
    processMessageThroughNetwork(message) {
        const keywords = this.contextMemory.extractKeywords(message);
        
        console.log('🔄 Duke procesuar mesazh nëpër rrjet:', message.substring(0, 30));
        
        // Gjuaj neuronet e input-it bazuar në fjalët kyçe
        keywords.forEach(keyword => {
            this.neurons.forEach((neuron, neuronId) => {
                if (neuron.keywords.includes(keyword)) {
                    this.stimulateNeuron(neuronId, 15); // Stimul i fortë
                }
            });
        });

        // Kthe neuronët më aktivë
        const activeNeurons = Array.from(this.neurons.values())
            .filter(neuron => neuron.fired)
            .sort((a, b) => b.membranePotential - a.membranePotential)
            .slice(0, 3);

        return activeNeurons;
    }

    // ✅ DEBUG BIO-NEURAL NETWORK
    debugNeuralNetwork() {
        console.log('🔍 DEBUG BIO-NEURAL NETWORK:');
        console.log('- Neuronet total:', this.neurons.size);
        console.log('- Sinapsa total:', this.synapses.size);
        console.log('- Aktivitet nervor:', this.neuralActivity);
        
        // Shfaq neuronët më aktivë
        const activeNeurons = Array.from(this.neurons.values())
            .filter(neuron => neuron.fired)
            .slice(0, 5);
        
        console.log('- Neuronët aktivë:', activeNeurons.length);
        activeNeurons.forEach((neuron, index) => {
            console.log(`  ${index + 1}. ${neuron.id} - Potencial: ${neuron.membranePotential}`);
        });
    }
}

// Eksporto për përdorim global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BioNeuralNetwork;
} else {
    window.BioNeuralNetwork = BioNeuralNetwork;
}
