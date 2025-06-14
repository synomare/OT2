# Organic Typography - 自己リフレクティブな言語読解体験

> 読む身体・時間・歴史が織りなす語義的引力場のシステムアート

## 🧠 概要

Organic Typographyは、「言語を読むとは何か」を自己言及的に展示する革新的なシステムアートです。視覚的連結と語義的連結の干渉パターンを生成し、読む身体が時間・歴史・他者と共に意味の枝を探索する体験を提供します。

### 🌟 主要機能

- **語義的引力場**: 単語間の意味的関係を物理的な力として可視化
- **連語感覚の図形化**: 言葉の関係性を感覚フィールドとして描画
- **身体化された時間**: 心拍・呼吸・神経振動との同期
- **歴史的他者性**: 過去の声と未来の可能性の織り込み
- **自己リフレクション**: システムが自身の読解プロセスを再帰的分析
- **創発パターン**: 意味の螺旋・クラスター・橋渡しの自動検出

## 🚀 クイックスタート

### 基本的な使用方法

1. **example.html**を開く
2. 「開始」ボタンをクリック
3. 語義的引力場の生成を観察

```html
<!-- 最小限の実装例 -->
<!DOCTYPE html>
<html>
<head>
    <script src="js/index.js"></script>
</head>
<body>
    <div id="canvas-container"></div>
    <script>
        OrganicTypography.createDemo('canvas-container', '読む身体が枝を探索する')
            .then(demo => demo.start());
    </script>
</body>
</html>
```

### プログラマティックな使用

```javascript
// システムの作成
const system = new OrganicTypography.System();
await system.initialize('テキスト', 800, 600, {
    metaCognitiveDepth: 0.8,
    semanticGravity: 0.6,
    interferenceAmplitude: 0.4
});

// アニメーションループ
function animate() {
    system.update();
    requestAnimationFrame(animate);
}

system.start();
animate();
```

## 📁 ファイル構成

```
organic-typography-ver.2/
├── js/
│   ├── SpatialIndex.js           # 空間インデックス（最適化済み）
│   ├── SemanticField.js          # 語義場・連語感覚エンジン
│   ├── TemporalContext.js        # 多層時間文脈システム
│   ├── OrganicLayout.js          # 枝-文字成長モデル（拡張版）
│   ├── MetaCognitiveOrchestrator.js # メタ認知統合システム
│   └── index.js                  # 統合インデックス・描画システム
├── example.html                  # 完全デモページ
├── test.html                     # 統合テストシステム
└── README.md                     # このファイル
```

## 🔧 システムアーキテクチャ

### 4層統合アーキテクチャ

1. **SemanticField** - 語義引力場の計算エンジン
2. **TemporalContext** - 時間・記憶・歴史の多層システム
3. **OrganicLayout** - 視覚的成長と語義統合
4. **MetaCognitiveOrchestrator** - 自己リフレクション統合

### データフロー

```
テキスト入力
    ↓
語義構造解析 (SemanticField)
    ↓
時間文脈生成 (TemporalContext)
    ↓
有機的成長 (OrganicLayout)
    ↓
メタ認知統合 (MetaCognitiveOrchestrator)
    ↓
自己リフレクティブ出力
```

## ⚙️ 設定パラメータ

### 基本パラメータ

```javascript
const config = {
    // メタ認知設定
    metaCognitiveDepth: 0.7,        // メタ認知の深度 (0-1)
    selfReflectionFrequency: 10,    // 自己リフレクション頻度
    consciousnessThreshold: 0.6,    // 意識閾値
    
    // 語義的パラメータ
    semanticGravity: 0.6,           // 語義的引力の強さ
    collocationResonance: 0.8,      // 連語共鳴の強さ
    interferenceAmplitude: 0.4,     // 干渉パターンの振幅
    
    // 身体化・時間的パラメータ
    embodimentFactor: 0.7,          // 身体化要因
    temporalDecay: 0.95,            // 時間的減衰
    reflexivityDepth: 0.5           // 自己言及の深度
};
```

### 成長パラメータ

```javascript
const growthParams = {
    initialEnergy: 100,             // 初期エネルギー
    energyDecay: 0.3,               // エネルギー減衰率
    branchProbability: 0.15,        // 分岐確率
    characterSpacing: 18,           // 文字間隔
    coilingThreshold: 30            // 螺旋化閾値
};
```

## 🎯 主要API

### OrganicTypographySystem

```javascript
// システム作成
const system = new OrganicTypography.System();

// 初期化
await system.initialize(text, width, height, config);

// 制御
system.start();        // 開始
system.pause();        // 一時停止
system.reset();        // リセット
system.update();       // 更新

// データ取得
const report = system.getReport();                    // システムレポート
const archive = system.getExperienceArchive();       // 読解体験アーカイブ
```

### SemanticField

```javascript
const semanticField = new SemanticField();

// 語義構造解析
semanticField.analyzeSemanticStructure(text);

// 語義的力の計算
const force = semanticField.calculateSemanticForce(node1, node2, distance);

// 読む身体のシミュレーション
const embodiedDir = semanticField.simulateReadingBody(currentNode, allNodes);

// 連語感覚の可視化
const fields = semanticField.visualizeCollocationSensation(node, nearbyNodes);
```

### TemporalContext

