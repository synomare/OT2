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
        
        // パフォーマンス最適化用
        this.queryCache = new Map();
        this.maxCacheSize = 1000;
    }

    /**
     * グリッドキーの計算（境界チェック付き）
     */
    getGridKey(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number') {
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
     * アイテムの挿入（入力検証付き）
     */
    insert(item) {
        if (!item || !item.position) {
            console.warn('Invalid item for spatial index:', item);
            return false;
        }
        
        if (typeof item.position.x !== 'number' || typeof item.position.y !== 'number') {
            console.warn('Invalid position for spatial index:', item.position);
            return false;
        }
        
        // 既存アイテムの重複チェック
        if (item.id && this.findItemById(item.id)) {
            this.remove(item.id);
        }
        
        const key = this.getGridKey(item.position.x, item.position.y);
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        
        this.grid.get(key).push(item);
        this.itemCount++;
        
        // キャッシュクリア
        this.clearQueryCache();
        
        return true;
    }

    /**
     * 範囲クエリ（キャッシュ付き）
     */
    query(position, radius) {
        if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
            console.warn('Invalid position for query:', position);
            return [];
        }
        
        if (typeof radius !== 'number' || radius < 0) {
            console.warn('Invalid radius for query:', radius);
            return [];
        }
        
        // キャッシュチェック
        const cacheKey = `${position.x.toFixed(1)},${position.y.toFixed(1)},${radius.toFixed(1)}`;
        if (this.queryCache.has(cacheKey)) {
            return this.queryCache.get(cacheKey);
        }
        
        const results = [];
        const gridRadius = Math.ceil(radius / this.cellSize);
        const centerX = Math.floor(position.x / this.cellSize);
        const centerY = Math.floor(position.y / this.cellSize);

        for (let dx = -gridRadius; dx <= gridRadius; dx++) {
            for (let dy = -gridRadius; dy <= gridRadius; dy++) {
                const gridX = centerX + dx;
                const gridY = centerY + dy;
                
                // 境界チェック
                if (gridX < 0 || gridX >= this.gridWidth || gridY < 0 || gridY >= this.gridHeight) {
                    continue;
                }
                
                const key = `${gridX},${gridY}`;
                if (this.grid.has(key)) {
                    const items = this.grid.get(key);
                    for (const item of items) {
                        if (!item || !item.position) continue;
                        
                        const dx = item.position.x - position.x;
                        const dy = item.position.y - position.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist <= radius) {
                            results.push(item);
                        }
                    }
                }
            }
        }
        
        // キャッシュに保存
        if (this.queryCache.size < this.maxCacheSize) {
            this.queryCache.set(cacheKey, results);
        }
        
        return results;
    }

    /**
     * IDによるアイテム検索
     */
    findItemById(id) {
        for (const [key, items] of this.grid) {
            for (const item of items) {
                if (item.id === id) {
                    return item;
                }
            }
        }
        return null;
    }

    /**
     * アイテムの削除
     */
    remove(id) {
        let removed = false;
        for (const [key, items] of this.grid) {
            for (let i = items.length - 1; i >= 0; i--) {
                if (items[i].id === id) {
                    items.splice(i, 1);
                    this.itemCount--;
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
            averageItemsPerCell: this.grid.size > 0 ? this.itemCount / this.grid.size : 0
        };
    }

    /**
     * 境界内の全アイテムを取得
     */
    getItemsInBounds(minX, minY, maxX, maxY) {
        const results = [];
        
        const minGridX = Math.floor(minX / this.cellSize);
        const minGridY = Math.floor(minY / this.cellSize);
        const maxGridX = Math.floor(maxX / this.cellSize);
        const maxGridY = Math.floor(maxY / this.cellSize);
        
        for (let x = minGridX; x <= maxGridX; x++) {
            for (let y = minGridY; y <= maxGridY; y++) {
                const key = `${x},${y}`;
                if (this.grid.has(key)) {
                    const items = this.grid.get(key);
                    for (const item of items) {
                        if (item.position.x >= minX && item.position.x <= maxX &&
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
     * 最近傍アイテムの検索
     */
    findNearest(position, maxDistance = Infinity) {
        let nearest = null;
        let minDistance = maxDistance;
        
        const radius = Math.min(maxDistance, Math.max(this.cellSize, 50));
        const candidates = this.query(position, radius);
        
        for (const item of candidates) {
            const dx = item.position.x - position.x;
            const dy = item.position.y - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearest = item;
            }
        }
        
        return nearest;
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpatialIndex;
} else if (typeof window !== 'undefined') {
    window.SpatialIndex = SpatialIndex;
}
