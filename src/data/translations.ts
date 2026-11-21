import type { ContactFieldCode } from "../domain/contact.ts";
import type { LanguageId } from "../lib/i18n.ts";

export type ContactErrorCode =
  | ContactFieldCode
  | "network"
  | "rateLimit"
  | "server"
  | "invalid";

export type Translation = {
  nav: {
    home: string;
    about: string;
    projects: string;
    journey: string;
    blog: string;
    contact: string;
    label: string;
  };
  header: {
    role: string;
    location: string;
    cta: string;
    openPalette: string;
    toggleMenu: string;
    name: string;
    skipToContent: string;
    locationLabel: string;
    settingsLabel: string;
    themeLabel: string;
    languageLabel: string;
    closeMenu: string;
    menuLabel: string;
  };
  hero: {
    status: string;
    headline: {
      coder: string;
      builder: string;
      researcher: string;
    };
    description: string;
    viewProjects: string;
    contactMe: string;
    metrics: {
      users: string;
      trades: string;
      integrations: string;
    };
  };
  about: {
    title: string;
    introText: string;
    tags: string[];
    developerProfile: string;
    certified: string;
    backpack: string;
    credentialsLabel: string;
    tabCertifications: string;
    tabBadges: string;
    credentialCategories: {
      security: string;
      networking: string;
      financeWeb3: string;
    };
    issuedOn: string;
    expiresOn: string;
    opensNewTab: string;
    verifyCredential: string;
    certificatePrevious: string;
    certificateNext: string;
    certificateClose: string;
    certificateCounter: string;
    certificationsEmpty: string;
    badgesEmpty: string;
    life: string;
    shufflePhoto: string;
    lifeLabel: string;
    photoCounter: string;
    lifeEmpty: string;
    contributionsHeading: string;
    contributionsYearHeading: string;
    lastYear: string;
    contributionsRange: string;
    contributionsGrid: string;
    less: string;
    more: string;
    viewOnGithub: string;
    contributionNone: string;
    contributionOne: string;
    contributionMany: string;
    contributionsLoading: string;
    contributionsError: string;
    contributionsRetry: string;
  };
  projects: {
    title: string;
    empty: string;
    emptyHint: string;
    problem: string;
    results: string;
    security: string;
    features: string;
    details: string;
    detailsOf: string;
    live: string;
    github: string;
    openLiveOf: string;
    viewOnGithub: string;
    backToProjects: string;
    techStack: string;
    roadmap: string;
    roadmapPlanned: string;
    gallery: string;
    previous: string;
    next: string;
    moreProjects: string;
    readPost: string;
    showMore: string;
    showLess: string;
    galleryClose: string;
    galleryPrevious: string;
    galleryNext: string;
  };
  experience: {
    title: string;
    empty: string;
    viewImage: string;
  };
  contact: {
    title: string;
    formTitle: string;
    formSubtitle: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    successTitle: string;
    successText: string;
    sendAnother: string;
    errors: Record<ContactErrorCode, string>;
  };
  footer: {
    aboutTitle: string;
    aboutText: string;
    quickLinks: string;
    connect: string;
    rights: string;
  };
  blog: {
    title: string;
    allPosts: string;
    minRead: string;
    emptyTitle: string;
    emptyHint: string;
    goHome: string;
    filterLabel: string;
    filterAll: string;
    older: string;
    newer: string;
    morePosts: string;
    backToBlog: string;
    loadError: string;
    retry: string;
    notFoundTitle: string;
    notFoundText: string;
    postsLabel: string;
    loadingPost: string;
    coverMissing: string;
    readIn: string;
    availableIn: string;
  };
  pet: {
    label: string;
    soundLabel: string;
    on: string;
    off: string;
    bark: string;
    catch: string;
    zzz: string;
  };
  palette: {
    label: string;
    placeholder: string;
    empty: string;
    navigate: string;
    actions: string;
    scrollTop: string;
    escape: string;
  };
};

