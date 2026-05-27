import { useMemo, useState } from 'react';
import { BarChart3, Brain, CheckCircle2, ChevronLeft, ChevronRight, Compass, RotateCcw, Sparkles, Target } from 'lucide-react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';

type DimensionCode = 'EI' | 'SN' | 'TF' | 'JP';
type MbtiTypeCode =
  | 'INTJ'
  | 'INTP'
  | 'ENTJ'
  | 'ENTP'
  | 'INFJ'
  | 'INFP'
  | 'ENFJ'
  | 'ENFP'
  | 'ISTJ'
  | 'ISFJ'
  | 'ESTJ'
  | 'ESFJ'
  | 'ISTP'
  | 'ISFP'
  | 'ESTP'
  | 'ESFP';

type LocalizedText = {
  zh: string;
  en: string;
};

type AnswerValue = -2 | -1 | 0 | 1 | 2;
type PreferenceLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

type Question = {
  id: string;
  dimension: DimensionCode;
  positiveLetter: PreferenceLetter;
  text: LocalizedText;
};

type PersonalityType = {
  code: MbtiTypeCode;
  role: LocalizedText;
  title: LocalizedText;
  tagline: LocalizedText;
  orientation: LocalizedText;
  analysis: LocalizedText;
  strengths: LocalizedText[];
  growth: LocalizedText;
  accentClassName: string;
};

const QUESTIONS: Question[] = [
  { id: 'ei-1', dimension: 'EI', positiveLetter: 'E', text: { zh: '连续交流一段时间后，我通常会更有能量。', en: 'After a stretch of interaction, I usually feel more energized.' } },
  { id: 'ei-2', dimension: 'EI', positiveLetter: 'I', text: { zh: '重要想法在说出口前，我更喜欢先独自整理。', en: 'Before sharing important ideas, I prefer to organize them privately.' } },
  { id: 'ei-3', dimension: 'EI', positiveLetter: 'E', text: { zh: '遇到新项目时，我倾向先找人讨论再推进。', en: 'When a new project starts, I tend to discuss it before moving ahead.' } },
  { id: 'ei-4', dimension: 'EI', positiveLetter: 'I', text: { zh: '高质量独处能明显恢复我的注意力。', en: 'High-quality time alone noticeably restores my focus.' } },
  { id: 'ei-5', dimension: 'EI', positiveLetter: 'E', text: { zh: '我常在表达过程中逐渐想清楚自己的观点。', en: 'I often clarify my view while talking it through.' } },
  { id: 'ei-6', dimension: 'EI', positiveLetter: 'I', text: { zh: '我更愿意把社交日程控制在少量但深入的范围内。', en: 'I prefer fewer, deeper social commitments.' } },
  { id: 'sn-1', dimension: 'SN', positiveLetter: 'N', text: { zh: '我很容易从一个细节联想到更大的可能性。', en: 'A single detail quickly leads me to larger possibilities.' } },
  { id: 'sn-2', dimension: 'SN', positiveLetter: 'S', text: { zh: '我更信任可验证的事实、步骤和过往经验。', en: 'I trust verifiable facts, steps, and past experience more.' } },
  { id: 'sn-3', dimension: 'SN', positiveLetter: 'N', text: { zh: '面对问题时，我会先想它背后的模式或趋势。', en: 'When facing a problem, I first look for patterns or trends behind it.' } },
  { id: 'sn-4', dimension: 'SN', positiveLetter: 'S', text: { zh: '清晰、具体、可执行的说明比抽象概念更让我安心。', en: 'Clear, concrete, actionable instructions reassure me more than abstractions.' } },
  { id: 'sn-5', dimension: 'SN', positiveLetter: 'N', text: { zh: '我喜欢探索尚未成形的想法，即使细节还不完整。', en: 'I enjoy exploring ideas before all details are settled.' } },
  { id: 'sn-6', dimension: 'SN', positiveLetter: 'S', text: { zh: '我擅长发现流程里的遗漏、风险和现实限制。', en: 'I am good at spotting omissions, risks, and practical constraints.' } },
  { id: 'tf-1', dimension: 'TF', positiveLetter: 'T', text: { zh: '做决定时，我会优先看逻辑一致性和客观代价。', en: 'When deciding, I prioritize logical consistency and objective costs.' } },
  { id: 'tf-2', dimension: 'TF', positiveLetter: 'F', text: { zh: '我会认真考虑决定对具体人的感受和关系影响。', en: 'I seriously consider how decisions affect people and relationships.' } },
  { id: 'tf-3', dimension: 'TF', positiveLetter: 'T', text: { zh: '必要时，我可以直接指出方案中的问题。', en: 'When needed, I can directly point out problems in a plan.' } },
  { id: 'tf-4', dimension: 'TF', positiveLetter: 'F', text: { zh: '我倾向用让对方更容易接受的方式表达分歧。', en: 'I tend to express disagreement in a way others can receive.' } },
  { id: 'tf-5', dimension: 'TF', positiveLetter: 'T', text: { zh: '公平的规则比临场照顾个别感受更重要。', en: 'Fair rules matter more to me than adjusting for each feeling in the moment.' } },
  { id: 'tf-6', dimension: 'TF', positiveLetter: 'F', text: { zh: '如果结果正确但伤害了信任，我会觉得这个方案仍有缺陷。', en: 'If a result is correct but damages trust, I still see the plan as flawed.' } },
  { id: 'jp-1', dimension: 'JP', positiveLetter: 'J', text: { zh: '我喜欢尽早确定计划、边界和交付时间。', en: 'I like setting plans, boundaries, and deadlines early.' } },
  { id: 'jp-2', dimension: 'JP', positiveLetter: 'P', text: { zh: '保留选择空间会让我更容易适应变化。', en: 'Keeping options open helps me adapt to change.' } },
  { id: 'jp-3', dimension: 'JP', positiveLetter: 'J', text: { zh: '我会通过清单或节奏安排来降低不确定性。', en: 'I reduce uncertainty with lists or planned rhythms.' } },
  { id: 'jp-4', dimension: 'JP', positiveLetter: 'P', text: { zh: '我常在最后阶段根据新信息优化方向。', en: 'I often refine direction late when new information appears.' } },
  { id: 'jp-5', dimension: 'JP', positiveLetter: 'J', text: { zh: '未完成的待办会持续占用我的注意力。', en: 'Unfinished tasks keep taking up my attention.' } },
  { id: 'jp-6', dimension: 'JP', positiveLetter: 'P', text: { zh: '灵活试错比一次性定好完整方案更自然。', en: 'Flexible experimentation feels more natural than fixing a full plan upfront.' } },
];

