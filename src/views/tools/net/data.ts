import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const NET_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'short-url': {
    zh: {
      summary:
        '短链接生成工具用于将较长的原始 URL 转换为更紧凑、便于复制和传播的短链接。适合社交媒体帖子、短信和即时通讯通知、邮件营销、二维码落地页、线下印刷物料、客服回复模板、工单系统参考链接、App 分享卡片，以及包含多个 UTM 参数的营销链接。工具会展示多条可选短链结果，并标注推荐结果，方便按访问速度、域名偏好或传播场景选择。',
      input:
        '一个以 http:// 或 https:// 开头的完整长链接地址。链接可以包含多级路径、查询参数、UTM 追踪参数、页面锚点、中文路径或已编码字符。输入为空时不会生成；输入不是 HTTP(S) 链接时会显示格式提示，避免把普通文本、邮箱地址或无效字符串当作链接提交。',
      output:
        '一组短链接结果，以卡片形式展示。每条结果包含服务商名称、短链接地址和可选说明；第一条会标记为推荐。短链接可一键复制，也可打开新标签页验证跳转目标。生成失败时，页面会显示错误提示并清空过期结果，避免继续使用无效短链。',
      processing:
        '工具会先检查输入是否为有效 HTTP(S) 链接，再生成多条短链结果。生成过程中会防止重复提交；结果返回后按服务商分组展示，并标记推荐项。复制成功会有即时反馈，打开短链前建议先验证跳转目标。短链生成需要请求外部短链服务，避免提交含隐私令牌、内部后台地址或未公开资源的链接。',
      modes: ['HTTP(S) 链接校验', '多线路生成', '服务商标注', '推荐结果标记', '逐条一键复制', '新标签页验证', '错误提示'],
      example: {
        title: '短链接生成输入到输出示例',
        input: 'https://example.com/products/spring-launch?utm_source=newsletter&utm_medium=email&utm_campaign=may_promo',
        output:
          '服务商 A (推荐): https://short.example/aB12cD\n服务商 B: https://s.example/9xYzW3\n\n选择任一短链接复制后用于社媒帖子、短信通知、邮件营销或二维码落地页。',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Short URL tool converts long URLs into compact links that are easier to copy, display, and share. It is useful for social media posts, SMS and messaging notifications, email campaigns, QR code landing pages, printed materials, support reply templates, ticket references, app share cards, and marketing links with multiple UTM parameters. The tool shows multiple short-link options and marks a recommended result so you can choose by speed, domain preference, or distribution context.',
      input:
        'A complete long URL starting with http:// or https://. The URL may include paths, query parameters, UTM tags, anchors, CJK paths, or encoded characters. Empty input will not generate a result. If the value is not an HTTP(S) link, the page shows a validation message so plain text, email addresses, and invalid strings are not treated as URLs.',
      output:
        'A set of short-link results displayed as cards. Each result includes the provider name, the short URL, and an optional note; the first result is marked as recommended. Each short link can be copied with one click or opened in a new tab to verify the redirect target. If generation fails, the page shows an error and clears stale results.',
      processing:
        'The tool checks that the input is a valid HTTP(S) link before generating multiple short-link results. It prevents duplicate submissions while generation is running, groups results by provider, and marks the recommended option. Copy actions show immediate feedback. Short-link generation uses external shortening services, so avoid submitting URLs that contain private tokens, internal admin paths, or unpublished resources.',
      modes: ['HTTP(S) validation', 'Multi-provider generation', 'Provider labels', 'Recommended result', 'One-click copy', 'New-tab verification', 'Clear error messages'],
      example: {
        title: 'Short URL generation input-to-output example',
        input: 'https://example.com/products/spring-launch?utm_source=newsletter&utm_medium=email&utm_campaign=may_promo',
        output:
          'Provider A (Recommended): https://short.example/aB12cD\nProvider B: https://s.example/9xYzW3\n\nCopy either short URL for social media posts, SMS notifications, email marketing, or QR code landing pages.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
};
