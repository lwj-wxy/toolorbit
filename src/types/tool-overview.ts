export type TechnicalOverview = {
  summary: string;
  input: string;
  output: string;
  processing: string;
  modes: string[];
  example?: {
    title: string;
    input: string;
    output: string;
    inputLanguage?: string;
    outputLanguage?: string;
  };
  /** E-E-A-T 信号：最近更新月份，格式如 '2026-06'。缺省则不渲染。 */
  lastUpdated?: string;
  /** E-E-A-T 信号：维护者，缺省回退到 'ToolOrbit Editorial Team' / 'ToolOrbit 编辑团队'。 */
  maintainer?: string;
};
