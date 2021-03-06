import { useState, useEffect } from 'react'
import { Metric } from '../../dataHub/metrics'

const ALERT_METRICS = [
  Metric.price_usd,
  Metric.daily_active_addresses,
  Metric.social_volume_total,
  Metric.exchange_balance,
  Metric.transaction_volume,
  Metric.volume_usd
]

const alertMetricsFilter = metric => ALERT_METRICS.includes(metric)

export function useAlertMetrics (metrics) {
  const [alertMetrics, setAlertMetrics] = useState([])

  useEffect(
    () => {
      setAlertMetrics(metrics.filter(alertMetricsFilter))
    },
    [metrics]
  )

  return alertMetrics
}
