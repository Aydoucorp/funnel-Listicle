// Toute donnee entrante passe par ici avant de toucher quoi que ce soit.
import { z } from 'zod'
import { questions, QUESTION_IDS } from '@/lib/quiz'

export const EVENT_TYPES = [
  'quiz_start',
  'question_view',
  'question_answer',
  'question_back',
  'lead_gate_view',
  'opt_in_submit',
  'result_view',
  'abandon',
] as const

export type EventType = (typeof EVENT_TYPES)[number]

// Schema des reponses construit a partir de quiz-content.json :
// seules les valeurs reellement proposees sont acceptees.
const answersShape = Object.fromEntries(
  questions.map((question) => {
    const values = question.options.map((o) => o.value) as [string, ...string[]]
    const option = z.enum(values)
    const list =
      question.type === 'multi'
        ? z.array(option).min(1).max(question.options.length)
        : z.array(option).length(1)

    return [
      question.id,
      list.refine((arr) => new Set(arr).size === arr.length, {
        message: 'doublon',
      }),
    ]
  }),
)

export const answersSchema = z.object(answersShape).strict()
export type ValidatedAnswers = z.infer<typeof answersSchema>

const QUESTION_ID_VALUES = ['lead_gate', ...QUESTION_IDS] as unknown as [string, ...string[]]

export const eventSchema = z
  .object({
    type: z.enum(EVENT_TYPES),
    sessionId: z.uuid().optional(),
    questionId: z.enum(QUESTION_ID_VALUES).optional(),
    answerValue: z.string().trim().min(1).max(64).optional(),
    context: z
      .object({
        device: z.enum(['mobile', 'tablet', 'desktop']).optional(),
        referrer: z.string().trim().max(300).optional(),
        utmSource: z.string().trim().max(120).optional(),
        utmMedium: z.string().trim().max(120).optional(),
        utmCampaign: z.string().trim().max(120).optional(),
      })
      .optional(),
  })
  .strict()
  .refine((data) => data.type === 'quiz_start' || Boolean(data.sessionId), {
    message: 'sessionId requis',
  })

export const subscribeSchema = z
  .object({
    prenom: z.string().trim().min(1).max(60),
    email: z.email().trim().toLowerCase().max(180),
    consent: z.literal(true),
    answers: answersSchema,
    sessionId: z.uuid().nullish(),
    formToken: z.string().min(10).max(4000),
    // Champ honeypot : doit rester vide.
    site_web: z.string().max(300).optional(),
  })
  .strict()

export const adminLoginSchema = z
  .object({
    password: z.string().min(1).max(200),
    site_web: z.string().max(300).optional(),
  })
  .strict()

export const adminPasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1).max(200),
    newPassword: z.string().min(12, '12 caracteres minimum').max(200),
    confirmPassword: z.string().min(1).max(200),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les deux mots de passe ne sont pas identiques',
    path: ['confirmPassword'],
  })

export const deleteLeadSchema = z
  .object({
    email: z.email().trim().toLowerCase().max(180),
  })
  .strict()
