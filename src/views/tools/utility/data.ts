import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const UTILITY_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
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
