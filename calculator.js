// =============================================
// AVIATOR CALCULATOR - JavaScript Version
// =============================================

class AviatorCalculator {
    constructor() {
        this.version = "2.0.0";
    }
    
    /**
     * Mamokatra crash point marina (exponential distribution)
     * @returns {number} Crash point (1.00 - 100.00)
     */
    generateCrashPoint() {
        try {
            // Exponential distribution simulation
            const e = -Math.log(1 - Math.random());
            let crash = 1 / (1 - e);
            
            // Limiter mba tsy hihoatra 100
            if (e > 0.99) crash = 100.0;
            if (crash > 100.0) crash = 100.0;
            
            return Math.round(crash * 100) / 100;
        } catch (error) {
            // Raha misy error, miverina amin'ny default
            return Math.round((Math.random() * 9 + 1) * 100) / 100;
        }
    }
    
    /**
     * Manisa ny mety hisian'ny crash amin'ny multiplier iray
     * @param {number} multiplier - Ny multiplier (ohatra: 2.0)
     * @returns {number} Probability en % (0-100)
     */
    calculateProbability(multiplier) {
        if (multiplier <= 1.0) return 100.0;
        if (multiplier > 100.0) return 1.0;
        
        const prob = (1 / multiplier) * 100;
        return Math.round(prob * 100) / 100;
    }
    
    /**
     * Manome confidence score (tsy mihoatra 80%)
     * @param {number[]} recentResults - Lisitry ny vokatra teo aloha
     * @returns {number} Confidence score (20-80)
     */
    calculateConfidence(recentResults) {
        if (!recentResults || recentResults.length < 3) {
            return 30;
        }
        
        try {
            // Volatility calculation (standard deviation)
            const avg = recentResults.reduce((a, b) => a + b, 0) / recentResults.length;
            const variance = recentResults.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / recentResults.length;
            const volatility = Math.sqrt(variance);
            
            // Confidence based on volatility
            let confidence;
            if (volatility < 0.5) confidence = 65;
            else if (volatility < 1.0) confidence = 55;
            else if (volatility < 2.0) confidence = 45;
            else confidence = 35;
            
            // Adjust based on data size
            if (recentResults.length > 20) confidence += 5;
            else if (recentResults.length < 10) confidence -= 5;
            
            // Between 20 and 80
            return Math.min(Math.max(confidence, 20), 80);
        } catch (error) {
            return 40;
        }
    }
    
    /**
     * Martingale strategy calculator
     * @param {number} initialBet - Vola voalohany (€)
     * @param {number} target - Target multiplier
     * @param {number} maxSteps - Isan'ny dingana (default: 5)
     * @returns {Object[]} Martingale steps
     */
    martingaleStrategy(initialBet, target, maxSteps = 5) {
        const results = [];
        let totalRisk = 0;
        
        for (let step = 0; step < maxSteps; step++) {
            const bet = initialBet * Math.pow(2, step);
            totalRisk += bet;
            
            const win = bet * target;
            const loseProb = Math.pow(1 - 1/target, step + 1);
            
            results.push({
                step: step + 1,
                bet: Math.round(bet * 100) / 100,
                totalRisk: Math.round(totalRisk * 100) / 100,
                potentialWin: Math.round(win * 100) / 100,
                profit: Math.round((win - totalRisk + bet) * 100) / 100,
                loseProbability: Math.round(loseProb * 10000) / 100
            });
        }
        
        return results;
    }
    
    /**
     * Expected Value calculation
     * @param {number} bet - Vola apetraka
     * @param {number} cashOut - Cash out multiplier
     * @returns {number} Expected Value
     */
    expectedValue(bet, cashOut) {
        const probWin = 1 / cashOut;
        const probLose = 1 - probWin;
        
        const ev = (bet * (cashOut - 1) * probWin) - (bet * probLose);
        return Math.round(ev * 100) / 100;
    }
    
    /**
     * Mamokatra vokatra maromaro (simulation)
     * @param {number} count - Isan'ny vokatra
     * @returns {number[]} Lisitry ny crash points
     */
    simulateRounds(count = 100) {
        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(this.generateCrashPoint());
        }
        return results;
    }
    
    /**
     * Statistics
     * @param {number[]} data - Lisitry ny vokatra
     * @returns {Object} Statistiques
     */
    calculateStats(data) {
        if (!data || data.length === 0) {
            return { error: "Tsy misy data" };
        }
        
        const sum = data.reduce((a, b) => a + b, 0);
        const avg = sum / data.length;
        
        // Sort for median and percentiles
        const sorted = [...data].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        
        // Minimum and maximum
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        
        // Variance and standard deviation
        const variance = data.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / data.length;
        const stdDev = Math.sqrt(variance);
        
        // Percentiles
        const p25 = sorted[Math.floor(sorted.length * 0.25)];
        const p75 = sorted[Math.floor(sorted.length * 0.75)];
        
        // Frequency analysis
        const under2x = data.filter(x => x < 2).length / data.length * 100;
        const over5x = data.filter(x => x > 5).length / data.length * 100;
        const over10x = data.filter(x => x > 10).length / data.length * 100;
        
        return {
            count: data.length,
            average: Math.round(avg * 100) / 100,
            median: Math.round(median * 100) / 100,
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            stdDev: Math.round(stdDev * 100) / 100,
            p25: Math.round(p25 * 100) / 100,
            p75: Math.round(p75 * 100) / 100,
            under2x: Math.round(under2x * 100) / 100,
            over5x: Math.round(over5x * 100) / 100,
            over10x: Math.round(over10x * 100) / 100
        };
    }
}

// Export ho an'ny modules (raha Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AviatorCalculator;
}
