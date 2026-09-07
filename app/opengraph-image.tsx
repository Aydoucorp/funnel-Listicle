import { ImageResponse } from 'next/og'
import { quiz } from '@/lib/quiz'

export const alt = quiz.meta.quizTitle
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Image de partage (Instagram, Messenger, WhatsApp). Palette de la DA uniquement.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#f6f2e8',
          padding: '72px 88px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#6a7688',
          }}
        >
          {quiz.meta.brand}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 76,
            lineHeight: 1.1,
            color: '#1f3350',
            maxWidth: 940,
          }}
        >
          {quiz.meta.quizTitle}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 34,
            fontSize: 32,
            color: '#3a4a63',
            maxWidth: 880,
          }}
        >
          Un petit diagnostic doux en {quiz.meta.estimatedTime}, avec un guide offert à la fin.
        </div>

        <div style={{ display: 'flex', marginTop: 44, alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              width: 120,
              height: 10,
              borderRadius: 999,
              backgroundColor: '#3f77b0',
            }}
          />
          <div
            style={{
              display: 'flex',
              width: 60,
              height: 10,
              marginLeft: 10,
              borderRadius: 999,
              backgroundColor: '#8bb28a',
            }}
          />
        </div>
      </div>
    ),
    size,
  )
}
