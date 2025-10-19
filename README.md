# Tuna

## 開発環境

本プロジェクトは以下の構成です。

- フロントエンド: React (Node.js)
- バックエンド: Spring Boot (Java)
- 開発環境の起動: Docker Compose
- ランタイムバージョン管理: mise (推奨)

## 環境構築

※ mise や docker 等のインストール手順は割愛します。

### 初期セットアップ

まずはリポジトリをクローンし、ツールをインストールします。

```bash
# クローン（SSH)
git clone git@github.com:CERS-Projects/Tuna.git
cd Tuna

# 定義されたツールを一括インストール
mise install
```

次にフロントエンドの依存関係をインストールしておきます。

```bash
cd frontend
npm install
```

### vscode 設定

開発環境に vscode を使用する場合は以下をご確認ください。
`JDK`がうまく認識されない場合は、settings.json に以下を追加してください。  
mise を使用している場合は、`mise where java`で JDK のパスを確認できます。

```json
"java.jdt.ls.java.home": "my/jdk/path" // 自分のJDKのパスを追加する
```

また、extensions.json にはこのプロジェクトにおいて有用な拡張機能が記述されているため、  
vscode 左側メニューの`拡張機能 > 推奨`を参照し、インストールすることをおすすめします。

## 開発環境の立ち上げ

docker compose によって開発に必要な環境が立ち上がるため以下コマンドで起動 / 停止してください。

```bash
# コンテナを起動
docker compose up -d

# コンテナ停止
docker compose down
# コンテナ停止とボリューム削除
docker compose down -v
```

各コンテナアクセスのためのポート等は[compose.yml](compose.yml)を参照してください。

必要であれば以下のコマンドも役に立ちます。

```bash
# コンテナが起動しているかの確認
docker compose ps

# コンテナログの確認
docker compose logs -f

# キャッシュを使わずにコンテナをビルドする
docker compose build --no-cache
```
