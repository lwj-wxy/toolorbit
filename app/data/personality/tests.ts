import { animeCharacters } from './anime-characters'

export interface PersonalityQuestion {
  id: string
  text: string
  dimension?: string
  reverse?: boolean
  options?: [string, string]
  weights?: [string, string]
}

export interface PersonalityDimensionResult {
  key: string
  label: string
  left: string
  right: string
  score: number
  percent: number
  dominant: string
}

export interface PersonalityResult {
  typeCode: string
  title: string
  summary: string
  dimensions: PersonalityDimensionResult[]
  primaryCharacter?: {
    name: string
    from: string
    description: string
    imageUrl: string
    matchScore: number
  }
  topCharacters?: Array<{
    name: string
    from: string
    description: string
    imageUrl: string
    matchScore: number
  }>
}

export interface PersonalityTestConfig {
  id: string
  title: string
  subtitle: string
  disclaimer: string
  questionDuration: string
  questions: PersonalityQuestion[]
  scaleOptions?: Array<{ value: number; label: string }>
  showDimensions?: boolean
  calculateResult: (answers: Array<number | null>) => PersonalityResult
}

interface Axis {
  key: string
  left: string
  right: string
}

const likertToScore = (answer: number) => answer - 3

function calcDimensions(axes: Axis[], questions: PersonalityQuestion[], answers: Array<number | null>) {
  return axes.map((axis) => {
    const dimensionQuestions = questions.filter((question) => question.dimension === axis.key)
    let score = 0

    dimensionQuestions.forEach((question) => {
      const index = questions.findIndex((item) => item.id === question.id)
      const answer = answers[index]
      const normalizedAnswer = answer ?? 3
      const normalized = likertToScore(normalizedAnswer) * (question.reverse ? -1 : 1)
      score += normalized
    })

    const maxAbs = Math.max(1, dimensionQuestions.length * 2)
    const percent = Math.round(((score + maxAbs) / (maxAbs * 2)) * 100)

    return {
      key: axis.key,
      label: `${axis.left} / ${axis.right}`,
      left: axis.left,
      right: axis.right,
      score,
      percent,
      dominant: score >= 0 ? axis.right : axis.left,
    }
  })
}

