目的:

スペック駆動開発の練習用として、フロントエンド（Next.js）＋バックエンド（FastAPI）＋DB(PostgreSQL)構成のシンプルなECサイトをモノレポで構築する。
コードの内のコメントアウトは全て英語で記載すること

支払いはすべてダミーAPIで完結し、外部決済サービスとは連携しない。

機能追加タスク5件＋既知バグ5件（フロント3, バック2）をチケットとして管理し、Kiro上でのタスク運用を想定する。

2. システム構成 / 技術スタック
2.1 モノレポ構造
/ec-mock
  /frontend      # Next.js (TypeScript, App Router, Server Actions)
  /backend       # FastAPI (Python)
  /infra
    docker-compose.yml
    /backend
      Dockerfile
    /db
      init.sql   # 初期データ投入用

2.2 フロントエンド

言語: TypeScript

FW: Next.js (App Router)

機能:

プロダクト一覧ページ

商品詳細ページ

カートページ

簡易チェックアウトページ（ダミー決済）

データ取得:

Next.js Server Actions から backend(FastAPI) の REST API を叩く

状態管理:

React hooks（useState / useReducer）ベース

カート状態はクライアント側状態（とりあえずLocalStorage等は任意）

2.3 バックエンド

言語: Python 3.11 以降

FW: FastAPI

DB: PostgreSQL（dockerコンテナ）

構成案:

/backend
  app/
    main.py
    api/
      products.py
      cart.py      # 今回はサーバー永続化なしでもOK、将来的拡張想定
      orders.py
      payments.py
    models/
      product.py
      order.py
      order_item.py
    db/
      session.py
      base.py

2.4 インフラ

docker-compose で以下を起動:

backend (FastAPI + uvicorn)

db (PostgreSQL)

フロントはローカル開発時は npm run dev で直接起動（必要なら Dockerfile 足してもOK）

3. ドメインモデル / DB スキーマ（案）
3.1 テーブル一覧

products

orders

order_items

3.2 テーブル定義（概略）
products
カラム名	型	制約	説明
id	SERIAL	PK	商品ID
name	VARCHAR(255)	NOT NULL	商品名
description	TEXT		説明
price	INTEGER	NOT NULL	価格（税抜 or 税込どちらか統一）
stock	INTEGER	NOT NULL, default 0	在庫数
image_url	VARCHAR(512)		商品画像URL（ダミーでOK）
category	VARCHAR(100)		カテゴリ名
created_at	TIMESTAMP	NOT NULL	作成日時
updated_at	TIMESTAMP	NOT NULL	更新日時
orders
カラム名	型	制約	説明
id	SERIAL	PK	注文ID
user_id	VARCHAR(100)	NOT NULL	今回は demo-user 固定など
total_amount	INTEGER	NOT NULL	合計金額
status	VARCHAR(50)	NOT NULL	pending, paid, failed 等
created_at	TIMESTAMP	NOT NULL	作成日時
order_items
カラム名	型	制約	説明
id	SERIAL	PK	明細ID
order_id	INTEGER	FK → orders.id	親注文ID
product_id	INTEGER	FK → products.id	商品ID
quantity	INTEGER	NOT NULL	個数
unit_price	INTEGER	NOT NULL	注文時点の単価
4. 機能要件（基本版）
4.1 ユースケース（ベースライン）

ユーザは商品一覧を閲覧できる

ユーザは商品詳細を閲覧できる

ユーザは商品詳細からカートに商品を追加できる

ユーザはカートの中身を確認できる

ユーザはカートの内容を確定し、ダミー決済を呼び出して注文を作成できる

決済結果は常に成功 or ランダム成功（仕様で決める）

ユーザIDはログインなしで demo-user 等に固定

5. API 仕様（サマリ）
5.1 Products

GET /api/products

クエリパラメータ:

page (optional, default=1)

page_size (optional, default=20)

q (optional, 商品名・説明への部分一致検索) ※これは「機能追加タスク」で後から実装でもOK

レスポンス:

items: Product[]

total: number

page: number

page_size: number

GET /api/products/{product_id}

レスポンス:

id, name, description, price, stock, image_url, category

5.2 Orders

POST /api/orders

リクエスト:

user_id: string

items: { product_id: number; quantity: number }[]

処理:

在庫チェック

ダミー決済API呼び出し

問題なければ orders / order_items に保存

レスポンス:

order_id: number

status: "paid" | "failed"

GET /api/orders?user_id=demo-user

指定ユーザの注文一覧を返却（これは「機能追加タスク」で実装対象にしてもよい）

5.3 Payments（ダミー）

POST /api/payments/checkout

リクエスト:

amount: number

レスポンス:

常に status: "authorized" と transaction_id: "dummy-<uuid>" を返す

実際の外部連携は行わない

6. フロント画面仕様（ざっくり）

/ or /products

商品一覧

1商品あたり：画像 / 名前 / 価格 / 「詳細を見る」ボタン / 「カートに追加」ボタン

/products/[id]

商品詳細表示

「カートに追加」ボタン

/cart

カート内一覧

税込/税抜の表記はおまかせだが統一する

「チェックアウトへ」ボタン

/checkout

注文内容確認（読み取り専用）

「注文する」ボタン → Server Actionで backend の POST /api/orders を叩く

（機能追加タスクで）/orders

ユーザの注文履歴一覧

7. 機能追加タスク（5件）

