import { usePathname } from 'next/navigation';
import AiRuntimeTool, { type AiRuntimeToolConfig } from './AiRuntimeTool';
import {
  competitorTrackerConfig,
  excelFormulaConfig,
  marketInsightsConfig,
  promptGeneratorConfig,
  regexGeneratorConfig,
  textPolisherConfig,
  translatorConfig,
  videoScriptConfig,
  worldCupMatchPredictorConfig,
  xiaohongshuConfig,
} from './p1RuntimeConfigs';

const configByPath: Record<string, AiRuntimeToolConfig> = {
  '/tools/ai/prompt-generator': promptGeneratorConfig,
  '/tools/ai/video-script': videoScriptConfig,
  '/tools/ai/excel-formula': excelFormulaConfig,
  '/tools/ai/regex': regexGeneratorConfig,
  '/tools/ai/xiaohongshu': xiaohongshuConfig,
  '/tools/ai/text-polisher': textPolisherConfig,
  '/tools/ai/translator': translatorConfig,
  '/tools/ai/competitor-tracker': competitorTrackerConfig,
  '/tools/ai/market-insights': marketInsightsConfig,
  '/tools/ai/worldcup-match-predictor': worldCupMatchPredictorConfig,
};

const P1RuntimeTool = () => {
  const pathname = usePathname();
  const config = Object.entries(configByPath).find(([path]) => pathname.endsWith(path))?.[1] || promptGeneratorConfig;

  return <AiRuntimeTool config={config} />;
};

export default P1RuntimeTool;
