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
};
