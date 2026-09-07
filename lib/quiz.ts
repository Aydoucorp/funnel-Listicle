// Source de verite du contenu : quiz-content.json (a la racine).
// On ne reecrit jamais ces textes, on les lit.
import rawContent from '@/quiz-content.json'

export const PROFILE_KEYS = ['bebe', 'animal', 'air', 'budget', 'charge'] as const
export type ProfileKey = (typeof PROFILE_KEYS)[number]

export type QuizOption = {
  value: string
  label: string
  points: Partial<Record<ProfileKey, number>>
}

export type QuizQuestion = {
  id: string
  order: number
  type: 'single' | 'multi'
  title: string
  help?: string
  options: QuizOption[]
}

export type ProfileInfo = { label: string; group: string; ebook: string }

export type ResultPage = {
  headline: string
  body: string
  ebook: string
  bonus: string
  nextStep: string
}

export type QuizContent = {
  meta: {
    brand: string
    instagram: string
    quizTitle: string
    quizSubtitle: string
    estimatedTime: string
    language: string
    note: string
  }
  profiles: Record<ProfileKey, ProfileInfo>
  scoring: { rule: string; tieBreakOrder: ProfileKey[] }
  bonusForAll: { ebook: string; usage: string }
  questions: QuizQuestion[]
  leadGate: {
    position: string
    title: string
    subtitle: string
    fields: { name: string; label: string; required: boolean; type?: string }[]
    consent: { required: boolean; label: string; note: string }
    cta: string
  }
  resultPages: Record<ProfileKey, ResultPage>
}

export const quiz = rawContent as unknown as QuizContent

export const questions: QuizQuestion[] = [...quiz.questions].sort((a, b) => a.order - b.order)
export const QUESTION_IDS = questions.map((q) => q.id)
export const TOTAL_QUESTIONS = questions.length

export function getQuestion(id: string): QuizQuestion | undefined {
  return questions.find((q) => q.id === id)
}

export function isProfileKey(value: unknown): value is ProfileKey {
  return typeof value === 'string' && (PROFILE_KEYS as readonly string[]).includes(value)
}

// Emojis de profil, verrouilles par DA-DESIGN-SYSTEM.md section 6.
export const PROFILE_EMOJI: Record<ProfileKey, string> = {
  bebe: '👶',
  animal: '🐾',
  air: '🌬️',
  budget: '💸',
  charge: '😮‍💨',
}

// Liseres de couleur par profil (palette DA uniquement).
export const PROFILE_ACCENT: Record<ProfileKey, string> = {
  bebe: '#6aa4d8',
  animal: '#8bb28a',
  air: '#3f77b0',
  budget: '#e0b64c',
  charge: '#5f8a5e',
}