const mbtiQuestions: PersonalityQuestion[] = [
  { id: 'm1', text: 'At a party do you:', options: ['Interact with many, including strangers', 'Interact with a few, known to you'], weights: ['e', 'i'] },
  { id: 'm2', text: 'Are you more:', options: ['Realistic than speculative', 'Speculative than realistic'], weights: ['s', 'n'] },
  { id: 'm3', text: 'Is it worse to:', options: ['Have your "head in the clouds"', 'Be "in a rut"'], weights: ['s', 'n'] },
  { id: 'm4', text: 'Are you more impressed by:', options: ['Principles', 'Emotions'], weights: ['t', 'f'] },
  { id: 'm5', text: 'Are more drawn toward the:', options: ['Convincing', 'Touching'], weights: ['t', 'f'] },
  { id: 'm6', text: 'Do you prefer to work:', options: ['To deadlines', 'Just "whenever"'], weights: ['j', 'p'] },
  { id: 'm7', text: 'Do you tend to choose:', options: ['Rather carefully', 'Somewhat impulsively'], weights: ['j', 'p'] },
  { id: 'm8', text: 'At parties do you:', options: ['Stay late, with increasing energy', 'Leave early with decreased energy'], weights: ['e', 'i'] },
  { id: 'm9', text: 'Are you more attracted to:', options: ['Sensible people', 'Imaginative people'], weights: ['s', 'n'] },
  { id: 'm10', text: 'Are you more interested in:', options: ['What is actual', 'What is possible'], weights: ['s', 'n'] },
  { id: 'm11', text: 'In judging others are you more swayed by:', options: ['Laws than circumstances', 'Circumstances than laws'], weights: ['t', 'f'] },
  { id: 'm12', text: 'In approaching others is your inclination to be somewhat:', options: ['Objective', 'Personal'], weights: ['t', 'f'] },
  { id: 'm13', text: 'Are you more:', options: ['Punctual', 'Leisurely'], weights: ['j', 'p'] },
  { id: 'm14', text: 'Does it bother you more having things:', options: ['Incomplete', 'Completed'], weights: ['j', 'p'] },
  { id: 'm15', text: 'In your social groups do you:', options: ['Keep abreast of other’s happenings', 'Get behind on the news'], weights: ['e', 'i'] },
  { id: 'm16', text: 'In doing ordinary things are you more likely to:', options: ['Do it the usual way', 'Do it your own way'], weights: ['s', 'n'] },
  { id: 'm17', text: 'Writers should:', options: ['Say what they mean and mean what they say', 'Express things more by use of analogy'], weights: ['s', 'n'] },
  { id: 'm18', text: 'Which appeals to you more:', options: ['Consistency of thought', 'Harmonious human relationships'], weights: ['t', 'f'] },
  { id: 'm19', text: 'Are you more comfortable in making:', options: ['Logical judgments', 'Value judgments'], weights: ['t', 'f'] },
  { id: 'm20', text: 'Do you want things:', options: ['Settled and decided', 'Unsettled and undecided'], weights: ['j', 'p'] },
  { id: 'm21', text: 'Would you say you are more:', options: ['Serious and determined', 'Easy-going'], weights: ['j', 'p'] },
  { id: 'm22', text: 'In phoning do you:', options: ['Rarely question that it will all be said', 'Rehearse what you’ll say'], weights: ['e', 'i'] },
  { id: 'm23', text: 'Facts:', options: ['Speak for themselves', 'Illustrate principles'], weights: ['s', 'n'] },
  { id: 'm24', text: 'Are visionaries:', options: ['somewhat annoying', 'rather fascinating'], weights: ['s', 'n'] },
  { id: 'm25', text: 'Are you more often:', options: ['a cool-headed person', 'a warm-hearted person'], weights: ['t', 'f'] },
  { id: 'm26', text: 'Is it worse to be:', options: ['unjust', 'merciless'], weights: ['t', 'f'] },
  { id: 'm27', text: 'Should one usually let events occur:', options: ['by careful selection and choice', 'randomly and by chance'], weights: ['j', 'p'] },
  { id: 'm28', text: 'Do you feel better about:', options: ['having purchased', 'having the option to buy'], weights: ['j', 'p'] },
  { id: 'm29', text: 'In company do you:', options: ['initiate conversation', 'wait to be approached'], weights: ['e', 'i'] },
  { id: 'm30', text: 'Common sense is:', options: ['rarely questionable', 'frequently questionable'], weights: ['s', 'n'] },
  { id: 'm31', text: 'Children often do not:', options: ['make themselves useful enough', 'exercise their fantasy enough'], weights: ['s', 'n'] },
  { id: 'm32', text: 'In making decisions do you feel more comfortable with:', options: ['standards', 'feelings'], weights: ['t', 'f'] },
  { id: 'm33', text: 'Are you more:', options: ['firm than gentle', 'gentle than firm'], weights: ['t', 'f'] },
  { id: 'm34', text: 'Which is more admirable:', options: ['the ability to organize and be methodical', 'the ability to adapt and make do'], weights: ['j', 'p'] },
  { id: 'm35', text: 'Do you put more value on:', options: ['infinite', 'open-minded'], weights: ['j', 'p'] },
  { id: 'm36', text: 'Does new and non-routine interaction:', options: ['stimulate and energize you', 'tax your reserves'], weights: ['e', 'i'] },
  { id: 'm37', text: 'Are you more frequently:', options: ['a practical sort of person', 'a fanciful sort of person'], weights: ['s', 'n'] },
  { id: 'm38', text: 'Are you more likely to:', options: ['see how others are useful', 'see how others see'], weights: ['s', 'n'] },
  { id: 'm39', text: 'Which is more satisfying:', options: ['to discuss an issue thoroughly', 'to arrive at agreement on an issue'], weights: ['t', 'f'] },
  { id: 'm40', text: 'Which rules you more:', options: ['your head', 'your heart'], weights: ['t', 'f'] },
  { id: 'm41', text: 'Are you more comfortable with work that:', options: ['contracted', 'done on a casual basis'], weights: ['j', 'p'] },
  { id: 'm42', text: 'Do you tend to look for:', options: ['the orderly', 'whatever turns up'], weights: ['j', 'p'] },
  { id: 'm43', text: 'Do you prefer:', options: ['many friends with brief contact', 'a few friends with more lengthy contact'], weights: ['e', 'i'] },
  { id: 'm44', text: 'Do you go more by:', options: ['facts', 'principles'], weights: ['s', 'n'] },
  { id: 'm45', text: 'Are you more interested in:', options: ['production and distribution', 'design and research'], weights: ['s', 'n'] },
  { id: 'm46', text: 'Which is more of a compliment:', options: ['"There is a very logical person."', '"There is a very sentimental person."'], weights: ['t', 'f'] },
  { id: 'm47', text: 'Do you value in yourself more that you are:', options: ['unwavering', 'devoted'], weights: ['t', 'f'] },
  { id: 'm48', text: 'Do you more often prefer the:', options: ['final and unalterable statement', 'tentative and preliminary statement'], weights: ['j', 'p'] },
  { id: 'm49', text: 'Are you more comfortable:', options: ['after a decision', 'before a decision'], weights: ['j', 'p'] },
  { id: 'm50', text: 'Do you:', options: ['speak easily and at length with strangers', 'find little to say to strangers'], weights: ['e', 'i'] },
  { id: 'm51', text: 'Are you more likely to trust your:', options: ['experience', 'hunch'], weights: ['s', 'n'] },
  { id: 'm52', text: 'Do you feel:', options: ['more practical than ingenious', 'more ingenious than practical'], weights: ['s', 'n'] },
  { id: 'm53', text: 'Which person is more to be complimented - one of:', options: ['clear reason', 'strong feeling'], weights: ['t', 'f'] },
  { id: 'm54', text: 'Are you inclined more to be:', options: ['fair-minded', 'sympathetic'], weights: ['t', 'f'] },
  { id: 'm55', text: 'Is it preferable mostly to:', options: ['make sure things are arranged', 'just let things happen'], weights: ['j', 'p'] },
  { id: 'm56', text: 'In relationships should most things be:', options: ['re-negotiable', 'random and circumstantial'], weights: ['j', 'p'] },
  { id: 'm57', text: 'When the phone rings do you:', options: ['hasten to get to it first', 'hope someone else will answer'], weights: ['e', 'i'] },
  { id: 'm58', text: 'Do you prize more in yourself:', options: ['a strong sense of reality', 'a vivid imagination'], weights: ['s', 'n'] },
  { id: 'm59', text: 'Are you drawn more to:', options: ['fundamentals', 'overtones'], weights: ['s', 'n'] },
  { id: 'm60', text: 'Which seems the greater error:', options: ['to be too passionate', 'to be too objective'], weights: ['t', 'f'] },
  { id: 'm61', text: 'Do you see yourself as basically:', options: ['hard-headed', 'soft-hearted'], weights: ['t', 'f'] },
  { id: 'm62', text: 'Which situation appeals to you more:', options: ['the structured and scheduled', 'the unstructured and unscheduled'], weights: ['j', 'p'] },
  { id: 'm63', text: 'Are you a person that is more:', options: ['routinized than whimsical', 'whimsical than routinized'], weights: ['j', 'p'] },
  { id: 'm64', text: 'Are you more inclined to be:', options: ['easy to approach', 'somewhat reserved'], weights: ['e', 'i'] },
  { id: 'm65', text: 'In writings do you prefer:', options: ['the more literal', 'the more figurative'], weights: ['s', 'n'] },
  { id: 'm66', text: 'Is it harder for you to:', options: ['identify with others', 'utilize others'], weights: ['s', 'n'] },
  { id: 'm67', text: 'Which do you wish more for yourself:', options: ['clarity of reason', 'strength of compassion'], weights: ['t', 'f'] },
  { id: 'm68', text: 'Which is the greater fault:', options: ['being indiscriminate', 'being critical'], weights: ['t', 'f'] },
  { id: 'm69', text: 'Do you prefer the:', options: ['planned event', 'unplanned event'], weights: ['j', 'p'] },
  { id: 'm70', text: 'Do you tend to be more:', options: ['deliberate than spontaneous', 'spontaneous than deliberate'], weights: ['j', 'p'] },
]

