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
        // 入力値検証
        this.text = (text && typeof text === 'string') ? text : 'デフォルトテキスト';
        this.canvasWidth = Math.max(100, Number(canvasWidth) || 800);
        this.canvasHeight = Math.max(100, Number(canvasHeight) || 600);
        
        this.nodes = [];
        this.connections = [];
        this.growthQueue = [];
        this.generation = 0;
        this.isGrowing = false;
        
        // メモリリーク対策
        this.maxNodes = 1000;
        this.maxConnections = 2000;
        this.maxTrajectoryLength = 500;
        this.maxCollocationFields = 200;
        this.maxEmergentPatterns = 100;
        this.maxSelfReflectionHistory = 50;
        
        // 依存関係チェック
        this.dependenciesReady = checkDependencies();
        
        // 空間インデックスの初期化
        if (typeof SpatialIndex !== 'undefined') {
            this.spatialIndex = new SpatialIndex(this.canvasWidth, this.canvasHeight, 50);
        } else {
            // フォールバック実装
            this.spatialIndex = {
                insert: (node) => {},
                query: (position, radius) => {
                    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
                        return [];
                    }
                    return this.nodes.filter(n => 
                        n && n.position && 
                        this.getDistance(n.position, position) <= radius
                    );
                },
                clear: () => {},
                remove: () => {},
                update: () => {}
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
        if (!this.text) return;
        
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
        if (!this.text || this.text.length === 0) {
            console.warn('No text to initialize');
            return;
        }
        
        // 初期シードの生成
        const seedCount = Math.max(1, Math.min(10, Math.floor(Math.sqrt(this.text.length) / 5)));
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;
        
        for (let i = 0; i < seedCount; i++) {
            const angle = (i / seedCount) * Math.PI * 2;
            const radius = 100 + Math.random() * 50;
            const textIndex = Math.min(i * Math.floor(this.text.length / seedCount), this.text.length - 1);
            
            const seed = {
                id: `node_${this.nodes.length}`,
                char: this.text[textIndex] || this.text[0],
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
                textIndex: textIndex,
                parent: null,
                children: [],
                curvature: 0,
                // 語義的属性の初期化
                semanticResonance: 0,
                collocationStrength: 0,
                readingDepth: { temporal: 0, semantic: 0, cognitive: 0, cultural: 0 },
                temporalLayer: this.getCurrentTemporalLayer()
            };
            
            this.nodes.push(seed);
            this.spatialIndex.insert(seed);
            this.growthQueue.push(seed);
        }
    }

    grow() {
        if (!this.isGrowing || this.growthQueue.length === 0) return;
        
        // メモリ制限チェック
        if (this.nodes.length >= this.maxNodes) {
            this.performMemoryCleanup();
        }
        
        const newQueue = [];
        
        for (const node of this.growthQueue) {
            if (!node || !node.position || node.energy <= 0 || node.textIndex >= this.text.length - 1) {
                continue;
            }
            
            // 近隣ノードの検出（null安全性チェック付き）
            const nearbyNodes = this.spatialIndex.query(node.position, 50).filter(n => 
                n && n.position && n.id !== node.id
            );
            
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
            const nextTextIndex = Math.min(node.textIndex + 1, this.text.length - 1);
            const newNode = {
                id: `node_${this.nodes.length}`,
                char: this.text[nextTextIndex],
                position: {
                    x: node.position.x + curvedDir.dx * this.params.characterSpacing,
                    y: node.position.y + curvedDir.dy * this.params.characterSpacing
                },
                velocity: { ...curvedDir },
                energy: Math.max(0, node.energy - this.calculateEnergyDecay(node, nearbyNodes)),
                generation: node.generation + 1,
                textIndex: nextTextIndex,
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
            try {
                const collocationField = this.semanticField.visualizeCollocationSensation(node, nearbyNodes);
                if (Array.isArray(collocationField) && collocationField.length > 0) {
                    this.addCollocationFields(collocationField);
                }
            } catch (error) {
                console.warn('Error generating collocation field:', error);
            }
            
            // 交差チェック（語義的考慮を含む）
            if (!this.checkSemanticIntersection(newNode, nearbyNodes)) {
                this.nodes.push(newNode);
                this.spatialIndex.insert(newNode);
                
                if (node.children) {
                    node.children.push(newNode.id);
                }
                
                newQueue.push(newNode);
                
                // 接続の追加（語義的タイプを含む）
                const connectionType = this.determineConnectionType(node, newNode);
                this.addConnection({
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

    /**
     * メモリクリーンアップ（拡張版）
     */
    performMemoryCleanup() {
        // ノード数制限
        if (this.nodes.length > this.maxNodes) {
            const removeCount = this.nodes.length - Math.floor(this.maxNodes * 0.8);
            const removedNodes = this.nodes.splice(0, removeCount);
            const removedIds = new Set(removedNodes.map(n => n.id));
            
            // 関連する接続を削除
            this.connections = this.connections.filter(conn => 
                !removedIds.has(conn.from) && !removedIds.has(conn.to)
            );
            
            // 空間インデックスの再構築
            this.spatialIndex.clear();
            this.nodes.forEach(node => {
                if (node && node.position) {
                    this.spatialIndex.insert(node);
                }
            });
        }
        
        // 接続数制限
        if (this.connections.length > this.maxConnections) {
            const removeCount = this.connections.length - Math.floor(this.maxConnections * 0.8);
            this.connections.splice(0, removeCount);
        }
        
        // 軌跡制限
        if (this.readingTrajectory.length > this.maxTrajectoryLength) {
            const removeCount = this.readingTrajectory.length - Math.floor(this.maxTrajectoryLength * 0.8);
            this.readingTrajectory.splice(0, removeCount);
        }
        
        // 連語フィールド制限
        if (this.collocationFields.length > this.maxCollocationFields) {
            const removeCount = this.collocationFields.length - Math.floor(this.maxCollocationFields * 0.8);
            this.collocationFields.splice(0, removeCount);
        }
        
        // 創発パターン制限
        if (this.emergentPatterns.length > this.maxEmergentPatterns) {
            const removeCount = this.emergentPatterns.length - Math.floor(this.maxEmergentPatterns * 0.8);
            this.emergentPatterns.splice(0, removeCount);
        }
        
        // 自己リフレクション履歴制限
        if (this.selfReflectionHistory && this.selfReflectionHistory.length > this.maxSelfReflectionHistory) {
            const removeCount = this.selfReflectionHistory.length - Math.floor(this.maxSelfReflectionHistory * 0.8);
            this.selfReflectionHistory.splice(0, removeCount);
        }
    }

    /**
     * 安全な接続追加
     */
    addConnection(connection) {
        if (!connection || !connection.from || !connection.to) {
            return;
        }
        
        // 重複チェック
        const exists = this.connections.some(conn => 
            conn.from === connection.from && conn.to === connection.to
        );
        
        if (!exists) {
            this.connections.push(connection);
        }
    }

    /**
     * 安全な連語フィールド追加
     */
    addCollocationFields(fields) {
        if (!Array.isArray(fields)) return;
        
        const validFields = fields.filter(field => 
            field && field.geometry && Array.isArray(field.geometry)
        );
        
        this.collocationFields.push(...validFields);
        
        // サイズ制限
        if (this.collocationFields.length > this.maxCollocationFields) {
            const removeCount = this.collocationFields.length - this.maxCollocationFields;
            this.collocationFields.splice(0, removeCount);
        }
    }

    calculateGrowthDirection(node, nearbyNodes) {
        if (!node || !node.velocity || !node.position) {
            return { dx: 1, dy: 0 };
        }
        
        let direction = { ...node.velocity };
        
        // 近隣ノードからの反発力
        if (Array.isArray(nearbyNodes)) {
            for (const nearby of nearbyNodes) {
                if (!nearby || !nearby.position || nearby.id === node.id) continue;
                
                const dx = node.position.x - nearby.position.x;
                const dy = node.position.y - nearby.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > 0 && dist < 30) {
                    const force = (30 - dist) / 30;
                    direction.dx += (dx / dist) * force * 0.3;
                    direction.dy += (dy / dist) * force * 0.3;
                }
            }
        }
        
        // 正規化
        const mag = Math.sqrt(direction.dx * direction.dx + direction.dy * direction.dy);
        return mag > 0 ? {
            dx: direction.dx / mag,
            dy: direction.dy / mag
        } : { dx: 1, dy: 0 };
    }

    applyCurvature(direction, curvature) {
        if (!direction || typeof direction.dx !== 'number' || typeof direction.dy !== 'number') {
            return { dx: 1, dy: 0 };
        }
        
        const safeCurvature = Math.max(0, Math.min(1, Number(curvature) || 0));
        const angle = Math.atan2(direction.dy, direction.dx);
        const curveAngle = angle + (Math.random() - 0.5) * safeCurvature * Math.PI;
        
        return {
            dx: Math.cos(curveAngle),
            dy: Math.sin(curveAngle)
        };
    }

    checkIntersection(node, nearbyNodes) {
        if (!node || !node.position || !Array.isArray(nearbyNodes)) {
            return false;
        }
        
        for (const nearby of nearbyNodes) {
            if (!nearby || !nearby.position || nearby.id === node.id) continue;
            
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
        if (!parentNode || !parentNode.position || !parentNode.velocity) {
            return null;
        }
        
        const branchAngle = Math.atan2(parentNode.velocity.dy, parentNode.velocity.dx) + 
                          (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 4 + Math.random() * Math.PI / 4);
        
        const nextTextIndex = Math.min(parentNode.textIndex + 1, this.text.length - 1);
        
        const branchNode = {
            id: `node_${this.nodes.length}`,
            char: this.text[nextTextIndex],
            position: {
                x: parentNode.position.x + Math.cos(branchAngle) * this.params.characterSpacing,
                y: parentNode.position.y + Math.sin(branchAngle) * this.params.characterSpacing
            },
            velocity: {
                dx: Math.cos(branchAngle),
                dy: Math.sin(branchAngle)
            },
            energy: Math.max(0, parentNode.energy * 0.7),
            generation: parentNode.generation + 1,
            textIndex: nextTextIndex,
            parent: parentNode.id,
            children: [],
            curvature: 0,
            semanticResonance: 0,
            collocationStrength: 0,
            readingDepth: { temporal: 0, semantic: 0, cognitive: 0, cultural: 0 },
            temporalLayer: this.getCurrentTemporalLayer()
        };
        
        if (!this.checkIntersection(branchNode, nearbyNodes)) {
            this.nodes.push(branchNode);
            this.spatialIndex.insert(branchNode);
            
            if (parentNode.children) {
                parentNode.children.push(branchNode.id);
            }
            
            this.addConnection({
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
        if (!parentNode || !parentNode.position || !Array.isArray(nearbyNodes)) {
            return null;
        }
        
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
                if (!nearby || !nearby.position) continue;
                
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

    // === 語義的成長メソッド群（null安全性強化） ===

    /**
     * 語義場を考慮した成長方向の計算
     */
    calculateSemanticGrowthDirection(node, nearbyNodes) {
        if (!node || !node.position) {
            return { dx: 1, dy: 0 };
        }
        
        // 従来の物理的方向
        const physicalDir = this.calculateGrowthDirection(node, nearbyNodes);
        
        // 語義的引力場の計算
        let semanticForce = { dx: 0, dy: 0 };
        
        if (Array.isArray(nearbyNodes)) {
            for (const nearby of nearbyNodes) {
                if (!nearby || !nearby.position || nearby.id === node.id) continue;
                
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
        if (!visualDir || !embodiedDir || !node) {
            return { dx: 1, dy: 0 };
        }
        
        const interferenceAmplitude = this.params.interferenceAmplitude;
        const embodimentFactor = this.params.embodimentFactor;
        
        // 干渉波形の生成
        const phase = (node.generation || 0) * 0.1 + (node.textIndex || 0) * 0.05;
        const interferenceX = Math.sin(phase) * interferenceAmplitude;
        const interferenceY = Math.cos(phase * 1.3) * interferenceAmplitude;
        
        // 視覚方向、身体化方向、干渉波形の合成
        const result = {
            dx: visualDir.dx * (1 - embodimentFactor) + 
                embodiedDir.dx * embodimentFactor + 
                interferenceX,
            dy: visualDir.dy * (1 - embodimentFactor) + 
                embodiedDir.dy * embodimentFactor + 
                interferenceY
        };
        
        return this.normalizeVector(result);
    }

    /**
     * 語義的曲率の計算
     */
    calculateSemanticCurvature(node, nearbyNodes) {
        if (!node || typeof node.energy !== 'number') {
            return 0.3;
        }
        
        const baseCurvature = Math.max(0, (this.params.initialEnergy - node.energy) / this.params.initialEnergy);
        
        // 連語強度による曲率修正
        let maxCollocation = 0;
        if (Array.isArray(nearbyNodes) && node.char) {
            for (const nearby of nearbyNodes) {
                if (!nearby || !nearby.char) continue;
                
                const collocationStrength = this.semanticField.getCollocationStrength(node.char, nearby.char);
                maxCollocation = Math.max(maxCollocation, collocationStrength);
            }
        }
        
        // 語義的複雑性による曲率
        const semanticComplexity = node.char ? this.semanticField.getSemanticComplexity(node.char) : 1;
        const complexityFactor = Math.min(1, semanticComplexity / 10);
        
        return Math.max(0, Math.min(1, baseCurvature + (maxCollocation * 0.3) + (complexityFactor * 0.2)));
    }

    /**
     * 語義的要因を含むエネルギー減衰の計算
     */
    calculateEnergyDecay(node, nearbyNodes) {
        if (!node) return this.params.energyDecay;
        
        let baseDecay = this.params.energyDecay;
        
        // 認知負荷による追加減衰
        const cognitiveLoad = this.semanticField.calculateCognitiveLoad(node);
        const loadPenalty = Math.max(0, cognitiveLoad * 0.1);
        
        // 連語関係によるエネルギー回復
        let collocationBonus = 0;
        if (Array.isArray(nearbyNodes) && node.char) {
            for (const nearby of nearbyNodes) {
                if (!nearby || !nearby.char) continue;
                
                const strength = this.semanticField.getCollocationStrength(node.char, nearby.char);
                collocationBonus += Math.max(0, strength * 0.05);
            }
        }
        
        return Math.max(0.1, Math.min(1, baseDecay + loadPenalty - collocationBonus));
    }

    /**
     * 語義的共鳴の計算
     */
    calculateSemanticResonance(node, nearbyNodes) {
        if (!node || !node.char || !node.position || !Array.isArray(nearbyNodes)) {
            return 0;
        }
        
        let totalResonance = 0;
        let validCount = 0;
        
        for (const nearby of nearbyNodes) {
            if (!nearby || !nearby.char || !nearby.position) continue;
            
            const semanticSimilarity = Math.max(0, 1 - this.semanticField.getSemanticDistance(node.char, nearby.char));
            const spatialProximity = Math.max(0, 1 - this.getDistance(node.position, nearby.position) / 100);
            
            totalResonance += semanticSimilarity * spatialProximity;
            validCount++;
        }
        
        return validCount > 0 ? Math.min(1, totalResonance / validCount) : 0;
    }

    /**
     * 最大連語強度の取得
     */
    getMaxCollocationStrength(node, nearbyNodes) {
        if (!node || !node.char || !Array.isArray(nearbyNodes)) {
            return 0;
        }
        
        let maxStrength = 0;
        
        for (const nearby of nearbyNodes) {
            if (!nearby || !nearby.char) continue;
            
            const strength = this.semanticField.getCollocationStrength(node.char, nearby.char);
            maxStrength = Math.max(maxStrength, strength);
        }
        
        return maxStrength;
    }

    /**
     * 読解深度の計算
     */
    calculateReadingDepth(node) {
        if (!node) {
            return { temporal: 0, semantic: 0, cognitive: 0, cultural: 0 };
        }
        
        return {
            temporal: this.semanticField.readingHistory.length,
            semantic: node.generation || 0,
            cognitive: this.calculateCognitiveDepth(node),
            cultural: this.getCulturalDepth(node)
        };
    }

    calculateCognitiveDepth(node) {
        if (!node || typeof node.generation !== 'number' || typeof node.energy !== 'number') {
            return 0;
        }
        
        return Math.log(node.generation + 1) * node.energy / this.params.initialEnergy;
    }

    getCulturalDepth(node) {
        if (!node || !node.char) return 0;
        
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
        if (!node || !node.position) return true;
        
        // 物理的交差チェック
        if (this.checkIntersection(node, nearbyNodes)) {
            return true;
        }
        
        // 語義的干渉チェック
        if (node.char && Array.isArray(nearbyNodes)) {
            for (const nearby of nearbyNodes) {
                if (!nearby || !nearby.char || !nearby.position) continue;
                
                const semanticDistance = this.semanticField.getSemanticDistance(node.char, nearby.char);
                const spatialDistance = this.getDistance(node.position, nearby.position);
                
                // 語義的に近い単語が物理的に近すぎる場合は干渉
                if (semanticDistance < 0.3 && spatialDistance < 25) {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * 接続タイプの決定
     */
    determineConnectionType(fromNode, toNode) {
        if (!fromNode || !toNode) {
            return { 
                visual: 'tertiary', 
                semantic: 'neutral', 
                interference: { amplitude: 0, frequency: 0, phase: 0 } 
            };
        }
        
        const energy = fromNode.energy || 0;
        const semanticDistance = fromNode.char && toNode.char ? 
            this.semanticField.getSemanticDistance(fromNode.char, toNode.char) : 1;
        const collocationStrength = fromNode.char && toNode.char ? 
            this.semanticField.getCollocationStrength(fromNode.char, toNode.char) : 0;
        
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
            amplitude: Math.max(0, Math.min(1, visualSemanticRatio * this.params.interferenceAmplitude)),
            frequency: Math.max(0, collocationStrength * 2 * Math.PI),
            phase: ((fromNode.generation || 0) + (toNode.generation || 0)) % (2 * Math.PI)
        };
        
        return { visual: visualType, semantic: semanticType, interference };
    }

    /**
     * 語義的分岐確率の計算
     */
    calculateSemanticBranchProbability(node, nearbyNodes) {
        if (!node || !node.char) return this.params.branchProbability;
        
        let baseProbability = this.params.branchProbability;
        
        // 語義的複雑性による分岐促進
        const semanticComplexity = this.semanticField.getSemanticComplexity(node.char);
        const complexityBonus = Math.min(0.3, semanticComplexity / 10);
        
        // 連語関係による分岐促進
        let collocationBonus = 0;
        if (Array.isArray(nearbyNodes)) {
            for (const nearby of nearbyNodes) {
                if (!nearby || !nearby.char) continue;
                
                const strength = this.semanticField.getCollocationStrength(node.char, nearby.char);
                if (strength > 0.5) {
                    collocationBonus += 0.1;
                }
            }
        }
        
        // 読解深度による調整
        const depthFactor = Math.min(1, this.semanticField.readingHistory.length / 100);
        
        return Math.max(0, Math.min(0.8, baseProbability + complexityBonus + collocationBonus * depthFactor));
    }

    /**
     * 語義的分岐の作成
     */
    createSemanticBranch(parentNode, nearbyNodes) {
        if (!parentNode || !parentNode.position) return null;
        
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
        
        if (!bestDirection || maxInterest <= 0) return null;
        
        const nextTextIndex = Math.min(parentNode.textIndex + 1, this.text.length - 1);
        
        const branchNode = {
            id: `node_${this.nodes.length}`,
            char: this.text[nextTextIndex],
            position: {
                x: parentNode.position.x + bestDirection.dx * this.params.characterSpacing,
                y: parentNode.position.y + bestDirection.dy * this.params.characterSpacing
            },
            velocity: { ...bestDirection },
            energy: Math.max(0, parentNode.energy * 0.8),
            generation: parentNode.generation + 1,
            textIndex: nextTextIndex,
            parent: parentNode.id,
            children: [],
            curvature: 0,
            
            // 語義的属性
            semanticResonance: maxInterest,
            branchType: 'semantic',
            collocationStrength: 0,
            readingDepth: this.calculateReadingDepth(parentNode),
            temporalLayer: this.getCurrentTemporalLayer()
        };
        
        if (!this.checkSemanticIntersection(branchNode, nearbyNodes)) {
            this.nodes.push(branchNode);
            this.spatialIndex.insert(branchNode);
            
            if (parentNode.children) {
                parentNode.children.push(branchNode.id);
            }
            
            this.addConnection({
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
        if (!node || !direction || !node.char) return 0;
        
        // その方向での語義的興味度を計算
        let interest = 0;
        
        // 方向性による基本興味度
        const angle = Math.atan2(direction.dy, direction.dx);
        interest += Math.sin(angle * 3) * 0.3; // 波状パターン
        
        // 近隣ノードとの語義的関係
        if (Array.isArray(nearbyNodes)) {
            for (const nearby of nearbyNodes) {
                if (!nearby || !nearby.position || !nearby.char) continue;
                
                const nearbyDir = this.getNormalizedDirection(node.position, nearby.position);
                const dirSimilarity = this.dot(direction, nearbyDir);
                
                if (dirSimilarity > 0.7) { // 同方向
                    const semanticSimilarity = 1 - this.semanticField.getSemanticDistance(node.char, nearby.char);
                    interest += semanticSimilarity * 0.4;
                }
            }
        }
        
        return Math.max(0, interest);
    }

    /**
     * 語義的回避分岐の作成
     */
    createSemanticAvoidanceBranch(parentNode, nearbyNodes) {
        if (!parentNode || !parentNode.position || !parentNode.char) return null;
        
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
        if (!position || !char || !Array.isArray(nearbyNodes)) return 0;
        
        let spatialFreedom = 1;
        let semanticFreedom = 1;
        
        for (const nearby of nearbyNodes) {
            if (!nearby || !nearby.position || !nearby.char) continue;
            
            const spatialDist = this.getDistance(position, nearby.position);
            const semanticDist = this.semanticField.getSemanticDistance(char, nearby.char);
            
            spatialFreedom *= Math.min(1, spatialDist / 30);
            semanticFreedom *= Math.min(1, semanticDist);
        }
        
        return (spatialFreedom + semanticFreedom) / 2;
    }

    /**
     * 読解軌跡の記録（null安全性強化）
     */
    recordReadingTrajectory(fromNode, toNode, direction) {
        if (!fromNode || !fromNode.position) return;
        
        const trajectoryPoint = {
            timestamp: Date.now(),
            from: {
                id: fromNode.id || 'unknown',
                char: fromNode.char || '',
                position: { ...fromNode.position }
            },
            to: toNode ? {
                id: toNode.id || 'unknown',
                char: toNode.char || '',
                position: { ...toNode.position }
            } : null,
            direction: direction ? { ...direction } : { dx: 0, dy: 0 },
            semanticContext: {
                resonance: fromNode.semanticResonance || 0,
                collocationStrength: fromNode.collocationStrength || 0,
                readingDepth: fromNode.readingDepth || { temporal: 0, semantic: 0 }
            },
            cognitiveState: {
                energy: fromNode.energy || 0,
                generation: fromNode.generation || 0,
                curvature: fromNode.curvature || 0
            }
        };
        
        this.readingTrajectory.push(trajectoryPoint);
        
        // 履歴の制限（メモリ管理）
        if (this.readingTrajectory.length > this.maxTrajectoryLength) {
            const removeCount = this.readingTrajectory.length - this.maxTrajectoryLength;
            this.readingTrajectory.splice(0, removeCount);
        }
    }

    /**
     * 創発パターンの更新
     */
    updateEmergentPatterns() {
        if (this.nodes.length < 10) return;
        
        try {
            const patterns = this.semanticField.recognizeEmergentPatterns(this.nodes, this.connections);
            
            // 新しいパターンのみを追加
            if (patterns.clusters && Array.isArray(patterns.clusters)) {
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
            }
            
            if (patterns.bridges && Array.isArray(patterns.bridges)) {
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
            }
            
            if (patterns.spirals && Array.isArray(patterns.spirals)) {
                patterns.spirals.forEach(spiral => {
                    this.emergentPatterns.push({
                        type: 'reading_spiral',
                        trajectory: spiral,
                        generation: this.generation,
                        complexity: spiral.length
                    });
                });
            }
            
            // パターン数制限
            if (this.emergentPatterns.length > this.maxEmergentPatterns) {
                const removeCount = this.emergentPatterns.length - this.maxEmergentPatterns;
                this.emergentPatterns.splice(0, removeCount);
            }
            
        } catch (error) {
            console.warn('Error updating emergent patterns:', error);
        }
    }

    hasExistingPattern(type, newPattern) {
        if (!Array.isArray(this.emergentPatterns)) return false;
        
        return this.emergentPatterns.some(pattern => {
            if (type === 'cluster' && pattern.type === 'semantic_cluster') {
                if (!pattern.elements || !Array.isArray(newPattern)) return false;
                
                const existingIds = pattern.elements.map(e => e && e.id).filter(Boolean);
                const newIds = newPattern.map(e => e && e.id).filter(Boolean);
                
                return this.arraysOverlap(existingIds, newIds, 0.7);
            }
            return false;
        });
    }

    arraysOverlap(arr1, arr2, threshold) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
        
        const intersection = arr1.filter(x => arr2.includes(x));
        const union = [...new Set([...arr1, ...arr2])];
        return union.length > 0 ? intersection.length / union.length >= threshold : false;
    }

    /**
     * 自己リフレクションの実行
     */
    performSelfReflection() {
        try {
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
            
            // 履歴サイズ制限
            if (this.selfReflectionHistory.length > this.maxSelfReflectionHistory) {
                const removeCount = this.selfReflectionHistory.length - this.maxSelfReflectionHistory;
                this.selfReflectionHistory.splice(0, removeCount);
            }
            
            // システムパラメータの適応的調整
            this.adaptSystemParameters(selfReflection);
            
        } catch (error) {
            console.warn('Error in self reflection:', error);
        }
    }

    calculateAverageSemanticResonance() {
        if (this.nodes.length === 0) return 0;
        
        const validNodes = this.nodes.filter(node => 
            node && typeof node.semanticResonance === 'number'
        );
        
        if (validNodes.length === 0) return 0;
        
        const totalResonance = validNodes.reduce((sum, node) => {
            return sum + node.semanticResonance;
        }, 0);
        
        return totalResonance / validNodes.length;
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
            if (conn && conn.semanticType && conn.semanticType !== 'neutral') {
                totalSemanticConnections++;
            }
        });
        
        return totalSemanticConnections / this.nodes.length;
    }

    calculateVisualComplexity() {
        if (this.connections.length === 0) return 0;
        
        let totalCurvature = 0;
        let validConnections = 0;
        
        this.connections.forEach(conn => {
            if (conn && typeof conn.curvature === 'number') {
                totalCurvature += conn.curvature;
                validConnections++;
            }
        });
        
        return validConnections > 0 ? totalCurvature / validConnections : 0;
    }

    generateSystemInsights() {
        const insights = [];
        
        try {
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
                conn && conn.interference && conn.interference.amplitude > 0.3
            );
            if (interferenceConnections.length > 0) {
                insights.push({
                    type: 'visual_semantic_interference',
                    description: `${interferenceConnections.length}個の視覚-語義干渉パターンが活性化`,
                    significance: interferenceConnections.length / this.connections.length
                });
            }
            
        } catch (error) {
            console.warn('Error generating insights:', error);
        }
        
        return insights;
    }

    adaptSystemParameters(reflection) {
        if (!reflection || !reflection.systemState) return;
        
        try {
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
            
        } catch (error) {
            console.warn('Error adapting parameters:', error);
        }
    }

    // === ユーティリティメソッド（null安全性強化） ===

    getDistance(pos1, pos2) {
        if (!pos1 || !pos2 || 
            typeof pos1.x !== 'number' || typeof pos1.y !== 'number' ||
            typeof pos2.x !== 'number' || typeof pos2.y !== 'number') {
            return Infinity;
        }
        
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getNormalizedDirection(from, to) {
        if (!from || !to || 
            typeof from.x !== 'number' || typeof from.y !== 'number' ||
            typeof to.x !== 'number' || typeof to.y !== 'number') {
            return { dx: 0, dy: 0 };
        }
        
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const mag = Math.sqrt(dx * dx + dy * dy);
        return mag > 0 ? { dx: dx / mag, dy: dy / mag } : { dx: 0, dy: 0 };
    }

    normalizeVector(vector) {
        if (!vector || typeof vector.dx !== 'number' || typeof vector.dy !== 'number') {
            return { dx: 0, dy: 0 };
        }
        
        const mag = Math.sqrt(vector.dx * vector.dx + vector.dy * vector.dy);
        return mag > 0 ? { dx: vector.dx / mag, dy: vector.dy / mag } : { dx: 0, dy: 0 };
    }

    dot(v1, v2) {
        if (!v1 || !v2 || 
            typeof v1.dx !== 'number' || typeof v1.dy !== 'number' ||
            typeof v2.dx !== 'number' || typeof v2.dy !== 'number') {
            return 0;
        }
        
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
        
        if (typeof SemanticField !== 'undefined') {
            this.semanticField = new SemanticField();
        }
        
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
        return this.collocationFields || [];
    }

    /**
     * 読解軌跡を取得
     */
    getReadingTrajectory() {
        return this.readingTrajectory || [];
    }

    /**
     * 創発パターンを取得
     */
    getEmergentPatterns() {
        return this.emergentPatterns || [];
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
                generation: this.generation,
                textLength: this.text.length
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
            currentState: this.captureSystemState(),
            memoryUsage: this.getMemoryUsage()
        };
    }

    /**
     * メモリ使用量の推定
     */
    getMemoryUsage() {
        return {
            nodes: this.nodes.length * 200, // 1ノード約200バイト
            connections: this.connections.length * 100, // 1接続約100バイト
            trajectory: this.readingTrajectory.length * 150, // 1軌跡点約150バイト
            collocationFields: this.collocationFields.length * 80, // 1フィールド約80バイト
            emergentPatterns: this.emergentPatterns.length * 120, // 1パターン約120バイト
            total: (this.nodes.length * 200) + 
                   (this.connections.length * 100) + 
                   (this.readingTrajectory.length * 150) + 
                   (this.collocationFields.length * 80) + 
                   (this.emergentPatterns.length * 120)
        };
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrganicLayout;
} else if (typeof window !== 'undefined') {
    window.OrganicLayout = OrganicLayout;
}
