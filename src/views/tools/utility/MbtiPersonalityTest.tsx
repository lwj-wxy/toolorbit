import { useMemo, useState } from 'react';
import { BarChart3, Brain, CheckCircle2, ChevronLeft, ChevronRight, Compass, RotateCcw, Target } from 'lucide-react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';
import {
  type AnswerValue,
  type DimensionCode,
  QUESTIONS,
  PERSONALITY_TYPES,
  DIMENSION_LABELS,
  getText,
  getInitialAnswers,
  calculateLetterScores,
  getTypeFromScores,
  getDimensionPercent,
  getPersonalityImagePath,
} from './MbtiPersonalityTest.data';

const MbtiPersonalityTest = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');
  const [answersByQuestion, setAnswersByQuestion] = useState<Record<string, AnswerValue | null>>(() => getInitialAnswers());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const answeredCount = useMemo(
    () => Object.values(answersByQuestion).filter((answerValue) => answerValue !== null).length,
    [answersByQuestion],
  );
  const completionPercent = Math.round((answeredCount / QUESTIONS.length) * 100);
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentAnswer = answersByQuestion[currentQuestion.id];
  const letterScores = useMemo(() => calculateLetterScores(answersByQuestion), [answersByQuestion]);
  const computedTypeCode = useMemo(() => getTypeFromScores(letterScores), [letterScores]);
  const resultType = PERSONALITY_TYPES[computedTypeCode];
  const hasCompletedTest = answeredCount === QUESTIONS.length;

  const handleAnswerChange = (questionId: string, answerValue: AnswerValue) => {
    if (hasCompletedTest) return;

    setAnswersByQuestion((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: answerValue,
    }));

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((questionIndex) => questionIndex + 1);
    }
  };

  const handleReset = () => {
    setAnswersByQuestion(getInitialAnswers());
    setCurrentQuestionIndex(0);
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
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#282c34]">
          <div className="grid grid-cols-1 border-b border-slate-200 dark:border-slate-800 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-950 lg:aspect-auto">
              <img
                src={getPersonalityImagePath(resultType.code)}
                alt={`${resultType.code} ${getText(resultType.title, Boolean(isZh))}`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-6">
              <span className={cn('w-fit rounded-md border px-2.5 py-1 text-xs font-semibold', resultType.accentClassName)}>
                {getText(resultType.role, Boolean(isZh))}
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{resultType.code}</h2>
              <p className="mt-1 text-base font-semibold text-slate-700 dark:text-slate-200">{getText(resultType.title, Boolean(isZh))}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{getText(resultType.tagline, Boolean(isZh))}</p>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <section>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Target className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                {t('tools.mbti-personality-test.strengthsTitle')}
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
                {resultType.strengths.map((strengthText) => (
                  <li key={strengthText.en} className="flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
                    {getText(strengthText, Boolean(isZh))}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-slate-200 pt-6 dark:border-slate-800">
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
            </section>

            <section className="border-t border-amber-200 pt-6 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:text-amber-100">
              <p className="font-semibold">{t('tools.mbti-personality-test.growthTitle')}</p>
              <p className="mt-2">{getText(resultType.growth, Boolean(isZh))}</p>
            </section>
          </div>
        </section>
      ) : null}

      <ToolSEOCard toolKey="mbti-personality-test" />
    </div>
  );
};

export default MbtiPersonalityTest;