const mbtiTypeDescriptions: Record<string, string> = {
  INTJ: '战略性强，偏好独立思考和长期规划。',
  INTP: '重视逻辑与探索，喜欢构建概念模型。',
  ENTJ: '目标驱动，善于组织资源和推进决策。',
  ENTP: '创意与辩证并重，擅长提出新可能。',
  INFJ: '重视意义与价值，关注长期影响。',
  INFP: '价值感强，倾向真诚表达和理想追求。',
  ENFJ: '擅长联结与激励，关注群体协作氛围。',
  ENFP: '热情开放，善于连接想法与人。',
  ISTJ: '务实可靠，重视秩序、责任与执行。',
  ISFJ: '稳定细致，重视承诺与照顾他人。',
  ESTJ: '结构化强，偏好规则清晰和高效推进。',
  ESFJ: '社交敏锐，重视关系与实际支持。',
  ISTP: '冷静务实，擅长快速分析和动手解决。',
  ISFP: '温和敏感，重视体验与个人价值一致。',
  ESTP: '行动导向，擅长在变化中快速应对。',
  ESFP: '外向灵活，重视互动体验和当下反馈。',
}

function getMbtiResult(answers: Array<number | null>): PersonalityResult {
  const scores: Record<string, number> = {
    e: 0,
    i: 0,
    s: 0,
    n: 0,
    t: 0,
    f: 0,
    j: 0,
    p: 0,
  }

  mbtiQuestions.forEach((question, index) => {
    const answer = answers[index]
    if (answer === null || answer === undefined) {
      return
    }
    const weight = question.weights?.[answer]
    if (weight && scores[weight] !== undefined) {
      scores[weight] += 1
    }
  })

  const pairs = [
    { key: 'ei', leftCode: 'I', rightCode: 'E', leftScore: scores.i, rightScore: scores.e, left: '内向 I', right: '外向 E' },
    { key: 'sn', leftCode: 'S', rightCode: 'N', leftScore: scores.s, rightScore: scores.n, left: '实感 S', right: '直觉 N' },
    { key: 'tf', leftCode: 'F', rightCode: 'T', leftScore: scores.f, rightScore: scores.t, left: '情感 F', right: '思考 T' },
    { key: 'jp', leftCode: 'P', rightCode: 'J', leftScore: scores.p, rightScore: scores.j, left: '感知 P', right: '判断 J' },
  ]

  const dimensions: PersonalityDimensionResult[] = pairs.map((pair) => {
    const total = Math.max(1, pair.leftScore + pair.rightScore)
    const percent = Math.round((pair.rightScore / total) * 100)
    return {
      key: pair.key,
      label: `${pair.left} / ${pair.right}`,
      left: pair.left,
      right: pair.right,
      score: pair.rightScore - pair.leftScore,
      percent,
      dominant: pair.rightScore >= pair.leftScore ? pair.right : pair.left,
    }
  })

  const typeCode = pairs
    .map((pair) => (pair.rightScore >= pair.leftScore ? pair.rightCode : pair.leftCode))
    .join('')

  const summary = mbtiTypeDescriptions[typeCode] ?? '你在多个维度上接近均衡，可结合维度条继续观察。'

  return {
    typeCode,
    title: `你的 16 型人格倾向：${typeCode}`,
    summary: `${summary} 这是非官方人格倾向测验结果，仅用于自我探索与交流。`,
    dimensions,
  }
}

