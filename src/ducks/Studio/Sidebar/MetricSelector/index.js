import React, { useMemo } from 'react'
import Category from '../Category'
import { TopHolderMetric } from '../../Chart/Sidepanel/HolderDistribution/metrics'

const MetricSelector = ({ categories = {}, availableMetrics, ...rest }) => {
  const hasTopHolders = useMemo(
    () =>
      availableMetrics.includes(
        TopHolderMetric.holders_distribution_1_to_10.key
      ),
    [availableMetrics]
  )

  return Object.keys(categories).map(key => (
    <Category
      key={key}
      title={key}
      groups={categories[key]}
      hasTopHolders={key === 'On-chain' && hasTopHolders}
      {...rest}
    />
  ))
}

export default MetricSelector
