'use client'

import { useEffect } from 'react'

const NOISY_MESSAGES = [
  'The width(-1) and height(-1) of chart should be greater than 0',
  '<ellipse> attribute rx: A negative value is not valid.',
  'Using DEFAULT root logger',
]

function shouldSuppress(args: unknown[]): boolean {
  const text = args
    .map((item) => {
      if (typeof item === 'string') return item
      if (item instanceof Error) return item.message
      if (item && typeof item === 'object' && 'message' in (item as any)) {
        return String((item as any).message)
      }
      return ''
    })
    .join(' ')

  return NOISY_MESSAGES.some((message) => text.includes(message))
}

export default function ConsoleNoiseFilter() {
  useEffect(() => {
    const originalError = console.error
    const originalWarn = console.warn

    console.error = (...args: unknown[]) => {
      if (shouldSuppress(args)) return
      originalError(...args)
    }

    console.warn = (...args: unknown[]) => {
      if (shouldSuppress(args)) return
      originalWarn(...args)
    }

    return () => {
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  return null
}