const animeScaleOptions = [
  { value: 1, label: '非常不符合' },
  { value: 2, label: '不太符合' },
  { value: 3, label: '略不符合' },
  { value: 4, label: '中立' },
  { value: 5, label: '略符合' },
  { value: 6, label: '比较符合' },
  { value: 7, label: '非常符合' },
]

const animeQuestions: PersonalityQuestion[] = [
  { id: 'a1', text: '陌生局里我通常先开口。', dimension: 'ei' },
  { id: 'a2', text: '长时间社交后我需要独处充电。', dimension: 'ei', reverse: true },
  { id: 'a3', text: '我更享受团队协作而不是单线推进。', dimension: 'ei' },
  { id: 'a4', text: '我在群聊里通常先观察再发言。', dimension: 'ei', reverse: true },
  { id: 'a5', text: '我会主动拉人一起做有趣的事。', dimension: 'ei' },
  { id: 'a6', text: '我偏好少数深交，而非广泛社交。', dimension: 'ei', reverse: true },
  { id: 'a7', text: '我对细节和现实条件非常敏感。', dimension: 'sn', reverse: true },
  { id: 'a8', text: '我会自然联想到未来的多种可能。', dimension: 'sn' },
  { id: 'a9', text: '做决定前我会先看已有经验和证据。', dimension: 'sn', reverse: true },
  { id: 'a10', text: '我经常在脑海里构建世界观设定。', dimension: 'sn' },
  { id: 'a11', text: '我更相信可验证的方法而非直觉灵感。', dimension: 'sn', reverse: true },
  { id: 'a12', text: '我很容易被“新点子”点燃。', dimension: 'sn' },
  { id: 'a13', text: '我在冲突中会优先讲逻辑和原则。', dimension: 'tf' },
  { id: 'a14', text: '我会优先照顾关系和他人感受。', dimension: 'tf', reverse: true },
  { id: 'a15', text: '我对“是否公平”比“是否和气”更在意。', dimension: 'tf' },
  { id: 'a16', text: '面对分歧时我更愿意先共情再结论。', dimension: 'tf', reverse: true },
  { id: 'a17', text: '就算会尴尬，我也会坚持事实判断。', dimension: 'tf' },
  { id: 'a18', text: '我会为了不伤人而调整表达和结论。', dimension: 'tf', reverse: true },
  { id: 'a19', text: '我喜欢提前规划并按节点推进。', dimension: 'jp' },
  { id: 'a20', text: '我更喜欢灵活临场发挥。', dimension: 'jp', reverse: true },
  { id: 'a21', text: '任务没定下来会让我焦虑。', dimension: 'jp' },
  { id: 'a22', text: '我常把最佳创意留到最后一刻。', dimension: 'jp', reverse: true },
  { id: 'a23', text: '我会先列清单，再开始行动。', dimension: 'jp' },
  { id: 'a24', text: '我更享受探索过程而不是尽快收束。', dimension: 'jp', reverse: true },
  { id: 'a25', text: '朋友遇事时我常担任“带队推进”的角色。', dimension: 'ei' },
  { id: 'a26', text: '我在陌生环境更像“隐身观察者”。', dimension: 'ei', reverse: true },
  { id: 'a27', text: '我喜欢把零散信息拼成全局图。', dimension: 'sn' },
  { id: 'a28', text: '我更相信踏实执行，而不是宏大想象。', dimension: 'sn', reverse: true },
  { id: 'a29', text: '我会用“最有效”作为首要标准。', dimension: 'tf' },
  { id: 'a30', text: '我会用“大家是否舒服”作为首要标准。', dimension: 'tf', reverse: true },
  { id: 'a31', text: '我做事偏好可复盘、可预测。', dimension: 'jp' },
  { id: 'a32', text: '我讨厌被流程束缚。', dimension: 'jp', reverse: true },
  { id: 'a33', text: '我会主动组织活动并推动落地。', dimension: 'ei' },
  { id: 'a34', text: '我常在脑海里跑“如果…会怎样”的分支。', dimension: 'sn' },
  { id: 'a35', text: '我常被评价为“理性到有点冷”。', dimension: 'tf' },
  { id: 'a36', text: '我常被评价为“温柔且有同理心”。', dimension: 'tf', reverse: true },
  { id: 'a37', text: '我对突发变化的容忍度很高。', dimension: 'jp', reverse: true },
  { id: 'a38', text: '我更喜欢把未知快速变成确定。', dimension: 'jp' },
  { id: 'a39', text: '我在关键时刻倾向于“先站出来”。', dimension: 'ei' },
]

