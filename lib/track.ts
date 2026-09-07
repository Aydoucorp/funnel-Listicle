'use client'

// Tracking cote client : toujours non bloquant. Aucune donnee personnelle n'y transite.
export type EventType =
  | 'quiz_start'
  | 'question_view'
  | 'question_answer'
  | 'question_back'
  | 'lead_gate_view'
  | 'opt_in_submit'
  | 'result_view'
  | 'abandon'

const STORAGE_KEY = 'qms_session_id'
const ENDPOINT = '/api/event'

let pendingStart: Promise<string | null> | null = null
let abandonSent = false

export function getStoredSessionId(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function storeSessionId(id: string) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* navigation privee : on continue sans memoriser */
  }
}

function collectContext() {
  const params = new URLSearchParams(window.location.search)
  const ua = window.navigator.userAgent
  const device = /Mobi|Android|iPhone|iPad|iPod/i.test(ua)
    ? /iPad|Tablet/i.test(ua)
      ? 'tablet'
      : 'mobile'
    : 'desktop'

  return {
    device,
    referrer: document.referrer ? document.referrer.slice(0, 300) : undefined,
    utmSource: params.get('utm_source')?.slice(0, 120) || undefined,
    utmMedium: params.get('utm_medium')?.slice(0, 120) || undefined,
    utmCampaign: params.get('utm_campaign')?.slice(0, 120) || undefined,
  }
}

/** Cree la session cote serveur (au quiz_start) ou reutilise celle de l'onglet. */
export function startSession(): Promise<string | null> {
  const existing = getStoredSessionId()
  if (existing) return Promise.resolve(existing)
  if (pendingStart) return pendingStart

  pendingStart = fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'quiz_start', context: collectContext() }),
    keepalive: true,
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { sessionId?: string } | null) => {
      if (data?.sessionId) {
        storeSessionId(data.sessionId)
        return data.sessionId
      }
      return null
    })
    .catch(() => null)

  return pendingStart
}

export async function track(
  type: EventType,
  detail?: { questionId?: string; answerValue?: string },
): Promise<void> {
  try {
    const sessionId = getStoredSessionId() ?? (await startSession())
    if (!sessionId || type === 'quiz_start') return

    await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, sessionId, ...detail }),
      keepalive: true,
    })
  } catch {
    /* le tracking ne doit jamais casser l'experience */
  }
}

/** Envoye quand la personne quitte sans finir. Une seule fois par session. */
export function trackAbandon(detail?: { questionId?: string }): void {
  if (abandonSent) return
  const sessionId = getStoredSessionId()
  if (!sessionId) return
  abandonSent = true

  const body = JSON.stringify({ type: 'abandon', sessionId, ...detail })
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))
      return
    }
  } catch {
    /* on retombe sur fetch */
  }
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}

export function cancelAbandon(): void {
  abandonSent = true
}
