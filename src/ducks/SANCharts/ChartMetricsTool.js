import React from 'react'
import cx from 'classnames'
import ContextMenu from '@santiment-network/ui/ContextMenu'
import Button from '@santiment-network/ui/Button'
import Icon from '@santiment-network/ui/Icon'
import ChartMetricSelector from './ChartMetricSelector'
import ChartActiveMetrics from './ChartActiveMetrics'
import styles from './ChartMetricsTool.module.scss'

const ChartMetricsTool = ({
  classes = {},
  activeMetrics,
  disabledMetrics,
  slug,
  toggleMetric
}) => (
  <div className={styles.wrapper}>
    <ContextMenu
      trigger={
        <Button variant='flat' className={styles.trigger} border>
          <Icon type='plus-round' />
        </Button>
      }
      passOpenStateAs='isActive'
      position='bottom'
      align='start'
      offsetY={8}
    >
      <ChartMetricSelector
        className={cx(styles.selector, classes.selector)}
        slug={slug}
        toggleMetric={toggleMetric}
        disabledMetrics={disabledMetrics}
        activeMetrics={activeMetrics}
        variant='modal'
      />
    </ContextMenu>

    <ChartActiveMetrics
      activeMetrics={activeMetrics}
      toggleMetric={toggleMetric}
    />
  </div>
)

export default ChartMetricsTool
