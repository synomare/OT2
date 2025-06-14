class SpatialIndex {
    constructor(width, height, cellSize = 50) {
        // 入力値検証
        this.width = Math.max(1, Number(width) || 800);
        this.height = Math.max(1, Number(height) || 600);
        this.cellSize = Math.max(1, Number(cellSize) || 50);
        
        this.gridWidth = Math.ceil(this.width / this.cellSize);
        this.gridHeight = Math.ceil(this.height / this.cellSize);
        this.grid = new Map();
        this.itemCount = 0;
        
        // パフォーマンス最適化用 - メモリリーク対策
        this.queryCache = new Map();
        this.maxCacheSize = 100; // 大幅削減
        this.cacheAccessOrder = []; // LRU用
    }

    /**
     * グリッドキーの計算（境界チェック付き）
     */
    getGridKey(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
            console.warn('Invalid coordinates for grid key:', { x, y });
            return '0,0';
        }
        
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        // 境界内に制限
        const clampedX = Math.max(0, Math.min(this.gridWidth - 1, gridX));
        const clampedY = Math.max(0, Math.min(this.gridHeight - 1, gridY));
        
        return `${clampedX},${clampedY}`;
    }

    /**
     * アイテムの挿入（null安全性強化）
     */
    insert(item) {
        if (!item || !item.position || typeof item.position !== 'object') {
            console.warn('Invalid item for spatial index:', item);
            return false;
        }
        
        const { x, y } = item.position;
        if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
            console.warn('Invalid position for spatial index:', item.position);
            return false;
        }
        
        // 既存アイテムの重複チェック
        if (item.id && this.findItemById(item.id)) {
            this.remove(item.id);
        }
        
        const key = this.getGridKey(x, y);
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        
        this.grid.get(key).push(item);
        this.itemCount++;
        
        // キャッシュクリア（メモリリーク対策）
        this.clearQueryCache();
        
        return true;
    }

    /**
     * 範囲クエリ（LRUキャッシュ実装）
     */
    query(position, radius) {
        if (!position || typeof position !== 'object') {
            console.warn('Invalid position for query:', position);
            return [];
        }
        
        const { x, y } = position;
        if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
            console.warn('Invalid position coordinates:', position);
            return [];
        }
        
        if (typeof radius !== 'number' || radius < 0 || isNaN(radius)) {
            console.warn('Invalid radius for query:', radius);
            return [];
        }
        
        // キャッシュキーの生成（精度を下げてヒット率向上）
        const cacheKey = `${Math.round(x)},${Math.round(y)},${Math.round(radius)}`;
        
        // LRUキャッシュチェック
        if (this.queryCache.has(cacheKey)) {
            this.updateCacheAccess(cacheKey);
            return this.queryCache.get(cacheKey);
        }
        
        // 実際のクエリ実行
        const results = this.performQuery(x, y, radius);
        
        // LRUキャッシュに保存
        this.addToCache(cacheKey, results);
        
        return results;
    }

    /**
     * 実際のクエリ実行（最適化版）
     */
    performQuery(x, y, radius) {
        const results = [];
        const gridRadius = Math.ceil(radius / this.cellSize);
        const centerX = Math.floor(x / this.cellSize);
        const centerY = Math.floor(y / this.cellSize);
        
        // 境界チェック付きグリッド走査
        const minX = Math.max(0, centerX - gridRadius);
        const maxX = Math.min(this.gridWidth - 1, centerX + gridRadius);
        const minY = Math.max(0, centerY - gridRadius);
        const maxY = Math.min(this.gridHeight - 1, centerY + gridRadius);

        for (let gridX = minX; gridX <= maxX; gridX++) {
            for (let gridY = minY; gridY <= maxY; gridY++) {
                const key = `${gridX},${gridY}`;
                const items = this.grid.get(key);
                
                if (items && items.length > 0) {
                    for (const item of items) {
                        if (!item || !item.position) continue;
                        
                        const dx = item.position.x - x;
                        const dy = item.position.y - y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist <= radius) {
                            results.push(item);
                        }
                    }
                }
            }
        }
        
        return results;
    }

    /**
     * LRUキャッシュアクセス更新
     */
    updateCacheAccess(cacheKey) {
        const index = this.cacheAccessOrder.indexOf(cacheKey);
        if (index > -1) {
            this.cacheAccessOrder.splice(index, 1);
        }
        this.cacheAccessOrder.push(cacheKey);
    }

    /**
     * LRUキャッシュ追加
     */
    addToCache(cacheKey, results) {
        // キャッシュサイズ制限
        if (this.queryCache.size >= this.maxCacheSize) {
            // 最も古いエントリを削除
            const oldestKey = this.cacheAccessOrder.shift();
            if (oldestKey) {
                this.queryCache.delete(oldestKey);
            }
        }
        
        this.queryCache.set(cacheKey, results);
        this.cacheAccessOrder.push(cacheKey);
    }

    /**
     * IDによるアイテム検索（最適化版）
     */
    findItemById(id) {
        if (!id) return null;
        
        for (const items of this.grid.values()) {
            if (!Array.isArray(items)) continue;
            
            for (const item of items) {
                if (item && item.id === id) {
                    return item;
                }
            }
        }
        return null;
    }

    /**
     * アイテムの削除（null安全性強化）
     */
    remove(id) {
        if (!id) return false;
        
        let removed = false;
        for (const [key, items] of this.grid) {
            if (!Array.isArray(items)) continue;
            
            for (let i = items.length - 1; i >= 0; i--) {
                const item = items[i];
                if (item && item.id === id) {
                    items.splice(i, 1);
                    this.itemCount = Math.max(0, this.itemCount - 1);
                    removed = true;
                    
                    // 空のセルを削除
                    if (items.length === 0) {
                        this.grid.delete(key);
                    }
                }
            }
        }
        
        if (removed) {
            this.clearQueryCache();
        }
        
        return removed;
    }

    /**
     * アイテムの更新（位置変更）
     */
    update(item) {
        if (!item || !item.id) {
            return false;
        }
        
        // 古い位置から削除
        this.remove(item.id);
        
        // 新しい位置に挿入
        return this.insert(item);
    }

    /**
     * 全クリア
     */
    clear() {
        this.grid.clear();
        this.itemCount = 0;
        this.clearQueryCache();
    }

    /**
     * クエリキャッシュのクリア
     */
    clearQueryCache() {
        this.queryCache.clear();
        this.cacheAccessOrder.length = 0;
    }

    /**
     * 統計情報の取得
     */
    getStats() {
        return {
            itemCount: this.itemCount,
            cellCount: this.grid.size,
            gridSize: this.gridWidth * this.gridHeight,
            cacheSize: this.queryCache.size,
            averageItemsPerCell: this.grid.size > 0 ? this.itemCount / this.grid.size : 0,
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    /**
     * メモリ使用量推定
     */
    estimateMemoryUsage() {
        const itemMemory = this.itemCount * 200; // 1アイテム約200バイト
        const gridMemory = this.grid.size * 100; // 1グリッドセル約100バイト
        const cacheMemory = this.queryCache.size * 50; // 1キャッシュエントリ約50バイト
        
        return {
            items: itemMemory,
            grid: gridMemory,
            cache: cacheMemory,
            total: itemMemory + gridMemory + cacheMemory
        };
    }

    /**
     * 境界内の全アイテムを取得（最適化版）
     */
    getItemsInBounds(minX, minY, maxX, maxY) {
        if (typeof minX !== 'number' || typeof minY !== 'number' || 
            typeof maxX !== 'number' || typeof maxY !== 'number') {
            console.warn('Invalid bounds parameters');
            return [];
        }
        
        const results = [];
        
        const minGridX = Math.max(0, Math.floor(minX / this.cellSize));
        const minGridY = Math.max(0, Math.floor(minY / this.cellSize));
        const maxGridX = Math.min(this.gridWidth - 1, Math.floor(maxX / this.cellSize));
        const maxGridY = Math.min(this.gridHeight - 1, Math.floor(maxY / this.cellSize));
        
        for (let x = minGridX; x <= maxGridX; x++) {
            for (let y = minGridY; y <= maxGridY; y++) {
                const key = `${x},${y}`;
                const items = this.grid.get(key);
                
                if (items && Array.isArray(items)) {
                    for (const item of items) {
                        if (item && item.position && 
                            item.position.x >= minX && item.position.x <= maxX &&
                            item.position.y >= minY && item.position.y <= maxY) {
                            results.push(item);
                        }
                    }
                }
            }
        }
        
        return results;
    }

    /**
     * 最近傍アイテムの検索（最適化版）
     */
    findNearest(position, maxDistance = Infinity) {
        if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
            console.warn('Invalid position for nearest search');
            return null;
        }
        
        let nearest = null;
        let minDistance = Math.min(maxDistance, 1000); // 最大探索距離制限
        
        // 段階的に半径を拡大して探索
        const searchRadii = [50, 100, 200, 500, minDistance];
        
        for (const radius of searchRadii) {
            if (radius > minDistance) break;
            
            const candidates = this.query(position, radius);
            
            for (const item of candidates) {
                if (!item || !item.position) continue;
                
                const dx = item.position.x - position.x;
                const dy = item.position.y - position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = item;
                }
            }
            
            // 候補が見つかったら早期終了
            if (nearest) break;
        }
        
        return nearest;
    }

    /**
     * メモリクリーンアップ
     */
    cleanup() {
        // 空のグリッドセルを削除
        for (const [key, items] of this.grid) {
            if (!Array.isArray(items) || items.length === 0) {
                this.grid.delete(key);
            }
        }
        
        // キャッシュを半分まで縮小
        if (this.queryCache.size > this.maxCacheSize / 2) {
            const keepCount = Math.floor(this.maxCacheSize / 2);
            const keysToKeep = this.cacheAccessOrder.slice(-keepCount);
            
            this.queryCache.clear();
            this.cacheAccessOrder.length = 0;
            
            // 最近アクセスされたもののみ保持
            keysToKeep.forEach(key => {
                this.cacheAccessOrder.push(key);
            });
        }
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpatialIndex;
} else if (typeof window !== 'undefined') {
    window.SpatialIndex = SpatialIndex;
}
