// ======================= RRUFE-BIO-NEURAL-001 =======================
// 📍 Krijo: /public/js/modules/bioNeuralNetwork.js
// 🎯 Eksperiment: Emulim i Rrjetit Nervor Biologjik
// ================================================================

class BioNeuralNetwork {
    constructor() {
        this.neurons = new Map();
        this.dendrites = new Map();
        this.axons = new Map();
        this.neurotransmitters = new Map();
        this.synapticWeights = new Map();
        this.neuralActivity = 0.7;
    }

    // ✅ CREATE BIOLOGICAL NEURON
    createNeuron(neuronId, neuronType = 'pyramidal') {
        const neuron = {
            id: neuronId,
            type: neuronType,
            membranePotential: -70, // mV
            threshold: -55, // mV
            fired: false,
            lastFired: null,
            connections: new Set(),
            neurotransmitters: new Map()
        };

        this.neurons.set(neuronId, neuron);
        console.log('🧠 NEURON I KRIJUAR:', neuronId, 'Tipi:', neuronType);
        return neuron;
    }

    // ✅ CREATE SYNAPSE CONNECTION
    createSynapse(preNeuronId, postNeuronId, weight = 0.5) {
        const synapseId = `synapse_${preNeuronId}_${postNeuronId}`;
        
        this.dendrites.set(synapseId, {
            preNeuron: preNeuronId,
            postNeuron: postNeuronId,
            weight: weight,
            strength: this.calculateSynapticStrength(preNeuronId, postNeuronId),
            neurotransmitters: this.generateNeurotransmitters()
        });

        // Shto lidhjen te neuronët
        this.neurons.get(preNeuronId)?.connections.add(postNeuronId);
        this.neurons.get(postNeuronId)?.connections.add(preNeuronId);

        console.log('🔄 SINAPSË E KRIJUAR:', synapseId);
        return synapseId;
    }

    // ✅ NEURON FIRING SIMULATION
    simulateNeuronFiring(neuronId, inputStrength) {
        const neuron = this.neurons.get(neuronId);
        if (!neuron) return false;

        // Rrit potencialin e membranës
        neuron.membranePotential += inputStrength;

        // Kontrollo nëse neuroni gjuaj
        if (neuron.membranePotential >= neuron.threshold) {
            neuron.fired = true;
            neuron.lastFired = new Date();
            neuron.membranePotential = -70; // Reset
            
            // Aktivizo neuronët e lidhur
            this.activateConnectedNeurons(neuronId);
            
            console.log('⚡ NEURONI U AKTIVIZUA:', neuronId);
            return true;
        }

        return false;
    }

    // ✅ NEUROTRANSMITTER GENERATION
    generateNeurotransmitters() {
        const neurotransmitters = {
            'glutamate': { type: 'excitatory', strength: 0.8 },
            'gaba': { type: 'inhibitory', strength: -0.6 },
            'dopamine': { type: 'modulatory', strength: 0.9 },
            'serotonin': { type: 'modulatory', strength: 0.7 }
        };

        return neurotransmitters;
    }
}
