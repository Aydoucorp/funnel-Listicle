// Le scoring vit cote serveur. Le navigateur ne decide jamais du profil.
import { PROFILE_KEYS, ProfileKey, questions, quiz } from '@/lib/quiz'

export type QuizAnswers = Record<string, string[]>

export type ScoreDetail = {
  profile: ProfileKey
  scores: Record<ProfileKey, number>
}

export function computeScores(answers: QuizAnswers): Record<ProfileKey, number> {
  const scores = Object.fromEntries(PROFILE_KEYS.map((k) => [k, 0])) as Record<ProfileKey, number>

  for (const question of questions) {
    const selected = answers[question.id]
    if (!Array.isArray(selected)) continue

    for (const value of selected) {
      const option = question.options.find((o) => o.value === value)
      if (!option) continue
      for (const [profile, points] of Object.entries(option.points)) {
        if ((PROFILE_KEYS as readonly string[]).includes(profile) && typeof points === 'number') {
          scores[profile as ProfileKey] += points
        }
      }
    }
  }

  return scores
}

export function computeProfile(answers: QuizAnswers): ScoreDetail {
  const scores = computeScores(answers)
  const tieBreak = quiz.scoring.tieBreakOrder

  let winner: ProfileKey = tieBreak[0]
  let best = -1

  for (const profile of tieBreak) {
    if (scores[profile] > best) {
      best = scores[profile]
      winner = profile
    }
  }

  return { profile: winner, scores }
}
