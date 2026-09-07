'use client'

import { useEffect } from 'react'
import { track } from '@/lib/track'

export function ResultViewTracker() {
  useEffect(() => {
    void track('result_view')
  }, [])
  return null
}