const PERSONALITY_TYPES: Record<MbtiTypeCode, PersonalityType> = {
  INTJ: {
    code: 'INTJ',
    role: { zh: '分析型', en: 'Analyst' },
    title: { zh: '战略设计者', en: 'Strategic Designer' },
    tagline: { zh: '把复杂系统拆成可执行蓝图。', en: 'Turns complex systems into executable blueprints.' },
    orientation: { zh: '长期规划 / 独立判断 / 系统优化', en: 'Long-range planning / independent judgment / system improvement' },
    analysis: { zh: '你倾向先看结构和趋势，再决定投入位置。你喜欢高质量信息、清晰目标和能自洽运转的方案，不太满足于只修补表层问题。', en: 'You tend to inspect structure and trends before committing effort. You value high-quality information, clear goals, and systems that can hold together beyond surface fixes.' },
    strengths: [{ zh: '擅长制定路线图', en: 'Strong roadmap thinking' }, { zh: '能识别低效结构', en: 'Spots inefficient structures' }, { zh: '适合深度独立工作', en: 'Suited to deep independent work' }],
    growth: { zh: '注意把判断过程说出来，给协作者足够上下文。', en: 'Make your reasoning visible so collaborators have enough context.' },
    accentClassName: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800 dark:border-fuchsia-900 dark:bg-fuchsia-950/30 dark:text-fuchsia-200',
  },
  INTP: {
    code: 'INTP',
    role: { zh: '分析型', en: 'Analyst' },
    title: { zh: '逻辑探索者', en: 'Logic Explorer' },
    tagline: { zh: '不断追问“为什么会这样”。', en: 'Keeps asking why the system behaves this way.' },
    orientation: { zh: '概念建模 / 原理拆解 / 自由探索', en: 'Concept modeling / principle analysis / open exploration' },
    analysis: { zh: '你偏好理解底层机制，而不是只接受结论。面对问题时，你会反复测试假设，寻找更优雅、更少约束的解释。', en: 'You prefer understanding underlying mechanisms over accepting conclusions. You test assumptions and look for explanations that are cleaner and less constrained.' },
    strengths: [{ zh: '理论敏感度高', en: 'High theoretical sensitivity' }, { zh: '善于发现矛盾', en: 'Finds contradictions well' }, { zh: '学习迁移能力强', en: 'Strong learning transfer' }],
    growth: { zh: '把探索收束为小交付，可以避免想法长期停留在脑内。', en: 'Turn exploration into small deliverables to keep ideas from staying only in your head.' },
    accentClassName: 'border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200',
  },
  ENTJ: {
    code: 'ENTJ',
    role: { zh: '分析型', en: 'Analyst' },
    title: { zh: '目标指挥者', en: 'Goal Commander' },
    tagline: { zh: '把目标、资源和节奏组织起来。', en: 'Organizes goals, resources, and pace.' },
    orientation: { zh: '目标推进 / 资源整合 / 决策效率', en: 'Goal execution / resource orchestration / decision efficiency' },
    analysis: { zh: '你天然关注目标是否清楚、角色是否到位、系统是否能产生结果。你愿意承担决策压力，也期待团队用同样清晰的标准推进。', en: 'You naturally ask whether goals are clear, roles are set, and the system can produce results. You can carry decision pressure and expect similarly clear standards from a team.' },
    strengths: [{ zh: '推进力强', en: 'High execution drive' }, { zh: '擅长组织资源', en: 'Organizes resources well' }, { zh: '能在压力下决策', en: 'Decides under pressure' }],
    growth: { zh: '给不同节奏的人留出表达空间，会提升方案接受度。', en: 'Leave room for different working tempos to improve buy-in.' },
    accentClassName: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200',
  },
  ENTP: {
    code: 'ENTP',
    role: { zh: '分析型', en: 'Analyst' },
    title: { zh: '创意辩手', en: 'Creative Debater' },
    tagline: { zh: '用碰撞生成新路径。', en: 'Creates new paths through productive friction.' },
    orientation: { zh: '快速联想 / 观点碰撞 / 机会发现', en: 'Fast association / idea debate / opportunity discovery' },
    analysis: { zh: '你容易看到替代方案，也喜欢通过讨论测试想法强度。你对新鲜问题反应快，但需要注意别让切换成本削弱落地。', en: 'You quickly see alternatives and enjoy testing ideas through discussion. You respond fast to fresh problems, while needing to watch the execution cost of frequent switching.' },
    strengths: [{ zh: '点子密度高', en: 'High idea density' }, { zh: '善于拆穿假设', en: 'Challenges assumptions' }, { zh: '适合早期探索', en: 'Great for early exploration' }],
    growth: { zh: '为好点子指定负责人和截止点，能让灵感变成结果。', en: 'Assign owners and deadlines so good ideas become outcomes.' },
    accentClassName: 'border-pink-200 bg-pink-50 text-pink-800 dark:border-pink-900 dark:bg-pink-950/30 dark:text-pink-200',
  },
  INFJ: {
    code: 'INFJ',
    role: { zh: '外交型', en: 'Diplomat' },
    title: { zh: '洞察倡导者', en: 'Insight Advocate' },
    tagline: { zh: '在意义和人之间寻找一致性。', en: 'Seeks alignment between meaning and people.' },
    orientation: { zh: '深度洞察 / 价值一致 / 长线陪伴', en: 'Deep insight / value alignment / long-term support' },
    analysis: { zh: '你会把人的动机、关系氛围和长期影响放在一起考虑。你不只想解决眼前问题，也希望方向本身是值得的。', en: 'You consider motives, relationship climate, and long-term impact together. You want to solve problems in a direction that feels worth pursuing.' },
    strengths: [{ zh: '共情与洞察并重', en: 'Empathy with insight' }, { zh: '能看见隐性需求', en: 'Sees hidden needs' }, { zh: '适合复杂沟通', en: 'Good in nuanced communication' }],
    growth: { zh: '避免过度承担他人情绪，边界也是长期支持的一部分。', en: 'Avoid over-carrying others emotions; boundaries are part of sustainable support.' },
    accentClassName: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200',
  },
  INFP: {
    code: 'INFP',
    role: { zh: '外交型', en: 'Diplomat' },
    title: { zh: '理想调和者', en: 'Ideal Harmonizer' },
    tagline: { zh: '用真实感校准选择。', en: 'Uses authenticity as a decision compass.' },
    orientation: { zh: '个人价值 / 创作表达 / 温和坚持', en: 'Personal values / creative expression / gentle persistence' },
    analysis: { zh: '你对“不对劲”的感受很敏锐，也会持续寻找更贴近内心价值的表达方式。你适合需要真诚、想象力和细腻判断的任务。', en: 'You are sensitive to what feels off and keep seeking expression that matches inner values. You suit work that needs sincerity, imagination, and subtle judgment.' },
    strengths: [{ zh: '价值感稳定', en: 'Stable value sense' }, { zh: '表达细腻', en: 'Nuanced expression' }, { zh: '能保护少数声音', en: 'Protects quieter voices' }],
    growth: { zh: '把理想拆成可行动的小步骤，会让坚持更轻。', en: 'Break ideals into actionable steps so persistence feels lighter.' },
    accentClassName: 'border-lime-200 bg-lime-50 text-lime-800 dark:border-lime-900 dark:bg-lime-950/30 dark:text-lime-200',
  },
  ENFJ: {
    code: 'ENFJ',
    role: { zh: '外交型', en: 'Diplomat' },
    title: { zh: '关系引导者', en: 'Relational Guide' },
    tagline: { zh: '把人聚到共同方向上。', en: 'Brings people toward a shared direction.' },
    orientation: { zh: '团队氛围 / 共同愿景 / 人际协调', en: 'Team climate / shared vision / interpersonal coordination' },
    analysis: { zh: '你擅长感知群体状态，并把抽象愿景讲成大家愿意参与的方向。你会自然承担连接者和推动者角色。', en: 'You read group state well and translate abstract vision into a direction people can join. You naturally become a connector and facilitator.' },
    strengths: [{ zh: '动员能力强', en: 'Strong mobilization' }, { zh: '善于照顾氛围', en: 'Cares for group climate' }, { zh: '能把愿景讲清楚', en: 'Explains vision clearly' }],
    growth: { zh: '不要把所有人的期待都变成自己的任务。', en: 'Do not turn everyones expectations into your own tasks.' },
    accentClassName: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-200',
  },
  ENFP: {
    code: 'ENFP',
    role: { zh: '外交型', en: 'Diplomat' },
    title: { zh: '可能性发起者', en: 'Possibility Starter' },
    tagline: { zh: '在热情里发现连接和新机会。', en: 'Finds connection and opportunity through enthusiasm.' },
    orientation: { zh: '灵感连接 / 人际能量 / 新机会探索', en: 'Inspirational connection / social energy / opportunity exploration' },
    analysis: { zh: '你容易被新想法和有生命力的人吸引，能快速让场域变得开放。你适合需要激发、连接、讲故事和打破僵局的场景。', en: 'You are drawn to fresh ideas and lively people, quickly making a space feel more open. You suit work that needs energy, connection, storytelling, and unsticking.' },
    strengths: [{ zh: '感染力强', en: 'Energizing presence' }, { zh: '跨界联想快', en: 'Fast cross-domain association' }, { zh: '能启动低能量场景', en: 'Starts low-energy situations' }],
    growth: { zh: '为热情加一个收尾机制，成果会更稳定。', en: 'Pair enthusiasm with a closing mechanism for steadier outcomes.' },
    accentClassName: 'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-200',
  },
  ISTJ: {
    code: 'ISTJ',
    role: { zh: '守护型', en: 'Sentinel' },
    title: { zh: '秩序执行者', en: 'Order Executor' },
    tagline: { zh: '用可靠流程稳住结果。', en: 'Stabilizes outcomes through reliable process.' },
    orientation: { zh: '责任交付 / 标准流程 / 细节准确', en: 'Responsible delivery / standard process / detail accuracy' },
    analysis: { zh: '你重视承诺、事实和可检查的步骤。你适合承担需要稳定、准确、可追踪的工作，也会自然修正流程漏洞。', en: 'You value commitments, facts, and checkable steps. You suit work that needs stability, accuracy, and traceability, and you naturally correct process gaps.' },
    strengths: [{ zh: '交付可靠', en: 'Reliable delivery' }, { zh: '细节扎实', en: 'Strong detail discipline' }, { zh: '规则意识强', en: 'Strong rule awareness' }],
    growth: { zh: '当环境变化很快时，给试验留一点空间。', en: 'When conditions move fast, reserve some space for experiments.' },
    accentClassName: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200',
  },
  ISFJ: {
    code: 'ISFJ',
    role: { zh: '守护型', en: 'Sentinel' },
    title: { zh: '温和守护者', en: 'Gentle Steward' },
    tagline: { zh: '把照顾落实到具体细节。', en: 'Turns care into concrete detail.' },
    orientation: { zh: '稳定支持 / 细节照顾 / 关系责任', en: 'Stable support / detailed care / relational responsibility' },
    analysis: { zh: '你会记住具体人的具体需要，并用可靠行动让环境更安心。你不一定高调，但经常是系统稳定运转的关键。', en: 'You remember specific needs of specific people and make the environment safer through reliable action. You may not be loud, but you often keep the system steady.' },
    strengths: [{ zh: '照顾细致', en: 'Careful support' }, { zh: '记忆具体需求', en: 'Remembers concrete needs' }, { zh: '稳定可信', en: 'Stable and trustworthy' }],
    growth: { zh: '及时说出自己的消耗，避免责任感过载。', en: 'Name your own depletion early to avoid responsibility overload.' },
    accentClassName: 'border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-200',
  },
  ESTJ: {
    code: 'ESTJ',
    role: { zh: '守护型', en: 'Sentinel' },
    title: { zh: '规则管理者', en: 'Practical Organizer' },
    tagline: { zh: '把标准转成清晰行动。', en: 'Turns standards into clear action.' },
    orientation: { zh: '执行管理 / 标准落地 / 团队秩序', en: 'Execution management / standards rollout / team order' },
    analysis: { zh: '你关注事情是否按规则、高效率、可衡量地推进。你适合把模糊任务变成分工、时间表和明确责任。', en: 'You care whether work moves by clear rules, efficiently, and measurably. You suit turning vague tasks into ownership, timelines, and responsibility.' },
    strengths: [{ zh: '组织推进强', en: 'Strong organizing drive' }, { zh: '标准清楚', en: 'Clear standards' }, { zh: '能维护秩序', en: 'Maintains order' }],
    growth: { zh: '在执行前解释规则背后的目的，阻力会更小。', en: 'Explain the purpose behind rules before execution to reduce friction.' },
    accentClassName: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200',
  },
  ESFJ: {
    code: 'ESFJ',
    role: { zh: '守护型', en: 'Sentinel' },
    title: { zh: '协作照料者', en: 'Community Builder' },
    tagline: { zh: '让团队协作更有温度和秩序。', en: 'Gives collaboration warmth and order.' },
    orientation: { zh: '关系维护 / 共同规范 / 现场协调', en: 'Relationship care / shared norms / live coordination' },
    analysis: { zh: '你擅长发现谁需要支持、哪里需要补位，并通过明确安排让大家更顺畅地协作。你常把抽象关心变成可见行动。', en: 'You notice who needs support and where coverage is missing, then use clear arrangements to help people work together smoothly.' },
    strengths: [{ zh: '协调意识强', en: 'Strong coordination sense' }, { zh: '善于维护关系', en: 'Maintains relationships' }, { zh: '行动细致', en: 'Detailed action' }],
    growth: { zh: '把“不方便”说清楚，不会削弱你的可靠感。', en: 'Saying what is inconvenient will not weaken your reliability.' },
    accentClassName: 'border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200',
  },
  ISTP: {
    code: 'ISTP',
    role: { zh: '探索型', en: 'Explorer' },
    title: { zh: '现场拆解者', en: 'Tactical Solver' },
    tagline: { zh: '用手感和逻辑解决现实问题。', en: 'Solves real problems with feel and logic.' },
    orientation: { zh: '动手排查 / 冷静分析 / 即时修复', en: 'Hands-on diagnosis / calm analysis / immediate repair' },
    analysis: { zh: '你倾向直接接触问题本体，边观察边拆解。你不喜欢过度说明，更看重方案是否真的能运行。', en: 'You prefer direct contact with the problem, observing while taking it apart. You dislike over-explaining and care whether the solution actually works.' },
    strengths: [{ zh: '临场排障强', en: 'Strong live troubleshooting' }, { zh: '冷静务实', en: 'Calm and practical' }, { zh: '掌握工具快', en: 'Learns tools quickly' }],
    growth: { zh: '提前同步关键判断，可以减少别人对沉默的误解。', en: 'Share key judgments early to reduce misreading of silence.' },
    accentClassName: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200',
  },
  ISFP: {
    code: 'ISFP',
    role: { zh: '探索型', en: 'Explorer' },
    title: { zh: '体验创作者', en: 'Experience Maker' },
    tagline: { zh: '把感受变成可触达的作品。', en: 'Turns feeling into tangible work.' },
    orientation: { zh: '审美体验 / 当下感受 / 自由表达', en: 'Aesthetic experience / present feeling / free expression' },
    analysis: { zh: '你对氛围、质感和个人真实反应很敏感。你适合在具体材料、视觉、内容或体验中做细腻选择。', en: 'You are sensitive to atmosphere, texture, and authentic personal response. You suit nuanced choices in materials, visuals, content, or experiences.' },
    strengths: [{ zh: '审美直觉好', en: 'Good aesthetic intuition' }, { zh: '体验敏感', en: 'Sensitive to experience' }, { zh: '表达自然', en: 'Natural expression' }],
    growth: { zh: '用简单结构保护创作时间，灵感会更容易持续。', en: 'Use simple structure to protect creative time so inspiration lasts.' },
    accentClassName: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-200',
  },
  ESTP: {
    code: 'ESTP',
    role: { zh: '探索型', en: 'Explorer' },
    title: { zh: '行动试探者', en: 'Action Adapter' },
    tagline: { zh: '在现场机会里快速调整。', en: 'Adapts quickly inside live opportunity.' },
    orientation: { zh: '即时行动 / 风险判断 / 现场影响', en: 'Immediate action / risk reading / live influence' },
    analysis: { zh: '你喜欢在真实场景里判断形势，快速试出可行路径。你对人和环境的变化反应灵敏，适合需要速度和胆量的任务。', en: 'You like reading situations in real time and testing workable paths quickly. You react well to people and environmental changes, fitting tasks that need speed and nerve.' },
    strengths: [{ zh: '反应快', en: 'Fast response' }, { zh: '敢于试探机会', en: 'Willing to test opportunity' }, { zh: '现场感强', en: 'Strong live presence' }],
    growth: { zh: '重大选择前加入复盘点，能减少冲动成本。', en: 'Add review checkpoints before major choices to reduce impulse cost.' },
    accentClassName: 'border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200',
  },
  ESFP: {
    code: 'ESFP',
    role: { zh: '探索型', en: 'Explorer' },
    title: { zh: '现场感染者', en: 'Live Energizer' },
    tagline: { zh: '把当下变得更生动。', en: 'Makes the present moment more alive.' },
    orientation: { zh: '情绪感染 / 体验参与 / 灵活表达', en: 'Emotional energy / experiential participation / flexible expression' },
    analysis: { zh: '你很容易把气氛带起来，也擅长根据现场反馈调整表达。你适合需要亲和力、表现力和即时回应的场景。', en: 'You easily lift the mood and adjust expression based on live feedback. You fit situations needing warmth, presence, and immediate response.' },
    strengths: [{ zh: '亲和力强', en: 'Warm and approachable' }, { zh: '表达鲜活', en: 'Vivid expression' }, { zh: '能激活氛围', en: 'Activates group energy' }],
    growth: { zh: '为承诺设置提醒和节奏，可让热情更可信。', en: 'Use reminders and rhythm so enthusiasm becomes more dependable.' },
    accentClassName: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200',
  },
};

