/**
 * SemanticField - 語義的引力場と連語感覚の計算エンジン
 * 視覚的連結と語義的連結の干渉パターンを生成
 */
class SemanticField {
    constructor() {
        this.semanticGraph = new Map();
        this.collocationMatrix = new Map();
        this.readingHistory = [];
        this.contextualLayers = {
            temporal: new Map(),    // 時間的文脈
            cultural: new Map(),    // 文化的文脈  
            personal: new Map()     // 個人的文脈
        };
        
        // 認知科学に基づくパラメータ
        this.cognitiveParams = {
            attentionSpan: 7,          // 注意範囲（ミラーの7±2）
            semanticRadius: 120,       // 語義的影響半径
            collocationStrength: 0.8,  // 連語の結合強度
            interferenceThreshold: 0.3, // 干渉発生閾値
            memoryDecay: 0.95          // 記憶減衰率
        };
    }

    /**
     * テキストの語義構造を解析し、引力場を構築
     */
    analyzeSemanticStructure(text) {
        const words = this.tokenize(text);
        const semanticVectors = this.computeSemanticVectors(words);
        
        // 語義的類似度行列の構築
        for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j < words.length; j++) {
                const similarity = this.calculateSemanticSimilarity(
                    semanticVectors[i], 
                    semanticVectors[j]
                );
                
                if (similarity > 0.3) {
                    this.addSemanticConnection(words[i], words[j], similarity);
                }
            }
        }
        
        // 連語パターンの検出
        this.detectCollocationPatterns(words);
        
        return this.semanticGraph;
    }

    /**
     * 語義的引力/斥力の計算
     */
    calculateSemanticForce(sourceNode, targetNode, spatialDistance) {
        if (!sourceNode || !targetNode || !sourceNode.char || !targetNode.char) {
            return { attraction: 0, repulsion: 0, lateral: 0 };
        }
        
        const word1 = sourceNode.char;
        const word2 = targetNode.char;
        
        // 語義的距離の計算
        const semanticDistance = this.getSemanticDistance(word1, word2);
        const collocationStrength = this.getCollocationStrength(word1, word2);
        
        // 視覚-語義干渉パターンの生成
        const interferencePattern = this.generateInterferencePattern(
            spatialDistance, 
            semanticDistance, 
            collocationStrength
        );
        
        // 引力場の方向と強度
        const forceVector = {
            attraction: interferencePattern.attraction || 0,
            repulsion: interferencePattern.repulsion || 0,
            lateral: interferencePattern.lateral || 0
        };
        
        return forceVector;
    }

    /**
     * 連語感覚の図形化アルゴリズム
     */
    visualizeCollocationSensation(node, nearbyNodes) {
        const collocationField = [];
        
        for (const nearby of nearbyNodes) {
            const collocationValue = this.getCollocationStrength(node.char, nearby.char);
            
            if (collocationValue > 0.5) {
                // 連語関係を視覚的に表現する「感覚フィールド」
                const sensationField = this.generateSensationField(
                    node.position,
                    nearby.position,
                    collocationValue
                );
                
                collocationField.push({
                    type: 'collocation_field',
                    intensity: collocationValue,
                    geometry: sensationField,
                    resonance: this.calculateResonancePattern(node, nearby)
                });
            }
        }
        
        return collocationField;
    }

    /**
     * 読む身体のシミュレーション
     */
    simulateReadingBody(currentNode, textNodes) {
        if (!currentNode || !currentNode.position || !currentNode.char) {
            return { dx: 0, dy: 0 };
        }
        
        const readingState = {
            eyePosition: currentNode.position,
            attentionFocus: this.calculateAttentionFocus(currentNode, textNodes || []),
            cognitiveLoad: this.calculateCognitiveLoad(currentNode),
            temporalContext: this.getTemporalContext(currentNode),
            bodyMemory: this.accessBodyMemory(currentNode.char)
        };
        
        // 身体記憶による成長方向の修正
        const embodiedDirection = this.calculateEmbodiedDirection(readingState);
        
        // 読書体験の履歴に追加
        this.readingHistory.push({
            timestamp: Date.now(),
            node: currentNode.id,
            readingState: readingState,
            context: this.captureCurrentContext()
        });
        
        return embodiedDirection;
    }

    /**
     * 自己リフレクティブな読解パターンの生成
     */
    generateSelfReflectivePattern(nodes, connections) {
        // システム自身の読解プロセスを分析
        const readingMetrics = this.analyzeReadingMetrics();
        const patternRecognition = this.recognizeEmergentPatterns(nodes, connections);
        
        // 「読むとは何か」の自己言及的表現
        const reflexiveElements = {
            // 読解プロセスの可視化
            readingTrace: this.visualizeReadingTrace(),
            
            // 意味創発の瞬間を捉える
            emergentMoments: this.captureEmergentMoments(patternRecognition),
            
            // 言語と認知の界面
            languageCognitionInterface: this.mapLanguageCognitionInterface(),
            
            // 時間性の折り畳み
            temporalFolding: this.generateTemporalFolding()
        };
        
        return reflexiveElements;
    }

    // === 内部メソッド群 ===

    tokenize(text) {
        // 高度な形態素解析（日本語対応）
        return text.split(/[\s、。！？]+/).filter(word => word.length > 0);
    }

    computeSemanticVectors(words) {
        // 分散表現ベースの語義ベクトル計算
        return words.map(word => this.getWordEmbedding(word));
    }

    calculateSemanticSimilarity(vector1, vector2) {
        // コサイン類似度計算
        if (!vector1 || !vector2) return 0;
        
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;
        
        for (let i = 0; i < Math.min(vector1.length, vector2.length); i++) {
            dotProduct += vector1[i] * vector2[i];
            norm1 += vector1[i] * vector1[i];
            norm2 += vector2[i] * vector2[i];
        }
        
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    getWordEmbedding(word) {
        // 簡化されたワード埋め込み（实際には事前学習モデルを使用）
        const hash = this.simpleHash(word);
        const vector = [];
        for (let i = 0; i < 50; i++) {
            vector.push(Math.sin(hash * (i + 1)) * Math.cos(hash * (i + 2)));
        }
        return vector;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    addSemanticConnection(word1, word2, strength) {
        if (!this.semanticGraph.has(word1)) {
            this.semanticGraph.set(word1, new Map());
        }
        this.semanticGraph.get(word1).set(word2, strength);
    }

    getSemanticDistance(word1, word2) {
        const connections = this.semanticGraph.get(word1);
        if (connections && connections.has(word2)) {
            return 1 - connections.get(word2); // 類似度を距離に変換
        }
        return 1; // デフォルト距離
    }

    getCollocationStrength(word1, word2) {
        const key = `${word1}_${word2}`;
        return this.collocationMatrix.get(key) || 0;
    }

    detectCollocationPatterns(words) {
        // n-gramベースの連語検出
        for (let i = 0; i < words.length - 1; i++) {
            const bigram = `${words[i]}_${words[i + 1]}`;
            const currentStrength = this.collocationMatrix.get(bigram) || 0;
            this.collocationMatrix.set(bigram, currentStrength + 0.1);
        }
    }

    generateInterferencePattern(spatialDist, semanticDist, collocationStrength) {
        // 视觉-语義干涉模式的核心算法
        const interferenceRatio = spatialDist / semanticDist;
        
        return {
            attraction: Math.max(0, collocationStrength - interferenceRatio * 0.3),
            repulsion: Math.max(0, (interferenceRatio - 1) * 0.5),
            lateral: Math.sin(interferenceRatio * Math.PI) * 0.2
        };
    }

    generateSensationField(pos1, pos2, intensity) {
        // 連語感覚を表現する幾何学的フィールド
        const midpoint = {
            x: (pos1.x + pos2.x) / 2,
            y: (pos1.y + pos2.y) / 2
        };
        
        const fieldRadius = intensity * 30;
        const points = [];
        
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
            const r = fieldRadius * (0.8 + 0.2 * Math.sin(angle * 3));
            points.push({
                x: midpoint.x + Math.cos(angle) * r,
                y: midpoint.y + Math.sin(angle) * r
            });
        }
        
        return points;
    }

    calculateResonancePattern(node1, node2) {
        // 共鳴パターンの計算
        const frequency1 = this.getWordFrequency(node1.char);
        const frequency2 = this.getWordFrequency(node2.char);
        
        return {
            frequency: Math.abs(frequency1 - frequency2),
            amplitude: Math.min(frequency1, frequency2),
            phase: (frequency1 + frequency2) % (Math.PI * 2)
        };
    }

    getWordFrequency(word) {
        // 語の使用頻度に基づく振動数
        return this.simpleHash(word) % 100 / 100;
    }

    calculateAttentionFocus(currentNode, allNodes) {
        // 注意焦点の計算
        const focusNodes = allNodes
            .filter(node => {
                const dist = Math.sqrt(
                    Math.pow(node.position.x - currentNode.position.x, 2) +
                    Math.pow(node.position.y - currentNode.position.y, 2)
                );
                return dist < this.cognitiveParams.semanticRadius;
            })
            .sort((a, b) => {
                const distA = Math.sqrt(
                    Math.pow(a.position.x - currentNode.position.x, 2) +
                    Math.pow(a.position.y - currentNode.position.y, 2)
                );
                const distB = Math.sqrt(
                    Math.pow(b.position.x - currentNode.position.x, 2) +
                    Math.pow(b.position.y - currentNode.position.y, 2)
                );
                return distA - distB;
            })
            .slice(0, this.cognitiveParams.attentionSpan);
            
        return focusNodes;
    }

    calculateCognitiveLoad(node) {
        // 認知負荷の計算
        const wordComplexity = node.char.length;
        const semanticComplexity = this.getSemanticComplexity(node.char);
        const contextualLoad = this.getContextualLoad(node);
        
        return (wordComplexity + semanticComplexity + contextualLoad) / 3;
    }

    getSemanticComplexity(word) {
        // 語の意味的複雑度
        const connections = this.semanticGraph.get(word);
        return connections ? connections.size : 1;
    }

    getContextualLoad(node) {
        // 文脈的負荷
        return this.readingHistory.length * 0.01;
    }

    getTemporalContext(node) {
        // 時間的文脈の取得
        return {
            recentHistory: this.readingHistory.slice(-10),
            globalContext: this.contextualLayers.temporal.get(node.char) || {},
            temporalDistance: Date.now() - (node.timestamp || Date.now())
        };
    }

    accessBodyMemory(word) {
        // 身体記憶へのアクセス
        return {
            motorMemory: this.getMotorMemory(word),
            sensoryMemory: this.getSensoryMemory(word),
            emotionalMemory: this.getEmotionalMemory(word)
        };
    }

    getMotorMemory(word) {
        // 運動記憶（書字運動など）
        return { gestureVector: this.calculateGestureVector(word) };
    }

    getSensoryMemory(word) {
        // 感覚記憶
        return { visualPattern: this.getVisualPattern(word) };
    }

    getEmotionalMemory(word) {
        // 感情記憶
        return { valence: this.getEmotionalValence(word) };
    }

    calculateGestureVector(word) {
        // 書字ジェスチャーのベクトル
        const hash = this.simpleHash(word);
        return {
            dx: Math.cos(hash) * 0.3,
            dy: Math.sin(hash) * 0.3
        };
    }

    getVisualPattern(word) {
        // 視覚パターン
        return word.split('').map(char => char.charCodeAt(0) % 10);
    }

    getEmotionalValence(word) {
        // 感情的価値
        return (this.simpleHash(word) % 200 - 100) / 100;
    }

    calculateEmbodiedDirection(readingState) {
        // 身体化された方向計算
        const attentionVector = this.calculateAttentionVector(readingState.attentionFocus);
        const memoryVector = this.calculateMemoryVector(readingState.bodyMemory);
        const loadFactor = 1 - readingState.cognitiveLoad * 0.5;
        
        return {
            dx: (attentionVector.dx * 0.6 + memoryVector.dx * 0.4) * loadFactor,
            dy: (attentionVector.dy * 0.6 + memoryVector.dy * 0.4) * loadFactor
        };
    }

    calculateAttentionVector(focusNodes) {
        if (focusNodes.length === 0) return { dx: 0, dy: 0 };
        
        const centerX = focusNodes.reduce((sum, node) => sum + node.position.x, 0) / focusNodes.length;
        const centerY = focusNodes.reduce((sum, node) => sum + node.position.y, 0) / focusNodes.length;
        
        return { dx: centerX * 0.01, dy: centerY * 0.01 };
    }

    calculateMemoryVector(bodyMemory) {
        return bodyMemory.motorMemory.gestureVector;
    }

    analyzeReadingMetrics() {
        // 読解メトリクスの分析
        return {
            averageReadingSpeed: this.calculateReadingSpeed(),
            attentionDistribution: this.analyzeAttentionDistribution(),
            semanticCohesion: this.calculateSemanticCohesion()
        };
    }

    calculateReadingSpeed() {
        if (this.readingHistory.length < 2) return 0;
        
        const timeSpan = this.readingHistory[this.readingHistory.length - 1].timestamp - 
                        this.readingHistory[0].timestamp;
        return this.readingHistory.length / (timeSpan / 1000);
    }

    analyzeAttentionDistribution() {
        // 注意分布の分析
        const distribution = new Map();
        
        this.readingHistory.forEach(entry => {
            const focus = entry.readingState.attentionFocus;
            focus.forEach(node => {
                const count = distribution.get(node.id) || 0;
                distribution.set(node.id, count + 1);
            });
        });
        
        return distribution;
    }

    calculateSemanticCohesion() {
        // 意味的結束性の計算
        let totalSimilarity = 0;
        let comparisons = 0;
        
        for (let i = 0; i < this.readingHistory.length - 1; i++) {
            const word1 = this.readingHistory[i].node;
            const word2 = this.readingHistory[i + 1].node;
            totalSimilarity += 1 - this.getSemanticDistance(word1, word2);
            comparisons++;
        }
        
        return comparisons > 0 ? totalSimilarity / comparisons : 0;
    }

    recognizeEmergentPatterns(nodes, connections) {
        // 創発パターンの認識
        return {
            clusters: this.identifySemanticClusters(nodes),
            bridges: this.identifySemanticBridges(connections),
            spirals: this.identifyReadingSpirals(nodes),
            fractals: this.identifyFractalPatterns(nodes)
        };
    }

    identifySemanticClusters(nodes) {
        // 意味クラスターの識別
        const clusters = [];
        const visited = new Set();
        
        nodes.forEach(node => {
            if (visited.has(node.id)) return;
            
            const cluster = this.expandCluster(node, nodes, visited);
            if (cluster.length > 2) {
                clusters.push(cluster);
            }
        });
        
        return clusters;
    }

    expandCluster(seedNode, allNodes, visited) {
        const cluster = [seedNode];
        visited.add(seedNode.id);
        
        allNodes.forEach(node => {
            if (visited.has(node.id)) return;
            
            const similarity = 1 - this.getSemanticDistance(seedNode.char, node.char);
            if (similarity > 0.7) {
                cluster.push(node);
                visited.add(node.id);
            }
        });
        
        return cluster;
    }

    identifySemanticBridges(connections) {
        // 意味的橋渡しの識別
        return connections.filter(conn => {
            // 安全な参照チェック
            if (!conn || !conn.from || !conn.to) return false;
            
            const fromChar = (typeof conn.from === 'object') ? conn.from.char : conn.from;
            const toChar = (typeof conn.to === 'object') ? conn.to.char : conn.to;
            
            if (!fromChar || !toChar) return false;
            
            const semanticGap = this.getSemanticDistance(fromChar, toChar);
            return semanticGap > 0.8 && semanticGap < 0.95;
        });
    }

    identifyReadingSpirals(nodes) {
        // 読解螺旋の識別
        const spirals = [];
        
        if (this.readingHistory.length < 5) return spirals;
        
        for (let i = 0; i < this.readingHistory.length - 4; i++) {
            const sequence = this.readingHistory.slice(i, i + 5);
            if (this.isSpirialPattern(sequence)) {
                spirals.push(sequence);
            }
        }
        
        return spirals;
    }

    isSpirialPattern(sequence) {
        // 螺旋パターンの判定
        if (!sequence || sequence.length < 3) return false;
        
        const positions = sequence.map(entry => {
            if (!entry || !entry.readingState || !entry.readingState.eyePosition) {
                return { x: 0, y: 0 };
            }
            return entry.readingState.eyePosition;
        }).filter(pos => pos.x !== undefined && pos.y !== undefined);
        
        if (positions.length < 3) return false;
        
        let totalAngle = 0;
        for (let i = 1; i < positions.length - 1; i++) {
            const dx1 = positions[i].x - positions[i-1].x;
            const dy1 = positions[i].y - positions[i-1].y;
            const dx2 = positions[i+1].x - positions[i].x;
            const dy2 = positions[i+1].y - positions[i].y;
            
            // ゼロ除算を防ぐ
            if (Math.abs(dx1) < 0.001 && Math.abs(dy1) < 0.001) continue;
            if (Math.abs(dx2) < 0.001 && Math.abs(dy2) < 0.001) continue;
            
            const angle1 = Math.atan2(dy1, dx1);
            const angle2 = Math.atan2(dy2, dx2);
            
            let angleDiff = angle2 - angle1;
            // 角度を -π から π の範囲に正規化
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            
            totalAngle += Math.abs(angleDiff);
        }
        
        return totalAngle > Math.PI; // 180度以上の回転があれば螺旋
    }

    identifyFractalPatterns(nodes) {
        // フラクタルパターンの識別
        const patterns = [];
        
        const scales = [10, 30, 90, 270]; // 複数スケールでの解析
        
        scales.forEach(scale => {
            const pattern = this.analyzeFractalAtScale(nodes, scale);
            if (pattern.selfSimilarity > 0.6) {
                patterns.push(pattern);
            }
        });
        
        return patterns;
    }

    analyzeFractalAtScale(nodes, scale) {
        // 特定スケールでのフラクタル解析
        const gridSize = scale;
        const grid = new Map();
        
        // グリッド分割
        nodes.forEach(node => {
            const gridX = Math.floor(node.position.x / gridSize);
            const gridY = Math.floor(node.position.y / gridSize);
            const key = `${gridX},${gridY}`;
            
            if (!grid.has(key)) grid.set(key, []);
            grid.get(key).push(node);
        });
        
        // 自己相似性の計算
        const selfSimilarity = this.calculateSelfSimilarity(grid);
        
        return {
            scale: scale,
            selfSimilarity: selfSimilarity,
            gridPattern: grid
        };
    }

    calculateSelfSimilarity(grid) {
        // 自己相似性の計算
        const densities = Array.from(grid.values()).map(cells => cells.length);
        
        if (densities.length < 4) return 0;
        
        // 密度分布の自己相関
        let correlation = 0;
        let comparisons = 0;
        
        for (let i = 0; i < densities.length - 1; i++) {
            for (let j = i + 1; j < densities.length; j++) {
                const similarity = 1 - Math.abs(densities[i] - densities[j]) / 
                                     Math.max(densities[i], densities[j], 1);
                correlation += similarity;
                comparisons++;
            }
        }
        
        return comparisons > 0 ? correlation / comparisons : 0;
    }

    visualizeReadingTrace() {
        // 読解軌跡の可視化
        return this.readingHistory.map(entry => ({
            position: entry.readingState.eyePosition,
            timestamp: entry.timestamp,
            cognitiveLoad: entry.readingState.cognitiveLoad,
            attention: entry.readingState.attentionFocus.length
        }));
    }

    captureEmergentMoments(patterns) {
        // 創発の瞬間を捉える
        const emergentMoments = [];
        
        // クラスター形成の瞬間
        patterns.clusters.forEach(cluster => {
            emergentMoments.push({
                type: 'cluster_formation',
                timestamp: Date.now(),
                elements: cluster,
                significance: cluster.length / 10
            });
        });
        
        // 意味的飛躍の瞬間
        patterns.bridges.forEach(bridge => {
            emergentMoments.push({
                type: 'semantic_leap',
                timestamp: Date.now(),
                connection: bridge,
                significance: this.getSemanticDistance(bridge.from.char, bridge.to.char)
            });
        });
        
        return emergentMoments;
    }

    mapLanguageCognitionInterface() {
        // 言語と認知の界面マッピング
        return {
            phonological: this.analyzePhonologicalProcessing(),
            morphological: this.analyzeMorphologicalProcessing(),
            syntactic: this.analyzeSyntacticProcessing(),
            semantic: this.analyzeSemanticProcessing(),
            pragmatic: this.analyzePragmaticProcessing()
        };
    }

    analyzePhonologicalProcessing() {
        // 音韻処理の分析
        return { soundPatterns: 'simplified_phonological_analysis' };
    }

    analyzeMorphologicalProcessing() {
        // 形態素処理の分析
        return { morphemePatterns: 'simplified_morphological_analysis' };
    }

    analyzeSyntacticProcessing() {
        // 統語処理の分析
        return { syntaxPatterns: 'simplified_syntactic_analysis' };
    }

    analyzeSemanticProcessing() {
        // 意味処理の分析
        return {
            semanticActivation: this.semanticGraph.size,
            conceptualConnections: Array.from(this.semanticGraph.entries()).length
        };
    }

    analyzePragmaticProcessing() {
        // 語用処理の分析
        return { contextualInferences: this.readingHistory.length };
    }

    generateTemporalFolding() {
        // 時間性の折り畳み
        const temporalLayers = [];
        
        // 過去の読解体験の層
        this.readingHistory.forEach((entry, index) => {
            temporalLayers.push({
                depth: index,
                content: entry,
                decay: Math.pow(this.cognitiveParams.memoryDecay, 
                              this.readingHistory.length - index)
            });
        });
        
        // 文化的時間層
        const culturalTime = Array.from(this.contextualLayers.cultural.entries())
            .map(([word, context]) => ({
                word: word,
                historicalDepth: context.historicalDepth || 0,
                culturalResonance: context.resonance || 0
            }));
        
        return {
            personalTime: temporalLayers,
            culturalTime: culturalTime,
            universalTime: this.getUniversalTimeContext()
        };
    }

    getUniversalTimeContext() {
        // 普遍的時間文脈
        return {
            linguisticEvolution: 'deep_time_linguistic_patterns',
            cognitiveArchetypes: 'universal_reading_patterns',
            semioticConstants: 'invariant_meaning_structures'
        };
    }

    captureCurrentContext() {
        // 現在のコンテキストの捕捉
        return {
            timestamp: Date.now(),
            systemState: {
                nodeCount: this.semanticGraph.size,
                connectionCount: this.collocationMatrix.size,
                readingDepth: this.readingHistory.length
            },
            cognitiveState: {
                averageLoad: this.calculateAverageCognitiveLoad(),
                attentionSpread: this.calculateAttentionSpread(),
                semanticActivation: this.calculateSemanticActivation()
            }
        };
    }

    calculateAverageCognitiveLoad() {
        if (this.readingHistory.length === 0) return 0;
        
        const totalLoad = this.readingHistory.reduce(
            (sum, entry) => sum + entry.readingState.cognitiveLoad, 0
        );
        return totalLoad / this.readingHistory.length;
    }

    calculateAttentionSpread() {
        if (this.readingHistory.length === 0) return 0;
        
        const totalSpread = this.readingHistory.reduce(
            (sum, entry) => sum + entry.readingState.attentionFocus.length, 0
        );
        return totalSpread / this.readingHistory.length;
    }

    calculateSemanticActivation() {
        return this.semanticGraph.size / Math.max(1, this.readingHistory.length);
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SemanticField;
} else if (typeof window !== 'undefined') {
    window.SemanticField = SemanticField;
}