export const translations: Record<LanguageId, Translation> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      journey: "Journey",
      blog: "Blog",
      contact: "Contact",
      label: "Main navigation",
    },
    header: {
      role: "Software Engineer",
      location: "Ho Chi Minh City, Vietnam",
      cta: "Get in touch",
      openPalette: "Open command palette",
      toggleMenu: "Toggle menu",
      name: "Khang Luong",
      skipToContent: "Skip to content",
      locationLabel: "Location and local time",
      settingsLabel: "Settings",
      themeLabel: "Theme",
      languageLabel: "Language",
      closeMenu: "Close menu",
      menuLabel: "Menu",
    },
    hero: {
      status: "Ho Chi Minh City, VN — Open to engaging tech conversations",
      headline: {
        coder: "Coder.",
        builder: "Builder.",
        researcher: "Researcher.",
      },
      description:
        "Building products, tools and automation pipelines that solve problems many people share.",
      viewProjects: "View Projects",
      contactMe: "Contact Me",
      metrics: {
        trades: "real trades analyzed",
        users: "users across my products",
        integrations: "workflow tools integrated",
      },
    },
    about: {
      title: "About Me",
      introText:
        "A passionate software engineer focused on creating innovative solutions and meaningful user experiences. I specialize in full-stack development, blockchain technologies, and AI integration. Always learning, always building.",
      tags: [
        "Web Development",
        "Full-stack",
        "Web3",
        "Security",
        "AI Integration",
      ],
      developerProfile: "Developer profile as code",
      certified: "Certified",
      backpack: "In my bag",
      credentialsLabel: "Credentials",
      tabCertifications: "Certifications",
      tabBadges: "Badges",
      credentialCategories: {
        security: "Security",
        networking: "Networking",
        financeWeb3: "Finance & Web3",
      },
      issuedOn: "Issued {date}",
      expiresOn: "Expires {date}",
      opensNewTab: "opens in a new tab",
      verifyCredential: "Verify credential",
      certificatePrevious: "Previous certificate",
      certificateNext: "Next certificate",
      certificateClose: "Close",
      certificateCounter: "{current} of {total}",
      certificationsEmpty: "No certifications yet",
      badgesEmpty: "No badges yet",
      life: "Life",
      shufflePhoto: "Show another photo",
      lifeLabel: "Life",
      photoCounter: "Photo {current} of {total}",
      lifeEmpty: "No photos yet",
      contributionsHeading: "{count} contributions in the last year",
      contributionsYearHeading: "{count} contributions in {year}",
      lastYear: "Last year",
      contributionsRange: "Contribution period",
      contributionsGrid: "GitHub contribution calendar",
      less: "Less",
      more: "More",
      viewOnGithub: "View on GitHub",
      contributionNone: "No contributions on {date}",
      contributionOne: "1 contribution on {date}",
      contributionMany: "{count} contributions on {date}",
      contributionsLoading: "Loading contributions",
      contributionsError: "Could not load contributions",
      contributionsRetry: "Try again",
    },
    projects: {
      title: "Projects",
      empty: "No projects yet",
      emptyHint: "Check back soon for updates",
      problem: "Problem",
      results: "Results",
      security: "Security",
      features: "Features",
      details: "Details",
      detailsOf: "{title}: details",
      live: "Live",
      github: "GitHub",
      openLiveOf: "Open {title} live",
      viewOnGithub: "View {title} on GitHub",
      backToProjects: "Back to projects",
      techStack: "Tech stack",
      roadmap: "Roadmap",
      roadmapPlanned: "Planned, not shipped yet",
      gallery: "Gallery",
      previous: "Previous project",
      next: "Next project",
      moreProjects: "More projects",
      readPost: "Read the blog post",
      showMore: "Show {count} more",
      showLess: "Show less",
      galleryClose: "Close image",
      galleryPrevious: "Previous image",
      galleryNext: "Next image",
    },
    experience: {
      title: "Experience",
      empty: "No experience yet",
      viewImage: "View image",
    },
    contact: {
      title: "Contact",
      formTitle: "Get in touch",
      formSubtitle:
        "I'm always interested in hearing about new projects and opportunities. Drop me a message!",
      name: "Name",
      namePlaceholder: "Enter your name",
      email: "Email",
      emailPlaceholder: "Enter your email",
      message: "Message",
      messagePlaceholder: "Write your message here",
      send: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent!",
      successText: "Thank you for reaching out. I'll get back to you soon.",
      sendAnother: "Send Another Message",
      errors: {
        nameRequired: "Name is required",
        nameTooLong: "Name must be at most 80 characters",
        emailRequired: "Email is required",
        emailInvalid: "Invalid email address",
        messageRequired: "Message is required",
        messageTooShort: "Message must be at least 10 characters",
        messageTooLong: "Message must be at most 1000 characters",
        network: "Network error. Please try again.",
        rateLimit: "Too many messages. Please try again in a few minutes.",
        server: "Something went wrong on the server. Please try again later.",
        invalid: "Some details look off. Check the form and try again.",
      },
    },
    footer: {
      aboutTitle: "About Me",
      aboutText:
        "Software engineer in Ho Chi Minh City building products, tools and automation pipelines that solve problems many people share.",
      quickLinks: "Quick Links",
      connect: "Connect",
      rights: "All rights reserved.",
    },
    blog: {
      title: "Blog",
      allPosts: "All posts",
      minRead: "{minutes} min read",
      emptyTitle: "No posts yet",
      emptyHint: "Nothing has been published here yet.",
      goHome: "Back to home",
      filterLabel: "Filter posts by tag",
      filterAll: "All",
      older: "Older post",
      newer: "Newer post",
      morePosts: "More posts",
      backToBlog: "All posts",
      loadError: "This post could not be loaded.",
      retry: "Try again",
      notFoundTitle: "Page not found",
      notFoundText: "The page you are looking for does not exist.",
      postsLabel: "Blog posts",
      loadingPost: "Loading post",
      coverMissing: "Cover image unavailable",
      readIn: "Read in",
      availableIn: "This post is available in {languages}",
    },
    pet: {
      label: "Pet",
      soundLabel: "Sound",
      on: "On",
      off: "Off",
      bark: "woof!",
      catch: "catch u!",
      zzz: "Zzz",
    },
    palette: {
      label: "Command palette",
      placeholder: "Search commands...",
      empty: "No commands found",
      navigate: "Navigate",
      actions: "Actions",
      scrollTop: "Scroll to Top",
      escape: "ESC",
    },
  },
  vi: {
    nav: {
      home: "Trang chủ",
      about: "Giới thiệu",
      projects: "Dự án",
      journey: "Hành trình",
      blog: "Blog",
      contact: "Liên hệ",
      label: "Điều hướng chính",
    },
    header: {
      role: "Kỹ sư phần mềm",
      location: "TP. Hồ Chí Minh, Việt Nam",
      cta: "Liên hệ ngay",
      openPalette: "Mở bảng lệnh",
      toggleMenu: "Bật tắt menu",
      name: "Khang Luong",
      skipToContent: "Chuyển đến nội dung",
      locationLabel: "Vị trí và giờ địa phương",
      settingsLabel: "Cài đặt",
      themeLabel: "Giao diện",
      languageLabel: "Ngôn ngữ",
      closeMenu: "Đóng menu",
      menuLabel: "Menu",
    },
    hero: {
      status: "TP. Hồ Chí Minh, VN — Sẵn sàng trao đổi về công nghệ",
      headline: {
        coder: "Coder.",
        builder: "Builder.",
        researcher: "Researcher.",
      },
      description:
        "Xây dựng sản phẩm, công cụ và pipeline tự động hóa giải quyết những nhu cầu chung của thị trường.",
      viewProjects: "Xem dự án",
      contactMe: "Liên hệ tôi",
      metrics: {
        trades: "giao dịch thật đã phân tích",
        users: "người dùng các sản phẩm",
        integrations: "công cụ workflow tích hợp",
      },
    },
    about: {
      title: "Về tôi",
      introText:
        "Một kỹ sư phần mềm đam mê tạo ra các giải pháp sáng tạo và trải nghiệm người dùng ý nghĩa. Tôi chuyên về phát triển full-stack, công nghệ blockchain và tích hợp AI. Luôn học hỏi, luôn xây dựng.",
      tags: [
        "Phát triển web",
        "Full-stack",
        "Web3",
        "Bảo mật",
        "Tích hợp AI",
      ],
      developerProfile: "Hồ sơ lập trình viên dạng mã",
      certified: "Chứng chỉ",
      backpack: "Trong ba lô của tôi",
      credentialsLabel: "Chứng nhận",
      tabCertifications: "Chứng chỉ",
      tabBadges: "Huy hiệu",
      credentialCategories: {
        security: "Bảo mật",
        networking: "Mạng máy tính",
        financeWeb3: "Tài chính & Web3",
      },
      issuedOn: "Cấp {date}",
      expiresOn: "Hết hạn {date}",
      opensNewTab: "mở trong tab mới",
      verifyCredential: "Xác minh chứng nhận",
      certificatePrevious: "Chứng chỉ trước",
      certificateNext: "Chứng chỉ sau",
      certificateClose: "Đóng",
      certificateCounter: "{current} / {total}",
      certificationsEmpty: "Chưa có chứng chỉ",
      badgesEmpty: "Chưa có huy hiệu",
      life: "Cuộc sống",
      shufflePhoto: "Xem ảnh khác",
      lifeLabel: "Đời thường",
      photoCounter: "Ảnh {current} trên {total}",
      lifeEmpty: "Chưa có ảnh",
      contributionsHeading: "{count} đóng góp trong năm qua",
      contributionsYearHeading: "{count} đóng góp trong năm {year}",
      lastYear: "Năm qua",
      contributionsRange: "Khoảng thời gian đóng góp",
      contributionsGrid: "Lịch đóng góp GitHub",
      less: "Ít",
      more: "Nhiều",
      viewOnGithub: "Xem trên GitHub",
      contributionNone: "Không có đóng góp vào {date}",
      contributionOne: "1 đóng góp vào {date}",
      contributionMany: "{count} đóng góp vào {date}",
      contributionsLoading: "Đang tải đóng góp",
      contributionsError: "Không thể tải đóng góp",
      contributionsRetry: "Thử lại",
    },
    projects: {
      title: "Dự án",
      empty: "Chưa có dự án",
      emptyHint: "Hãy quay lại sau nhé",
      problem: "Vấn đề",
      results: "Kết quả",
      security: "Bảo mật",
      features: "Tính năng",
      details: "Chi tiết",
      detailsOf: "{title}: chi tiết",
      live: "Live",
      github: "GitHub",
      openLiveOf: "Mở {title} trực tiếp",
      viewOnGithub: "Xem {title} trên GitHub",
      backToProjects: "Quay lại dự án",
      techStack: "Công nghệ sử dụng",
      roadmap: "Lộ trình",
      roadmapPlanned: "Dự kiến, chưa phát hành",
      gallery: "Thư viện ảnh",
      previous: "Dự án trước",
      next: "Dự án tiếp theo",
      moreProjects: "Dự án khác",
      readPost: "Đọc bài viết trên blog",
      showMore: "Xem thêm {count} ảnh",
      showLess: "Thu gọn",
      galleryClose: "Đóng ảnh",
      galleryPrevious: "Ảnh trước",
      galleryNext: "Ảnh sau",
    },
    experience: {
      title: "Kinh nghiệm",
      empty: "Chưa có kinh nghiệm",
      viewImage: "Xem ảnh",
    },
    contact: {
      title: "Liên hệ",
      formTitle: "Kết nối với tôi",
      formSubtitle:
        "Tôi luôn quan tâm đến các dự án và cơ hội mới. Hãy gửi tin nhắn cho tôi!",
      name: "Họ tên",
      namePlaceholder: "Nhập họ tên của bạn",
      email: "Email",
      emailPlaceholder: "Nhập email của bạn",
      message: "Tin nhắn",
      messagePlaceholder: "Viết tin nhắn của bạn tại đây",
      send: "Gửi tin nhắn",
      sending: "Đang gửi...",
      successTitle: "Đã gửi tin nhắn!",
      successText: "Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất.",
      sendAnother: "Gửi tin nhắn khác",
      errors: {
        nameRequired: "Vui lòng nhập họ tên",
        nameTooLong: "Họ tên tối đa 80 ký tự",
        emailRequired: "Vui lòng nhập email",
        emailInvalid: "Email không hợp lệ",
        messageRequired: "Vui lòng nhập tin nhắn",
        messageTooShort: "Tin nhắn tối thiểu 10 ký tự",
        messageTooLong: "Tin nhắn tối đa 1000 ký tự",
        network: "Lỗi kết nối. Vui lòng thử lại.",
        rateLimit: "Bạn gửi hơi nhiều. Thử lại sau vài phút nhé.",
        server: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.",
        invalid: "Có thông tin chưa hợp lệ. Kiểm tra lại form rồi gửi nhé.",
      },
    },
    footer: {
      aboutTitle: "Về tôi",
      aboutText:
        "Kỹ sư phần mềm tại Thành phố Hồ Chí Minh, xây dựng sản phẩm, công cụ và pipeline tự động hóa giải quyết những nhu cầu chung của thị trường.",
      quickLinks: "Liên kết nhanh",
      connect: "Kết nối",
      rights: "Bảo lưu mọi quyền.",
    },
    blog: {
      title: "Blog",
      allPosts: "Tất cả bài viết",
      minRead: "{minutes} phút đọc",
      emptyTitle: "Chưa có bài viết",
      emptyHint: "Chưa có bài viết nào được đăng ở đây.",
      goHome: "Về trang chủ",
      filterLabel: "Lọc bài viết theo thẻ",
      filterAll: "Tất cả",
      older: "Bài cũ hơn",
      newer: "Bài mới hơn",
      morePosts: "Bài viết khác",
      backToBlog: "Tất cả bài viết",
      loadError: "Không thể tải bài viết này.",
      retry: "Thử lại",
      notFoundTitle: "Không tìm thấy trang",
      notFoundText: "Trang bạn tìm không tồn tại.",
      postsLabel: "Bài viết",
      loadingPost: "Đang tải bài viết",
      coverMissing: "Không có ảnh bìa",
      readIn: "Đọc bằng",
      availableIn: "Bài viết này có bản {languages}",
    },
    pet: {
      label: "Thú cưng",
      soundLabel: "Âm thanh",
      on: "Bật",
      off: "Tắt",
      bark: "gâu gâu!",
      catch: "bắt được rồi!",
      zzz: "Zzz",
    },
    palette: {
      label: "Bảng lệnh",
      placeholder: "Tìm lệnh...",
      empty: "Không tìm thấy lệnh",
      navigate: "Điều hướng",
      actions: "Hành động",
      scrollTop: "Cuộn lên đầu trang",
      escape: "ESC",
    },
  },
  zh: {
    nav: {
      home: "首页",
      about: "关于",
      projects: "项目",
      journey: "旅程",
      blog: "博客",
      contact: "联系",
      label: "主导航",
    },
    header: {
      role: "软件工程师",
      location: "越南胡志明市",
      cta: "联系我",
      openPalette: "打开命令面板",
      toggleMenu: "切换菜单",
      name: "Khang Luong",
      skipToContent: "跳到内容",
      locationLabel: "位置与当地时间",
      settingsLabel: "设置",
      themeLabel: "主题",
      languageLabel: "语言",
      closeMenu: "关闭菜单",
      menuLabel: "菜单",
    },
    hero: {
      status: "越南胡志明市 — 乐于进行有趣的技术交流",
      headline: {
        coder: "开发者。",
        builder: "构建者。",
        researcher: "研究者。",
      },
      description: "打造产品、工具和自动化流程，解决大家共同面对的问题。",
      viewProjects: "查看项目",
      contactMe: "联系我",
      metrics: {
        trades: "笔真实交易已分析",
        users: "位产品用户",
        integrations: "个工作流工具集成",
      },
    },
    about: {
      title: "关于我",
      introText:
        "一名热衷于创造创新解决方案和有意义用户体验的软件工程师。我专注于全栈开发、区块链技术和 AI 集成。持续学习，持续构建。",
      tags: [
        "Web 开发",
        "全栈",
        "Web3",
        "安全",
        "AI 集成",
      ],
      developerProfile: "以代码呈现的开发者档案",
      certified: "认证",
      backpack: "我的背包",
      credentialsLabel: "资质凭证",
      tabCertifications: "证书",
      tabBadges: "徽章",
      credentialCategories: {
        security: "安全",
        networking: "网络",
        financeWeb3: "金融与 Web3",
      },
      issuedOn: "颁发于 {date}",
      expiresOn: "有效期至 {date}",
      opensNewTab: "在新标签页打开",
      verifyCredential: "验证凭证",
      certificatePrevious: "上一张证书",
      certificateNext: "下一张证书",
      certificateClose: "关闭",
      certificateCounter: "第 {current} 张，共 {total} 张",
      certificationsEmpty: "暂无证书",
      badgesEmpty: "暂无徽章",
      life: "生活",
      shufflePhoto: "换一张照片",
      lifeLabel: "生活",
      photoCounter: "第 {current} 张，共 {total} 张",
      lifeEmpty: "暂无照片",
      contributionsHeading: "过去一年共 {count} 次贡献",
      contributionsYearHeading: "{year} 年共 {count} 次贡献",
      lastYear: "过去一年",
      contributionsRange: "贡献时间范围",
      contributionsGrid: "GitHub 贡献日历",
      less: "少",
      more: "多",
      viewOnGithub: "在 GitHub 上查看",
      contributionNone: "{date} 无贡献",
      contributionOne: "{date} 有 1 次贡献",
      contributionMany: "{date} 有 {count} 次贡献",
      contributionsLoading: "正在加载贡献",
      contributionsError: "无法加载贡献",
      contributionsRetry: "重试",
    },
    projects: {
      title: "项目",
      empty: "暂无项目",
      emptyHint: "敬请期待",
      problem: "问题",
      results: "成果",
      security: "安全",
      features: "功能",
      details: "详情",
      detailsOf: "{title}：详情",
      live: "在线",
      github: "GitHub",
      openLiveOf: "打开 {title} 在线版",
      viewOnGithub: "在 GitHub 上查看 {title}",
      backToProjects: "返回项目",
      techStack: "技术栈",
      roadmap: "路线图",
      roadmapPlanned: "计划中，尚未发布",
      gallery: "图库",
      previous: "上一个项目",
      next: "下一个项目",
      moreProjects: "更多项目",
      readPost: "阅读博客文章",
      showMore: "再显示 {count} 张",
      showLess: "收起",
      galleryClose: "关闭图片",
      galleryPrevious: "上一张图片",
      galleryNext: "下一张图片",
    },
    experience: {
      title: "经历",
      empty: "暂无经历",
      viewImage: "查看图片",
    },
    contact: {
      title: "联系",
      formTitle: "保持联系",
      formSubtitle: "我随时乐意了解新的项目与机会。给我留言吧！",
      name: "姓名",
      namePlaceholder: "请输入您的姓名",
      email: "邮箱",
      emailPlaceholder: "请输入您的邮箱",
      message: "留言",
      messagePlaceholder: "请在此写下您的留言",
      send: "发送留言",
      sending: "发送中...",
      successTitle: "留言已发送！",
      successText: "感谢您的联系，我会尽快回复。",
      sendAnother: "再发一条留言",
      errors: {
        nameRequired: "请输入姓名",
        nameTooLong: "姓名最多 80 个字符",
        emailRequired: "请输入邮箱",
        emailInvalid: "邮箱格式不正确",
        messageRequired: "请输入留言",
        messageTooShort: "留言至少 10 个字符",
        messageTooLong: "留言最多 1000 个字符",
        network: "网络错误，请重试。",
        rateLimit: "发送过于频繁，请几分钟后再试。",
        server: "服务器出现问题，请稍后再试。",
        invalid: "部分信息似乎有误，请检查表单后重试。",
      },
    },
    footer: {
      aboutTitle: "关于我",
      aboutText: "常驻胡志明市的软件工程师，打造产品、工具和自动化流程，解决大家共同面对的问题。",
      quickLinks: "快速链接",
      connect: "联系方式",
      rights: "版权所有。",
    },
    blog: {
      title: "博客",
      allPosts: "全部文章",
      minRead: "阅读约 {minutes} 分钟",
      emptyTitle: "暂无文章",
      emptyHint: "这里还没有发布任何文章。",
      goHome: "返回首页",
      filterLabel: "按标签筛选文章",
      filterAll: "全部",
      older: "较早的文章",
      newer: "较新的文章",
      morePosts: "更多文章",
      backToBlog: "全部文章",
      loadError: "无法加载这篇文章。",
      retry: "重试",
      notFoundTitle: "页面不存在",
      notFoundText: "你访问的页面不存在。",
      postsLabel: "博客文章",
      loadingPost: "正在加载文章",
      coverMissing: "封面图片不可用",
      readIn: "阅读语言",
      availableIn: "本文提供 {languages} 版本",
    },
    pet: {
      label: "宠物",
      soundLabel: "声音",
      on: "开",
      off: "关",
      bark: "汪汪！",
      catch: "抓到你啦！",
      zzz: "Zzz",
    },
    palette: {
      label: "命令面板",
      placeholder: "搜索命令...",
      empty: "未找到命令",
      navigate: "导航",
      actions: "操作",
      scrollTop: "回到顶部",
      escape: "ESC",
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      about: "自己紹介",
      projects: "プロジェクト",
      journey: "経歴",
      blog: "ブログ",
      contact: "お問い合わせ",
      label: "メインナビゲーション",
    },
    header: {
      role: "ソフトウェアエンジニア",
      location: "ホーチミン市、ベトナム",
      cta: "連絡する",
      openPalette: "コマンドパレットを開く",
      toggleMenu: "メニューを切り替え",
      name: "Khang Luong",
      skipToContent: "本文へスキップ",
      locationLabel: "所在地と現地時間",
      settingsLabel: "設定",
      themeLabel: "テーマ",
      languageLabel: "言語",
      closeMenu: "メニューを閉じる",
      menuLabel: "メニュー",
    },
    hero: {
      status: "ホーチミン市、VN — 技術の話、気軽にどうぞ",
      headline: {
        coder: "コーダー。",
        builder: "ビルダー。",
        researcher: "リサーチャー。",
      },
      description:
        "多くの人が抱える共通の課題を解決するプロダクト、ツール、自動化パイプラインを作っています。",
      viewProjects: "プロジェクトを見る",
      contactMe: "連絡する",
      metrics: {
        trades: "件の実取引を分析",
        users: "人のプロダクト利用者",
        integrations: "個のワークフロー連携",
      },
    },
    about: {
      title: "自己紹介",
      introText:
        "革新的なソリューションと心地よいユーザー体験づくりに情熱を注ぐソフトウェアエンジニアです。フルスタック開発、ブロックチェーン、AI 連携を得意としています。学び続け、作り続けます。",
      tags: [
        "Web 開発",
        "フルスタック",
        "Web3",
        "セキュリティ",
        "AI 連携",
      ],
      developerProfile: "コードで表す開発者プロフィール",
      certified: "認定",
      backpack: "バッグの中身",
      credentialsLabel: "資格情報",
      tabCertifications: "認定証",
      tabBadges: "バッジ",
      credentialCategories: {
        security: "セキュリティ",
        networking: "ネットワーク",
        financeWeb3: "金融と Web3",
      },
      issuedOn: "発行 {date}",
      expiresOn: "有効期限 {date}",
      opensNewTab: "新しいタブで開く",
      verifyCredential: "資格を確認",
      certificatePrevious: "前の認定証",
      certificateNext: "次の認定証",
      certificateClose: "閉じる",
      certificateCounter: "{current} / {total}",
      certificationsEmpty: "認定証はまだありません",
      badgesEmpty: "バッジはまだありません",
      life: "日常",
      shufflePhoto: "別の写真を表示",
      lifeLabel: "日常",
      photoCounter: "{total} 枚中 {current} 枚目",
      lifeEmpty: "写真はまだありません",
      contributionsHeading: "過去 1 年間で {count} 件のコントリビューション",
      contributionsYearHeading: "{year} 年は {count} 件のコントリビューション",
      lastYear: "過去 1 年",
      contributionsRange: "集計期間",
      contributionsGrid: "GitHub コントリビューションカレンダー",
      less: "少",
      more: "多",
      viewOnGithub: "GitHub で見る",
      contributionNone: "{date}：コントリビューションなし",
      contributionOne: "{date}：1 件のコントリビューション",
      contributionMany: "{date}：{count} 件のコントリビューション",
      contributionsLoading: "コントリビューションを読み込み中",
      contributionsError: "コントリビューションを読み込めませんでした",
      contributionsRetry: "再試行",
    },
    projects: {
      title: "プロジェクト",
      empty: "プロジェクトはまだありません",
      emptyHint: "近日公開予定です",
      problem: "課題",
      results: "実績",
      security: "セキュリティ",
      features: "機能",
      details: "詳細",
      detailsOf: "{title}：詳細",
      live: "ライブ",
      github: "GitHub",
      openLiveOf: "{title} のライブ版を開く",
      viewOnGithub: "GitHub で {title} を見る",
      backToProjects: "プロジェクトに戻る",
      techStack: "技術スタック",
      roadmap: "ロードマップ",
      roadmapPlanned: "計画中、未リリース",
      gallery: "ギャラリー",
      previous: "前のプロジェクト",
      next: "次のプロジェクト",
      moreProjects: "その他のプロジェクト",
      readPost: "ブログ記事を読む",
      showMore: "さらに {count} 枚を表示",
      showLess: "表示を減らす",
      galleryClose: "画像を閉じる",
      galleryPrevious: "前の画像",
      galleryNext: "次の画像",
    },
    experience: {
      title: "経歴",
      empty: "経歴はまだありません",
      viewImage: "画像を見る",
    },
    contact: {
      title: "お問い合わせ",
      formTitle: "ご連絡ください",
      formSubtitle:
        "新しいプロジェクトや機会のお話は大歓迎です。お気軽にメッセージをどうぞ。",
      name: "お名前",
      namePlaceholder: "お名前を入力",
      email: "メールアドレス",
      emailPlaceholder: "メールアドレスを入力",
      message: "メッセージ",
      messagePlaceholder: "メッセージを入力してください",
      send: "送信",
      sending: "送信中...",
      successTitle: "送信しました",
      successText: "ご連絡ありがとうございます。近日中に返信します。",
      sendAnother: "もう一通送る",
      errors: {
        nameRequired: "お名前を入力してください",
        nameTooLong: "お名前は 80 文字以内で入力してください",
        emailRequired: "メールアドレスを入力してください",
        emailInvalid: "メールアドレスの形式が正しくありません",
        messageRequired: "メッセージを入力してください",
        messageTooShort: "メッセージは 10 文字以上で入力してください",
        messageTooLong: "メッセージは 1000 文字以内で入力してください",
        network: "ネットワークエラーです。もう一度お試しください。",
        rateLimit: "メッセージの送信回数が多すぎます。数分後にもう一度お試しください。",
        server: "サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。",
        invalid: "入力内容に誤りがあります。フォームを確認してもう一度お試しください。",
      },
    },
    footer: {
      aboutTitle: "自己紹介",
      aboutText:
        "ホーチミン市を拠点に、多くの人が抱える共通の課題を解決するプロダクト、ツール、自動化パイプラインを作るソフトウェアエンジニアです。",
      quickLinks: "クイックリンク",
      connect: "つながる",
      rights: "無断転載を禁じます。",
    },
    blog: {
      title: "ブログ",
      allPosts: "すべての記事",
      minRead: "読了目安 {minutes} 分",
      emptyTitle: "記事はまだありません",
      emptyHint: "まだ公開された記事はありません。",
      goHome: "ホームに戻る",
      filterLabel: "タグで記事を絞り込む",
      filterAll: "すべて",
      older: "前の記事",
      newer: "次の記事",
      morePosts: "ほかの記事",
      backToBlog: "すべての記事",
      loadError: "記事を読み込めませんでした。",
      retry: "再試行",
      notFoundTitle: "ページが見つかりません",
      notFoundText: "お探しのページは存在しません。",
      postsLabel: "ブログ記事",
      loadingPost: "記事を読み込み中",
      coverMissing: "カバー画像を表示できません",
      readIn: "表示言語",
      availableIn: "この記事は {languages} で読めます",
    },
    pet: {
      label: "ペット",
      soundLabel: "サウンド",
      on: "オン",
      off: "オフ",
      bark: "ワン！",
      catch: "つかまえた！",
      zzz: "Zzz",
    },
    palette: {
      label: "コマンドパレット",
      placeholder: "コマンドを検索...",
      empty: "コマンドが見つかりません",
      navigate: "移動",
      actions: "アクション",
      scrollTop: "ページの先頭へ",
      escape: "ESC",
    },
  },
};
