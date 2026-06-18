import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const UTILITY_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'age-calculator': {
    zh: {
      summary:
        '年龄计算器根据用户输入的出生日期，自动计算从出生日期到今天的完整年龄和累计天数。它适合填写资料前核对周岁、计算纪念日跨度、统计已经出生多少天、确认距离下一个生日还有多少天，以及在不打开表格或手动推算闰年月份的情况下快速得到准确结果。工具以浏览器当前日期作为“今天”，所有计算都在本地完成。',
      input:
        '输入出生日期，格式由浏览器日期选择器提供，通常为 YYYY-MM-DD。出生日期不能晚于今天；如果输入为空、格式无效或选择未来日期，页面会提示先修正日期。工具会把出生日期和今天都归一到本地时区当天 00:00，再进行日期差计算，避免小时、分钟、夏令时等因素影响年龄结果。',
      output:
        '输出包括三个核心结果：完整周岁、从出生日期到今天的累计天数，以及距离下一个生日的天数。页面还会展示更细的年龄表达，例如“26 岁 4 个月 24 天”，并列出输入出生日期和下一个生日日期，方便直接复制到资料填写、家庭记录、活动报名或纪念日规划场景中。',
      processing:
        '计算过程在浏览器中同步完成。首先将 YYYY-MM-DD 拆分为年、月、日并创建本地日期对象；随后按“今天年份 - 出生年份”得到初始年数，再根据当前月日是否已经过生日修正年、月、日差。当日差为负时，借用上一个月的实际天数补齐，因此能正确处理大小月和闰年。累计天数通过两个本地零点日期的毫秒差除以 86400000 得出。下一个生日日期则以今年生日为基准，如果已经过去则顺延到下一年。',
      modes: ['出生日期输入', '完整周岁', '年月日精确年龄', '累计天数', '距离下个生日天数', '下个生日日期', '本地日期计算'],
      example: {
        title: '年龄计算示例',
        input: '出生日期: 2000-01-01\n今天: 2026-05-25',
        output: '年龄: 26 岁 4 个月 24 天\n累计天数: 9637 天\n距离下一个生日: 221 天',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Age Calculator uses a birth date to calculate the complete age and total days elapsed from that date to today. It is useful for checking full years before filling forms, measuring anniversary spans, counting days since birth, seeing how many days remain until the next birthday, and getting accurate results without manually handling leap years or month lengths. The tool uses the browser’s current date as “today” and runs locally.',
      input:
        'Enter a birth date through the browser date picker, usually in YYYY-MM-DD format. The birth date cannot be later than today. If the value is empty, invalid, or in the future, the page asks the user to correct it first. Both the birth date and today are normalized to local midnight before calculation so hours, minutes, and daylight-saving differences do not distort the result.',
      output:
        'Outputs include three core values: complete age in years, total days from the birth date to today, and days until the next birthday. The page also shows a more precise age expression such as “26 years 4 months 24 days,” plus the selected birth date and next birthday date for form filling, household records, event registration, or anniversary planning.',
      processing:
        'The calculation runs synchronously in the browser. First, the YYYY-MM-DD value is split into year, month, and day and converted into a local Date object. The initial year difference is computed from today’s year minus the birth year, then adjusted based on whether this year’s birthday has passed. If the day difference is negative, the algorithm borrows the actual number of days from the previous month, correctly handling short months and leap years. Total days are calculated by subtracting the two local-midnight timestamps and dividing by 86400000. The next birthday is this year’s birthday unless it has already passed, in which case it moves to next year.',
      modes: ['Birth date input', 'Full years', 'Precise years/months/days age', 'Total days', 'Days until next birthday', 'Next birthday date', 'Local date calculation'],
      example: {
        title: 'Age calculation example',
        input: 'Birth date: 2000-01-01\nToday: 2026-05-25',
        output: 'Age: 26 years 4 months 24 days\nTotal days: 9637 days\nDays until next birthday: 221 days',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'world-timezone-compare': {
    zh: {
      summary:
        '世界时区对比工具同时显示 38 个固定 UTC 偏移时区在同一时刻的本地时间，覆盖 UTC-12:00 至 UTC+14:00。它适合协调跨时区会议、安排客服或开发交接、规划全球发布窗口，以及解释为什么同一时刻在另一地可能显示为前一天或次日。页面默认以 UTC+08:00 作为参考时区，用户可以切换参考偏移、拖动时间轴并搜索地区或偏移值。',
      input:
        '输入包括参考时区、参考时间、搜索关键词、视图模式和 12/24 小时制偏好。参考时区从固定偏移表选择，不绑定 IANA 政治时区；参考时间通过 0-1439 分钟范围的滑块调整，步进为 15 分钟。搜索支持地区名称、偏移标签和偏移值片段，例如 Tokyo、Berlin、+09:00 或 -03:30。',
      output:
        '输出包括每个 UTC 偏移对应的本地时间、UTC 标签、与参考时区的时间差、跨日标签和地区示例。卡片视图适合快速浏览所有时区；时间轴视图把 24 小时横向展开，更适合观察多方工作时间是否重叠。若目标时间落在参考日期前后，页面会显示“前一天”“次日”或多日差标签。',
      processing:
        '计算在浏览器内同步完成。工具先将参考时区的本地分钟数减去参考 UTC 偏移，得到同一时刻的 UTC 分钟；再为每个目标偏移加上对应分钟数，归一化到 0-1439 分钟显示本地时间。日期差通过未归一化分钟数除以 1440 向下取整得到。由于工具使用固定 UTC 偏移表，不会查询夏令时或当地法定时区规则；例如美国夏令时期间纽约通常应按 UTC-04:00 复核，而不是固定的 UTC-05:00。',
      modes: ['38 个固定 UTC 偏移', '参考时区选择', '拖动时间轴', '地区和偏移搜索', '概览卡片', '时间轴视图', '跨日标签', '12/24 小时制切换'],
      example: {
        title: '跨时区换算示例',
        input: '参考时区: Beijing, Singapore, Manila (UTC+08:00)\n参考时间: 15:30\n目标时区: Eastern Time - New York, Toronto (UTC-05:00)',
        output: '纽约固定偏移时间: 02:30\n时间差: 13h 落后\n跨日标签: 同一天（如参考时间较早，则可能显示前一天）',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'World Timezone Compare shows the local time for the same moment across 38 fixed UTC offsets from UTC-12:00 through UTC+14:00. It helps coordinate cross-timezone meetings, support handoffs, global release windows, and date-change explanations when another region shows the previous or next day. The page defaults to UTC+08:00 as the reference offset and lets users switch offsets, drag the timeline, and search by region or UTC value.',
      input:
        'Inputs include the reference timezone, reference time, search keyword, view mode, and 12/24-hour preference. The reference timezone is selected from a fixed offset table rather than an IANA political timezone. The reference time uses a 0-1439 minute slider with a 15-minute step. Search matches region names, offset labels, and offset fragments such as Tokyo, Berlin, +09:00, or -03:30.',
      output:
        'Outputs include each offset’s local time, UTC label, difference from the reference offset, date-change label, and example regions. The card view is best for scanning all zones quickly. The timeline view lays out the 24-hour day horizontally, which is better for checking overlap across working hours. If the target local time lands before or after the reference date, the page marks previous day, next day, or a multi-day difference.',
      processing:
        'The calculation runs synchronously in the browser. The tool subtracts the reference UTC offset from the reference local minutes to get the same moment in UTC minutes, then adds every target offset and normalizes the result into the 0-1439 minute display range. The date delta is derived from the non-normalized minute value divided by 1440 and floored. Because this is a fixed UTC offset table, it does not query daylight saving time or local legal timezone rules; during US daylight saving time, for example, New York should usually be checked as UTC-04:00 rather than the fixed UTC-05:00 row.',
      modes: ['38 fixed UTC offsets', 'Reference timezone selector', 'Draggable timeline', 'Region and offset search', 'Overview cards', 'Timeline view', 'Date-change labels', '12/24-hour toggle'],
      example: {
        title: 'Cross-timezone conversion example',
        input: 'Reference timezone: Beijing, Singapore, Manila (UTC+08:00)\nReference time: 15:30\nTarget timezone: Eastern Time - New York, Toronto (UTC-05:00)',
        output: 'New York fixed-offset time: 02:30\nDifference: 13h behind\nDate label: same day, unless the reference time is early enough to cross into the previous day',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'mbti-personality-test': {
    zh: {
      summary:
        'MBTI 性格测试工具通过 24 道原创偏好题，按外向/内向（E/I）、实感/直觉（S/N）、思考/情感（T/F）、判断/感知（J/P）四个维度累计得分，生成 16 型性格参考结果。它适合轻量自我了解、团队沟通破冰、学习与工作风格梳理以及个人成长方向探索，不适合做招聘筛选或临床诊断。结果页集中展示低多边形风格人物画像、性格定向、深度性格解析（含核心驱动力、思维模式、职场与关系表现、压力反应和成长路径）、三条详细优势提示、一条具体成长建议、四个维度的实时倾向条以及按角色组智能匹配的 ToolOrbit 推荐工具。用户还可点击任意 16 型按钮自由浏览其他类型的完整画像和解析。',
      input:
        '输入为 24 道五档偏好题，每个维度 6 道，选项从”很不符”到”很符合”（对应 -2 到 +2 分）。每道题只描述日常行为偏好和思维倾向，不涉及对错判断、能力高低或心理诊断，且措辞经过设计以降低社会期望偏差。同一维度包含正反向题目各半——例如 E/I 维度中，既有”交流后更有能量”（正向 E）也有”重要想法需要先独自整理”（反向 I），双向措辞用于抵消单一话术偏向和默认同意倾向。作答过程中可随时跳转任意题目、返回修改已有答案，每次修改后结果即时重算。进度条和题目导航点实时显示完成状态，全部答完后结果区标记为已完成。',
      output:
        '完成全部题目后，输出区域包含多层信息：左侧为当前类型的低多边形人物画像卡片，展示类型代码、角色组标签（分析型/外交型/守护型/探索型）、性格名称和一句概括性格向。右侧主内容区依次呈现：性格定向（一句话概括默认行动风格）、长篇性格解析（覆盖核心动机、思维与决策模式、职场适配、关系表现、压力反应及成长方向）、三条详细优势说明、一组成长建议（含具体可操作的练习方法）。底部四个维度倾向条以可视化方式展示每对偏好的得分分布——滑块位置反映右侧字母得分占该维度总分的比例，中间竖线标记 50% 中点，若某维度无有效倾向则滑块停留在中间。页面底部提供 16 型快速切换按钮，当前选中类型高亮，点击任意类型即可预览该类型的完整画像和解析，方便对比和探索。同时按角色组推荐相关 ToolOrbit 工具。',
      processing:
        '题目、答案和结果都保留在本地，不发送到服务器。计分逻辑：每道题对应一个维度（E/I、S/N、T/F、J/P）和一个正向字母。选择”很符合”（+2）或”符合”（+1）时，按强度给正向字母加分；选择”很不符”（-2）或”不符”（-1）时，按强度给相反字母加分；选择”一般”（0）不加分。全部答完后，工具比较四组维度得分，得分较高的一端组成最终类型；若某组并列，默认取 E、S、T、J。维度倾向条展示右侧字母在该维度总分中的占比，无有效倾向时显示在中间。',
      modes: ['24 道原创偏好题（每维度 6 道）', '五档 Likert 量表（-2 至 +2）', '正反向措辞防偏设计', '四维度实时倾向条', '16 型完整画像与深度解析', '低多边形风格人物图', '性格定向与成长路径', '16 型自由浏览切换', '角色组智能推荐工具', '纯本地计算，零数据上传'],
      example: {
        title: 'MBTI 测试示例',
        input: 'E/I 维度：偏独处整理、高质量独处恢复注意力\nS/N 维度：偏模式和趋势、从细节联想到更大可能性\nT/F 维度：偏逻辑一致性和客观代价、公平规则优先\nJ/P 维度：偏提前规划、用清单降低不确定性',
        output: '结果类型：INTJ（分析型 · 战略设计者）\n性格定向：长期战略规划 / 独立深度思考 / 系统性优化\n维度分布：I 倾向强、N 倾向强、T 倾向中、J 倾向强\n推荐工具：JSON 格式化、正则表达式测试、文本对比 Diff、JWT 在线解码',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The MBTI Personality Test uses 24 original preference statements across Extraversion/Introversion (E/I), Sensing/Intuition (S/N), Thinking/Feeling (T/F), and Judging/Perceiving (J/P) dimensions to generate a 16-type personality result. It is designed for lightweight self-reflection, team communication icebreakers, learning and work-style mapping, and personal growth exploration — not for hiring decisions or clinical diagnosis. The result page displays a low-poly character illustration, style orientation, in-depth personality analysis (covering core motivations, thinking patterns, workplace and relationship dynamics, stress responses, and growth paths), three detailed strength descriptions, one specific growth suggestion, live four-dimension preference bars, and role-group-matched ToolOrbit tool recommendations. Users can also click any of the 16 type buttons to freely browse the full portrait and analysis of other types.',
      input:
        'The input is a 24-question five-point preference scale with 6 questions per dimension, ranging from “strongly does not fit” to “strongly fits” (mapped to -2 through +2). Each statement describes everyday behavioral preferences and thinking tendencies without implying correctness, ability level, or psychological diagnosis, and wording is designed to reduce social desirability bias. Each dimension includes both forward and reverse-keyed items — for example, the E/I dimension contains both “feel more energized after interaction” (forward E) and “prefer to organize important ideas privately first” (reverse I), with bidirectional phrasing to counteract single-wording bias and acquiescence tendency. Users can freely jump to any question, return to modify previous answers, and see results recalculate instantly after each change. A progress bar and question navigation dots show completion status in real time, and the result area is marked complete after all questions are answered.',
      output:
        'After completing all questions, the output area presents multiple layers of information: on the left, a personality card showing the current type\'s low-poly character illustration, type code, role group label (Analyst/Diplomat/Sentinel/Explorer), personality title, and a one-line tagline. The main content area on the right displays: style orientation (a one-line summary of the type\'s default approach), a comprehensive personality analysis (covering core motivations, thinking and decision-making patterns, workplace fit, relationship dynamics, stress responses, and growth direction), three detailed strength descriptions, and one growth suggestion with specific, actionable practice methods. Four dimension bars at the bottom visualize the score distribution for each preference pair — the slider position reflects the right-side letter\'s score as a percentage of that dimension\'s total, with a center tick mark at 50%; if a dimension has no effective preference, the slider remains centered. The bottom section provides 16 type quick-switch buttons with the currently selected type highlighted; clicking any type instantly previews its full portrait and analysis, enabling easy comparison and exploration. Role-group-matched ToolOrbit tool recommendations are also displayed.',
      processing:
        'Questions, answers, and results remain local and are never sent to a server. Scoring logic: each question belongs to one dimension (E/I, S/N, T/F, J/P) and has a keyed positive letter. “Strongly fits” (+2) and “fits” (+1) add points to that positive letter; “strongly does not fit” (-2) and “does not fit” (-1) add points to the opposite letter; “neutral” (0) adds no points. After all 24 questions are answered, the tool compares the four dimension pairs and uses the higher-scoring side for the final type. Ties default to E, S, T, and J. Dimension bars show the right-side letter as a share of that dimension’s total; no effective preference displays at the midpoint.',
      modes: ['24 original preference questions (6 per dimension)', 'Five-point Likert scale (-2 to +2)', 'Forward and reverse-keyed item design', 'Live four-dimension preference bars', '16 type full portraits with in-depth analysis', 'Low-poly character illustrations', 'Style orientation and growth paths', '16 type free-browse switching', 'Role-group-based smart tool recommendations', 'Fully local computation, zero data upload'],
      example: {
        title: 'MBTI test example',
        input: 'E/I dimension: prefers private reflection, quality alone time restores focus\nS/N dimension: prefers patterns and trends, details spark larger possibilities\nT/F dimension: prioritizes logical consistency and objective costs, fair rules first\nJ/P dimension: prefers early planning, uses lists to reduce uncertainty',
        output: 'Result type: INTJ (Analyst · Strategic Designer)\nStyle orientation: Long-range strategic planning / independent deep thinking / systematic optimization\nDimension distribution: strong I preference, strong N preference, moderate T preference, strong J preference\nRecommended tools: JSON Formatter, Regex Tester, Text Diff, JWT Debugger',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'bmi-calculator': {
    zh: {
      summary:
        'BMI 计算器根据性别、年龄、身高和体重实时计算体质指数（Body Mass Index），并输出当前体重分类、BMI 所在区间和基于身高推算的健康体重建议范围。它适合在体重管理、健身记录、健康打卡、体检前自查或日常家庭记录中快速判断体重是否处于常见参考区间。工具使用标准公式 BMI = 体重（kg）÷ 身高²（m），身高输入为厘米并自动换算为米；个人身体数据不会上传。',
      input:
        '输入项包括性别、年龄、身高和体重。年龄允许 1-130 岁，身高允许 10-200 厘米，体重允许 1-500 千克。性别和年龄用于完整记录评估场景与提示局限性，BMI 数值本身按身高和体重计算。输入任一数值后结果会即时更新；如果数值超出范围，页面会提示先修正输入，避免生成不可靠结果。',
      output:
        '输出包括 BMI 数值、体重分类、建议体重区间和一条面向当前结果的提示。分类阈值为：过轻低于 18.5，正常 18.5-24.9，超重 24.9-28.0，肥胖 28.0 以上。建议体重区间按当前身高对应 BMI 18.5-24.9 计算：建议最低体重 = 18.5 × 身高(m)²，建议最高体重 = 24.9 × 身高(m)²。例如身高 170 cm 时，建议范围约为 53.5 kg - 72.0 kg。',
      processing:
        '工具先将身高厘米值换算为米，再用体重千克除以身高米值的平方得到 BMI，并按阈值映射为过轻、正常、超重或肥胖。建议体重使用同一身高平方分别乘以 18.5 和 24.9 得到边界值。底部彩色刻度条用 18.5、24.9、28.0 三个刻度帮助定位当前状态。中国及多数亚洲国家常采用比 WHO 更严格的参考标准，本工具当前使用的 24.9 / 28.0 阈值接近常见中文健康评估口径；如需严格医疗判断，应以本地医疗机构标准为准。所有计算仅依赖本地输入。',
      modes: ['性别选择', '年龄输入', '身高厘米输入', '体重千克输入', '实时 BMI 计算', '体重分类', '建议体重区间', '彩色 BMI 刻度条', '本地计算'],
      example: {
        title: 'BMI 计算示例',
        input: '性别: 女\n年龄: 28\n身高: 170 cm\n体重: 65 kg',
        output: 'BMI = 22.5\n分类: 正常\n建议体重: 53.5 kg - 72.0 kg',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The BMI Calculator uses gender, age, height, and weight inputs to calculate Body Mass Index in real time, then shows the current weight category, BMI range, and a height-based healthy-weight recommendation. It is useful for weight tracking, fitness logs, health check preparation, household records, and quick self-checks against common BMI reference ranges. The tool uses the standard formula BMI = weight (kg) / height² (m). Height is entered in centimeters and converted to meters locally in the browser; no body data is submitted to a server.',
      input:
        'Inputs include gender, age, height, and weight. Age accepts 1-130 years, height accepts 10-200 cm, and weight accepts 1-500 kg. Gender and age provide context for the assessment and limitations; the BMI value itself is calculated from height and weight. Results update immediately after any input changes. If a value is outside the supported range, the page asks the user to correct it before showing a result.',
      output:
        'Outputs include BMI value, weight category, recommended weight range, and a short interpretation hint. The thresholds used by this tool are: underweight below 18.5, normal 18.5-24.9, overweight 24.9-28.0, and obese at 28.0 or above. The recommended weight range is calculated from the current height at BMI 18.5-24.9: minimum recommended weight = 18.5 × height(m)², maximum recommended weight = 24.9 × height(m)². For example, at 170 cm, the range is about 53.5 kg - 72.0 kg.',
      processing:
        'The tool converts centimeters to meters, divides weight in kilograms by squared height in meters, and maps the BMI to a category based on the configured thresholds. The healthy-weight boundaries reuse the same height squared value multiplied by 18.5 and 24.9. The color scale uses 18.5, 24.9, and 28.0 tick marks so the current status can be located visually. China and many Asian countries often use stricter BMI references than WHO; this tool uses 24.9 / 28.0 thresholds that are close to common Chinese health-assessment references. For strict medical interpretation, follow local clinical guidance. Input data stays local.',
      modes: ['Gender selector', 'Age input', 'Height in centimeters', 'Weight in kilograms', 'Live BMI calculation', 'Weight category', 'Recommended weight range', 'Color BMI scale', 'Local calculation'],
      example: {
        title: 'BMI calculation example',
        input: 'Gender: Female\nAge: 28\nHeight: 170 cm\nWeight: 65 kg',
        output: 'BMI = 22.5\nCategory: Normal\nRecommended weight: 53.5 kg - 72.0 kg',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
};
