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
        'MBTI 性格测试工具通过 24 道原创偏好题，按外向/内向、实感/直觉、思考/情感、判断/感知四个维度生成 16 型性格参考结果。它适合做轻量自我了解、团队沟通破冰、学习风格讨论和个人工作偏好梳理。结果页会展示低多边形风格人物画像、性格定向、性格解析、优势提醒、成长建议和与当前类型匹配的 ToolOrbit 推荐工具。',
      input:
        '输入为 24 道五档偏好题，选项从“不符合”到“很符合”。每道题只描述日常偏好，不涉及对错、能力高低或诊断结论。题目分别映射到 E/I、S/N、T/F、J/P 四个维度；同一维度包含正反向题目，用于降低单一措辞造成的偏差。用户也可以在结果区点击 16 型按钮，预览其它类型的画像和解析。',
      output:
        '输出包括四字母类型代码、类型角色组、低多边形人物图、性格定向、性格解析、三条优势提示、一条成长建议、四个维度的实时倾向条，以及按类型角色推荐的站内工具。若题目尚未全部回答，页面会显示当前预览类型；完成全部题目后结果会标记为已完成。',
      processing:
        '计算在浏览器内同步完成。每道题的回答值按 -2、-1、0、1、2 记录；如果题目倾向 E、N、T、J，则同意会增加对应维度分数；如果题目倾向 I、S、F、P，则同意会反向扣减该维度分数。四个维度分别累加后，分数大于或等于 0 时取 E/N/T/J，小于 0 时取 I/S/F/P，组合为 16 型之一。维度条将每个维度的 -12 到 +12 分映射为 0-100% 位置。所有题目、答案和结果都保留在本地 React 状态中，不发送到服务器。',
      modes: ['24 道原创偏好题', '五档量表', '四维度实时倾向', '16 型结果', '低多边形画像', '性格定向', '性格解析', '推荐工具', '本地计算'],
      example: {
        title: 'MBTI 测试示例',
        input: 'E/I: 更偏独处整理\nS/N: 更偏模式和可能性\nT/F: 更偏逻辑一致性\nJ/P: 更偏提前规划',
        output: '结果类型: INTJ\n性格定向: 长期规划 / 独立判断 / 系统优化\n推荐工具: AI 代码审查、JSON 格式化、正则表达式测试、文本对比 Diff',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The MBTI Personality Test uses 24 original preference statements to estimate a 16-type personality result across Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving. It is useful for lightweight self-reflection, team icebreakers, learning-style conversations, and work-preference mapping. The result page shows a low-poly character illustration, style orientation, personality analysis, strengths, growth guidance, and ToolOrbit tool recommendations matched to the current role group.',
      input:
        'The input is a 24-question five-point preference scale, ranging from “does not fit” to “strongly fits.” Each statement describes everyday preference rather than correctness, ability, or diagnosis. Questions map to the E/I, S/N, T/F, and J/P dimensions, with both forward and reverse wording in each dimension to reduce single-phrasing bias. Users can also click any of the 16 type buttons in the result area to preview another type illustration and analysis.',
      output:
        'The output includes the four-letter type code, role group, low-poly character illustration, style orientation, personality analysis, three strength notes, one growth suggestion, live dimension bars, and role-based recommended ToolOrbit tools. If not every question has been answered, the page shows a preview type; after all questions are answered, the result is marked as complete.',
      processing:
        'The calculation runs synchronously in the browser. Each answer is stored as -2, -1, 0, 1, or 2. Agreement with statements leaning E, N, T, or J increases that dimension score; agreement with statements leaning I, S, F, or P subtracts from the same dimension score. After summing each dimension, scores greater than or equal to 0 choose E/N/T/J, while scores below 0 choose I/S/F/P, forming one of the 16 type codes. The dimension bars map each -12 to +12 score to a 0-100% position. Questions, answers, and results remain in local React state and are not sent to a server.',
      modes: ['24 original preference questions', 'Five-point scale', 'Live four-dimension bars', '16 type results', 'Low-poly illustration', 'Style orientation', 'Personality analysis', 'Recommended tools', 'Local calculation'],
      example: {
        title: 'MBTI test example',
        input: 'E/I: prefers private reflection\nS/N: prefers patterns and possibilities\nT/F: prefers logical consistency\nJ/P: prefers early planning',
        output: 'Result type: INTJ\nStyle orientation: Long-range planning / independent judgment / system improvement\nRecommended tools: AI Code Reviewer, JSON Formatter, Regex Tester, Text Diff',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'bmi-calculator': {
    zh: {
      summary:
        'BMI 计算器根据性别、年龄、身高和体重实时计算体质指数（Body Mass Index），并输出当前体重分类、BMI 所在区间和基于身高推算的健康体重建议范围。它适合在体重管理、健身记录、健康打卡、体检前自查或日常家庭记录中快速判断体重是否处于常见参考区间。工具使用标准公式 BMI = 体重（kg）÷ 身高²（m），身高输入为厘米，页面会在浏览器内自动换算为米再计算，不需要提交任何个人身体数据到服务端。',
      input:
        '输入项包括性别、年龄、身高和体重。年龄允许 1-130 岁，身高允许 10-200 厘米，体重允许 1-500 千克。性别和年龄用于完整记录评估场景与提示局限性，BMI 数值本身按身高和体重计算。输入任一数值后结果会即时更新；如果数值超出范围，页面会提示先修正输入，避免生成不可靠结果。',
      output:
        '输出包括 BMI 数值、体重分类、建议体重区间和一条面向当前结果的提示。分类阈值为：过轻低于 18.5，正常 18.5-24.9，超重 24.9-28.0，肥胖 28.0 以上。建议体重区间按当前身高对应 BMI 18.5-24.9 计算：建议最低体重 = 18.5 × 身高(m)²，建议最高体重 = 24.9 × 身高(m)²。例如身高 170 cm 时，建议范围约为 53.5 kg - 72.0 kg。',
      processing:
        '页面在浏览器前端同步完成计算。首先将身高厘米值除以 100 得到米，再用体重千克除以身高米值的平方得到 BMI；随后根据阈值映射为过轻、正常、超重或肥胖。建议体重使用同一身高平方分别乘以 18.5 和 24.9 得到边界值。底部彩色刻度条将 BMI 投射到固定显示范围，并用 18.5、24.9、28.0 三个刻度帮助定位当前状态。中国及多数亚洲国家常采用比 WHO 更严格的参考标准，本工具当前使用的 24.9 / 28.0 阈值接近常见中文健康评估口径；如需严格医疗判断，应以本地医疗机构标准为准。所有计算仅依赖本地输入，没有网络请求。',
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
        'All calculations run synchronously in the browser. The page converts centimeters to meters, divides weight in kilograms by squared height in meters, and maps the BMI to a category based on the configured thresholds. The healthy-weight boundaries reuse the same height squared value multiplied by 18.5 and 24.9. The color scale projects the BMI onto a fixed display range with 18.5, 24.9, and 28.0 tick marks so the current status can be located visually. China and many Asian countries often use stricter BMI references than WHO; this tool uses 24.9 / 28.0 thresholds that are close to common Chinese health-assessment references. For strict medical interpretation, follow local clinical guidance. No network request is needed.',
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
