import AiRuntimeTool, { type AiRuntimeToolConfig } from './AiRuntimeTool';

const config: AiRuntimeToolConfig = {
  toolId: 'ai-youtube-generator',
  endpoint: '/api/youtube-generator',
  icon: 'clapperboard',
  title: {
    en: 'YouTube Title and Description Generator',
    zh: 'YouTube 标题与简介生成器',
  },
  subtitle: {
    en: 'Generate title ideas, SEO descriptions, tags, and thumbnail directions from one video brief.',
    zh: '根据视频主题生成标题、SEO 简介、标签和缩略图方向。',
  },
  formTitle: {
    en: 'Video brief',
    zh: '视频简报',
  },
  generateLabel: {
    en: 'Generate YouTube copy',
    zh: '生成 YouTube 文案',
  },
  waitingLabel: {
    en: 'Your YouTube packaging draft will appear here.',
    zh: '生成后的 YouTube 包装文案会显示在这里。',
  },
  loadingLabel: {
    en: 'Generating YouTube copy...',
    zh: '正在生成 YouTube 文案...',
  },
  fields: [
    {
      key: 'topic',
      type: 'textarea',
      label: { en: 'Video topic', zh: '视频主题' },
      placeholder: {
        en: 'How to create latte art at home for complete beginners',
        zh: '教咖啡初学者如何在家做拉花',
      },
      required: true,
      helpText: { en: 'Include the angle, audience, and key promise if you have them.', zh: '可以写清角度、受众和主要看点。' },
    },
    {
      key: 'targetAudience',
      type: 'input',
      label: { en: 'Target audience', zh: '目标观众' },
      placeholder: { en: 'Coffee beginners', zh: '咖啡初学者' },
    },
    {
      key: 'language',
      type: 'language',
      label: { en: 'Output language', zh: '输出语言' },
      options: [
        { value: 'English', label: { en: 'English', zh: '英文' } },
        { value: 'Chinese', label: { en: 'Chinese', zh: '中文' } },
        { value: 'Japanese', label: { en: 'Japanese', zh: '日文' } },
        { value: 'Spanish', label: { en: 'Spanish', zh: '西班牙文' } },
      ],
    },
    {
      key: 'tone',
      type: 'select',
      label: { en: 'Tone', zh: '语气' },
      defaultValue: 'engaging',
      options: [
        { value: 'engaging', label: { en: 'Engaging', zh: '吸引点击' } },
        { value: 'educational', label: { en: 'Educational', zh: '教学' } },
        { value: 'dramatic', label: { en: 'Dramatic', zh: '悬念感' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'title', marker: 'TITLE', label: { en: 'Titles', zh: '标题' }, markdown: true },
      { key: 'description', marker: 'DESCRIPTION', label: { en: 'Description', zh: '简介' }, markdown: true },
      { key: 'tags', marker: 'TAGS', label: { en: 'Tags', zh: '标签' }, monospace: true },
      { key: 'thumbnails', marker: 'THUMBNAIL_IDEAS', label: { en: 'Thumbnail ideas', zh: '缩略图方向' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    topic: values.topic,
    targetAudience: values.targetAudience,
    tone: values.tone,
    language: values.language,
  }),
};

const YoutubeGenerator = () => <AiRuntimeTool config={config} />;

export default YoutubeGenerator;
