import { getDateFormats, getTimeFormats } from '../../utils/dates'
import { millify } from '../../utils/formatting'

const LARGE_NUMBER_THRESHOLD = 99999

export const TooltipSetting = {
  datetime: {
    formatter: value => {
      const date = new Date(value)
      const { HH, mm } = getTimeFormats(date)
      const { MMMM, DD, YYYY } = getDateFormats(date)
      return `${HH}:${mm}, ${MMMM} ${DD}, ${YYYY}`
    }
  },
  isAnomaly: {
    label: 'Anomaly',
    formatter: v => v
  }
}

export function FORMATTER (value) {
  if (!value && typeof value !== 'number') {
    return 'No data'
  }

  if (value > LARGE_NUMBER_THRESHOLD) {
    return millify(value, 2)
  }

  if (value < 1) {
    return value.toFixed(6)
  }

  return Number.isInteger(value) ? value : value.toFixed(2)
}

export function updateTooltipSettings (metrics) {
  const { length } = metrics

  for (let i = 0; i < length; i++) {
    const metric = metrics[i]
    const { key, dataKey = key, formatter = FORMATTER, label } = metric

    metric.formatter = formatter
    TooltipSetting[dataKey] = {
      label,
      formatter
    }
  }
}
