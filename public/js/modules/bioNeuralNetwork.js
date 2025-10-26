// ======================================================
// 🧬 BIO-NEURAL NETWORK MODULE - RRUFE-TESLA
// ======================================================

class BioNeuralNetwork {
    constructor(contextMemory) {
        this.contextMemory = contextMemory;
        this.neurons = new Map();
        this.synapses = new Map();
        this.neuralPathways = new Map();
        
        console.log('🧬 BIO-NEURAL NETWORK u inicializua!');
        this.initializeBaseNeurons();
    }

    initializeBaseNeurons() {
        // Neurona bazë për proceset kognitive
        const baseNeurons = {
            language_processing: {
                type: 'sensory',
                activation: 0.8,
                connections: ['semantic_understanding', 'emotional_processing']
            },
            semantic_understanding: {
                type: 'processing', 
                activation: 0.7,
                connections: ['context_integration', 'memory_recall']
            },
            emotional_processing: {
                type: 'emotional',
                activation: 0.6,
                connections: ['empathy_response', 'tone_adjustment']
            },
            memory_recall: {
                type: 'memory',
                activation: 0.75,
                connections: ['context_integration', 'pattern_recognition']
            },
            context_integration: {
                type: 'executive',
                activation: 0.9,
                connections: ['response_generation']
            }
        };

        Object.entries(baseNeurons).forEach(([neuronId, data]) => {
            this.neurons.set(neuronId, {
                id: neuronId,
                ...data,
                created: new Date(),
                lastActivated: new Date()
            });
        });

        console.log(`🧠 Inicializova ${this.neurons.size} neurona bazë`);
    }

    processMessageThroughNetwork(message) {
        const messageId = `msg_${Date.now()}`;
        
        // Aktivizo neurona sensoriale
        this.activateNeuron('language_processing', 0.8);
        this.activateNeuron('semantic_understanding', 0.7);
        
        // Proceso emocionet
        const emotionalTone = this.analyzeEmotionalTone(message);
        this.activateNeuron('emotional_processing', emotionalTone.intensity);
        
        // Kërko në memorie
        const memoryResults = this.contextMemory.searchInMemory(message);
        if (memoryResults.length > 0) {
            this.activateNeuron('memory_recall', 0.8);
        }
        
        // Integro kontekstin
        this.activateNeuron('context_integration', 0.9);
        
        // Krijo pathway të ri neural
        const pathwayId = this.createNeuralPathway([
            'language_processing',
            'semantic_understanding', 
            'emotional_processing',
            'context_integration'
        ], messageId);
        
        console.log(`🧠 Procesova mesazhin përmes rrjetit nervor: ${message.substring(0, 50)}`);
        return {
            pathwayId,
            emotionalTone,
            memoryActivation: memoryResults.length
        };
    }

    analyzeEmotionalTone(message) {
        const emotionalKeywords = {
            positive: ['faleminderit', 'bukur', 'mrekullueshëm', 'sukses', 'gezuar', 'lumtur'],
            negative: ['problem', ' Gabim', 'mërzitur', 'urgjent', 'nuk funksionon', 'help'],
            curious: ['si', 'ku', 'kur', 'pse', 'a mund', 'mundesh', 'ndihmo'],
            excited: ['wow', 'o zot', 'mahnitës', 'fantastike', 'extraordinary']
        };

        let dominantTone = 'neutral';
        let maxIntensity = 0;

        Object.entries(emotionalKeywords).forEach(([tone, keywords]) => {
            const intensity = keywords.filter(keyword => 
                message.toLowerCase().includes(keyword)
            ).length / Math.max(1, keywords.length);
            
            if (intensity > maxIntensity) {
                maxIntensity = intensity;
                dominantTone = tone;
            }
        });

        return {
            tone: dominantTone,
            intensity: Math.min(maxIntensity * 2, 1.0), // Normalizo
            confidence: maxIntensity
        };
    }

    activateNeuron(neuronId, activationLevel) {
        const neuron = this.neurons.get(neuronId);
        if (!neuron) return;

        // Përditëso aktivizimin
        neuron.activation = Math.min(1.0, (neuron.activation + activationLevel) / 2);
        neuron.lastActivated = new Date();

        // Propagoj aktivizimin te neuronat e lidhur
        neuron.connections.forEach(connectedNeuronId => {
            const connectedNeuron = this.neurons.get(connectedNeuronId);
            if (connectedNeuron) {
                const propagatedActivation = activationLevel * 0.3; // Zvogëlohet
                this.activateNeuron(connectedNeuronId, propagatedActivation);
            }
        });

        this.neurons.set(neuronId, neuron);
    }

    createNeuralPathway(neuronSequence, messageId) {
        const pathwayId = `pathway_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        
        const pathway = {
            id: pathwayId,
            neurons: neuronSequence,
            messageId: messageId,
            strength: 0.7,
            created: new Date(),
            activatedCount: 1
        };
        
        this.neuralPathways.set(pathwayId, pathway);
        
        // Krijo sinapsa midis neuroneve
        for (let i = 0; i < neuronSequence.length - 1; i++) {
            this.createSynapse(neuronSequence[i], neuronSequence[i + 1], pathwayId);
        }
        
        return pathwayId;
    }

    createSynapse(sourceNeuron, targetNeuron, pathwayId) {
        const synapseId = `synapse_${sourceNeuron}_${targetNeuron}`;
        
        const synapse = {
            id: synapseId,
            source: sourceNeuron,
            target: targetNeuron,
            pathway: pathwayId,
            strength: 0.5,
            created: new Date(),
            activatedCount: 0
        };
        
        this.synapses.set(synapseId, synapse);
        return synapseId;
    }

    debugNeuralNetwork() {
        console.log('🧠 DEBUG BIO-NEURAL NETWORK:');
        console.log(`- Neurons: ${this.neurons.size}`);
        console.log(`- Synapses: ${this.synapses.size}`);
        console.log(`- Neural Pathways: ${this.neuralPathways.size}`);
        
        // Shfaq disa neurona të aktivizuar
        console.log('⚡ Neurona më të aktivizuar:');
        Array.from(this.neurons.values())
            .sort((a, b) => b.activation - a.activation)
            .slice(0, 3)
            .forEach(neuron => {
                console.log(`   ${neuron.id}: ${neuron.activation.toFixed(2)}`);
            });
    }

    // 🚀 METODA E RE: Neural Learning
    reinforceSuccessfulPathway(pathwayId) {
        const pathway = this.neuralPathways.get(pathwayId);
        if (pathway) {
            pathway.strength = Math.min(1.0, pathway.strength + 0.1);
            pathway.activatedCount++;
            this.neuralPathways.set(pathwayId, pathway);
            
            // Forco sinapsat përkatëse
            for (let i = 0; i < pathway.neurons.length - 1; i++) {
                const synapseId = `synapse_${pathway.neurons[i]}_${pathway.neurons[i + 1]}`;
                const synapse = this.synapses.get(synapseId);
                if (synapse) {
                    synapse.strength = Math.min(1.0, synapse.strength + 0.05);
                    synapse.activatedCount++;
                    this.synapses.set(synapseId, synapse);
                }
            }
        }
    }
}