const animeArchetypeMap: Record<string, { name: string; desc: string }> = {
  ENFP: { name: '发光主角位', desc: '外向直觉，热情带节奏，天然适合点燃团队情绪。' },
  ENFJ: { name: '热场领航位', desc: '擅长连接人与目标，既能共情也能推动结果。' },
  ENTP: { name: '奇想策士位', desc: '脑洞大、点子快，喜欢在变化中寻找最优解。' },
  ENTJ: { name: '战术指挥位', desc: '目标导向强，能快速组织资源并推进决策。' },
  INFP: { name: '月下守护者', desc: '价值驱动，情感细腻，倾向温柔而坚定地守护。' },
  INFJ: { name: '静夜预言者', desc: '洞察深、直觉强，擅长从长期视角理解关系。' },
  INTP: { name: '冷面分析师', desc: '偏好逻辑推演和系统化思考，追求认知准确。' },
  INTJ: { name: '终局设计师', desc: '擅长长期规划与策略布局，行动克制但高效。' },
}

const animeAxisMeta = [
  { key: 'ei', left: '内向 I', right: '外向 E', leftCode: 'I', rightCode: 'E' },
  { key: 'sn', left: '实感 S', right: '直觉 N', leftCode: 'S', rightCode: 'N' },
  { key: 'tf', left: '情感 F', right: '思考 T', leftCode: 'F', rightCode: 'T' },
  { key: 'jp', left: '感知 P', right: '判断 J', leftCode: 'P', rightCode: 'J' },
] as const