```javascript
const temporalContext = new TemporalContext();

// 多層時間文脈の計算
const context = temporalContext.calculateTemporalContext(node, readingState);

// 身体化された時間の生成
const embodiedTime = temporalContext.generateEmbodiedTime(readingState, physicalState);

// 歴史的他者性の織り込み
const otherness = temporalContext.weaveHistoricalOtherness(node, trajectory);
```

## 🧪 テスト

### テストの実行

1. **test.html**を開く
2. テストボタンをクリック
3. 結果を確認

### テスト項目

- ✅ **基本機能テスト**: 各クラスの初期化・基本操作
- ✅ **統合テスト**: システム全体の連携動作
- ✅ **パフォーマンステスト**: 大量データでの性能評価
- ✅ **メモリリークテスト**: メモリ使用量の監視
- ✅ **エラーハンドリングテスト**: 異常入力への対応
- ✅ **ブラウザ互換性テスト**: 各種API利用可能性

### パフォーマンス指標

- **推奨環境**: Chrome/Firefox最新版
- **最大ノード数**: 1000（自動制限）
- **メモリ使用量**: 10MB以下を維持
- **フレームレート**: 60fps対応

## 🔬 理論的背景

### 認知科学的基盤

- **注意範囲**: ミラーの7±2理論に基づく注意スパン実装
- **意識理論**: 統合情報理論（IIT）とグローバルワークスペース理論
- **身体化認知**: メルロ＝ポンティの身体現象学の計算モデル化

### 言語学的基盤

- **連語理論**: 共起統計に基づく語彙関係の可視化
- **意味場理論**: 語義的類似度による引力場の構築
- **語義変化**: 歴史的意味変遷の時間軸表現

### 哲学的基盤

- **現象学**: フッサールの時間意識・意向性の実装
- **解釈学**: ガダマーの地平融合概念の視覚化
- **対話理論**: バフチンの対話性・多声性の表現

## 🚨 トラブルシューティング

### よくある問題

**Q: システムが初期化されない**
- A: ブラウザの開発者ツールでエラーを確認
- A: ファイルパスが正しいか確認
- A: モダンブラウザを使用

**Q: パフォーマンスが低下する**
- A: ノード数制限が自動で作動（1000ノード）
- A: メモリ最適化が定期実行
- A: ブラウザのハードウェアアクセラレーションを有効化

**Q: 描画が表示されない**
- A: Canvas要素が正しく作成されているか確認
- A: コンテナ要素のサイズを確認
- A: CSS z-indexの競合を確認

### デバッグ機能

```javascript
// デバッグ情報の取得
const report = system.getReport();
console.log('System Report:', report);

// 詳細ログ有効化
window.OrganicTypography.debug = true;

// メモリ使用量監視
console.log('Memory:', performance.memory);
```

## 🎨 カスタマイズ

### 描画スタイルの変更

```javascript
// カスタム描画関数
function customDrawNode(ctx, node) {
    // カスタムノード描画ロジック
}

// システムに適用
system.setCustomRenderer({
    drawNode: customDrawNode,
    drawConnection: customDrawConnection
});
```

### 語義解析エンジンの拡張

```javascript
// カスタム語義解析
class CustomSemanticField extends SemanticField {
    calculateSemanticSimilarity(vector1, vector2) {
        // カスタム類似度計算
    }
}
```

## 📊 出力データ形式

### システムレポート

```json
{
    "basicMetrics": {
        "nodes": 247,
        "connections": 189,
        "generation": 156
    },
    "semanticMetrics": {
        "semanticDensity": 0.734,
        "averageResonance": 0.612,
        "collocationFields": 23
    },
    "emergentMetrics": {
        "patterns": 7,
        "insights": 12,
        "revelations": 3
    },
    "phenomenologicalMetrics": {
        "qualiaIntensity": 0.789,
        "intentionalityStrength": 0.654,
        "embodimentLevel": 0.723
    }
}
```

### 読解体験アーカイブ

```json
{
    "states": [...],           // システム状態履歴
    "cycles": [...],           // 認知サイクル
    "awareness": [...],        // 意識レベル
    "insights": [...],         // 創発的洞察
    "revelations": [...]       // システム啓示
}
```

## 🌐 ブラウザサポート

| ブラウザ | バージョン | 状態 |
|---------|----------|------|
| Chrome  | 90+      | ✅ 完全サポート |
| Firefox | 88+      | ✅ 完全サポート |
| Safari  | 14+      | ⚠️ 部分サポート |
| Edge    | 90+      | ✅ 完全サポート |

## 📄 ライセンス

MIT License - 自由にご利用ください

## 🤝 貢献

1. フォークの作成
2. 機能ブランチの作成 (`git checkout -b feature/amazing-feature`)
3. 変更のコミット (`git commit -m 'Add amazing feature'`)
4. ブランチへのプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストの作成

## 📚 参考文献

- Merleau-Ponty, M. (1945). *Phénoménologie de la perception*
- Bakhtin, M. (1981). *The Dialogic Imagination*
- Husserl, E. (1905). *Zur Phänomenologie des inneren Zeitbewusstseins*
- Miller, G. A. (1956). "The magical number seven, plus or minus two"
- Tononi, G. (2008). "Integrated information theory"

---

**作品コンセプト**: 「言語を読むとは何か」という問いを、システム自身が読解プロセスを通じて探求する自己言及的なシステムアート。視覚・語義・時間の干渉パターンが、読む身体の軌跡として現前し、テクノロジーと現象学の新たな邂逅を生み出します。