const DIMENSION_LABELS: Record<DimensionCode, { left: LocalizedText; right: LocalizedText }> = {
  EI: { left: { zh: '内向 I', en: 'Introversion I' }, right: { zh: '外向 E', en: 'Extraversion E' } },
  SN: { left: { zh: '实感 S', en: 'Sensing S' }, right: { zh: '直觉 N', en: 'Intuition N' } },
  TF: { left: { zh: '情感 F', en: 'Feeling F' }, right: { zh: '思考 T', en: 'Thinking T' } },
  JP: { left: { zh: '感知 P', en: 'Perceiving P' }, right: { zh: '判断 J', en: 'Judging J' } },
};

const DIMENSION_PAIRS: Record<DimensionCode, { left: PreferenceLetter; right: PreferenceLetter }> = {
  EI: { left: 'I', right: 'E' },
  SN: { left: 'S', right: 'N' },
  TF: { left: 'F', right: 'T' },
  JP: { left: 'P', right: 'J' },
};

const OPPOSITE_LETTERS: Record<PreferenceLetter, PreferenceLetter> = {
  E: 'I',
  I: 'E',
  S: 'N',
  N: 'S',
  T: 'F',
  F: 'T',
  J: 'P',
  P: 'J',
};

const getText = (text: LocalizedText, isZh: boolean) => (isZh ? text.zh : text.en);