function mbtiDistance(left: string, right: string) {
  const maxLen = Math.max(left.length, right.length, 4)
  let diff = 0
  for (let index = 0; index < maxLen; index += 1) {
    if ((left[index] ?? '') !== (right[index] ?? '')) {
      diff += 1
    }
  }
  return diff
}

function matchScoreFromCode(typeCode: string, matchCode: string, flexCodes: string[]) {
  const baseDistance = mbtiDistance(typeCode, matchCode)
  const flexDistance = flexCodes.length > 0
    ? Math.min(...flexCodes.map((code) => mbtiDistance(typeCode, code)))
    : 99

  const bestDistance = Math.min(baseDistance, flexDistance)
  const scoreTable = [96, 86, 74, 62, 50]
  const scoreByDistance = scoreTable[Math.min(bestDistance, scoreTable.length - 1)]
  const exactBonus = baseDistance === 0 ? 2 : 0
  const flexPenalty = baseDistance !== 0 && bestDistance === flexDistance ? -3 : 0

  return Math.max(35, Math.min(99, scoreByDistance + exactBonus + flexPenalty))
}

function getAnimeResult(answers: Array<number | null>): PersonalityResult {
  const axisScores: Record<'ei' | 'sn' | 'tf' | 'jp', number> = { ei: 0, sn: 0, tf: 0, jp: 0 }
  const axisCounts: Record<'ei' | 'sn' | 'tf' | 'jp', number> = { ei: 0, sn: 0, tf: 0, jp: 0 }

  animeQuestions.forEach((question, index) => {
    const axisKey = question.dimension as 'ei' | 'sn' | 'tf' | 'jp'
    const answer = answers[index] ?? 4
    const signedDelta = (answer - 4) * (question.reverse ? -1 : 1)
    axisScores[axisKey] += signedDelta
    axisCounts[axisKey] += 1
  })

  const dimensions: PersonalityDimensionResult[] = animeAxisMeta.map((axis) => {
    const maxAbs = Math.max(1, axisCounts[axis.key] * 3)
    const score = axisScores[axis.key]
    const percent = Math.round(((score + maxAbs) / (maxAbs * 2)) * 100)
    return {
      key: axis.key,
      label: `${axis.left} / ${axis.right}`,
      left: axis.left,
      right: axis.right,
      score,
      percent,
      dominant: score >= 0 ? axis.right : axis.left,
    }
  })

  const typeCode = dimensions
    .map((dimension) => {
      const axis = animeAxisMeta.find((item) => item.key === dimension.key)
      if (!axis) {
        return ''
      }
      return dimension.score >= 0 ? axis.rightCode : axis.leftCode
    })
    .join('')

  const archetype = animeArchetypeMap[typeCode] ?? {
    name: '混合番剧位',
    desc: '你在多个维度上接近均衡，是适配面很广的多面型角色。',
  }

  const rankedCharacters = animeCharacters
    .map((character) => {
      const normalizedScore = matchScoreFromCode(typeCode, character.matchCode, character.matchCodeFlex)
      return {
        name: character.name,
        from: character.from,
        description: character.description,
        imageUrl: character.imageUrl,
        matchScore: Math.max(0, Math.min(100, normalizedScore)),
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)

  const topCharacters = rankedCharacters.slice(0, 3)
  const primaryCharacter = topCharacters[0] ?? {
    name: '待定角色',
    from: '角色库',
    description: '当前匹配结果暂不可用，请重试。',
    imageUrl: 'https://placehold.co/800x450/e2e8f0/334155?text=%E4%BA%8C%E6%AC%A1%E5%85%83%E8%A7%92%E8%89%B2',
    matchScore: 0,
  }

  return {
    typeCode,
    title: `你最像的二次元角色：${primaryCharacter.name}`,
    summary: `${archetype.desc} 你的角色匹配结果如下。`,
    dimensions,
    primaryCharacter,
    topCharacters: topCharacters.length > 0 ? topCharacters : [primaryCharacter],
  }
}

const bigFiveAxes: Axis[] = [
  { key: 'o', left: '开放性较低', right: '开放性较高' },
  { key: 'c', left: '尽责性较低', right: '尽责性较高' },
  { key: 'e', left: '外向性较低', right: '外向性较高' },
  { key: 'a', left: '宜人性较低', right: '宜人性较高' },
  { key: 'n', left: '情绪稳定较高', right: '神经质较高' },
]

const bigFiveQuestions: PersonalityQuestion[] = [
  { id: 'b1', text: '我喜欢探索新想法和新体验。', dimension: 'o' },
  { id: 'b2', text: '我更喜欢熟悉的方式而不是新变化。', dimension: 'o', reverse: true },
  { id: 'b3', text: '艺术、抽象或哲学话题容易吸引我。', dimension: 'o' },
  { id: 'b4', text: '我会主动制定计划并按计划推进。', dimension: 'c' },
  { id: 'b5', text: '我经常把任务拖到最后一刻。', dimension: 'c', reverse: true },
  { id: 'b6', text: '我对细节和质量有较高要求。', dimension: 'c' },
  { id: 'b7', text: '我在社交场景中通常比较活跃。', dimension: 'e' },
  { id: 'b8', text: '长时间和很多人相处会让我疲惫。', dimension: 'e', reverse: true },
  { id: 'b9', text: '我愿意主动表达观点并影响他人。', dimension: 'e' },
  { id: 'b10', text: '我会尽量照顾他人的感受。', dimension: 'a' },
  { id: 'b11', text: '我在争论中更容易强硬地坚持己见。', dimension: 'a', reverse: true },
  { id: 'b12', text: '我倾向于信任并支持团队成员。', dimension: 'a' },
  { id: 'b13', text: '压力大时我很容易焦虑或反复担心。', dimension: 'n' },
  { id: 'b14', text: '面对波动我通常能保持稳定。', dimension: 'n', reverse: true },
  { id: 'b15', text: '我会因为小事而明显情绪化。', dimension: 'n' },
]

function getBigFiveResult(answers: Array<number | null>): PersonalityResult {
  const dimensions = calcDimensions(bigFiveAxes, bigFiveQuestions, answers)
  return {
    typeCode: 'OCEAN',
    title: '你的大五人格画像（OCEAN）',
    summary: '大五是连续维度模型，你不是某个固定标签，而是五个维度上的组合。',
    dimensions,
  }
}

export const personalityTestMap: Record<string, PersonalityTestConfig> = {
  'mbti-style-test': {
    id: 'mbti-style-test',
    title: '16 型人格倾向测试',
    subtitle: '70 题二选一版本，前端本地计分',
    disclaimer: '说明：本测试为非官方人格倾向测验，仅用于自我探索与交流，不用于招聘、诊断或重大决策。',
    questionDuration: '约 10-15 分钟',
    questions: mbtiQuestions,
    calculateResult: getMbtiResult,
  },
  'anime-persona-test': {
    id: 'anime-persona-test',
    title: '二次元人格测试',
    subtitle: 'ACGTI 风格 39 题七级量表，匹配二次元角色',
    disclaimer: '说明：本测试是娱乐向画像工具，不代表专业心理测量结论。',
    questionDuration: '约 6-10 分钟',
    scaleOptions: animeScaleOptions,
    showDimensions: false,
    questions: animeQuestions,
    calculateResult: getAnimeResult,
  },
  'big-five-test': {
    id: 'big-five-test',
    title: '大五人格测试（轻量版）',
    subtitle: 'OCEAN 五维度连续画像',
    disclaimer: '说明：本测试为轻量版大五画像，仅供参考。若用于研究或临床评估，请使用专业量表并由专业人员解释。',
    questionDuration: '约 4-6 分钟',
    questions: bigFiveQuestions,
    calculateResult: getBigFiveResult,
  },
}

export function getPersonalityTestConfig(id: string) {
  return personalityTestMap[id] ?? null
}
