import 'server-only'
import { Prisma } from '@prisma/client'
import { hasDatabase, prisma } from '@/lib/prisma'
import { PROFILE_KEYS, ProfileKey, questions, quiz } from '@/lib/quiz'

export type DashboardFilters = {
  from: Date
  to: Date
  utmSource: string | null
  device: string | null
}

export type FunnelStep = {
  key: string
  label: string
  sessions: number
  shareOfStart: number
  dropFromPrevious: number
  dropRate: number
}

export type QuestionStat = {
  id: string
  order: number
  title: string
  views: number
  answered: number
  backs: number
  abandons: number
  avgSeconds: number | null
  options: { value: string; label: string; sessions: number; share: number }[]
}

export type DashboardData = {
  available: boolean
  totals: {
    sessions: number
    completed: number
    optIns: number
    leads: number
    leadsNotSynced: number
    completionRate: number
    optInRate: number
  }
  funnel: FunnelStep[]
  questionStats: QuestionStat[]
  profiles: { key: ProfileKey; label: string; profileLabel: string; total: number; share: number }[]
  daily: { day: string; sessions: number; optIns: number }[]
  filterOptions: { utmSources: string[]; devices: string[] }
  recentLeads: { email: string; prenom: string; profile: string; createdAt: Date; synced: boolean }[]
}

function emptyDashboard(): DashboardData {
  return {
    available: false,
    totals: {
      sessions: 0,
      completed: 0,
      optIns: 0,
      leads: 0,
      leadsNotSynced: 0,
      completionRate: 0,
      optInRate: 0,
    },
    funnel: [],
    questionStats: [],
    profiles: [],
    daily: [],
    filterOptions: { utmSources: [], devices: [] },
    recentLeads: [],
  }
}

/** Filtres appliques aux sessions. Toutes les valeurs passent en parametres (jamais de SQL concatene). */
function sessionWhere(filters: DashboardFilters): Prisma.Sql {
  const clauses: Prisma.Sql[] = [
    Prisma.sql`s."startedAt" >= ${filters.from}`,
    Prisma.sql`s."startedAt" <= ${filters.to}`,
  ]
  if (filters.utmSource) clauses.push(Prisma.sql`s."utmSource" = ${filters.utmSource}`)
  if (filters.device) clauses.push(Prisma.sql`s."device" = ${filters.device}`)
  return Prisma.join(clauses, ' AND ')
}

function rate(part: number, whole: number): number {
  if (whole <= 0) return 0
  return Math.round((part / whole) * 1000) / 10
}

