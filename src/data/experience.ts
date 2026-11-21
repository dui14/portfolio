import type { ExperienceItem } from "../domain/experience.ts";

export const experience: ExperienceItem[] = [
  {
    id: "vaa-start",
    period: {
      en: "Sep 2023",
      vi: "Th9 2023",
      zh: "2023年9月",
      ja: "2023年9月",
    },
    title: {
      en: "Starting at VAA",
      vi: "Bắt đầu hành trình tại VAA",
      zh: "在 VAA 起步",
      ja: "VAA でのスタート",
    },
    description: {
      en: "Enrolled at the Vietnam Aviation Academy (VAA). Got used to university life, set a career direction and took my first steps into information technology.",
      vi: "Nhập học Học viện Hàng không Việt Nam (VAA). Làm quen với môi trường đại học, định hướng nghề nghiệp và những bài học nhập môn đầu tiên về công nghệ thông tin.",
      zh: "入学越南航空学院（VAA）。适应大学生活，确定职业方向，并迈出了信息技术的第一步。",
      ja: "ベトナム航空学院（VAA）に入学。大学生活に慣れ、進むべき方向を定め、情報技術への第一歩を踏み出しました。",
    },
    image: "experience/vaa-start",
    tags: ["Education", "IT Fundamentals"],
    side: "left",
  },
  {
    id: "foundations",
    period: { en: "2024", vi: "2024", zh: "2024", ja: "2024" },
    title: {
      en: "Programming foundations & community",
      vi: "Nền tảng lập trình và cộng đồng",
      zh: "编程基础与社区",
      ja: "プログラミングの基礎とコミュニティ",
    },
    description: {
      en: "Built core programming skills: data structures, algorithms and computer systems. Joined a student tech club, which widened my view and taught me to work in a team.",
      vi: "Rèn tư duy lập trình cốt lõi: cấu trúc dữ liệu, giải thuật và hệ thống máy tính. Tham gia CLB chuyên ngành để mở rộng góc nhìn và học cách làm việc nhóm.",
      zh: "打牢编程核心能力：数据结构、算法与计算机系统。加入学生技术社团，拓宽了视野，也学会了团队协作。",
      ja: "データ構造、アルゴリズム、コンピュータシステムなど、プログラミングの核となる力を養いました。学生の技術サークルに参加し、視野を広げ、チームで働くことを学びました。",
    },
    image: "experience/foundations",
    tags: ["Algorithms", "Data Structures", "Teamwork"],
    side: "right",
  },
  {
    id: "first-builds",
    period: { en: "2025", vi: "2025", zh: "2025", ja: "2025" },
    title: {
      en: "Exploring Web3 & first builds",
      vi: "Khám phá Web3 và những công cụ đầu tiên",
      zh: "探索 Web3 与最初的作品",
      ja: "Web3 の探求と最初のビルド",
    },
    description: {
      en: "Studied decentralized architecture and joined workshops in the Sui ecosystem. Turned what I learned into my first small tools, built from scratch.",
      vi: "Tìm hiểu kiến trúc phi tập trung và tham gia các workshop trong hệ sinh thái Sui. Bắt đầu biến kiến thức thành những công cụ nhỏ đầu tiên do chính mình xây dựng.",
      zh: "研究去中心化架构，参加 Sui 生态的工作坊，并把所学转化为我从零开始构建的第一批小工具。",
      ja: "分散型アーキテクチャを学び、Sui エコシステムのワークショップに参加。学んだことを、ゼロから作った最初の小さなツールに変えていきました。",
    },
    image: "experience/first-builds",
    tags: ["Web3", "Sui", "Builder"],
    side: "left",
  },
  {
    id: "products-freelance",
    period: { en: "2026", vi: "2026", zh: "2026", ja: "2026" },
    title: {
      en: "Building real products & freelancing",
      vi: "Xây sản phẩm thực tế và làm freelance",
      zh: "打造真实产品与自由职业",
      ja: "実際のプロダクト開発とフリーランス",
    },
    description: {
      en: "Built personal products for needs many people share, now used by 100+ people. Took on freelance work and deepened my knowledge of security and information system safety.",
      vi: "Phát triển các sản phẩm cá nhân phục vụ những nhu cầu chung của thị trường, đã có hơn 100 người dùng. Nhận dự án freelance và bồi đắp thêm kiến thức về bảo mật, an toàn hệ thống thông tin.",
      zh: "围绕大家共同的需求打造个人产品，目前已有 100 多人在使用。承接自由职业项目，并进一步加深了对安全与信息系统安全的理解。",
      ja: "多くの人に共通するニーズに向けて個人プロダクトを開発し、現在 100 人以上に使われています。フリーランスの案件も受け、セキュリティと情報システムの安全性への理解を深めました。",
    },
    image: "experience/products-freelance",
    tags: ["Product", "Freelance", "Security"],
    side: "right",
  },
  {
    id: "graduated",
    period: {
      en: "Nov 2026 – Now",
      vi: "Th11 2026 – Nay",
      zh: "2026年11月 – 至今",
      ja: "2026年11月 – 現在",
    },
    title: {
      en: "Graduated, ready for the next step",
      vi: "Tốt nghiệp và sẵn sàng cho chặng mới",
      zh: "毕业，准备迎接下一步",
      ja: "卒業、次のステップへ",
    },
    description: {
      en: "Completed my degree at VAA. Bringing my foundations and project experience into a professional team, where I can keep learning and growing.",
      vi: "Chính thức hoàn thành chương trình học tại VAA. Mang nền tảng kiến thức và kinh nghiệm làm dự án cá nhân vào môi trường doanh nghiệp để tiếp tục học hỏi và phát triển.",
      zh: "在 VAA 完成学业。希望把扎实的基础和项目经验带入专业团队，在其中继续学习与成长。",
      ja: "VAA での学業を修了しました。基礎とプロジェクト経験を専門のチームに持ち込み、学び、成長を続けたいと考えています。",
    },
    image: "experience/graduated",
    tags: ["Graduate", "Open to opportunities"],
    side: "left",
  },
];
