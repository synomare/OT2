/**
 * Organic Typography System - 統合インデックス
 * 自己リフレクティブな言語読解体験のためのシステムアート
 */

// 依存関係の適切な読み込み順序を定義
(function() {
    'use strict';
    
    // グローバル名前空間の初期化
    if (typeof window !== 'undefined') {
        window.OrganicTypography = window.OrganicTypography || {};
    }
    
    // モジュール読み込みの状態管理
    const moduleLoader = {
        loaded: {},
        loading: {},
        dependencies: {
            'SpatialIndex': [],
            'SemanticField': [],
            'TemporalContext': [],
            'OrganicLayout': ['SemanticField', 'SpatialIndex'],
            'MetaCognitiveOrchestrator': ['OrganicLayout', 'SemanticField', 'TemporalContext']
        },
        
        /**
         * モジュールの動的読み込み
         */
        async loadModule(moduleName) {
            if (this.loaded[moduleName]) {
                return this.loaded[moduleName];
            }
            
            if (this.loading[moduleName]) {
                return this.loading[moduleName];
            }
            
            this.loading[moduleName] = this._loadModuleInternal(moduleName);
            const result = await this.loading[moduleName];
            this.loaded[moduleName] = result;
            delete this.loading[moduleName];
            
            return result;
        },
        
        /**
         * 内部モジュール読み込み実装
         */
        async _loadModuleInternal(moduleName) {
            // 依存関係を先に読み込み
            const deps = this.dependencies[moduleName] || [];
            for (const dep of deps) {
                try {
                    await this.loadModule(dep);
                } catch (error) {
                    console.warn(`Dependency ${dep} failed to load:`, error.message);
                }
            }
            
            // モジュールファイルの読み込み
            return new Promise((resolve, reject) => {
                if (typeof window === 'undefined') {
                    // Node.js環境
                    try {
                        const moduleClass = require(`./${moduleName}.js`);
                        if (typeof global !== 'undefined') {
                            global[moduleName] = moduleClass;
                        }
                        resolve(moduleClass);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    // ブラウザ環境 - 既に読み込まれているかチェック
                    if (window[moduleName]) {
                        resolve(window[moduleName]);
                        return;
                    }
                    
                    const script = document.createElement('script');
                    script.src = `js/${moduleName}.js`;
                    script.async = false; // 順序保証
                    
                    script.onload = () => {
                        // 少し待ってからチェック
                        setTimeout(() => {
                            if (window[moduleName]) {
                                resolve(window[moduleName]);
                            } else {
                                reject(new Error(`Module ${moduleName} not found after loading`));
                            }
                        }, 50);
                    };
                    
                    script.onerror = (event) => {
                        reject(new Error(`Failed to load ${moduleName}: ${event.message || 'Network error'}`));
                    };
                    
                    // 既存のスクリプトタグと重複しないかチェック
                    const existingScript = document.querySelector(`script[src="js/${moduleName}.js"]`);
                    if (!existingScript) {
                        document.head.appendChild(script);
                    } else {
                        // 既に読み込まれている場合は短時間後にチェック
                        setTimeout(() => {
                            if (window[moduleName]) {
                                resolve(window[moduleName]);
                            } else {
                                reject(new Error(`Module ${moduleName} exists but class not available`));
                            }
                        }, 100);
                    }
                }
            });
        },
        
        /**
         * すべてのモジュールを適切な順序で読み込み
         */
        async loadAll() {
            const loadOrder = [
                'SpatialIndex',
                'SemanticField', 
                'TemporalContext',
                'OrganicLayout',
                'MetaCognitiveOrchestrator'
            ];
            
            const results = {};
            for (const moduleName of loadOrder) {
                try {
                    results[moduleName] = await this.loadModule(moduleName);
                    console.log(`✓ ${moduleName} loaded successfully`);
                } catch (error) {
                    console.warn(`⚠ ${moduleName} failed to load:`, error.message);
                    // フォールバック：各ファイル内で定義されているフォールバッククラスを使用
                }
            }
            
            return results;
        }
    };
    
    /**
     * システム全体の初期化
     */
    class OrganicTypographySystem {
        constructor() {
            this.modules = {};
            this.orchestrator = null;
            this.isInitialized = false;
        }
        
        /**
         * システムの非同期初期化
         */
        async initialize(text = "言語を読むとは何か", canvasWidth = 800, canvasHeight = 600, config = {}) {
            try {
                console.log('🚀 Organic Typography System 初期化開始...');
                
                // モジュールの読み込み
                this.modules = await moduleLoader.loadAll();
                
                // メインオーケストレーターの初期化
                if (typeof MetaCognitiveOrchestrator !== 'undefined') {
                    this.orchestrator = new MetaCognitiveOrchestrator(text, canvasWidth, canvasHeight, config);
                    console.log('🧠 MetaCognitiveOrchestrator 初期化完了');
                } else {
                    console.warn('⚠ MetaCognitiveOrchestrator が利用できません。基本モードで動作します。');
                    
                    // フォールバック：OrganicLayoutのみで動作
                    if (typeof OrganicLayout !== 'undefined') {
                        this.orchestrator = new OrganicLayout(text, canvasWidth, canvasHeight);
                        console.log('📝 OrganicLayout フォールバックモードで初期化');
                    } else {
                        throw new Error('必要なモジュールが読み込めませんでした');
                    }
                }
                
                this.isInitialized = true;
                console.log('✅ システム初期化完了');
                
                return this.orchestrator;
                
            } catch (error) {
                console.error('❌ システム初期化エラー:', error);
                throw error;
            }
        }
        
        /**
         * システムの開始
         */
        start() {
            if (!this.isInitialized || !this.orchestrator) {
                throw new Error('システムが初期化されていません。initialize()を最初に呼び出してください。');
            }
            
            this.orchestrator.start();
            console.log('▶️ システム開始');
        }
        
        /**
         * システムの更新（アニメーションループ）
         */
        update() {
            if (!this.orchestrator) return;
            
            try {
                if (typeof this.orchestrator.update === 'function') {
                    this.orchestrator.update();
                } else if (typeof this.orchestrator.grow === 'function') {
                    this.orchestrator.grow();
                }
                
                // メモリ使用量チェックと最適化
                this.performMemoryOptimization();
            } catch (error) {
                console.warn('Update error:', error);
            }
        }
        
        /**
         * メモリ最適化
         */
        performMemoryOptimization() {
            if (!this.orchestrator || !this.orchestrator.organicLayout) return;
            
            const layout = this.orchestrator.organicLayout;
            
            // ノード数の制限
            const maxNodes = 1000;
            if (layout.nodes && layout.nodes.length > maxNodes) {
                const removeCount = layout.nodes.length - maxNodes;
                const removedNodes = layout.nodes.splice(0, removeCount);
                
                // 削除されたノードの接続も削除
                if (layout.connections) {
                    const removedIds = new Set(removedNodes.map(n => n.id));
                    layout.connections = layout.connections.filter(conn => 
                        !removedIds.has(conn.from) && !removedIds.has(conn.to)
                    );
                }
                
                // 空間インデックスの更新
                if (layout.spatialIndex && typeof layout.spatialIndex.clear === 'function') {
                    layout.spatialIndex.clear();
                    layout.nodes.forEach(node => {
                        if (typeof layout.spatialIndex.insert === 'function') {
                            layout.spatialIndex.insert(node);
                        }
                    });
                }
            }
            
            // 読解軌跡の制限
            const maxTrajectory = 500;
            if (layout.readingTrajectory && layout.readingTrajectory.length > maxTrajectory) {
                layout.readingTrajectory = layout.readingTrajectory.slice(-maxTrajectory);
            }
            
            // 連語フィールドの制限
            const maxFields = 200;
            if (layout.collocationFields && layout.collocationFields.length > maxFields) {
                layout.collocationFields = layout.collocationFields.slice(-maxFields);
            }
            
            // 創発パターンの制限
            const maxPatterns = 100;
            if (layout.emergentPatterns && layout.emergentPatterns.length > maxPatterns) {
                layout.emergentPatterns = layout.emergentPatterns.slice(-maxPatterns);
            }
            
            // メタ認知システムの履歴制限
            if (this.orchestrator.systemStates && this.orchestrator.systemStates.length > 200) {
                this.orchestrator.systemStates = this.orchestrator.systemStates.slice(-150);
            }
            
            if (this.orchestrator.cognitiveCycles && this.orchestrator.cognitiveCycles.length > 100) {
                this.orchestrator.cognitiveCycles = this.orchestrator.cognitiveCycles.slice(-75);
            }
        }
        
        /**
         * システムの一時停止
         */
        pause() {
            if (this.orchestrator) {
                this.orchestrator.pause();
                console.log('⏸️ システム一時停止');
            }
        }
        
        /**
         * システムのリセット
         */
        reset() {
            if (this.orchestrator) {
                this.orchestrator.reset();
                console.log('🔄 システムリセット');
            }
        }
        
        /**
         * システムレポートの取得
         */
        getReport() {
            if (!this.orchestrator) return null;
            
            if (typeof this.orchestrator.getIntegratedSystemReport === 'function') {
                return this.orchestrator.getIntegratedSystemReport();
            } else if (typeof this.orchestrator.getSystemReport === 'function') {
                return this.orchestrator.getSystemReport();
            } else {
                return {
                    nodes: this.orchestrator.nodes?.length || 0,
                    connections: this.orchestrator.connections?.length || 0,
                    generation: this.orchestrator.generation || 0
                };
            }
        }
        
        /**
         * 読解体験アーカイブの取得
         */
        getExperienceArchive() {
            if (this.orchestrator && typeof this.orchestrator.getReadingExperienceArchive === 'function') {
                return this.orchestrator.getReadingExperienceArchive();
            }
            return null;
        }
    }
    
    /**
     * 便利なファクトリー関数
     */
    const createOrganicTypography = async (text, canvasWidth, canvasHeight, config) => {
        try {
            const system = new OrganicTypographySystem();
            await system.initialize(text, canvasWidth, canvasHeight, config);
            return system;
        } catch (error) {
            console.error('createOrganicTypography error:', error);
            throw error;
        }
    };
    
    /**
     * デモ用の完全なアニメーションループ
     */
    const createAnimatedDemo = async (containerId, text = "読む身体が枝を探索する", config = {}) => {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element with id '${containerId}' not found`);
        }
        
        const canvas = document.createElement('canvas');
        const width = config.width || container.clientWidth || 800;
        const height = config.height || container.clientHeight || 600;
        
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const system = await createOrganicTypography(text, width, height, config);
        
        let animationId;
        let isRunning = false;
        
        const animate = () => {
            if (!isRunning) return;
            
            // キャンバスクリア
            ctx.clearRect(0, 0, width, height);
            
            // システム更新
            system.update();
            
            // 描画
            if (system.orchestrator) {
                drawSystem(ctx, system.orchestrator);
            }
            
            animationId = requestAnimationFrame(animate);
        };
        
        const controls = {
            start() {
                if (!isRunning) {
                    isRunning = true;
                    system.start();
                    animate();
                    console.log('🎬 アニメーション開始');
                }
            },
            
            pause() {
                isRunning = false;
                system.pause();
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                console.log('⏸️ アニメーション一時停止');
            },
            
            reset() {
                isRunning = false;
                system.reset();
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                ctx.clearRect(0, 0, width, height);
                console.log('🔄 アニメーションリセット');
            },
            
            getReport: () => system.getReport(),
            getArchive: () => system.getExperienceArchive()
        };
        
        return controls;
    };
    
    /**
     * システムの描画関数
     */
    function drawSystem(ctx, orchestrator) {
        if (!orchestrator.organicLayout) return;
        
        const layout = orchestrator.organicLayout;
        
        // ノードの描画
        layout.nodes.forEach(node => {
            drawNode(ctx, node);
        });
        
        // 接続の描画
        layout.connections.forEach(connection => {
            drawConnection(ctx, connection, layout.nodes);
        });
        
        // 連語感覚フィールドの描画
        if (layout.collocationFields) {
            layout.collocationFields.forEach(field => {
                drawCollocationField(ctx, field);
            });
        }
        
        // 読解軌跡の描画
        if (layout.readingTrajectory && layout.readingTrajectory.length > 1) {
            drawReadingTrajectory(ctx, layout.readingTrajectory);
        }
    }
    
    function drawNode(ctx, node) {
        if (!node || !node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
            return;
        }
        
        try {
            ctx.save();
            
            // 語義的共鳴による色の変化
            const resonance = Math.max(0, Math.min(1, node.semanticResonance || 0));
            const hue = 200 + resonance * 60; // 青から紫へ
            const saturation = 50 + resonance * 50;
            const lightness = 30 + resonance * 30;
            
            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            
            // エネルギーによるサイズの変化
            const energy = Math.max(0, Math.min(100, node.energy || 50));
            const size = Math.max(2, Math.min(20, 6 + energy / 10));
            
            // 位置の境界チェック
            const x = Math.max(size, Math.min(ctx.canvas.width - size, node.position.x));
            const y = Math.max(size, Math.min(ctx.canvas.height - size, node.position.y));
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // 文字の描画
            if (node.char && typeof node.char === 'string') {
                ctx.fillStyle = '#ffffff';
                const fontSize = Math.max(8, Math.min(24, size * 2));
                ctx.font = `${fontSize}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // テキストが長すぎる場合は切り詰める
                const displayChar = node.char.length > 2 ? node.char.substring(0, 2) : node.char;
                ctx.fillText(displayChar, x, y);
            }
            
            ctx.restore();
        } catch (error) {
            console.warn('Error drawing node:', error);
            ctx.restore();
        }
    }
    
    function drawConnection(ctx, connection, nodes) {
        if (!connection || !connection.from || !connection.to || !Array.isArray(nodes)) {
            return;
        }
        
        const fromNode = nodes.find(n => n && n.id === connection.from);
        const toNode = nodes.find(n => n && n.id === connection.to);
        
        if (!fromNode || !toNode || !fromNode.position || !toNode.position) return;
        
        try {
            ctx.save();
            
            // 接続タイプによる線の描画
            const alpha = connection.type === 'primary' ? 0.8 : 
                         connection.type === 'secondary' ? 0.5 : 0.3;
            
            ctx.strokeStyle = `rgba(100, 150, 255, ${Math.max(0.1, Math.min(1, alpha))})`;
            ctx.lineWidth = connection.type === 'primary' ? 2 : 1;
            
            // NaN チェック
            if (isNaN(fromNode.position.x) || isNaN(fromNode.position.y) || 
                isNaN(toNode.position.x) || isNaN(toNode.position.y)) {
                return;
            }
            
            ctx.beginPath();
            ctx.moveTo(fromNode.position.x, fromNode.position.y);
            
            // 曲率による曲線描画
            const curvature = connection.curvature || 0;
            if (curvature > 0.1) {
                const midX = (fromNode.position.x + toNode.position.x) / 2;
                const midY = (fromNode.position.y + toNode.position.y) / 2;
                const offset = Math.max(-100, Math.min(100, curvature * 50));
                
                ctx.quadraticCurveTo(
                    midX + offset, midY + offset,
                    toNode.position.x, toNode.position.y
                );
            } else {
                ctx.lineTo(toNode.position.x, toNode.position.y);
            }
            
            ctx.stroke();
            ctx.restore();
        } catch (error) {
            console.warn('Error drawing connection:', error);
            ctx.restore();
        }
    }
    
    function drawCollocationField(ctx, field) {
        if (!field.geometry || field.geometry.length === 0) return;
        
        ctx.save();
        ctx.fillStyle = `rgba(255, 200, 100, ${field.intensity * 0.2})`;
        ctx.strokeStyle = `rgba(255, 200, 100, ${field.intensity * 0.5})`;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(field.geometry[0].x, field.geometry[0].y);
        
        for (let i = 1; i < field.geometry.length; i++) {
            ctx.lineTo(field.geometry[i].x, field.geometry[i].y);
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    
    function drawReadingTrajectory(ctx, trajectory) {
        if (trajectory.length < 2) return;
        
        ctx.save();
        ctx.strokeStyle = 'rgba(200, 100, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(trajectory[0].from.position.x, trajectory[0].from.position.y);
        
        for (let i = 1; i < trajectory.length; i++) {
            if (trajectory[i].from && trajectory[i].from.position) {
                ctx.lineTo(trajectory[i].from.position.x, trajectory[i].from.position.y);
            }
        }
        
        ctx.stroke();
        ctx.restore();
    }
    
    // エクスポート
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            OrganicTypographySystem,
            createOrganicTypography,
            createAnimatedDemo,
            moduleLoader
        };
    } else if (typeof window !== 'undefined') {
        window.OrganicTypography = {
            System: OrganicTypographySystem,
            create: createOrganicTypography,
            createDemo: createAnimatedDemo,
            moduleLoader: moduleLoader
        };
    }
    
})();