export async function getDashboard(filters: DashboardFilters): Promise<DashboardData> {
  if (!hasDatabase()) return emptyDashboard()

  const where = sessionWhere(filters)

  const [
    stepRows,
    answerRows,
    timeRows,
    totalsRow,
    profileRows,
    dailyRows,
    utmRows,
    deviceRows,
    leadTotals,
    leadsNotSynced,
    recentLeads,
  ] = await Promise.all([
    prisma.$queryRaw<{ type: string; question_id: string | null; sessions: number; events: number }[]>(
      Prisma.sql`
        SELECT e."type" AS type,
               e."questionId" AS question_id,
               COUNT(DISTINCT e."sessionId")::int AS sessions,
               COUNT(*)::int AS events
        FROM "Event" e
        JOIN "Session" s ON s."id" = e."sessionId"
        WHERE ${where}
        GROUP BY 1, 2
      `,
    ),
    prisma.$queryRaw<{ question_id: string; answer_value: string; sessions: number }[]>(
      Prisma.sql`
        SELECT e."questionId" AS question_id,
               e."answerValue" AS answer_value,
               COUNT(DISTINCT e."sessionId")::int AS sessions
        FROM "Event" e
        JOIN "Session" s ON s."id" = e."sessionId"
        WHERE ${where}
          AND e."type" = 'question_answer'
          AND e."questionId" IS NOT NULL
          AND e."answerValue" IS NOT NULL
        GROUP BY 1, 2
      `,
    ),
    prisma.$queryRaw<{ question_id: string; avg_seconds: number | null }[]>(
      Prisma.sql`
        WITH ordered AS (
          SELECT e."sessionId" AS session_id,
                 e."type" AS type,
                 e."questionId" AS question_id,
                 e."createdAt" AS created_at,
                 LEAD(e."createdAt") OVER (
                   PARTITION BY e."sessionId" ORDER BY e."createdAt", e."id"
                 ) AS next_at
          FROM "Event" e
          JOIN "Session" s ON s."id" = e."sessionId"
          WHERE ${where}
        )
        SELECT question_id,
               AVG(EXTRACT(EPOCH FROM (next_at - created_at)))::float AS avg_seconds
        FROM ordered
        WHERE type = 'question_view'
          AND question_id IS NOT NULL
          AND next_at IS NOT NULL
          AND EXTRACT(EPOCH FROM (next_at - created_at)) BETWEEN 0 AND 600
        GROUP BY 1
      `,
    ),
    prisma.$queryRaw<{ sessions: number; completed: number; optins: number }[]>(
      Prisma.sql`
        SELECT COUNT(*)::int AS sessions,
               COUNT(*) FILTER (WHERE s."completedAt" IS NOT NULL)::int AS completed,
               COUNT(*) FILTER (WHERE s."optedIn")::int AS optins
        FROM "Session" s
        WHERE ${where}
      `,
    ),
    prisma.$queryRaw<{ profile: string; total: number }[]>(
      Prisma.sql`
        SELECT s."resultProfile" AS profile, COUNT(*)::int AS total
        FROM "Session" s
        WHERE ${where} AND s."resultProfile" IS NOT NULL
        GROUP BY 1
      `,
    ),
    prisma.$queryRaw<{ day: string; sessions: number; optins: number }[]>(
      Prisma.sql`
        SELECT to_char(
                 date_trunc('day', s."startedAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Paris'),
                 'YYYY-MM-DD'
               ) AS day,
               COUNT(*)::int AS sessions,
               COUNT(*) FILTER (WHERE s."optedIn")::int AS optins
        FROM "Session" s
        WHERE ${where}
        GROUP BY 1
        ORDER BY 1
      `,
    ),
    prisma.session.findMany({
      where: { utmSource: { not: null } },
      select: { utmSource: true },
      distinct: ['utmSource'],
      take: 50,
    }),
    prisma.session.findMany({
      where: { device: { not: null } },
      select: { device: true },
      distinct: ['device'],
      take: 10,
    }),
    prisma.lead.count({
      where: { createdAt: { gte: filters.from, lte: filters.to } },
    }),
    prisma.lead.count({
      where: { mailerliteOk: false, createdAt: { gte: filters.from, lte: filters.to } },
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: { email: true, prenom: true, profile: true, createdAt: true, mailerliteOk: true },
    }),
  ])

  const totals = totalsRow[0] ?? { sessions: 0, completed: 0, optins: 0 }

  const sessionsForStep = (type: string, questionId?: string) =>
    stepRows.find(
      (row) => row.type === type && (questionId ? row.question_id === questionId : true),
    )?.sessions ?? 0

  // Entonnoir : depart, chaque question, formulaire, opt-in, resultat.
  const rawSteps: { key: string; label: string; sessions: number }[] = [
    { key: 'start', label: 'Quiz démarré', sessions: totals.sessions },
    ...questions.map((question) => ({
      key: question.id,
      label: `Q${question.order}`,
      sessions: sessionsForStep('question_view', question.id),
    })),
    { key: 'lead_gate', label: 'Formulaire vu', sessions: sessionsForStep('lead_gate_view') },
    { key: 'opt_in', label: 'Email laissé', sessions: sessionsForStep('opt_in_submit') },
    { key: 'result', label: 'Résultat vu', sessions: sessionsForStep('result_view') },
  ]

  const startCount = rawSteps[0].sessions
  const funnel: FunnelStep[] = rawSteps.map((step, index) => {
    const previous = index === 0 ? step.sessions : rawSteps[index - 1].sessions
    const drop = Math.max(previous - step.sessions, 0)
    return {
      ...step,
      shareOfStart: rate(step.sessions, startCount),
      dropFromPrevious: index === 0 ? 0 : drop,
      dropRate: index === 0 ? 0 : rate(drop, previous),
    }
  })

  const questionStats: QuestionStat[] = questions.map((question) => {
    const views = sessionsForStep('question_view', question.id)
    const answered = sessionsForStep('question_answer', question.id)
    const backs =
      stepRows.find((row) => row.type === 'question_back' && row.question_id === question.id)
        ?.events ?? 0
    const abandons = sessionsForStep('abandon', question.id)
    const avg = timeRows.find((row) => row.question_id === question.id)?.avg_seconds ?? null

    const answersForQuestion = answerRows.filter((row) => row.question_id === question.id)
    const totalAnswers = answersForQuestion.reduce((sum, row) => sum + row.sessions, 0)

    return {
      id: question.id,
      order: question.order,
      title: question.title,
      views,
      answered,
      backs,
      abandons,
      avgSeconds: avg === null ? null : Math.round(avg * 10) / 10,
      options: question.options.map((option) => {
        const sessions =
          answersForQuestion.find((row) => row.answer_value === option.value)?.sessions ?? 0
        return {
          value: option.value,
          label: option.label,
          sessions,
          share: rate(sessions, totalAnswers),
        }
      }),
    }
  })

  const profileTotal = profileRows.reduce((sum, row) => sum + row.total, 0)
  const profiles = PROFILE_KEYS.map((key) => {
    const total = profileRows.find((row) => row.profile === key)?.total ?? 0
    return {
      key,
      label: quiz.profiles[key].group,
      profileLabel: quiz.profiles[key].label,
      total,
      share: rate(total, profileTotal),
    }
  }).sort((a, b) => b.total - a.total)

  const resultViews = sessionsForStep('result_view')

  return {
    available: true,
    totals: {
      sessions: totals.sessions,
      completed: resultViews,
      optIns: totals.optins,
      leads: leadTotals,
      leadsNotSynced,
      completionRate: rate(resultViews, totals.sessions),
      optInRate: rate(totals.optins, sessionsForStep('lead_gate_view')),
    },
    funnel,
    questionStats,
    profiles,
    daily: dailyRows.map((row) => ({ day: row.day, sessions: row.sessions, optIns: row.optins })),
    filterOptions: {
      utmSources: utmRows
        .map((row) => row.utmSource)
        .filter((value): value is string => Boolean(value))
        .sort(),
      devices: deviceRows
        .map((row) => row.device)
        .filter((value): value is string => Boolean(value))
        .sort(),
    },
    recentLeads: recentLeads.map((lead) => ({
      email: lead.email,
      prenom: lead.prenom,
      profile: lead.profile,
      createdAt: lead.createdAt,
      synced: lead.mailerliteOk,
    })),
  }
}
