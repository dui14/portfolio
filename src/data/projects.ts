import type { LocalizedText, Project, ProjectVideo } from "../domain/project.ts";
import { getImage, getVideo } from "./media.ts";

const PNLENS_COVER = getImage("projects/pnlens/cover");
const COVER_WIDTH = 1600;
const COVER_HEIGHT = 800;
const WORKFLOW_COVER = getImage("projects/vibe-coding-workflow/workflow");
const WORKFLOW_WIDTH = 1536;
const WORKFLOW_HEIGHT = 1024;
const SMART_HOME_COVER = getImage("projects/smart-home-iot/smart-home-iot");
const SMART_HOME_WIDTH = 1600;
const SMART_HOME_HEIGHT = 1163;
const METABASED_COVER = getImage("projects/metabased/home");
const METABASED_WIDTH = 346;
const METABASED_HEIGHT = 275;
const PORTFOLIO_COVER = getImage("projects/portfolio/portfolio");
const PORTFOLIO_WIDTH = 1341;
const PORTFOLIO_HEIGHT = 739;

const DEMO_LABEL: LocalizedText = {
  en: "Demo video",
  vi: "Video demo",
  zh: "演示视频",
  ja: "デモ動画",
};

function findDemoVideo(slug: string): ProjectVideo | undefined {
  const entry = getVideo(`projects/${slug}/demo`);
  if (!entry) return undefined;
  return {
    src: entry.src,
    poster: entry.poster,
    width: entry.width,
    height: entry.height,
    label: DEMO_LABEL,
  };
}

