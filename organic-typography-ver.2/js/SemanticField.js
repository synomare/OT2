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
        
        // メモリリーク対策
        this.maxHistorySize = 500;     // 読解履歴の最大サイズ
        this.maxSemanticGraphSize = 1000; // 語義グラフの最大サイズ
        this.maxCollocationSize = 2000;   // 連語行列の最大サイズ
        this.cleanupCounter = 0;          // クリーンアップカウンター
    }

    /**
     * テキストの語義構造を解析し、引力場を構築
     */
    analyzeSemanticStructure(text) {
        if (!text || typeof text !== 'string') {
            console.warn('Invalid text for semantic analysis:', text);
            return this.semanticGraph;
        }
        
        const words = this.tokenize(text);
        if (words.length === 0) {
            return this.semanticGraph;
        }
        
        const semanticVectors = this.computeSemanticVectors(words);
        
        // 語義的類似度行列の構築
        for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j < words.length; j++) {
                if (!semanticVectors[i] || !semanticVectors[j]) continue;
                
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
        
        // 定期クリーンアップ
        this.performCleanupIfNeeded();
        
        return this.semanticGraph;
    }

    /**
     * 語義的引力/斥力の計算（null安全性強化）
     */
    calculateSemanticForce(sourceNode, targetNode, spatialDistance) {
        // null安全性チェック
        if (!sourceNode || !targetNode || 
            !sourceNode.char || !targetNode.char ||
            typeof spatialDistance !== 'number' || isNaN(spatialDistance)) {
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
        
        // 引力場の方向と強度（安全な数値チェック）
        const forceVector = {
            attraction: Math.max(0, Math.min(1, interferencePattern.attraction || 0)),
            repulsion: Math.max(0, Math.min(1, interferencePattern.repulsion || 0)),
            lateral: Math.max(-1, Math.min(1, interferencePattern.lateral || 0))
        };
        
        return forceVector;
    }

    /**
     * 連語感覚の図形化アルゴリズム（null安全性強化）
     */
    visualizeCollocationSensation(node, nearbyNodes) {
        if (!node || !node.char || !node.position || !Array.isArray(nearbyNodes)) {
            return [];
        }
        
        const collocationField = [];
        
        for (const nearby of nearbyNodes) {
            if (!nearby || !nearby.char || !nearby.position) continue;
            
            const collocationValue = this.getCollocationStrength(node.char, nearby.char);
            
            if (collocationValue > 0.5) {
                // 連語関係を視覚的に表現する「感覚フィールド」
                const sensationField = this.generateSensationField(
                    node.position,
                    nearby.position,
                    collocationValue
                );
                
                if (sensationField && sensationField.length > 0) {
                    collocationField.push({
                        type: 'collocation_field',
                        intensity: collocationValue,
                        geometry: sensationField,
                        resonance: this.calculateResonancePattern(node, nearby)
                    });
                }
            }
        }
        
        return collocationField;
    }

    /**
     * 読む身体のシミュレーション（null安全性強化）
     */
    simulateReadingBody(currentNode, textNodes) {
        if (!currentNode || !currentNode.position || !currentNode.char) {
            return { dx: 0, dy: 0 };
        }
        
        const safeTextNodes = Array.isArray(textNodes) ? textNodes.filter(n => n && n.position) : [];
        
        const readingState = {
            eyePosition: { ...currentNode.position },
            attentionFocus: this.calculateAttentionFocus(currentNode, safeTextNodes),
            cognitiveLoad: this.calculateCognitiveLoad(currentNode),
            temporalContext: this.getTemporalContext(currentNode),
            bodyMemory: this.accessBodyMemory(currentNode.char)
        };
        
        // 身体記憶による成長方向の修正
        const embodiedDirection = this.calculateEmbodiedDirection(readingState);
        
        // 読書体験の履歴に追加（サイズ制限付き）
        this.addToReadingHistory({
            timestamp: Date.now(),
            node: currentNode.id || 'unknown',
            readingState: readingState,
            context: this.captureCurrentContext()
        });
        
        return embodiedDirection;
    }

    /**
     * 読解履歴への安全な追加（メモリリーク対策）
     */
    addToReadingHistory(entry) {
        if (!entry) return;
        
        this.readingHistory.push(entry);
        
        // 履歴サイズ制限
        if (this.readingHistory.length > this.maxHistorySize) {
            const removeCount = this.readingHistory.length - this.maxHistorySize;
            this.readingHistory.splice(0, removeCount);
        }
    }

    /**
     * 自己リフレクティブな読解パターンの生成
     */
    generateSelfReflectivePattern(nodes, connections) {
        if (!Array.isArray(nodes) || !Array.isArray(connections)) {
            return {
                readingTrace: [],
                emergentMoments: [],
                languageCognitionInterface: {},
                temporalFolding: {}
            };
        }
        
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

    // === 内部メソッド群（メモリリーク対策強化） ===

    tokenize(text) {
        if (!text || typeof text !== 'string') return [];
        
        // 高度な形態素解析（日本語対応）
        return text.split(/[\s、。！？]+/).filter(word => word && word.length > 0);
    }

    computeSemanticVectors(words) {
        if (!Array.isArray(words)) return [];
        
        // 分散表現ベースの語義ベクトル計算
        return words.map(word => this.getWordEmbedding(word)).filter(v => v);
    }

    calculateSemanticSimilarity(vector1, vector2) {
        // null安全性チェック
        if (!vector1 || !vector2 || !Array.isArray(vector1) || !Array.isArray(vector2)) {
            return 0;
        }
        
        if (vector1.length === 0 || vector2.length === 0) {
            return 0;
        }
        
        // コサイン類似度計算
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;
        
        const minLength = Math.min(vector1.length, vector2.length);
        
        for (let i = 0; i < minLength; i++) {
            const v1 = Number(vector1[i]) || 0;
            const v2 = Number(vector2[i]) || 0;
            
            dotProduct += v1 * v2;
            norm1 += v1 * v1;
            norm2 += v2 * v2;
        }
        
        const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
        return denominator > 0 ? Math.max(0, Math.min(1, dotProduct / denominator)) : 0;
    }

    getWordEmbedding(word) {
        if (!word || typeof word !== 'string') return null;
        
        // 簡化されたワード埋め込み
        const hash = this.simpleHash(word);
        const vector = [];
        for (let i = 0; i < 50; i++) {
            vector.push(Math.sin(hash * (i + 1)) * Math.cos(hash * (i + 2)));
        }
        return vector;
    }

    simpleHash(str) {
        if (!str || typeof str !== 'string') return 0;
        
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    addSemanticConnection(word1, word2, strength) {
        if (!word1 || !word2 || typeof strength !== 'number') return;
        
        // サイズ制限チェック
        if (this.semanticGraph.size >= this.maxSemanticGraphSize) {
            this.cleanupSemanticGraph();
        }
        
        if (!this.semanticGraph.has(word1)) {
            this.semanticGraph.set(word1, new Map());
        }
        this.semanticGraph.get(word1).set(word2, Math.max(0, Math.min(1, strength)));
    }

    getSemanticDistance(word1, word2) {
        if (!word1 || !word2) return 1;
        
        const connections = this.semanticGraph.get(word1);
        if (connections && connections.has(word2)) {
            return Math.max(0, 1 - connections.get(word2)); // 類似度を距離に変換
        }
        return 1; // デフォルト距離
    }

    getCollocationStrength(word1, word2) {
        if (!word1 || !word2) return 0;
        
        const key = `${word1}_${word2}`;
        return this.collocationMatrix.get(key) || 0;
    }

    detectCollocationPatterns(words) {
        if (!Array.isArray(words) || words.length < 2) return;
        
        // サイズ制限チェック
        if (this.collocationMatrix.size >= this.maxCollocationSize) {
            this.cleanupCollocationMatrix();
        }
        
        // n-gramベースの連語検出
        for (let i = 0; i < words.length - 1; i++) {
            if (!words[i] || !words[i + 1]) continue;
            
            const bigram = `${words[i]}_${words[i + 1]}`;
            const currentStrength = this.collocationMatrix.get(bigram) || 0;
            this.collocationMatrix.set(bigram, Math.min(1, currentStrength + 0.1));
        }
    }

    generateInterferencePattern(spatialDist, semanticDist, collocationStrength) {
        // 安全な数値チェック
        const safeSpatialDist = Math.max(0.1, Number(spatialDist) || 0.1);
        const safeSemanticDist = Math.max(0.1, Math.min(1, Number(semanticDist) || 1));
        const safeCollocationStrength = Math.max(0, Math.min(1, Number(collocationStrength) || 0));
        
        // 视觉-语義干涉模式的核心算法
        const interferenceRatio = safeSpatialDist / safeSemanticDist;
        
        return {
            attraction: Math.max(0, Math.min(1, safeCollocationStrength - interferenceRatio * 0.3)),
            repulsion: Math.max(0, Math.min(1, (interferenceRatio - 1) * 0.5)),
            lateral: Math.max(-1, Math.min(1, Math.sin(interferenceRatio * Math.PI) * 0.2))
        };
    }

    generateSensationField(pos1, pos2, intensity) {
        // null安全性チェック
        if (!pos1 || !pos2 || typeof pos1.x !== 'number' || typeof pos1.y !== 'number' ||
            typeof pos2.x !== 'number' || typeof pos2.y !== 'number') {
            return [];
        }
        
        const safeIntensity = Math.max(0, Math.min(1, Number(intensity) || 0));
        
        // 連語感覚を表現する幾何学的フィールド
        const midpoint = {
            x: (pos1.x + pos2.x) / 2,
            y: (pos1.y + pos2.y) / 2
        };
        
        const fieldRadius = safeIntensity * 30;
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
        if (!node1 || !node2 || !node1.char || !node2.char) {
            return { frequency: 0, amplitude: 0, phase: 0 };
        }
        
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
        if (!word || typeof word !== 'string') return 0;
        
        // 語の使用頻度に基づく振動数
        return (this.simpleHash(word) % 100) / 100;
    }

    calculateAttentionFocus(currentNode, allNodes) {
        if (!currentNode || !currentNode.position || !Array.isArray(allNodes)) {
            return [];
        }
        
        // 注意焦点の計算
        const focusNodes = allNodes
            .filter(node => {
                if (!node || !node.position) return false;
                
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
        if (!node || !node.char) return 0.5;
        
        // 認知負荷の計算
        const wordComplexity = node.char.length;
        const semanticComplexity = this.getSemanticComplexity(node.char);
        const contextualLoad = this.getContextualLoad(node);
        
        return Math.max(0, Math.min(1, (wordComplexity + semanticComplexity + contextualLoad) / 3));
    }

    getSemanticComplexity(word) {
        if (!word || typeof word !== 'string') return 1;
        
        // 語の意味的複雑度
        const connections = this.semanticGraph.get(word);
        return connections ? Math.min(10, connections.size) : 1;
    }

    getContextualLoad(node) {
        // 文脈的負荷
        return Math.min(1, this.readingHistory.length * 0.01);
    }

    getTemporalContext(node) {
        if (!node) return {};
        
        // 時間的文脈の取得
        return {
            recentHistory: this.readingHistory.slice(-10),
            globalContext: this.contextualLayers.temporal.get(node.char) || {},
            temporalDistance: Date.now() - (node.timestamp || Date.now())
        };
    }

    accessBodyMemory(word) {
        if (!word || typeof word !== 'string') {
            return {
                motorMemory: { gestureVector: { dx: 0, dy: 0 } },
                sensoryMemory: { visualPattern: [] },
                emotionalMemory: { valence: 0 }
            };
        }
        
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
        if (!word || typeof word !== 'string') return { dx: 0, dy: 0 };
        
        // 書字ジェスチャーのベクトル
        const hash = this.simpleHash(word);
        return {
            dx: Math.max(-1, Math.min(1, Math.cos(hash) * 0.3)),
            dy: Math.max(-1, Math.min(1, Math.sin(hash) * 0.3))
        };
    }

    getVisualPattern(word) {
        if (!word || typeof word !== 'string') return [];
        
        // 視覚パターン
        return word.split('').map(char => char.charCodeAt(0) % 10);
    }

    getEmotionalValence(word) {
        if (!word || typeof word !== 'string') return 0;
        
        // 感情的価値
        return Math.max(-1, Math.min(1, (this.simpleHash(word) % 200 - 100) / 100));
    }

    calculateEmbodiedDirection(readingState) {
        if (!readingState) return { dx: 0, dy: 0 };
        
        // 身体化された方向計算
        const attentionVector = this.calculateAttentionVector(readingState.attentionFocus || []);
        const memoryVector = this.calculateMemoryVector(readingState.bodyMemory || {});
        const loadFactor = Math.max(0.1, Math.min(1, 1 - (readingState.cognitiveLoad || 0) * 0.5));
        
        return {
            dx: Math.max(-1, Math.min(1, (attentionVector.dx * 0.6 + memoryVector.dx * 0.4) * loadFactor)),
            dy: Math.max(-1, Math.min(1, (attentionVector.dy * 0.6 + memoryVector.dy * 0.4) * loadFactor))
        };
    }

    calculateAttentionVector(focusNodes) {
        if (!Array.isArray(focusNodes) || focusNodes.length === 0) {
            return { dx: 0, dy: 0 };
        }
        
        const validNodes = focusNodes.filter(node => node && node.position);
        if (validNodes.length === 0) return { dx: 0, dy: 0 };
        
        const centerX = validNodes.reduce((sum, node) => sum + node.position.x, 0) / validNodes.length;
        const centerY = validNodes.reduce((sum, node) => sum + node.position.y, 0) / validNodes.length;
        
        return { 
            dx: Math.max(-1, Math.min(1, centerX * 0.01)), 
            dy: Math.max(-1, Math.min(1, centerY * 0.01))
        };
    }

    calculateMemoryVector(bodyMemory) {
        if (!bodyMemory || !bodyMemory.motorMemory || !bodyMemory.motorMemory.gestureVector) {
            return { dx: 0, dy: 0 };
        }
        
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
        
        const recentHistory = this.readingHistory.slice(-10);
        if (recentHistory.length < 2) return 0;
        
        const timeSpan = recentHistory[recentHistory.length - 1].timestamp - recentHistory[0].timestamp;
        return timeSpan > 0 ? recentHistory.length / (timeSpan / 1000) : 0;
    }

    analyzeAttentionDistribution() {
        // 注意分布の分析
        const distribution = new Map();
        
        this.readingHistory.forEach(entry => {
            if (!entry || !entry.readingState || !Array.isArray(entry.readingState.attentionFocus)) {
                return;
            }
            
            entry.readingState.attentionFocus.forEach(node => {
                if (!node || !node.id) return;
                
                const count = distribution.get(node.id) || 0;
                distribution.set(node.id, count + 1);
            });
        });
        
        return distribution;
    }

    calculateSemanticCohesion() {
        // 意味的結束性の計算
        if (this.readingHistory.length < 2) return 0;
        
        let totalSimilarity = 0;
        let comparisons = 0;
        
        for (let i = 0; i < this.readingHistory.length - 1; i++) {
            const entry1 = this.readingHistory[i];
            const entry2 = this.readingHistory[i + 1];
            
            if (!entry1 || !entry2 || !entry1.node || !entry2.node) continue;
            
            const word1 = entry1.node;
            const word2 = entry2.node;
            totalSimilarity += 1 - this.getSemanticDistance(word1, word2);
            comparisons++;
        }
        
        return comparisons > 0 ? Math.max(0, Math.min(1, totalSimilarity / comparisons)) : 0;
    }

    recognizeEmergentPatterns(nodes, connections) {
        if (!Array.isArray(nodes) || !Array.isArray(connections)) {
            return { clusters: [], bridges: [], spirals: [], fractals: [] };
        }
        
        // 創発パターンの認識
        return {
            clusters: this.identifySemanticClusters(nodes),
            bridges: this.identifySemanticBridges(connections),
            spirals: this.identifyReadingSpirals(nodes),
            fractals: this.identifyFractalPatterns(nodes)
        };
    }

    identifySemanticClusters(nodes) {
        if (!Array.isArray(nodes)) return [];
        
        // 意味クラスターの識別
        const clusters = [];
        const visited = new Set();
        const validNodes = nodes.filter(node => node && node.id && node.char);
        
        validNodes.forEach(node => {
            if (visited.has(node.id)) return;
            
            const cluster = this.expandCluster(node, validNodes, visited);
            if (cluster.length > 2) {
                clusters.push(cluster);
            }
        });
        
        return clusters;
    }

    expandCluster(seedNode, allNodes, visited) {
        if (!seedNode || !seedNode.id || !seedNode.char) return [];
        
        const cluster = [seedNode];
        visited.add(seedNode.id);
        
        allNodes.forEach(node => {
            if (!node || !node.id || !node.char || visited.has(node.id)) return;
            
            const similarity = 1 - this.getSemanticDistance(seedNode.char, node.char);
            if (similarity > 0.7) {
                cluster.push(node);
                visited.add(node.id);
            }
        });
        
        return cluster;
    }

    identifySemanticBridges(connections) {
        if (!Array.isArray(connections)) return [];
        
        // 意味的橋渡しの識別
        return connections.filter(conn => {
            // 安全な参照チェック
            if (!conn || !conn.from || !conn.to) return false;
            
            const fromChar = (typeof conn.from === 'object' && conn.from.char) ? conn.from.char : 
                            (typeof conn.from === 'string') ? conn.from : null;
            const toChar = (typeof conn.to === 'object' && conn.to.char) ? conn.to.char : 
                          (typeof conn.to === 'string') ? conn.to : null;
            
            if (!fromChar || !toChar) return false;
            
            const semanticGap = this.getSemanticDistance(fromChar, toChar);
            return semanticGap > 0.8 && semanticGap < 0.95;
        });
    }

    identifyReadingSpirals(nodes) {
        // 読解螺旋の識別（null安全性強化）
        const spirals = [];
        
        if (this.readingHistory.length < 5) return spirals;
        
        for (let i = 0; i <= this.readingHistory.length - 5; i++) {
            const sequence = this.readingHistory.slice(i, i + 5);
            if (this.isSpiralPattern(sequence)) {
                spirals.push(sequence);
            }
        }
        
        return spirals;
    }

    isSpiralPattern(sequence) {
        // 螺旋パターンの判定（null安全性強化）
        if (!sequence || !Array.isArray(sequence) || sequence.length < 3) return false;
        
        const positions = sequence
            .filter(entry => entry && entry.readingState && entry.readingState.eyePosition)
            .map(entry => entry.readingState.eyePosition)
            .filter(pos => pos && typeof pos.x === 'number' && typeof pos.y === 'number' && 
                          !isNaN(pos.x) && !isNaN(pos.y));
        
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
            
            // 角度を -π から π の範囲に正規化（無限ループ防止）
            let loopGuard = 0;
            while (angleDiff > Math.PI && loopGuard < 10) {
                angleDiff -= 2 * Math.PI;
                loopGuard++;
            }
            loopGuard = 0;
            while (angleDiff < -Math.PI && loopGuard < 10) {
                angleDiff += 2 * Math.PI;
                loopGuard++;
            }
            
            totalAngle += Math.abs(angleDiff);
        }
        
        return totalAngle > Math.PI; // 180度以上の回転があれば螺旋
    }

    identifyFractalPatterns(nodes) {
        if (!Array.isArray(nodes) || nodes.length < 4) return [];
        
        // フラクタルパターンの識別
        const patterns = [];
        const scales = [10, 30, 90, 270]; // 複数スケールでの解析
        
        scales.forEach(scale => {
            const pattern = this.analyzeFractalAtScale(nodes, scale);
            if (pattern && pattern.selfSimilarity > 0.6) {
                patterns.push(pattern);
            }
        });
        
        return patterns;
    }

    analyzeFractalAtScale(nodes, scale) {
        if (!Array.isArray(nodes) || nodes.length === 0 || !scale || scale <= 0) {
            return null;
        }
        
        // 特定スケールでのフラクタル解析
        const gridSize = scale;
        const grid = new Map();
        
        // グリッド分割
        const validNodes = nodes.filter(node => node && node.position && 
                                      typeof node.position.x === 'number' && 
                                      typeof node.position.y === 'number');
        
        validNodes.forEach(node => {
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
        if (!grid || grid.size === 0) return 0;
        
        // 自己相似性の計算
        const densities = Array.from(grid.values()).map(cells => cells.length);
        
        if (densities.length < 4) return 0;
        
        // 密度分布の自己相関
        let correlation = 0;
        let comparisons = 0;
        
        for (let i = 0; i < densities.length - 1; i++) {
            for (let j = i + 1; j < densities.length; j++) {
                const maxDensity = Math.max(densities[i], densities[j], 1);
                const similarity = 1 - Math.abs(densities[i] - densities[j]) / maxDensity;
                correlation += similarity;
                comparisons++;
            }
        }
        
        return comparisons > 0 ? Math.max(0, Math.min(1, correlation / comparisons)) : 0;
    }

    visualizeReadingTrace() {
        // 読解軌跡の可視化
        return this.readingHistory
            .filter(entry => entry && entry.readingState && entry.readingState.eyePosition)
            .map(entry => ({
                position: entry.readingState.eyePosition,
                timestamp: entry.timestamp,
                cognitiveLoad: entry.readingState.cognitiveLoad || 0,
                attention: (entry.readingState.attentionFocus || []).length
            }));
    }

    captureEmergentMoments(patterns) {
        if (!patterns) return [];
        
        // 創発の瞬間を捉える
        const emergentMoments = [];
        
        // クラスター形成の瞬間
        if (Array.isArray(patterns.clusters)) {
            patterns.clusters.forEach(cluster => {
                emergentMoments.push({
                    type: 'cluster_formation',
                    timestamp: Date.now(),
                    elements: cluster,
                    significance: Math.min(1, cluster.length / 10)
                });
            });
        }
        
        // 意味的飛躍の瞬間
        if (Array.isArray(patterns.bridges)) {
            patterns.bridges.forEach(bridge => {
                if (bridge && bridge.from && bridge.to) {
                    const fromChar = (typeof bridge.from === 'object') ? bridge.from.char : bridge.from;
                    const toChar = (typeof bridge.to === 'object') ? bridge.to.char : bridge.to;
                    
                    if (fromChar && toChar) {
                        emergentMoments.push({
                            type: 'semantic_leap',
                            timestamp: Date.now(),
                            connection: bridge,
                            significance: this.getSemanticDistance(fromChar, toChar)
                        });
                    }
                }
            });
        }
        
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
        return { soundPatterns: 'simplified_phonological_analysis' };
    }

    analyzeMorphologicalProcessing() {
        return { morphemePatterns: 'simplified_morphological_analysis' };
    }

    analyzeSyntacticProcessing() {
        return { syntaxPatterns: 'simplified_syntactic_analysis' };
    }

    analyzeSemanticProcessing() {
        return {
            semanticActivation: this.semanticGraph.size,
            conceptualConnections: Array.from(this.semanticGraph.entries()).length
        };
    }

    analyzePragmaticProcessing() {
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
                historicalDepth: (context && context.historicalDepth) || 0,
                culturalResonance: (context && context.resonance) || 0
            }));
        
        return {
            personalTime: temporalLayers,
            culturalTime: culturalTime,
            universalTime: this.getUniversalTimeContext()
        };
    }

    getUniversalTimeContext() {
        return {
            linguisticEvolution: 'deep_time_linguistic_patterns',
            cognitiveArchetypes: 'universal_reading_patterns',
            semioticConstants: 'invariant_meaning_structures'
        };
    }

    captureCurrentContext() {
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
        
        const validEntries = this.readingHistory.filter(entry => 
            entry && entry.readingState && typeof entry.readingState.cognitiveLoad === 'number'
        );
        
        if (validEntries.length === 0) return 0;
        
        const totalLoad = validEntries.reduce(
            (sum, entry) => sum + entry.readingState.cognitiveLoad, 0
        );
        return Math.max(0, Math.min(1, totalLoad / validEntries.length));
    }

    calculateAttentionSpread() {
        if (this.readingHistory.length === 0) return 0;
        
        const validEntries = this.readingHistory.filter(entry => 
            entry && entry.readingState && Array.isArray(entry.readingState.attentionFocus)
        );
        
        if (validEntries.length === 0) return 0;
        
        const totalSpread = validEntries.reduce(
            (sum, entry) => sum + entry.readingState.attentionFocus.length, 0
        );
        return Math.max(0, totalSpread / validEntries.length);
    }

    calculateSemanticActivation() {
        const historyLength = Math.max(1, this.readingHistory.length);
        return Math.min(1, this.semanticGraph.size / historyLength);
    }

    // === メモリ管理とクリーンアップ ===

    performCleanupIfNeeded() {
        this.cleanupCounter++;
        
        // 100回ごとにクリーンアップ実行
        if (this.cleanupCounter >= 100) {
            this.cleanup();
            this.cleanupCounter = 0;
        }
    }

    cleanup() {
        // 読解履歴のクリーンアップ
        if (this.readingHistory.length > this.maxHistorySize) {
            const removeCount = this.readingHistory.length - this.maxHistorySize;
            this.readingHistory.splice(0, removeCount);
        }
        
        // 語義グラフのクリーンアップ
        if (this.semanticGraph.size > this.maxSemanticGraphSize) {
            this.cleanupSemanticGraph();
        }
        
        // 連語行列のクリーンアップ
        if (this.collocationMatrix.size > this.maxCollocationSize) {
            this.cleanupCollocationMatrix();
        }
    }

    cleanupSemanticGraph() {
        // 使用頻度の低い語義関係を削除
        const entries = Array.from(this.semanticGraph.entries());
        entries.sort((a, b) => b[1].size - a[1].size); // 接続数で降順ソート
        
        const keepCount = Math.floor(this.maxSemanticGraphSize * 0.8);
        const toKeep = entries.slice(0, keepCount);
        
        this.semanticGraph.clear();
        toKeep.forEach(([word, connections]) => {
            this.semanticGraph.set(word, connections);
        });
    }

    cleanupCollocationMatrix() {
        // 強度の低い連語関係を削除
        const entries = Array.from(this.collocationMatrix.entries());
        entries.sort((a, b) => b[1] - a[1]); // 強度で降順ソート
        
        const keepCount = Math.floor(this.maxCollocationSize * 0.8);
        const toKeep = entries.slice(0, keepCount);
        
        this.collocationMatrix.clear();
        toKeep.forEach(([key, strength]) => {
            this.collocationMatrix.set(key, strength);
        });
    }

    // === 外部API ===

    getSystemReport() {
        return {
            semanticGraphSize: this.semanticGraph.size,
            collocationMatrixSize: this.collocationMatrix.size,
            readingHistoryLength: this.readingHistory.length,
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    estimateMemoryUsage() {
        return {
            semanticGraph: this.semanticGraph.size * 100,
            collocationMatrix: this.collocationMatrix.size * 50,
            readingHistory: this.readingHistory.length * 200,
            total: (this.semanticGraph.size * 100) + 
                   (this.collocationMatrix.size * 50) + 
                   (this.readingHistory.length * 200)
        };
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SemanticField;
} else if (typeof window !== 'undefined') {
    window.SemanticField = SemanticField;
}
