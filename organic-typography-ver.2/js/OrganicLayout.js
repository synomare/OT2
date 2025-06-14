// 依存関係チェック関数
function checkDependencies() {
    const missing = [];
    
    if (typeof SemanticField === 'undefined') {
        missing.push('SemanticField');
    }
    
    if (typeof SpatialIndex === 'undefined') {
        missing.push('SpatialIndex');
    }
    
    if (missing.length > 0) {
        console.warn('OrganicLayout dependencies missing:', missing);
        return false;
    }
    
    return true;
}

class OrganicLayout {
    constructor(text, canvasWidth, canvasHeight) {
        this.text = text;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.nodes = [];
        this.connections = [];
        this.growthQueue = [];
        this.generation = 0;
        this.isGrowing = false;
        
        // 依存関係チェック
        this.dependenciesReady = checkDependencies();
        
        // 空間インデックスの初期化
        if (typeof SpatialIndex !== 'undefined') {
            this.spatialIndex = new SpatialIndex(canvasWidth, canvasHeight, 50);
        } else {
            // フォールバック実装
            this.spatialIndex = {
                insert: (node) => {},
                query: (position, radius) => this.nodes.filter(n => 
                    n.position && this.getDistance(n.position, position) <= radius
                ),
                clear: () => {}
            };
        }
        
        // 語義場システムの統合
        if (typeof SemanticField !== 'undefined') {
            this.semanticField = new SemanticField();
        } else {
            // フォールバック実装
            this.semanticField = {
                semanticGraph: new Map(),
                collocationMatrix: new Map(),
                readingHistory: [],
                analyzeSemanticStructure: () => new Map(),
                calculateSemanticForce: () => ({ attraction: 0, repulsion: 0, lateral: 0 }),
                simulateReadingBody: () => ({ dx: 0, dy: 0 }),
                visualizeCollocationSensation: () => [],
                getSemanticDistance: () => 1,
                getCollocationStrength: () => 0,
                getSemanticComplexity: () => 1,
                calculateCognitiveLoad: () => 0.5,
                recognizeEmergentPatterns: () => ({ clusters: [], bridges: [], spirals: [], fractals: [] }),
                generateSelfReflectivePattern: () => ({}),
                calculateAverageCognitiveLoad: () => 0.5
            };
        }
        
        this.collocationFields = [];
        this.readingTrajectory = [];
        this.emergentPatterns = [];
        
        // 成長パラメータ（拡張版）
        this.params = {
            initialEnergy: 100,
            energyDecay: 0.3,
            straightPreference: 0.9,
            branchProbability: 0.15,
            intersectionPenalty: 50,
            coilingThreshold: 30,
            characterSpacing: 18,
            lineSpacing: 20,
            
            // 語義的パラメータ
            semanticGravity: 0.6,          // 語義的引力の強さ
            collocationResonance: 0.8,     // 連語共鳴の強さ
            interferenceAmplitude: 0.4,    // 干渉パターンの振幅
            embodimentFactor: 0.7,         // 身体化要因
            temporalDecay: 0.95,           // 時間的減衰
            reflexivityDepth: 0.5          // 自己言及の深度
        };
        
        // 初期化時に語義構造を解析
        this.initializeSemanticStructure();
    }

    /**
     * 語義構造の初期化
     */
    initializeSemanticStructure() {
        // テキストの語義構造を解析
        this.semanticField.analyzeSemanticStructure(this.text);
        
        // 初期読解状態を設定
        this.currentReadingState = {
            position: { x: this.canvasWidth / 2, y: this.canvasHeight / 2 },
            attention: [],
            cognitiveLoad: 0.5,
            temporalContext: Date.now()
        };
    }

    initialize() {
        // 初期シードの生成
        const seedCount = Math.max(3, Math.floor(Math.sqrt(this.text.length) / 5));
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;
        
        for (let i = 0; i < seedCount; i++) {
            const angle = (i / seedCount) * Math.PI * 2;
            const radius = 100 + Math.random() * 50;
            const seed = {
                id: `node_${this.nodes.length}`,
                char: this.text[0],
                position: {
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius
                },
                velocity: {
                    dx: Math.cos(angle + (Math.random() - 0.5) * 0.5),
                    dy: Math.sin(angle + (Math.random() - 0.5) * 0.5)
                },
                energy: this.params.initialEnergy,
                generation: 0,
                textIndex: i * Math.floor(this.text.length / seedCount),
                parent: null,
                children: [],
                curvature: 0
            };
            
            this.nodes.push(seed);
            this.spatialIndex.insert(seed);
            this.growthQueue.push(seed);
        }
    }

