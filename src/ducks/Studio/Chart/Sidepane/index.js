import React from 'react'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import { TOP_HOLDERS_PANE, METRICS_EXPLANATION_PANE } from './panes'
import TopHolders from './TopHolders'
import MetricsExplanation from './MetricsExplanation'
import styles from './index.module.scss'

const Components = {
  [TOP_HOLDERS_PANE]: TopHolders,
  [METRICS_EXPLANATION_PANE]: MetricsExplanation,
}

const CloseButton = (props) => (
  <div className={styles.close} {...props}>
    <div className={styles.icons}>
      <Icon type='hamburger' className={styles.hamburger} />
      <Icon type='arrow-right' className={styles.arrow} />
    </div>
  </div>
)

export default ({
  className,
  chartSidepane,
  toggleChartSidepane,
  ...props
}) => {
  const El = Components[chartSidepane]

  if (!El) {
    toggleChartSidepane()
    return null
  }

  return (
    <div className={cx(styles.wrapper, className)}>
      <CloseButton onClick={toggleChartSidepane} />
      <div className={styles.content}>
        {El.Title && (
          <div className={styles.title}>
            <El.Title {...props} />
          </div>
        )}
        <El {...props} />
      </div>
    </div>
  )
}
