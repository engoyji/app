export const MAX_LIMIT = 15

export const CURSOR_TYPES = {
  before: 'BEFORE',
  after: 'AFTER'
}

export const makeVariables = (
  date,
  limit = MAX_LIMIT,
  type = CURSOR_TYPES.before
) => ({
  limit,
  cursor: {
    type,
    datetime: date
  }
})

export const makeFeedVariables = (
  date,
  limit = MAX_LIMIT,
  type = CURSOR_TYPES.before
) => ({
  limit,
  cursor: {
    type,
    datetime: date
  }
})

export const extractEventsFromData = data => {
  const { timelineEvents } = data
  const [first] = timelineEvents
  const { events } = first
  return events.filter(
    ({ post, payload, trigger }) => post || (trigger && payload)
  )
}

export const isBottom = el =>
  el.getBoundingClientRect().bottom <= 1.5 * window.innerHeight