初期実装では 未対応 とし、以下を Kiro のチケットとして管理する想定。

FT-001: 商品検索機能の追加

種別: 機能追加

概要: 商品名・説明文に対するキーワード検索機能を追加する。

詳細:

バックエンド:

GET /api/products にクエリ q を追加し、name または description に部分一致する商品だけを返す。

フロントエンド:

商品一覧ページに検索フォームを追加し、キーワード入力→検索実行で再度 API を呼ぶ。

受け入れ条件:

キーワードを入力して検索すると、該当商品だけが一覧に表示されること。

キーワードが空の場合は全商品を返すこと。

FT-002: カテゴリ絞り込み機能の追加

種別: 機能追加

概要: 商品一覧をカテゴリで絞り込めるようにする。

詳細:

バックエンド:

GET /api/products にクエリ category を追加。

フロントエンド:

一覧上部にカテゴリ選択用のドロップダウンを配置。

受け入れ条件:

カテゴリを選択すると、そのカテゴリの商品だけが表示される。

「すべて」を選ぶと全商品が表示される。

FT-003: カート内数量変更・削除機能の追加

種別: 機能追加

概要: カート画面で、各商品の数量変更と削除ができるようにする。

詳細:

フロント側の状態管理で、数量変更と削除を扱う reducer / hook を実装。

Server Actions を使う場合は、サーバ側状態と整合が取れるように。

受け入れ条件:

カート画面で数量を変更すると、即座に小計と合計金額が更新される。

「削除」操作で対象商品がカートから消える。

FT-004: 注文履歴ページの追加

種別: 機能追加

概要: demo-user の注文履歴を表示するページを追加。

詳細:

バックエンド:

GET /api/orders?user_id=demo-user を実装（または user_id をヘッダで渡す）。

フロント:

/orders ページを追加。

注文ID / 日付 / 合計金額 / ステータスを一覧表示。

受け入れ条件:

新たに注文を行った後、注文履歴ページにアクセスすると、その注文が一覧に現れる。

FT-005: モバイル向けレスポンシブ対応

種別: 機能追加

概要: スマホ幅（375px〜）で見やすい UI へ対応。

詳細:

ヘッダをハンバーガーメニュー化。

商品カードのレイアウトを1列表示に。

カート・チェックアウトページも横スクロールなしで見切れないように。

受け入れ条件:

開発ツールの画面幅を 375px にした場合でも、各ページが崩れず操作可能である。

8. 既知バグタスク（5件）

初期コードに あえて埋め込むバグ。Kiro上では「バグチケット」として管理。

BUG-FE-001: カートバッジの数量が初回追加時に更新されない

種別: バグ（フロント）

概要: ヘッダの「カート」アイコン横の数量バッジが、最初の商品追加時に 0 のまま。

想定する原因例:

setCartCount(cartCount + 1) のように古い state を参照しており、初回レンダー時に反映漏れ。

再現手順:

商品一覧ページを開く

任意の商品で「カートに追加」を初めてクリック

ヘッダのカートバッジが 0 のまま

期待結果:

初回追加時から正しい数量（1）が表示される。

BUG-FE-002: カート数量入力で 0 や負数が指定できる

種別: バグ（フロント）

概要: カート画面の数量入力欄で 0 または負数を入力すると、合計金額が不正になる。

再現手順:

カートに商品を1つ以上追加

カート画面で数量欄に 0 や -1 を入力

合計金額が0やマイナスになってしまう

期待結果:

数量は 1 以上の整数に制限される。

不正な値を入力した場合は自動で 1 に戻すなどのバリデーションが行われる。

BUG-FE-003: 商品一覧のSSR/CSR不整合による hydration エラー

種別: バグ（フロント）

概要: 商品一覧ページで、SSR時とCSR時で要素数が変わり hydration warning が出る。

想定する原因例:

Math.random() を使って key を生成している。

再現手順:

npm run dev で起動

ページをリロード

ブラウザコンソールに hydration warning が表示される

期待結果:

key は product.id を用いるなどして固定し、warning が発生しない。

BUG-BE-001: 在庫が0の商品でも注文が通ってしまう

種別: バグ（バックエンド）

概要: stock = 0 の商品に対して注文を送っても、在庫チェックが行われずに注文が作成される。

再現手順:

DB に在庫0の商品を1つ用意する

POST /api/orders でその商品を quantity=1 で指定

200 OKで status: "paid" な注文が返ってくる

期待結果:

在庫0の商品が含まれている場合は注文を受け付けず、4xx エラー＋エラーメッセージを返す。

BUG-BE-002: 商品一覧APIのページネーションが1ページずれている

種別: バグ（バックエンド）

概要: page=1 指定でも2ページ目相当の商品が返ってくるなど、オフセット計算が不正。

想定する原因例:

offset = page * page_size としており 0 始まり前提で実装している。

再現手順:

商品を 30 件程度登録

GET /api/products?page=1&page_size=10 を呼ぶ

期待より10件後ろのレコードから返ってくる

期待結果:

page=1 のとき offset=0 になるように、offset = (page - 1) * page_size が使われている。

9. 非機能要件（ざっくり）

全APIは JSON ベース

エラーレスポンスは { "detail": "エラーメッセージ" } 形式で統一

ログイン機能は本模擬プロジェクトでは実装しない

ログ・監視は最小限（コンソールログ程度）