const getInitialAnswers = () => {
  return QUESTIONS.reduce<Record<string, AnswerValue | null>>((answersByQuestion, question) => {
    answersByQuestion[question.id] = null;
    return answersByQuestion;
  }, {});
};

const calculateLetterScores = (answersByQuestion: Record<string, AnswerValue | null>) => {
  return QUESTIONS.reduce<Record<PreferenceLetter, number>>(
    (letterScores, question) => {
      const answerValue = answersByQuestion[question.id];

      if (answerValue === null || answerValue === 0) {
        return letterScores;
      }

      const targetLetter = answerValue > 0 ? question.positiveLetter : OPPOSITE_LETTERS[question.positiveLetter as PreferenceLetter];
      const scoreValue = Math.abs(answerValue);

      return {
        ...letterScores,
        [targetLetter]: letterScores[targetLetter] + scoreValue,
      };
    },
    { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
  );
};

const getTypeFromScores = (letterScores: Record<PreferenceLetter, number>) => {
  const energyLetter = letterScores.E >= letterScores.I ? 'E' : 'I';
  const informationLetter = letterScores.N >= letterScores.S ? 'N' : 'S';
  const decisionLetter = letterScores.T >= letterScores.F ? 'T' : 'F';
  const lifestyleLetter = letterScores.J >= letterScores.P ? 'J' : 'P';

  return `${energyLetter}${informationLetter}${decisionLetter}${lifestyleLetter}` as MbtiTypeCode;
};

const getDimensionPercent = (dimensionCode: DimensionCode, letterScores: Record<PreferenceLetter, number>) => {
  const pair = DIMENSION_PAIRS[dimensionCode];
  const leftScore = letterScores[pair.left];
  const rightScore = letterScores[pair.right];
  const totalScore = leftScore + rightScore;

  if (totalScore === 0) return 50;

  return Math.round((rightScore / totalScore) * 100);
};

const getPersonalityImagePath = (typeCode: MbtiTypeCode) => {
  return `/images/tools/mbti-personality-test/${typeCode.toLowerCase()}-v2.png`;
};

const MbtiPersonalityTest = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');
  const [answersByQuestion, setAnswersByQuestion] = useState<Record<string, AnswerValue | null>>(() => getInitialAnswers());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedResultCode, setSelectedResultCode] = useState<MbtiTypeCode | null>(null);

  const answeredCount = useMemo(
    () => Object.values(answersByQuestion).filter((answerValue) => answerValue !== null).length,
    [answersByQuestion],
  );
  const completionPercent = Math.round((answeredCount / QUESTIONS.length) * 100);
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentAnswer = answersByQuestion[currentQuestion.id];
  const letterScores = useMemo(() => calculateLetterScores(answersByQuestion), [answersByQuestion]);
  const computedTypeCode = useMemo(() => getTypeFromScores(letterScores), [letterScores]);
  const resultTypeCode = selectedResultCode || computedTypeCode;
  const resultType = PERSONALITY_TYPES[resultTypeCode];
  const hasCompletedTest = answeredCount === QUESTIONS.length;

  const handleAnswerChange = (questionId: string, answerValue: AnswerValue) => {
    if (hasCompletedTest) return;

    setAnswersByQuestion((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: answerValue,
    }));
    setSelectedResultCode(null);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((questionIndex) => questionIndex + 1);
    }
  };

  const handleReset = () => {
    setAnswersByQuestion(getInitialAnswers());
    setCurrentQuestionIndex(0);
    setSelectedResultCode(null);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((questionIndex) => Math.max(questionIndex - 1, 0));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((questionIndex) => Math.min(questionIndex + 1, QUESTIONS.length - 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.mbti-personality-test.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.mbti-personality-test.subtitle')}
          </p>
        </div>
        <Button type="default" size="large" onClick={handleReset} icon={<RotateCcw className="h-4 w-4" />}>
          {t('tools.mbti-personality-test.resetButton')}
        </Button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
        <div className="space-y-5">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <Brain className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                  {t('tools.mbti-personality-test.workspaceTitle')}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t('tools.mbti-personality-test.progressText', { answered: answeredCount, total: QUESTIONS.length })}
                </p>
              </div>
              <div className="w-full sm:w-56">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                  <div className="h-full rounded-full bg-cyan-600 transition-all duration-300" style={{ width: `${completionPercent}%` }} />
                </div>
                <p className="mt-1 text-right text-xs font-semibold text-cyan-700 dark:text-cyan-300">{completionPercent}%</p>
              </div>
            </div>

            <article className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    {t('tools.mbti-personality-test.questionLabel', { number: currentQuestionIndex + 1 })}
                  </p>
                  <h2 className="mt-2 max-w-3xl text-xl font-semibold leading-8 tracking-tight text-slate-950 dark:text-white">
                    {getText(currentQuestion.text, Boolean(isZh))}
                  </h2>
                </div>
                <span
                  className={cn(
                    'inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-semibold',
                    currentAnswer === null
                      ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
                      : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200',
                  )}
                >
                  {currentAnswer === null ? t('tools.mbti-personality-test.unansweredStatus') : t('tools.mbti-personality-test.answeredStatus')}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-5">
                {([-2, -1, 0, 1, 2] as AnswerValue[]).map((answerValue) => (
                  <button
                    key={answerValue}
                    type="button"
                    disabled={hasCompletedTest}
                    onClick={() => handleAnswerChange(currentQuestion.id, answerValue)}
                    className={cn(
                      'min-h-14 rounded-lg border px-3 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-default dark:focus:ring-offset-[#282c34]',
                      currentAnswer === answerValue
                        ? 'border-cyan-700 bg-cyan-700 text-white shadow-sm dark:border-[#4183c4] dark:bg-[#4183c4]'
                        : cn(
                            'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-300',
                            !hasCompletedTest && 'cursor-pointer hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-100',
                          ),
                    )}
                  >
                    {answerValue === -2 ? t('tools.mbti-personality-test.scaleStrongNo') : null}
                    {answerValue === -1 ? t('tools.mbti-personality-test.scaleNo') : null}
                    {answerValue === 0 ? t('tools.mbti-personality-test.scaleNeutral') : null}
                    {answerValue === 1 ? t('tools.mbti-personality-test.scaleYes') : null}
                    {answerValue === 2 ? t('tools.mbti-personality-test.scaleStrongYes') : null}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {QUESTIONS.map((question, questionIndex) => {
                    const isCurrentQuestion = questionIndex === currentQuestionIndex;
                    const hasAnswer = answersByQuestion[question.id] !== null;

                    return (
                      <button
                        key={question.id}
                        type="button"
                        disabled={hasCompletedTest}
                        onClick={() => {
                          if (!hasCompletedTest) {
                            setCurrentQuestionIndex(questionIndex);
                          }
                        }}
                        className={cn(
                          'h-2.5 w-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-default dark:focus:ring-offset-[#282c34]',
                          isCurrentQuestion
                            ? 'bg-cyan-700 dark:bg-cyan-300'
                            : hasAnswer
                              ? cn('bg-cyan-200 dark:bg-cyan-800', !hasCompletedTest && 'cursor-pointer hover:bg-cyan-300 dark:hover:bg-cyan-700')
                              : cn('bg-slate-200 dark:bg-slate-700', !hasCompletedTest && 'cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600'),
                        )}
                        aria-label={t('tools.mbti-personality-test.jumpQuestionLabel', { number: questionIndex + 1 })}
                      />
                    );
                  })}
                </div>

                {!hasCompletedTest ? (
                  <div className="flex gap-2">
                    <Button
                      size="large"
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      icon={<ChevronLeft className="h-4 w-4" />}
                    >
                      {t('tools.mbti-personality-test.previousButton')}
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === QUESTIONS.length - 1}
                    >
                      {t('tools.mbti-personality-test.nextButton')}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </article>

          </div>

          {hasCompletedTest ? (
            <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/30">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-900 dark:text-cyan-100">
                <BarChart3 className="h-4 w-4" />
                {t('tools.mbti-personality-test.dimensionTitle')}
              </p>
              <div className="mt-4 space-y-4">
                {(Object.keys(DIMENSION_LABELS) as DimensionCode[]).map((dimensionCode) => {
                  const percentValue = getDimensionPercent(dimensionCode, letterScores);
                  const dimensionLabel = DIMENSION_LABELS[dimensionCode];

                  return (
                    <div key={dimensionCode}>
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-cyan-900 dark:text-cyan-100">
                        <span>{getText(dimensionLabel.left, Boolean(isZh))}</span>
                        <span>{getText(dimensionLabel.right, Boolean(isZh))}</span>
                      </div>
                      <div className="relative h-3 rounded-full bg-white dark:bg-slate-900">
                        <span className="absolute left-1/2 top-0 h-3 w-px bg-cyan-200 dark:bg-cyan-800" />
                        <span className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-cyan-700 shadow transition-all duration-300 dark:border-slate-900 dark:bg-cyan-300" style={{ left: `${percentValue}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 rounded-lg border border-cyan-200 bg-white p-3 text-xs leading-5 text-cyan-900 dark:border-cyan-900 dark:bg-slate-950 dark:text-cyan-100">
                {t('tools.mbti-personality-test.localNote')}
              </p>
            </section>
          ) : null}
        </div>
      </section>

      {hasCompletedTest ? (
        <>
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
            <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#282c34]">
              <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-950">
                <img
                  src={getPersonalityImagePath(resultType.code)}
                  alt={`${resultType.code} ${getText(resultType.title, Boolean(isZh))}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('rounded-md border px-2.5 py-1 text-xs font-semibold', resultType.accentClassName)}>
                    {getText(resultType.role, Boolean(isZh))}
                  </span>
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{resultType.code}</h2>
                <p className="mt-1 text-base font-semibold text-slate-700 dark:text-slate-200">{getText(resultType.title, Boolean(isZh))}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{getText(resultType.tagline, Boolean(isZh))}</p>
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#282c34]">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <Compass className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                    {t('tools.mbti-personality-test.orientationTitle')}
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {getText(resultType.orientation, Boolean(isZh))}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {getText(resultType.analysis, Boolean(isZh))}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <Target className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                    {t('tools.mbti-personality-test.strengthsTitle')}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {resultType.strengths.map((strengthText) => (
                      <li key={strengthText.en} className="flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
                        {getText(strengthText, Boolean(isZh))}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                <p className="font-semibold">{t('tools.mbti-personality-test.growthTitle')}</p>
                <p className="mt-1">{getText(resultType.growth, Boolean(isZh))}</p>
              </div>

              <div className="mt-5">
                <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                  {t('tools.mbti-personality-test.allTypesTitle')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(PERSONALITY_TYPES) as MbtiTypeCode[]).map((typeCode) => (
                    <button
                      key={typeCode}
                      type="button"
                      onClick={() => setSelectedResultCode(typeCode)}
                      className={cn(
                        'cursor-pointer rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-[#282c34]',
                        resultTypeCode === typeCode
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200'
                          : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-cyan-700 dark:hover:text-cyan-300',
                      )}
                    >
                      {typeCode}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          </section>
        </>
      ) : null}

      <ToolSEOCard toolKey="mbti-personality-test" />
    </div>
  );
};

export default MbtiPersonalityTest;