    grow() {
        if (!this.isGrowing || this.growthQueue.length === 0) return;
        
        const newQueue = [];
        
        for (const node of this.growthQueue) {
            if (node.energy <= 0 || node.textIndex >= this.text.length - 1) continue;
            
            // 近隣ノードの検出
            const nearbyNodes = this.spatialIndex.query(node.position, 50);
            
            // 語義場の影響を考慮した成長方向の計算
            const growthDir = this.calculateSemanticGrowthDirection(node, nearbyNodes);
            
            // 身体化された読解体験のシミュレーション
            const embodiedDirection = this.semanticField.simulateReadingBody(node, this.nodes);
            
            // 視覚-語義干渉パターンの適用
            const interferencePattern = this.applyInterferencePattern(growthDir, embodiedDirection, node);
            
            // エネルギー減少による曲率の増加（語義的要因を含む）
            const curvature = this.calculateSemanticCurvature(node, nearbyNodes);
            const curvedDir = this.applyCurvature(interferencePattern, curvature);
            
            // 新しいノードの生成
            const newNode = {
                id: `node_${this.nodes.length}`,
                char: this.text[node.textIndex + 1],
                position: {
                    x: node.position.x + curvedDir.dx * this.params.characterSpacing,
                    y: node.position.y + curvedDir.dy * this.params.characterSpacing
                },
                velocity: curvedDir,
                energy: node.energy - this.calculateEnergyDecay(node, nearbyNodes),
                generation: node.generation + 1,
                textIndex: node.textIndex + 1,
                parent: node.id,
                children: [],
                curvature: curvature,
                
                // 語義的属性を追加
                semanticResonance: this.calculateSemanticResonance(node, nearbyNodes),
                collocationStrength: this.getMaxCollocationStrength(node, nearbyNodes),
                readingDepth: this.calculateReadingDepth(node),
                temporalLayer: this.getCurrentTemporalLayer()
            };
            
            // 連語感覚フィールドの生成
            const collocationField = this.semanticField.visualizeCollocationSensation(node, nearbyNodes);
            if (collocationField.length > 0) {
                this.collocationFields.push(...collocationField);
            }
            
            // 交差チェック（語義的考慮を含む）
            if (!this.checkSemanticIntersection(newNode, nearbyNodes)) {
                this.nodes.push(newNode);
                this.spatialIndex.insert(newNode);
                node.children.push(newNode.id);
                newQueue.push(newNode);
                
                // 接続の追加（語義的タイプを含む）
                const connectionType = this.determineConnectionType(node, newNode);
                this.connections.push({
                    from: node.id,
                    to: newNode.id,
                    type: connectionType.visual,
                    semanticType: connectionType.semantic,
                    curvature: curvature,
                    interference: connectionType.interference,
                    resonance: newNode.semanticResonance
                });
                
                // 語義的分岐判定
                const branchProbability = this.calculateSemanticBranchProbability(node, nearbyNodes);
                if (Math.random() < branchProbability && node.energy > 50) {
                    const branchNode = this.createSemanticBranch(node, nearbyNodes);
                    if (branchNode) {
                        newQueue.push(branchNode);
                    }
                }
            } else {
                // 語義的回避分岐
                const avoidanceNode = this.createSemanticAvoidanceBranch(node, nearbyNodes);
                if (avoidanceNode) {
                    newQueue.push(avoidanceNode);
                }
            }
            
            // 読解軌跡の記録
            this.recordReadingTrajectory(node, newNode, curvedDir);
        }
        
        // 創発パターンの検出と更新
        this.updateEmergentPatterns();
        
        // 自己リフレクション の実行
        if (this.generation % 10 === 0) {
            this.performSelfReflection();
        }
        
        this.growthQueue = newQueue;
        this.generation++;
    }

    calculateGrowthDirection(node, nearbyNodes) {
        let direction = { ...node.velocity };
        
        // 近隣ノードからの反発力
        for (const nearby of nearbyNodes) {
            if (nearby.id === node.id) continue;
            
            const dx = node.position.x - nearby.position.x;
            const dy = node.position.y - nearby.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 30) {
                const force = (30 - dist) / 30;
                direction.dx += (dx / dist) * force * 0.3;
                direction.dy += (dy / dist) * force * 0.3;
            }
        }
        
