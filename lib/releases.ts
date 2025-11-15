import type { ReleaseWindow } from '@prisma/client'

const shortDate = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
})

const longDate = new Intl.DateTimeFormat('en-PH', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-PH', {
  hour: 'numeric',
  minute: 'numeric',
})

export function getPrimaryReleaseWindow(windows: ReleaseWindow[] = []): ReleaseWindow | null {
  if (!windows?.length) {
    return null
  }

  return (
    windows.find((window) => window.status === 'ACTIVE') ??
    windows.find((window) => window.status === 'SCHEDULED') ??
    windows.find((window) => window.status === 'DRAFT') ??
    windows[0]
  )
}

export function humanizeReleaseStatus(status: ReleaseWindow['status']): string {
  switch (status) {
    case 'ACTIVE':
      return 'Live now'
    case 'SCHEDULED':
      return 'Opens soon'
    case 'CLOSED':
      return 'Closed'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return 'Upcoming'
  }
}

type FormatReleaseLabelOptions = {
  fallbackDate?: Date | null
  style?: 'short' | 'long'
}

export function formatReleaseLabel(
  windows: ReleaseWindow[] = [],
  options: FormatReleaseLabelOptions = {},
): string | null {
  const window = getPrimaryReleaseWindow(windows)
  const formatter = options.style === 'long' ? longDate : shortDate

  if (window) {
    const date = formatter.format(window.startsAt)
    const statusCopy = humanizeReleaseStatus(window.status)
    return `${date} • ${statusCopy}`
  }

  if (options.fallbackDate) {
    return `${formatter.format(options.fallbackDate)} • Available`
  }

  return null
}

export function formatWindowRange(window: ReleaseWindow): string {
  const startDate = longDate.format(window.startsAt)
  const endDate = window.endsAt ? longDate.format(window.endsAt) : null

  if (endDate && endDate !== startDate) {
    return `${startDate} — ${endDate}`
  }

  const startTime = timeFormatter.format(window.startsAt)
  const endTime = window.endsAt ? timeFormatter.format(window.endsAt) : null

  if (endTime) {
    return `${startDate} • ${startTime} – ${endTime}`
  }

  return `${startDate} • ${startTime}`
}