export const projects: Project[] = [
  {
    id: "pnlens",
    title: "PnLens",
    openSource: true,
    summary: {
      en: "Read-only PNL dashboard that unifies trade history from five crypto exchanges.",
      vi: "Dashboard PNL chỉ đọc, gộp lịch sử giao dịch từ năm sàn crypto vào một nơi.",
      zh: "只读的盈亏仪表盘，汇总五家加密交易所的交易历史。",
      ja: "5 つの暗号資産取引所の取引履歴をまとめる、読み取り専用の PNL ダッシュボード。",
    },
    problem: {
      en: "Traders who use several exchanges end up with several partial pictures: each venue reports its own PNL, its own fees and its own time zone.",
      vi: "Trader dùng nhiều sàn chỉ có những bức tranh rời rạc: mỗi sàn báo PNL, phí và múi giờ theo cách riêng.",
      zh: "同时使用多家交易所的交易者只能看到零散的局部：每家都有各自的盈亏、手续费和时区。",
      ja: "複数の取引所を使うトレーダーは断片的な情報しか得られません。取引所ごとに PNL、手数料、タイムゾーンがばらばらだからです。",
    },
    features: {
      en: [
        "Connect exchanges with read-only keys; trade or withdraw keys are rejected",
        "PNL for today, 7/30/90 days and year to date, with win rate and fees",
        "Cumulative PNL chart and a daily PNL calendar",
        "Fee and volume breakdown by exchange and market",
        "AI assistant that answers from your own trades, bring your own key",
        "Futures demo sandbox on live prices",
      ],
      vi: [
        "Kết nối sàn bằng key chỉ đọc; key giao dịch hoặc rút tiền bị từ chối",
        "PNL hôm nay, 7/30/90 ngày và từ đầu năm, kèm tỷ lệ thắng và phí",
        "Biểu đồ PNL tích lũy và lịch PNL theo ngày",
        "Phân tích phí và khối lượng theo sàn và thị trường",
        "Trợ lý AI trả lời từ giao dịch của bạn, dùng key của bạn",
        "Sandbox futures demo trên giá thời gian thực",
      ],
      zh: [
        "使用只读密钥连接交易所，交易或提现密钥会被拒绝",
        "今日、7/30/90 天和年初至今的盈亏，含胜率和手续费",
        "累计盈亏图表和每日盈亏日历",
        "按交易所和市场拆分手续费与成交量",
        "基于你自己交易记录作答的 AI 助手，使用你自己的密钥",
        "基于实时价格的合约演示沙盒",
      ],
      ja: [
        "読み取り専用キーで取引所に接続、取引・出金キーは拒否",
        "今日・7/30/90 日・年初来の PNL を勝率と手数料つきで表示",
        "累積 PNL チャートと日別 PNL カレンダー",
        "取引所・市場別の手数料と取引量の内訳",
        "自分の取引から答える AI アシスタント、利用するのは自分のキー",
        "リアルタイム価格で動く先物デモサンドボックス",
      ],
    },
    stack: [
      "Next.js 15",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "Recharts",
      "TanStack Query",
    ],
    results: [
      {
        value: "10K+",
        label: {
          en: "real trades synced and analyzed",
          vi: "giao dịch thật đã đồng bộ và phân tích",
          zh: "笔真实交易已同步并分析",
          ja: "件の実取引を同期・分析",
        },
      },
      {
        value: "5",
        label: {
          en: "exchanges: Binance, OKX, Bybit, Bitget, Gate.io",
          vi: "sàn: Binance, OKX, Bybit, Bitget, Gate.io",
          zh: "交易所：Binance、OKX、Bybit、Bitget、Gate.io",
          ja: "取引所：Binance、OKX、Bybit、Bitget、Gate.io",
        },
      },
      {
        value: "5",
        label: {
          en: "AI providers, bring your own key",
          vi: "nhà cung cấp AI, dùng key của bạn",
          zh: "AI 服务商，使用你自己的密钥",
          ja: "AI プロバイダー、自分のキーを利用",
        },
      },
      {
        value: "AES-256-GCM",
        label: {
          en: "encryption for stored keys",
          vi: "mã hóa cho key được lưu",
          zh: "加密存储的密钥",
          ja: "保存されたキーの暗号化",
        },
      },
    ],
    links: {
      live: "https://pnlens.duii.dev",
      github: "https://github.com/dui14/PnLens",
    },
    visual: {
      kind: "image",
      image: {
        src: PNLENS_COVER?.src ?? "",
        srcSet: PNLENS_COVER?.srcSet ?? "",
        sizes: "(min-width: 1024px) 700px, 100vw",
        width: PNLENS_COVER?.width ?? COVER_WIDTH,
        height: PNLENS_COVER?.height ?? COVER_HEIGHT,
        alt: {
          en: "PnLens flow: create a read-only API key, choose an exchange, paste keys, sync trades and see your real PNL.",
          vi: "Quy trình PnLens: tạo API key chỉ đọc, chọn sàn, dán key, đồng bộ giao dịch và xem PNL thực.",
          zh: "PnLens 流程：创建只读 API 密钥、选择交易所、粘贴密钥、同步交易并查看真实盈亏。",
          ja: "PnLens の流れ：読み取り専用 API キーを作成し、取引所を選び、キーを貼り付け、取引を同期して実際の PNL を確認。",
        },
      },
    },
    demoVideo: findDemoVideo("pnlens"),
  },
  {
    id: "multi-wallet-cli",
    title: "Multi-Wallet CLI",
    openSource: true,
    summary: {
      en: "Local Go CLI that moves funds across many EVM and Solana wallets, with keys that never leave your machine.",
      vi: "CLI Go chạy cục bộ để chuyển tiền giữa nhiều ví EVM và Solana, khóa không bao giờ rời khỏi máy bạn.",
      zh: "本地运行的 Go 命令行工具，可在多个 EVM 和 Solana 钱包之间转移资金，私钥始终不离开你的设备。",
      ja: "多数の EVM / Solana ウォレット間で資金を動かすローカル Go CLI。秘密鍵は端末の外に出ません。",
    },
    problem: {
      en: "Managing many on-chain wallets usually means browser extensions, hosted bots or scripts that keep raw private keys in plain files, so one leak can empty every wallet.",
      vi: "Quản lý nhiều ví on-chain thường phải dùng tiện ích trình duyệt, bot lưu trữ hộ hoặc script để khóa riêng dạng thô trong file, nên một lần rò rỉ có thể rút sạch mọi ví.",
      zh: "管理大量链上钱包通常要靠浏览器插件、托管机器人，或把私钥明文存在文件里的脚本，一旦泄露，所有钱包都可能被清空。",
      ja: "多数のオンチェーンウォレットの管理は、ブラウザ拡張、ホスト型ボット、秘密鍵を平文ファイルに置くスクリプトに頼りがちで、1 回の漏えいで全ウォレットが空になりかねません。",
    },
    features: {
      en: [
        "Encrypted vault: master password, keyfile and wallet file, Argon2id with AES-256-GCM",
        "Transfers 1 to 1, 1 to many and many to 1; three or more calls batch into one EIP-7702 transaction",
        "Swap and bridge through Relay quotes, confirmed before anything is signed",
        "Balance scan across wallets and chains with batched RPC reads",
        "Natural-language agent in English or Vietnamese that plans, never sees private keys",
      ],
      vi: [
        "Vault mã hóa: mật khẩu chủ, keyfile và file ví, Argon2id với AES-256-GCM",
        "Chuyển 1-1, 1-nhiều và nhiều-1; từ ba lệnh gọi trở lên gộp thành một giao dịch EIP-7702",
        "Swap và bridge qua báo giá Relay, xác nhận trước khi ký bất cứ thứ gì",
        "Quét số dư nhiều ví và nhiều chain bằng RPC gộp lô",
        "Agent ngôn ngữ tự nhiên tiếng Anh hoặc Việt, chỉ lập kế hoạch, không bao giờ thấy khóa riêng",
      ],
      zh: [
        "加密保险库：主密码、密钥文件和钱包文件，Argon2id 加 AES-256-GCM",
        "支持 1 对 1、1 对多、多对 1 转账；三次及以上调用合并为一笔 EIP-7702 交易",
        "通过 Relay 报价完成兑换和跨链，签名前先确认",
        "批量 RPC 读取，跨钱包跨链扫描余额",
        "支持英语或越南语的自然语言智能体，只做规划，从不接触私钥",
      ],
      ja: [
        "暗号化ボールト：マスターパスワード、キーファイル、ウォレットファイル。Argon2id と AES-256-GCM",
        "1 対 1、1 対多、多対 1 の送金。3 件以上の呼び出しは 1 つの EIP-7702 トランザクションにまとめる",
        "Relay の見積もりでスワップとブリッジ、署名前に必ず確認",
        "バッチ RPC でウォレットとチェーンをまたいで残高をスキャン",
        "英語またはベトナム語の自然言語エージェント。計画だけを担い、秘密鍵は見ない",
      ],
    },
    stack: ["Go", "go-ethereum", "solana-go", "Solidity", "Relay Protocol"],
    results: [
      {
        value: "1,000+",
        label: {
          en: "on-chain transactions executed",
          vi: "giao dịch on-chain đã thực hiện",
          zh: "笔链上交易已执行",
          ja: "件のオンチェーン取引を実行",
        },
      },
      {
        value: "3",
        label: {
          en: "factors to unlock: password, keyfile, wallet file",
          vi: "yếu tố để mở khóa: mật khẩu, keyfile, file ví",
          zh: "解锁要素：密码、密钥文件、钱包文件",
          ja: "解除要素：パスワード、キーファイル、ウォレットファイル",
        },
      },
      {
        value: "AES-256-GCM",
        label: {
          en: "with Argon2id-derived keys",
          vi: "với khóa sinh từ Argon2id",
          zh: "配合 Argon2id 派生密钥",
          ja: "Argon2id 由来の鍵で暗号化",
        },
      },
      {
        value: "EVM + Solana",
        label: {
          en: "from one encrypted vault",
          vi: "từ một vault mã hóa",
          zh: "来自同一个加密保险库",
          ja: "1 つの暗号化ボールトから",
        },
      },
    ],
    security: {
      en: [
        "Unlocking needs three things: your master password, a 32-byte keyfile kept outside the repo, and the wallet file. Miss or change any one and decryption fails.",
        "The password and the wallet's own salt go through Argon2id, then HMAC-SHA256 mixes in the keyfile to produce the AES-256 key.",
        "Private keys are sealed with AES-256-GCM, so a wrong or tampered file is rejected outright.",
        "Keys stay on your machine. Nothing is sent to a server.",
      ],
      vi: [
        "Mở khóa cần đủ ba thứ: mật khẩu chính, keyfile 32 byte nằm ngoài repo và file ví. Thiếu hoặc sai một thứ là giải mã thất bại.",
        "Mật khẩu cùng salt riêng của file ví đi qua Argon2id, sau đó HMAC-SHA256 trộn thêm keyfile để tạo khóa AES-256.",
        "Private key được niêm phong bằng AES-256-GCM, file sai hoặc bị sửa sẽ bị từ chối ngay.",
        "Khóa nằm trên máy bạn, không gửi lên server nào.",
      ],
      zh: [
        "解锁需要三样东西：主密码、存放在仓库之外的 32 字节密钥文件，以及钱包文件。缺少或更改任何一项，解密都会失败。",
        "密码与钱包文件自带的盐值先经过 Argon2id，再由 HMAC-SHA256 混入密钥文件，生成 AES-256 密钥。",
        "私钥使用 AES-256-GCM 封存，错误或被篡改的文件会被直接拒绝。",
        "密钥只保存在你的设备上，不会发送到任何服务器。",
      ],
      ja: [
        "解除にはマスターパスワード、リポジトリ外に置く 32 バイトのキーファイル、ウォレットファイルの 3 つが必要です。どれか 1 つでも欠けたり変わったりすると復号できません。",
        "パスワードとウォレットファイル固有のソルトを Argon2id に通し、さらに HMAC-SHA256 でキーファイルを混ぜて AES-256 鍵を生成します。",
        "秘密鍵は AES-256-GCM で封印されるため、誤ったファイルや改ざんされたファイルはその場で拒否されます。",
        "鍵はあなたのマシンの中にとどまり、サーバーには何も送信されません。",
      ],
    },
    links: {
      github: "https://github.com/dui14/multi-wallet-cli",
      video: "https://youtu.be/pKRjosJ5gqo",
    },
    visual: {
      kind: "terminal",
      terminal: {
        title: "multi-wallet-cli",
        banner: "MULTI-WALLET CLI V1.0.0",
        tagline: "A local-first Go CLI for multi-wallet Web3 & AI agent flows.",
        status: "13 wallets unlocked · lang: EN",
        hint: "↑/↓ move · enter select · q quit",
        prompt: "Multi-Wallet CLI",
        filter: "[Use arrows to move, type to filter]",
        menu: ["Transfer", "Swap", "Bridge", "Balance", "Agent", "Config", "Exit"],
        description: {
          en: "Terminal window showing the Multi-Wallet CLI menu: Transfer, Swap, Bridge, Balance, Agent, Config and Exit.",
          vi: "Cửa sổ terminal hiển thị menu Multi-Wallet CLI: Transfer, Swap, Bridge, Balance, Agent, Config và Exit.",
          zh: "终端窗口，显示 Multi-Wallet CLI 菜单：Transfer、Swap、Bridge、Balance、Agent、Config 和 Exit。",
          ja: "Multi-Wallet CLI のメニュー（Transfer、Swap、Bridge、Balance、Agent、Config、Exit）を表示したターミナル画面。",
        },
      },
    },
    demoVideo: findDemoVideo("multi-wallet-cli"),
  },
  {
    id: "vibe-coding-workflow",
    title: "Vibe Coding Workflow",
    openSource: true,
    summary: {
      en: "An AI-native project scaffold: describe your idea, the agent writes the architecture, specs and progress tracker, you review before any code.",
      vi: "Bộ khung dự án AI-native: bạn mô tả ý tưởng, agent viết kiến trúc, spec và bảng tiến độ, bạn duyệt trước khi có bất kỳ dòng code nào.",
      zh: "AI 原生的项目脚手架：你描述想法，智能体写出架构、规格和进度表，你在任何代码出现之前先审阅。",
      ja: "AI ネイティブなプロジェクトの雛形：アイデアを伝えるとエージェントがアーキテクチャ、仕様、進捗表を書き、コードの前に人がレビューします。",
    },
    problem: {
      en: "A coding agent starting a new project has no context, so it picks a stack, invents a structure and writes code before the idea is clear.",
      vi: "Coding agent bắt đầu dự án mới mà không có ngữ cảnh, nên tự chọn stack, tự nghĩ ra cấu trúc và viết code trước khi ý tưởng rõ ràng.",
      zh: "编码智能体接手新项目时没有任何上下文，于是自行选技术栈、编造结构，在想法还不清晰时就开始写代码。",
      ja: "新規プロジェクトを始めるコーディングエージェントは文脈を持たないため、アイデアが固まる前にスタックを選び、構造を作り、コードを書いてしまいます。",
    },
    features: {
      en: [
        "One bootstrap prompt generates ai-context/ and spec/ from idea.md",
        "Lite (3 files) or full (ai-context 00 to 08) context modes",
        "Required human review gate before anything is written to src/",
        "Acceptance criteria are runnable commands; done only after they pass",
        "Shared AGENTS.md for Cursor, Claude Code, Copilot, Windsurf and Antigravity",
        "Reusable skills: bootstrap, code-review, finish-feature, fix-bug",
      ],
      vi: [
        "Một prompt bootstrap tạo ai-context/ và spec/ từ idea.md",
        "Hai chế độ ngữ cảnh: lite (3 file) hoặc full (ai-context 00 đến 08)",
        "Bắt buộc người duyệt trước khi ghi bất cứ thứ gì vào src/",
        "Tiêu chí nghiệm thu là lệnh chạy được; chỉ done khi lệnh pass",
        "AGENTS.md dùng chung cho Cursor, Claude Code, Copilot, Windsurf và Antigravity",
        "Skill tái sử dụng: bootstrap, code-review, finish-feature, fix-bug",
      ],
      zh: [
        "一条引导提示从 idea.md 生成 ai-context/ 和 spec/",
        "精简（3 个文件）或完整（ai-context 00 至 08）两种上下文模式",
        "写入 src/ 之前必须经过人工审阅关卡",
        "验收标准是可运行的命令，通过后才算完成",
        "共用 AGENTS.md，适配 Cursor、Claude Code、Copilot、Windsurf 和 Antigravity",
        "可复用技能：bootstrap、code-review、finish-feature、fix-bug",
      ],
      ja: [
        "ブートストラップ用プロンプト 1 つで idea.md から ai-context/ と spec/ を生成",
        "ライト（3 ファイル）とフル（ai-context 00 から 08）の 2 つのコンテキストモード",
        "src/ に何かを書く前に、人によるレビューが必須",
        "受け入れ基準は実行できるコマンド、通過して初めて完了",
        "Cursor、Claude Code、Copilot、Windsurf、Antigravity で共通の AGENTS.md",
        "再利用できるスキル：bootstrap、code-review、finish-feature、fix-bug",
      ],
    },
    stack: ["Markdown", "AGENTS.md", "Agent Skills", "MCP", "Playwright"],
    results: [
      {
        value: "100+",
        label: {
          en: "people using the workflow",
          vi: "người đang dùng quy trình",
          zh: "人正在使用该流程",
          ja: "人がこのワークフローを利用",
        },
      },
      {
        value: "7",
        label: {
          en: "workflow steps, with a human review gate",
          vi: "bước quy trình, có cổng duyệt của con người",
          zh: "个流程步骤，含人工审阅关卡",
          ja: "つのワークフロー手順、人によるレビューつき",
        },
      },
      {
        value: "2",
        label: {
          en: "context modes: lite and full",
          vi: "chế độ ngữ cảnh: lite và full",
          zh: "种上下文模式：精简和完整",
          ja: "つのコンテキストモード：ライトとフル",
        },
      },
      {
        value: "0",
        label: {
          en: "runtime dependencies, context files only",
          vi: "phụ thuộc runtime, chỉ có file ngữ cảnh",
          zh: "个运行时依赖，只有上下文文件",
          ja: "個のランタイム依存、コンテキストファイルのみ",
        },
      },
    ],
    links: {
      github: "https://github.com/dui14/vibe-coding-workflow",
    },
    visual: {
      kind: "image",
      image: {
        src: WORKFLOW_COVER?.src ?? "",
        srcSet: WORKFLOW_COVER?.srcSet ?? "",
        sizes: "(min-width: 1024px) 700px, 100vw",
        width: WORKFLOW_COVER?.width ?? WORKFLOW_WIDTH,
        height: WORKFLOW_COVER?.height ?? WORKFLOW_HEIGHT,
        fit: "contain",
        alt: {
          en: "Hand-drawn diagram of the Vibe Coding Workflow, from the idea to reviewed code.",
          vi: "Sơ đồ vẽ tay của Vibe Coding Workflow, từ ý tưởng đến code đã được duyệt.",
          zh: "Vibe Coding Workflow 的手绘流程图，从想法到经过审阅的代码。",
          ja: "Vibe Coding Workflow の手描き図。アイデアからレビュー済みコードまで。",
        },
      },
    },
    demoVideo: findDemoVideo("vibe-coding-workflow"),
    relatedPost: "vibe-coding-workflow",
  },
  {
    id: "smart-home-iot",
    title: "Smart Home IoT",
    openSource: true,
    summary: {
      en: "Smart home system that controls devices and reads sensors from one web dashboard, an ESP32 and a Node.js API.",
      vi: "Hệ thống nhà thông minh điều khiển thiết bị và đọc cảm biến từ một dashboard web, ESP32 và API Node.js.",
      zh: "智能家居系统，通过一个网页仪表盘、ESP32 和 Node.js API 控制设备并读取传感器。",
      ja: "1 つの Web ダッシュボード、ESP32、Node.js API で機器の操作とセンサー読み取りを行うスマートホームシステム。",
    },
    problem: {
      en: "Home devices are controlled from separate switches and apps, with no single place to see sensor data, automate, or just say what you want.",
      vi: "Thiết bị trong nhà bị điều khiển bằng công tắc và app riêng lẻ, không có một nơi để xem dữ liệu cảm biến, tự động hóa hay chỉ cần nói điều mình muốn.",
      zh: "家中的设备分别由不同的开关和应用控制，没有一个地方可以查看传感器数据、设置自动化，或者直接说出需求。",
      ja: "家電は別々のスイッチやアプリで操作することになり、センサーの値を確認したり、自動化したり、話しかけるだけで操作したりできる場所がありません。",
    },
    features: {
      en: [
        "Control lights, fans, air conditioners and door locks",
        "Real-time sync between the web dashboard, the server and the ESP32",
        "Sensor monitoring: DHT22 temperature and humidity, LDR light level",
        "AI natural-language commands through an LLM API (OpenAI or Gemini)",
        "Command and chat history stored in PostgreSQL",
        "Manual and Auto modes",
      ],
      vi: [
        "Điều khiển đèn, quạt, máy lạnh và khóa cửa",
        "Đồng bộ thời gian thực giữa dashboard web, server và ESP32",
        "Giám sát cảm biến: nhiệt độ và độ ẩm DHT22, ánh sáng LDR",
        "Ra lệnh bằng ngôn ngữ tự nhiên qua API LLM (OpenAI hoặc Gemini)",
        "Lịch sử lệnh và trò chuyện lưu trong PostgreSQL",
        "Hai chế độ Manual và Auto",
      ],
      zh: [
        "控制灯、风扇、空调和门锁",
        "网页仪表盘、服务器与 ESP32 之间实时同步",
        "传感器监测：DHT22 温湿度、LDR 光照",
        "通过 LLM API（OpenAI 或 Gemini）用自然语言下达指令",
        "指令和聊天记录保存在 PostgreSQL",
        "手动和自动两种模式",
      ],
      ja: [
        "照明、ファン、エアコン、ドアロックを操作",
        "Web ダッシュボード、サーバー、ESP32 間のリアルタイム同期",
        "センサー監視：DHT22 の温度・湿度、LDR の明るさ",
        "LLM API（OpenAI または Gemini）による自然言語コマンド",
        "コマンドとチャットの履歴を PostgreSQL に保存",
        "Manual と Auto の 2 つのモード",
      ],
    },
    stack: ["ESP32", "Node.js", "PostgreSQL", "Redis", "PlatformIO", "Wokwi"],
    results: [
      {
        value: "4",
        label: {
          en: "relay-controlled devices",
          vi: "thiết bị điều khiển qua relay",
          zh: "个继电器控制的设备",
          ja: "台のリレー制御デバイス",
        },
      },
      {
        value: "3-way",
        label: {
          en: "real-time sync: dashboard, server, ESP32",
          vi: "đồng bộ thời gian thực: dashboard, server, ESP32",
          zh: "实时同步：仪表盘、服务器、ESP32",
          ja: "リアルタイム同期：ダッシュボード、サーバー、ESP32",
        },
      },
      {
        value: "2",
        label: {
          en: "sensors: DHT22 and LDR",
          vi: "cảm biến: DHT22 và LDR",
          zh: "个传感器：DHT22 和 LDR",
          ja: "種類のセンサー：DHT22 と LDR",
        },
      },
      {
        value: "2",
        label: {
          en: "modes: Manual and Auto",
          vi: "chế độ: Manual và Auto",
          zh: "种模式：手动和自动",
          ja: "つのモード：Manual と Auto",
        },
      },
    ],
    links: {
      github: "https://github.com/dui14/smart-home-iot",
    },
    visual: {
      kind: "image",
      image: {
        src: SMART_HOME_COVER?.src ?? "",
        srcSet: SMART_HOME_COVER?.srcSet ?? "",
        sizes: "(min-width: 1024px) 700px, 100vw",
        width: SMART_HOME_COVER?.width ?? SMART_HOME_WIDTH,
        height: SMART_HOME_COVER?.height ?? SMART_HOME_HEIGHT,
        fit: "cover",
        alt: {
          en: "Handmade two-storey model house running the Smart Home IoT system, with a fan and an LCD showing temperature and humidity.",
          vi: "Ngôi nhà mô hình hai tầng tự làm chạy hệ thống Smart Home IoT, có quạt và màn hình LCD hiển thị nhiệt độ và độ ẩm.",
          zh: "手工制作的两层楼房模型，运行 Smart Home IoT 系统，装有风扇和显示温湿度的 LCD 屏。",
          ja: "Smart Home IoT システムを動かす手作りの 2 階建て模型の家。ファンと、温度と湿度を表示する LCD 付き。",
        },
      },
    },
    gallery: [
      {
        key: "projects/smart-home-iot/circuit",
        alt: {
          en: "Wokwi circuit: ESP32 with DHT22, light sensor, 16x2 LCD, servo, four relays, LEDs and a buzzer.",
          vi: "Mạch Wokwi: ESP32 với DHT22, cảm biến ánh sáng, LCD 16x2, servo, bốn relay, đèn LED và còi buzzer.",
          zh: "Wokwi 电路：ESP32 搭配 DHT22、光敏传感器、16x2 LCD、舵机、四个继电器、LED 和蜂鸣器。",
          ja: "Wokwi 回路：ESP32 に DHT22、光センサー、16x2 LCD、サーボ、4 つのリレー、LED、ブザーを接続。",
        },
      },
    ],
  },
  {
    id: "metabased",
    title: "Metabased",
    openSource: true,
    summary: {
      en: "Social NFT marketplace on Base Sepolia where posts can be minted as NFTs and traded.",
      vi: "Mạng xã hội kiêm chợ NFT trên Base Sepolia, nơi bài đăng có thể được mint thành NFT và giao dịch.",
      zh: "基于 Base Sepolia 的社交 NFT 市场，帖子可以铸造成 NFT 并进行交易。",
      ja: "Base Sepolia 上のソーシャル NFT マーケットプレイス。投稿を NFT としてミントし、売買できます。",
    },
    problem: {
      en: "Social posts are owned by the platform, so creators cannot own or sell what they share.",
      vi: "Bài đăng mạng xã hội thuộc về nền tảng, nên người sáng tạo không thể sở hữu hay bán thứ mình chia sẻ.",
      zh: "社交帖子归平台所有，创作者无法拥有或出售自己分享的内容。",
      ja: "SNS の投稿はプラットフォームのものになり、クリエイターは自分が共有したものを所有も販売もできません。",
    },
    features: {
      en: [
        "Wallet login with Dynamic Labs",
        "Posts with follow, like and comment",
        "Mint an NFT from a post",
        "Marketplace to buy and sell NFTs",
        "Direct messages between users",
        "Admin dashboard",
      ],
      vi: [
        "Đăng nhập bằng ví với Dynamic Labs",
        "Bài đăng với theo dõi, thích và bình luận",
        "Mint NFT từ một bài đăng",
        "Chợ để mua và bán NFT",
        "Tin nhắn trực tiếp giữa người dùng",
        "Dashboard quản trị",
      ],
      zh: [
        "通过 Dynamic Labs 使用钱包登录",
        "发帖，支持关注、点赞和评论",
        "从帖子铸造 NFT",
        "买卖 NFT 的市场",
        "用户之间的私信",
        "管理后台",
      ],
      ja: [
        "Dynamic Labs によるウォレットログイン",
        "投稿、フォロー、いいね、コメント",
        "投稿から NFT をミント",
        "NFT を売買するマーケットプレイス",
        "ユーザー間のダイレクトメッセージ",
        "管理ダッシュボード",
      ],
    },
    stack: [
      "Next.js 14",
      "TypeScript",
      "Solidity",
      "Supabase",
      "Tailwind CSS",
      "Base Sepolia",
    ],
    results: [
      {
        value: "3",
        label: {
          en: "smart contracts: ERC-721, ERC-1155, marketplace",
          vi: "smart contract: ERC-721, ERC-1155, marketplace",
          zh: "个智能合约：ERC-721、ERC-1155、市场",
          ja: "つのスマートコントラクト：ERC-721、ERC-1155、マーケットプレイス",
        },
      },
      {
        value: "7",
        label: {
          en: "core features, from wallet login to the admin dashboard",
          vi: "tính năng cốt lõi, từ đăng nhập ví đến dashboard quản trị",
          zh: "项核心功能，从钱包登录到管理后台",
          ja: "つの主要機能、ウォレットログインから管理ダッシュボードまで",
        },
      },
      {
        value: "Base",
        label: {
          en: "Sepolia L2 testnet deployment",
          vi: "triển khai trên testnet L2 Sepolia",
          zh: "部署在 Sepolia L2 测试网",
          ja: "Sepolia L2 テストネットにデプロイ",
        },
      },
    ],
    links: {
      github: "https://github.com/dui14/metabased",
    },
    visual: {
      kind: "image",
      image: {
        src: METABASED_COVER?.src ?? "",
        srcSet: METABASED_COVER?.srcSet ?? "",
        sizes: "(min-width: 1024px) 700px, 100vw",
        width: METABASED_COVER?.width ?? METABASED_WIDTH,
        height: METABASED_COVER?.height ?? METABASED_HEIGHT,
        fit: "contain",
        alt: {
          en: "Metabased landing page: Share moments, own memories, with Mint as NFT, Built on Base and Secure & Decentralized highlights.",
          vi: "Trang chủ Metabased: Share moments, own memories, với các điểm nổi bật Mint as NFT, Built on Base và Secure & Decentralized.",
          zh: "Metabased 落地页：Share moments, own memories，并突出展示 Mint as NFT、Built on Base 和 Secure & Decentralized。",
          ja: "Metabased のランディングページ：Share moments, own memories。Mint as NFT、Built on Base、Secure & Decentralized の 3 つの特長を紹介。",
        },
      },
    },
    gallery: [
      {
        key: "projects/metabased/dashboard",
        alt: {
          en: "Metabased home feed with a sidebar menu, a listed NFT post with a Buy NFT button and a minted Wonka Golden Ticket post.",
          vi: "Bảng tin Metabased với menu bên trái, một bài đăng NFT đang niêm yết có nút Buy NFT và một bài đăng NFT Wonka Golden Ticket đã mint.",
          zh: "Metabased 首页动态：左侧菜单、带 Buy NFT 按钮的已上架 NFT 帖子，以及已铸造的 Wonka Golden Ticket 帖子。",
          ja: "Metabased のホームフィード。サイドメニュー、Buy NFT ボタン付きの出品中 NFT 投稿、ミント済みの Wonka Golden Ticket 投稿。",
        },
      },
      {
        key: "projects/metabased/discover",
        alt: {
          en: "Metabased discover screen for browsing posts and NFTs.",
          vi: "Màn hình khám phá của Metabased để duyệt bài đăng và NFT.",
          zh: "Metabased 发现页面，用于浏览帖子和 NFT。",
          ja: "投稿や NFT を探す Metabased のディスカバー画面。",
        },
      },
      {
        key: "projects/metabased/create-nft",
        alt: {
          en: "Metabased NFT creation screen.",
          vi: "Màn hình tạo NFT của Metabased.",
          zh: "Metabased 创建 NFT 页面。",
          ja: "Metabased の NFT 作成画面。",
        },
      },
      {
        key: "projects/metabased/sell-nft",
        alt: {
          en: "Metabased screen for listing an NFT for sale.",
          vi: "Màn hình niêm yết bán NFT của Metabased.",
          zh: "Metabased 上架出售 NFT 的页面。",
          ja: "NFT を出品する Metabased の画面。",
        },
      },
      {
        key: "projects/metabased/profile",
        alt: {
          en: "Metabased user profile screen.",
          vi: "Màn hình hồ sơ người dùng của Metabased.",
          zh: "Metabased 用户个人资料页面。",
          ja: "Metabased のユーザープロフィール画面。",
        },
      },
      {
        key: "projects/metabased/create-post",
        alt: {
          en: "Metabased post creation screen.",
          vi: "Màn hình tạo bài đăng của Metabased.",
          zh: "Metabased 创建帖子页面。",
          ja: "Metabased の投稿作成画面。",
        },
      },
      {
        key: "projects/metabased/interactive",
        alt: {
          en: "Metabased post with likes, reposts and comments.",
          vi: "Bài đăng trên Metabased với lượt thích, đăng lại và bình luận.",
          zh: "Metabased 帖子，包含点赞、转发和评论。",
          ja: "いいね、リポスト、コメント付きの Metabased の投稿。",
        },
      },
      {
        key: "projects/metabased/messages",
        alt: {
          en: "Metabased messages screen.",
          vi: "Màn hình tin nhắn của Metabased.",
          zh: "Metabased 消息页面。",
          ja: "Metabased のメッセージ画面。",
        },
      },
      {
        key: "projects/metabased/notification",
        alt: {
          en: "Metabased notifications screen.",
          vi: "Màn hình thông báo của Metabased.",
          zh: "Metabased 通知页面。",
          ja: "Metabased の通知画面。",
        },
      },
      {
        key: "projects/metabased/settings",
        alt: {
          en: "Metabased settings screen.",
          vi: "Màn hình cài đặt của Metabased.",
          zh: "Metabased 设置页面。",
          ja: "Metabased の設定画面。",
        },
      },
    ],
  },
  {
    id: "portfolio",
    title: "Portfolio",
    openSource: true,
    summary: {
      en: "This portfolio: a fast, four-language, scroll-driven site with prerendered pages, five themes and a pixel pet.",
      vi: "Chính portfolio này: trang cuộn nhanh, bốn ngôn ngữ, có trang prerender, năm giao diện và một chú pet pixel.",
      zh: "就是这个作品集：加载快、支持四种语言、以滚动驱动，带预渲染页面、五套主题和一只像素宠物。",
      ja: "このポートフォリオ自体：高速で 4 言語対応、スクロール主体のサイト。プリレンダリング、5 つのテーマ、ピクセルペット付き。",
    },
    problem: {
      en: "A portfolio should load fast, read well in several languages, and show real work instead of a template.",
      vi: "Portfolio nên tải nhanh, đọc tốt bằng nhiều ngôn ngữ và cho thấy sản phẩm thật thay vì một mẫu có sẵn.",
      zh: "作品集应该加载快、能用多种语言流畅阅读，并展示真实作品，而不是套用模板。",
      ja: "ポートフォリオは素早く読み込まれ、複数の言語で読みやすく、テンプレートではなく実際の仕事を見せるべきです。",
    },
    features: {
      en: [
        "Four languages and five themes, with an inline script that avoids a theme flash",
        "Lenis smooth scroll and motion, gated by reduced-motion preference",
        "Prerendered blog and project pages for SEO",
        "Media pipeline: WebP at two sizes, MOV to MP4, PDF to image, SEO slugs",
        "Command palette on Ctrl K",
        "Pixel Shiba pet driven by a manifest state machine, and a Markdown blog with sanitized HTML",
      ],
      vi: [
        "Bốn ngôn ngữ và năm giao diện, có script inline để tránh nháy giao diện",
        "Cuộn mượt Lenis và chuyển động, tôn trọng thiết lập giảm chuyển động",
        "Trang blog và dự án được prerender cho SEO",
        "Pipeline media: WebP hai kích thước, MOV sang MP4, PDF sang ảnh, slug chuẩn SEO",
        "Command palette mở bằng Ctrl K",
        "Pet Shiba pixel chạy bằng state machine theo manifest, cùng blog Markdown với HTML đã được làm sạch",
      ],
      zh: [
        "四种语言和五套主题，内联脚本避免主题闪烁",
        "Lenis 平滑滚动与动效，遵循减少动态效果的偏好",
        "为 SEO 预渲染博客和项目页面",
        "媒体流程：两种尺寸的 WebP、MOV 转 MP4、PDF 转图片、SEO 友好的 slug",
        "按 Ctrl K 打开命令面板",
        "由清单状态机驱动的像素柴犬宠物，以及 HTML 经过净化的 Markdown 博客",
      ],
      ja: [
        "4 言語と 5 テーマ、テーマのちらつきを防ぐインラインスクリプト",
        "Lenis によるスムーズスクロールとモーション、動きを減らす設定に対応",
        "SEO のためにブログとプロジェクトページをプリレンダリング",
        "メディアパイプライン：2 サイズの WebP、MOV から MP4、PDF から画像、SEO 向けスラッグ",
        "Ctrl K で開くコマンドパレット",
        "マニフェスト駆動のステートマシンで動くピクセル柴犬と、サニタイズ済み HTML の Markdown ブログ",
      ],
    },
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Motion", "Lenis"],
    results: [
      {
        value: "4",
        label: {
          en: "languages: English, Vietnamese, Chinese, Japanese",
          vi: "ngôn ngữ: Anh, Việt, Trung, Nhật",
          zh: "种语言：英语、越南语、中文、日语",
          ja: "言語：英語、ベトナム語、中国語、日本語",
        },
      },
      {
        value: "5",
        label: {
          en: "themes, with no flash on load",
          vi: "giao diện, không nháy khi tải trang",
          zh: "套主题，加载时不闪烁",
          ja: "つのテーマ、読み込み時のちらつきなし",
        },
      },
      {
        value: "5",
        label: {
          en: "runtime dependencies",
          vi: "phụ thuộc runtime",
          zh: "个运行时依赖",
          ja: "個のランタイム依存",
        },
      },
    ],
    links: {
      live: "https://duii.dev",
      github: "https://github.com/dui14/portfolio",
    },
    visual: {
      kind: "image",
      image: {
        src: PORTFOLIO_COVER?.src ?? "",
        srcSet: PORTFOLIO_COVER?.srcSet ?? "",
        sizes: "(min-width: 1024px) 700px, 100vw",
        width: PORTFOLIO_COVER?.width ?? PORTFOLIO_WIDTH,
        height: PORTFOLIO_COVER?.height ?? PORTFOLIO_HEIGHT,
        fit: "contain",
        alt: {
          en: "The hero section of the duii.dev portfolio.",
          vi: "Phần hero của portfolio duii.dev.",
          zh: "duii.dev 作品集的首屏区域。",
          ja: "duii.dev ポートフォリオのヒーローセクション。",
        },
      },
    },
    relatedPost: "vibe-coding-workflow",
  },
];