        // 正規化
        const mag = Math.sqrt(direction.dx * direction.dx + direction.dy * direction.dy);
        return {
            dx: direction.dx / mag,
            dy: direction.dy / mag
        };
    }

    applyCurvature(direction, curvature) {
        const angle = Math.atan2(direction.dy, direction.dx);
        const curveAngle = angle + (Math.random() - 0.5) * curvature * Math.PI;
        
        return {
            dx: Math.cos(curveAngle),
            dy: Math.sin(curveAngle)
        };
    }

    checkIntersection(node, nearbyNodes) {
        for (const nearby of nearbyNodes) {
            const dx = node.position.x - nearby.position.x;
            const dy = node.position.y - nearby.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 15) {
                return true;
            }
        }
        return false;
    }

    createBranch(parentNode, nearbyNodes) {
        const branchAngle = Math.atan2(parentNode.velocity.dy, parentNode.velocity.dx) + 
                          (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 4 + Math.random() * Math.PI / 4);
        
        const branchNode = {
            id: `node_${this.nodes.length}`,
            char: this.text[parentNode.textIndex + 1],
            position: {
                x: parentNode.position.x + Math.cos(branchAngle) * this.params.characterSpacing,
                y: parentNode.position.y + Math.sin(branchAngle) * this.params.characterSpacing
            },
            velocity: {
                dx: Math.cos(branchAngle),
                dy: Math.sin(branchAngle)
            },
            energy: parentNode.energy * 0.7,
            generation: parentNode.generation + 1,
            textIndex: parentNode.textIndex + 1,
            parent: parentNode.id,
            children: [],
            curvature: 0
        };
        
        if (!this.checkIntersection(branchNode, nearbyNodes)) {
            this.nodes.push(branchNode);
            this.spatialIndex.insert(branchNode);
            parentNode.children.push(branchNode.id);
            
            this.connections.push({
                from: parentNode.id,
                to: branchNode.id,
                type: 'tertiary',
                curvature: 0.2
            });
            
            return branchNode;
        }
        
        return null;
    }

    createAvoidanceBranch(parentNode, nearbyNodes) {
        // 最も空いている方向を探す
        let bestAngle = null;
        let maxDistance = 0;
        
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
            const testPos = {
                x: parentNode.position.x + Math.cos(angle) * this.params.characterSpacing,
                y: parentNode.position.y + Math.sin(angle) * this.params.characterSpacing
            };
            
            let minDist = Infinity;
            for (const nearby of nearbyNodes) {
                const dist = Math.sqrt(
                    Math.pow(testPos.x - nearby.position.x, 2) +
                    Math.pow(testPos.y - nearby.position.y, 2)
                );
                minDist = Math.min(minDist, dist);
            }
            
            if (minDist > maxDistance) {
                maxDistance = minDist;
                bestAngle = angle;
            }
        }
        
        if (bestAngle !== null && maxDistance > 15) {
            return this.createBranch(parentNode, nearbyNodes);
        }
        
        return null;
    }

    // === 語義的成長メソッド群 ===

    /**
     * 語義場を考慮した成長方向の計算
     */
    calculateSemanticGrowthDirection(node, nearbyNodes) {
        // 従来の物理的方向
        const physicalDir = this.calculateGrowthDirection(node, nearbyNodes);
        
        // 語義的引力場の計算
        let semanticForce = { dx: 0, dy: 0 };
        
        for (const nearby of nearbyNodes) {
            if (nearby.id === node.id) continue;
            
            const semanticVector = this.semanticField.calculateSemanticForce(
                node, nearby, this.getDistance(node.position, nearby.position)
            );
            
            const dirToNearby = this.getNormalizedDirection(node.position, nearby.position);
            
            // 語義的引力/斥力の適用
            semanticForce.dx += dirToNearby.dx * semanticVector.attraction * this.params.semanticGravity;
            semanticForce.dy += dirToNearby.dy * semanticVector.attraction * this.params.semanticGravity;
            
            // 語義的斥力
            semanticForce.dx -= dirToNearby.dx * semanticVector.repulsion * this.params.semanticGravity;
            semanticForce.dy -= dirToNearby.dy * semanticVector.repulsion * this.params.semanticGravity;
            
            // 側方力（螺旋構造生成）
            const lateralDir = { dx: -dirToNearby.dy, dy: dirToNearby.dx };
            semanticForce.dx += lateralDir.dx * semanticVector.lateral;
            semanticForce.dy += lateralDir.dy * semanticVector.lateral;
        }
        
        // 物理的方向と語義的方向の合成
        const combinedDir = {
            dx: physicalDir.dx * (1 - this.params.semanticGravity) + semanticForce.dx,
            dy: physicalDir.dy * (1 - this.params.semanticGravity) + semanticForce.dy
        };
        
        return this.normalizeVector(combinedDir);
    }

    /**
     * 視覚-語義干渉パターンの適用
     */
    applyInterferencePattern(visualDir, embodiedDir, node) {
        const interferenceAmplitude = this.params.interferenceAmplitude;
        const embodimentFactor = this.params.embodimentFactor;
        
        // 干渉波形の生成
        const phase = node.generation * 0.1 + node.textIndex * 0.05;
        const interferenceX = Math.sin(phase) * interferenceAmplitude;
        const interferenceY = Math.cos(phase * 1.3) * interferenceAmplitude;
        
        // 視覚方向、身体化方向、干渉波形の合成
        return {
            dx: visualDir.dx * (1 - embodimentFactor) + 
                embodiedDir.dx * embodimentFactor + 
                interferenceX,
            dy: visualDir.dy * (1 - embodimentFactor) + 
                embodiedDir.dy * embodimentFactor + 
                interferenceY
        };
    }

    /**
     * 語義的曲率の計算
     */
    calculateSemanticCurvature(node, nearbyNodes) {
        const baseCurvature = (this.params.initialEnergy - node.energy) / this.params.initialEnergy;
        
        // 連語強度による曲率修正
        let maxCollocation = 0;
        for (const nearby of nearbyNodes) {
            const collocationStrength = this.semanticField.getCollocationStrength(node.char, nearby.char);
            maxCollocation = Math.max(maxCollocation, collocationStrength);
        }
        
        // 語義的複雑性による曲率
        const semanticComplexity = this.semanticField.getSemanticComplexity(node.char);
        const complexityFactor = Math.min(1, semanticComplexity / 10);
        
        return baseCurvature + (maxCollocation * 0.3) + (complexityFactor * 0.2);
    }

    /**
     * 語義的要因を含むエネルギー減衰の計算
     */
    calculateEnergyDecay(node, nearbyNodes) {
        let baseDecay = this.params.energyDecay;
        
        // 認知負荷による追加減衰
        const cognitiveLoad = this.semanticField.calculateCognitiveLoad(node);
        const loadPenalty = cognitiveLoad * 0.1;
        
        // 連語関係によるエネルギー回復
        let collocationBonus = 0;
        for (const nearby of nearbyNodes) {
            const strength = this.semanticField.getCollocationStrength(node.char, nearby.char);
            collocationBonus += strength * 0.05;
        }
        
        return Math.max(0.1, baseDecay + loadPenalty - collocationBonus);
    }

    /**
     * 語義的共鳴の計算
     */
    calculateSemanticResonance(node, nearbyNodes) {
        let totalResonance = 0;
        
        for (const nearby of nearbyNodes) {
            const semanticSimilarity = 1 - this.semanticField.getSemanticDistance(node.char, nearby.char);
            const spatialProximity = Math.max(0, 1 - this.getDistance(node.position, nearby.position) / 100);
            
            totalResonance += semanticSimilarity * spatialProximity;
        }
        
        return Math.min(1, totalResonance / Math.max(1, nearbyNodes.length));
    }

    /**
     * 最大連語強度の取得
     */
    getMaxCollocationStrength(node, nearbyNodes) {
        let maxStrength = 0;
        
        for (const nearby of nearbyNodes) {
            const strength = this.semanticField.getCollocationStrength(node.char, nearby.char);
            maxStrength = Math.max(maxStrength, strength);
        }
        
        return maxStrength;
    }

    /**
     * 読解深度の計算
     */
    calculateReadingDepth(node) {
        return {
            temporal: this.semanticField.readingHistory.length,
            semantic: node.generation,
            cognitive: this.calculateCognitiveDepth(node),
            cultural: this.getCulturalDepth(node)
        };
    }

    calculateCognitiveDepth(node) {
        return Math.log(node.generation + 1) * node.energy / this.params.initialEnergy;
    }

    getCulturalDepth(node) {
        return this.semanticField.contextualLayers.cultural.get(node.char)?.depth || 0;
    }

    /**
     * 現在の時間層の取得
     */
    getCurrentTemporalLayer() {
        return {
            generation: this.generation,
            timestamp: Date.now(),
            readingPhase: this.getReadingPhase(),
            contextualDepth: this.semanticField.readingHistory.length
        };
    }

    getReadingPhase() {
        const progress = this.generation / (this.text.length * 2);
        if (progress < 0.3) return 'initiation';
        if (progress < 0.7) return 'development';
        return 'culmination';
    }

    /**
     * 語義的交差チェック
     */
    checkSemanticIntersection(node, nearbyNodes) {
        // 物理的交差チェック
        if (this.checkIntersection(node, nearbyNodes)) {
            return true;
        }
        
        // 語義的干渉チェック
        for (const nearby of nearbyNodes) {
            const semanticDistance = this.semanticField.getSemanticDistance(node.char, nearby.char);
            const spatialDistance = this.getDistance(node.position, nearby.position);
            
            // 語義的に近い単語が物理的に近すぎる場合は干渉
            if (semanticDistance < 0.3 && spatialDistance < 25) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * 接続タイプの決定
     */
    determineConnectionType(fromNode, toNode) {
        const energy = fromNode.energy;
        const semanticDistance = this.semanticField.getSemanticDistance(fromNode.char, toNode.char);
        const collocationStrength = this.semanticField.getCollocationStrength(fromNode.char, toNode.char);
        
        let visualType, semanticType, interference;
        
        // 視覚的タイプ
        if (energy > this.params.coilingThreshold) {
            visualType = 'primary';
        } else if (energy > this.params.coilingThreshold * 0.5) {
            visualType = 'secondary';
        } else {
            visualType = 'tertiary';
        }
        
        // 語義的タイプ
        if (collocationStrength > 0.7) {
            semanticType = 'collocation';
        } else if (semanticDistance < 0.4) {
            semanticType = 'similarity';
        } else if (semanticDistance > 0.8) {
            semanticType = 'contrast';
        } else {
            semanticType = 'neutral';
        }
        
        // 干渉パターン
        const visualSemanticRatio = (1 - semanticDistance) / Math.max(0.1, energy / this.params.initialEnergy);
        interference = {
            amplitude: visualSemanticRatio * this.params.interferenceAmplitude,
            frequency: collocationStrength * 2 * Math.PI,
            phase: (fromNode.generation + toNode.generation) % (2 * Math.PI)
        };
        
        return { visual: visualType, semantic: semanticType, interference };
    }

    /**
     * 語義的分岐確率の計算
     */
    calculateSemanticBranchProbability(node, nearbyNodes) {
        let baseProbability = this.params.branchProbability;
        
        // 語義的複雑性による分岐促進
        const semanticComplexity = this.semanticField.getSemanticComplexity(node.char);
        const complexityBonus = Math.min(0.3, semanticComplexity / 10);
        
        // 連語関係による分岐促進
        let collocationBonus = 0;
        for (const nearby of nearbyNodes) {
            const strength = this.semanticField.getCollocationStrength(node.char, nearby.char);
            if (strength > 0.5) {
                collocationBonus += 0.1;
            }
        }
        
        // 読解深度による調整
        const depthFactor = Math.min(1, this.semanticField.readingHistory.length / 100);
        
        return Math.min(0.8, baseProbability + complexityBonus + collocationBonus * depthFactor);
    }

    /**
     * 語義的分岐の作成
     */
    createSemanticBranch(parentNode, nearbyNodes) {
        // 最も語義的に興味深い方向を探す
        let bestDirection = null;
        let maxInterest = 0;
        
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
            const testDir = { dx: Math.cos(angle), dy: Math.sin(angle) };
            const interest = this.calculateSemanticInterest(parentNode, testDir, nearbyNodes);
            
            if (interest > maxInterest) {
                maxInterest = interest;
                bestDirection = testDir;
            }
        }
        
        if (!bestDirection) return null;
        
        const branchNode = {
            id: `node_${this.nodes.length}`,
            char: this.text[parentNode.textIndex + 1],
            position: {
                x: parentNode.position.x + bestDirection.dx * this.params.characterSpacing,
                y: parentNode.position.y + bestDirection.dy * this.params.characterSpacing
            },
            velocity: bestDirection,
            energy: parentNode.energy * 0.8,
            generation: parentNode.generation + 1,
            textIndex: parentNode.textIndex + 1,
            parent: parentNode.id,
            children: [],
            curvature: 0,
            
            // 語義的属性
            semanticResonance: maxInterest,
            branchType: 'semantic',
            temporalLayer: this.getCurrentTemporalLayer()
        };
        
        if (!this.checkSemanticIntersection(branchNode, nearbyNodes)) {
            this.nodes.push(branchNode);
            this.spatialIndex.insert(branchNode);
            parentNode.children.push(branchNode.id);
            
            this.connections.push({
                from: parentNode.id,
                to: branchNode.id,
                type: 'semantic_branch',
                semanticType: 'exploration',
                curvature: 0.3,
                resonance: maxInterest
            });
            
            return branchNode;
        }
        
        return null;
    }

    calculateSemanticInterest(node, direction, nearbyNodes) {
        // その方向での語義的興味度を計算
        let interest = 0;
        
        // 方向性による基本興味度
        const angle = Math.atan2(direction.dy, direction.dx);
        interest += Math.sin(angle * 3) * 0.3; // 波状パターン
        
        // 近隣ノードとの語義的関係
        for (const nearby of nearbyNodes) {
            const nearbyDir = this.getNormalizedDirection(node.position, nearby.position);
            const dirSimilarity = this.dot(direction, nearbyDir);
            
            if (dirSimilarity > 0.7) { // 同方向
                const semanticSimilarity = 1 - this.semanticField.getSemanticDistance(node.char, nearby.char);
                interest += semanticSimilarity * 0.4;
            }
        }
        
        return Math.max(0, interest);
    }

    /**
     * 語義的回避分岐の作成
     */
    createSemanticAvoidanceBranch(parentNode, nearbyNodes) {
        // 語義的・物理的に最も空いている方向を探す
        let bestAngle = null;
        let maxFreedom = 0;
        
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
            const testPos = {
                x: parentNode.position.x + Math.cos(angle) * this.params.characterSpacing,
                y: parentNode.position.y + Math.sin(angle) * this.params.characterSpacing
            };
            
            const freedom = this.calculateSemanticFreedom(testPos, parentNode.char, nearbyNodes);
            
            if (freedom > maxFreedom) {
                maxFreedom = freedom;
                bestAngle = angle;
            }
        }
        
        if (bestAngle !== null && maxFreedom > 0.3) {
            return this.createSemanticBranch(parentNode, nearbyNodes);
        }
        
        return null;
    }

    calculateSemanticFreedom(position, char, nearbyNodes) {
        let spatialFreedom = 1;
        let semanticFreedom = 1;
        
        for (const nearby of nearbyNodes) {
            const spatialDist = this.getDistance(position, nearby.position);
            const semanticDist = this.semanticField.getSemanticDistance(char, nearby.char);
            
            spatialFreedom *= Math.min(1, spatialDist / 30);
            semanticFreedom *= Math.min(1, semanticDist);
        }
        
        return (spatialFreedom + semanticFreedom) / 2;
    }

    /**
     * 読解軌跡の記録
     */
    recordReadingTrajectory(fromNode, toNode, direction) {
        const trajectoryPoint = {
            timestamp: Date.now(),
            from: {
                id: fromNode.id,
                char: fromNode.char,
                position: { ...fromNode.position }
            },
            to: toNode ? {
                id: toNode.id,
                char: toNode.char,
                position: { ...toNode.position }
            } : null,
            direction: { ...direction },
            semanticContext: {
                resonance: fromNode.semanticResonance || 0,
                collocationStrength: fromNode.collocationStrength || 0,
                readingDepth: fromNode.readingDepth || { temporal: 0, semantic: 0 }
            },
            cognitiveState: {
                energy: fromNode.energy,
                generation: fromNode.generation,
                curvature: fromNode.curvature
            }
        };
        
        this.readingTrajectory.push(trajectoryPoint);
        
        // 履歴の制限（メモリ管理）
        if (this.readingTrajectory.length > 1000) {
            this.readingTrajectory = this.readingTrajectory.slice(-800);
        }
    }

    /**
     * 創発パターンの更新
     */
    updateEmergentPatterns() {
        if (this.nodes.length < 10) return;
        
        const patterns = this.semanticField.recognizeEmergentPatterns(this.nodes, this.connections);
        
        // 新しいパターンのみを追加
        patterns.clusters.forEach(cluster => {
            if (!this.hasExistingPattern('cluster', cluster)) {
                this.emergentPatterns.push({
                    type: 'semantic_cluster',
                    elements: cluster,
                    generation: this.generation,
                    strength: cluster.length / this.nodes.length
                });
            }
        });
        
        patterns.bridges.forEach(bridge => {
            if (!this.hasExistingPattern('bridge', bridge)) {
                this.emergentPatterns.push({
                    type: 'semantic_bridge',
                    connection: bridge,
                    generation: this.generation,
                    strength: bridge.semanticGap || 0
                });
            }
        });
        
        patterns.spirals.forEach(spiral => {
            this.emergentPatterns.push({
                type: 'reading_spiral',
                trajectory: spiral,
                generation: this.generation,
                complexity: spiral.length
            });
        });
    }

    hasExistingPattern(type, newPattern) {
        return this.emergentPatterns.some(pattern => {
            if (type === 'cluster' && pattern.type === 'semantic_cluster') {
                return this.arraysOverlap(pattern.elements.map(e => e.id), newPattern.map(e => e.id), 0.7);
            }
            return false;
        });
    }

    arraysOverlap(arr1, arr2, threshold) {
        const intersection = arr1.filter(x => arr2.includes(x));
        const union = [...new Set([...arr1, ...arr2])];
        return intersection.length / union.length >= threshold;
    }

    /**
     * 自己リフレクションの実行
     */
    performSelfReflection() {
        const reflexiveElements = this.semanticField.generateSelfReflectivePattern(this.nodes, this.connections);
        
        // システムの読解プロセスを分析
        const readingMetrics = {
            totalNodes: this.nodes.length,
            totalConnections: this.connections.length,
            averageSemanticResonance: this.calculateAverageSemanticResonance(),
            emergentPatternCount: this.emergentPatterns.length,
            collocationFieldCount: this.collocationFields.length,
            readingTrajectoryLength: this.readingTrajectory.length
        };
        
        // 自己言及的フィードバックループの生成
        const selfReflection = {
            timestamp: Date.now(),
            generation: this.generation,
            metrics: readingMetrics,
            reflexiveElements: reflexiveElements,
            systemState: this.captureSystemState(),
            insights: this.generateSystemInsights()
        };
        
        // 自己リフレクションの記録
        if (!this.selfReflectionHistory) {
            this.selfReflectionHistory = [];
        }
        this.selfReflectionHistory.push(selfReflection);
        
        // システムパラメータの適応的調整
        this.adaptSystemParameters(selfReflection);
    }

    calculateAverageSemanticResonance() {
        if (this.nodes.length === 0) return 0;
        
        const totalResonance = this.nodes.reduce((sum, node) => {
            return sum + (node.semanticResonance || 0);
        }, 0);
        
        return totalResonance / this.nodes.length;
    }

    captureSystemState() {
        return {
            growthPhase: this.getReadingPhase(),
            semanticDensity: this.calculateSemanticDensity(),
            visualComplexity: this.calculateVisualComplexity(),
            temporalDepth: this.semanticField.readingHistory.length,
            cognitiveLoad: this.semanticField.calculateAverageCognitiveLoad()
        };
    }

    calculateSemanticDensity() {
        if (this.nodes.length === 0) return 0;
        
        let totalSemanticConnections = 0;
        this.connections.forEach(conn => {
            if (conn.semanticType && conn.semanticType !== 'neutral') {
                totalSemanticConnections++;
            }
        });
        
        return totalSemanticConnections / this.nodes.length;
    }

    calculateVisualComplexity() {
        if (this.connections.length === 0) return 0;
        
        let totalCurvature = 0;
        this.connections.forEach(conn => {
            totalCurvature += conn.curvature || 0;
        });
        
        return totalCurvature / this.connections.length;
    }

    generateSystemInsights() {
        const insights = [];
        
        // 語義クラスターの発見
        const clusterCount = this.emergentPatterns.filter(p => p.type === 'semantic_cluster').length;
        if (clusterCount > 0) {
            insights.push({
                type: 'semantic_clustering',
                description: `${clusterCount}個の語義クラスターが創発`,
                significance: clusterCount / this.nodes.length
            });
        }
        
        // 読解螺旋の発見
        const spiralCount = this.emergentPatterns.filter(p => p.type === 'reading_spiral').length;
        if (spiralCount > 0) {
            insights.push({
                type: 'spiral_emergence',
                description: `${spiralCount}個の読解螺旋パターンが出現`,
                significance: spiralCount / 10
            });
        }
        
        // 干渉パターンの分析
        const interferenceConnections = this.connections.filter(conn => 
            conn.interference && conn.interference.amplitude > 0.3
        );
        if (interferenceConnections.length > 0) {
            insights.push({
                type: 'visual_semantic_interference',
                description: `${interferenceConnections.length}個の視覚-語義干渉パターンが活性化`,
                significance: interferenceConnections.length / this.connections.length
            });
        }
        
        return insights;
    }

    adaptSystemParameters(reflection) {
        const metrics = reflection.metrics;
        const state = reflection.systemState;
        
        // 語義密度に基づく調整
        if (state.semanticDensity > 0.8) {
            this.params.semanticGravity *= 0.95; // 語義引力を弱める
        } else if (state.semanticDensity < 0.3) {
            this.params.semanticGravity *= 1.05; // 語義引力を強める
        }
        
        // 視覚複雑性に基づく調整
        if (state.visualComplexity > 0.7) {
            this.params.interferenceAmplitude *= 0.9; // 干渉を弱める
        } else if (state.visualComplexity < 0.3) {
            this.params.interferenceAmplitude *= 1.1; // 干渉を強める
        }
        
        // 認知負荷に基づく調整
        if (state.cognitiveLoad > 0.8) {
            this.params.energyDecay *= 1.1; // エネルギー減衰を強める
        } else if (state.cognitiveLoad < 0.3) {
            this.params.energyDecay *= 0.9; // エネルギー減衰を弱める
        }
        
        // パラメータの制限
        this.params.semanticGravity = Math.max(0.1, Math.min(1.0, this.params.semanticGravity));
        this.params.interferenceAmplitude = Math.max(0.1, Math.min(1.0, this.params.interferenceAmplitude));
        this.params.energyDecay = Math.max(0.1, Math.min(1.0, this.params.energyDecay));
    }

    // === ユーティリティメソッド ===

    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getNormalizedDirection(from, to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const mag = Math.sqrt(dx * dx + dy * dy);
        return mag > 0 ? { dx: dx / mag, dy: dy / mag } : { dx: 0, dy: 0 };
    }

    normalizeVector(vector) {
        const mag = Math.sqrt(vector.dx * vector.dx + vector.dy * vector.dy);
        return mag > 0 ? { dx: vector.dx / mag, dy: vector.dy / mag } : { dx: 0, dy: 0 };
    }

    dot(v1, v2) {
        return v1.dx * v2.dx + v1.dy * v2.dy;
    }

    start() {
        this.isGrowing = true;
    }

    pause() {
        this.isGrowing = false;
    }

    reset() {
        this.nodes = [];
        this.connections = [];
        this.growthQueue = [];
        this.generation = 0;
        this.isGrowing = false;
        this.spatialIndex.clear();
        
        // 語義システムのリセット
        this.collocationFields = [];
        this.readingTrajectory = [];
        this.emergentPatterns = [];
        this.selfReflectionHistory = [];
        this.semanticField = new SemanticField();
        
        this.initialize();
    }

    // === 外部アクセス用メソッド ===

    /**
     * 現在の語義構造を取得
     */
    getSemanticStructure() {
        return {
            semanticGraph: this.semanticField.semanticGraph,
            collocationMatrix: this.semanticField.collocationMatrix,
            readingHistory: this.semanticField.readingHistory
        };
    }

    /**
     * 連語感覚フィールドを取得
     */
    getCollocationFields() {
        return this.collocationFields;
    }

    /**
     * 読解軌跡を取得
     */
    getReadingTrajectory() {
        return this.readingTrajectory;
    }

    /**
     * 創発パターンを取得
     */
    getEmergentPatterns() {
        return this.emergentPatterns;
    }

    /**
     * 自己リフレクション履歴を取得
     */
    getSelfReflectionHistory() {
        return this.selfReflectionHistory || [];
    }

    /**
     * システム状態の詳細レポート
     */
    getSystemReport() {
        return {
            basicMetrics: {
                nodes: this.nodes.length,
                connections: this.connections.length,
                generation: this.generation
            },
            semanticMetrics: {
                semanticDensity: this.calculateSemanticDensity(),
                averageResonance: this.calculateAverageSemanticResonance(),
                collocationFields: this.collocationFields.length
            },
            emergentMetrics: {
                patterns: this.emergentPatterns.length,
                trajectoryPoints: this.readingTrajectory.length,
                reflections: this.getSelfReflectionHistory().length
            },
            systemParameters: { ...this.params },
            currentState: this.captureSystemState()
        };
    }
}
