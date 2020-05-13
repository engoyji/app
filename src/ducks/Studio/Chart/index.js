import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { linearScale, logScale } from '@santiment-network/chart/scales'
import ChartPaywallInfo from './PaywallInfo'
import ChartActiveMetrics from './ActiveMetrics'
import ChartFullscreenBtn from './ChartFullscreenBtn'
import ChartSidepane from './Sidepane'
import IcoPrice from './IcoPrice'
import LastDayPrice from './LastDayPrice'
import SharedAxisToggle from './SharedAxisToggle'
import ChartMetricsExplanation, {
  filterExplainableMetrics,
} from './Sidepane/MetricsExplanation'
import { METRICS_EXPLANATION_PANE } from './Sidepane/panes'
import { TOP_HOLDER_METRICS } from './Sidepane/TopHolders/metrics'
import Chart from '../../Chart'
import Signals from '../../Chart/Signals'
import Synchronizer from '../../Chart/Synchronizer'
import { useDomainGroups } from '../../Chart/hooks'
import { useChartColors } from '../../Chart/colors'
import { checkIsLoggedIn } from '../../../pages/UserSelectors'
import styles from './index.module.scss'
import RChart from '../../RChart'
import Lines from '../../RChart/Lines'
import CartesianGrid from '../../RChart/CartesianGrid'
import Tooltip from '../../RChart/Tooltip'
import Brush from '../../RChart/Brush'
import { CHART_PADDING, CHART_WITH_BRUSH_PADDING } from '../../Chart/settings'

const Canvas = ({
  index,
  className,
  chartRef,
  settings,
  options,
  loadings,
  eventLoadings,
  metrics,
  activeEvents,
  boundaries,
  advancedView,
  chartSidepane,
  toggleMetric,
  toggleChartSidepane,
  changeHoveredDate,
  changeDatesRange,
  isMultiChartsActive,
  syncedTooltipDate,
  isAnon,
  isSidebarClosed,
  setIsICOPriceDisabled,
  ...props
}) => {
  const [isDomainGroupingActive, setIsDomainGroupingActive] = useState()
  const [FocusedMetric, setFocusedMetric] = useState()
  const MetricColor = useChartColors(metrics, FocusedMetric)
  const domainGroups = useDomainGroups(metrics)

  const isBlurred = isAnon && index > 1
  const hasExplanaibles = filterExplainableMetrics(metrics).length > 0
  const scale = options.isLogScale ? logScale : linearScale

  useEffect(
    () => {
      if (chartSidepane === METRICS_EXPLANATION_PANE && !hasExplanaibles) {
        toggleChartSidepane()
      }
    },
    [hasExplanaibles],
  )

  useEffect(onMetricHoverEnd, [metrics])

  function onMetricHover(metric) {
    setFocusedMetric(metric)
  }

  function onMetricHoverEnd() {
    setFocusedMetric()
  }

  return (
    <div
      className={cx(
        styles.wrapper,
        chartSidepane && styles.wrapper_explained,
        className,
      )}
    >
      <div className={cx(styles.top, isBlurred && styles.blur)}>
        <div className={styles.metrics}>
          <ChartActiveMetrics
            className={styles.metric}
            MetricColor={MetricColor}
            activeMetrics={metrics.filter(
              (metric) => !TOP_HOLDER_METRICS.includes(metric),
            )}
            activeEvents={activeEvents}
            toggleMetric={toggleMetric}
            loadings={loadings}
            eventLoadings={eventLoadings}
            isMultiChartsActive={isMultiChartsActive}
            onMetricHover={onMetricHover}
            onMetricHoverEnd={onMetricHoverEnd}
          />
        </div>

        <div className={styles.meta}>
          <ChartPaywallInfo boundaries={boundaries} metrics={metrics} />
          {domainGroups && (
            <SharedAxisToggle
              isDomainGroupingActive={isDomainGroupingActive}
              setIsDomainGroupingActive={setIsDomainGroupingActive}
            />
          )}
          {hasExplanaibles && (
            <ChartMetricsExplanation.Button
              className={styles.explain}
              onClick={toggleChartSidepane}
            />
          )}
          <ChartFullscreenBtn
            {...props}
            options={options}
            settings={settings}
            MetricColor={MetricColor}
            metrics={metrics}
            activeEvents={activeEvents}
            scale={scale}
          />
        </div>
      </div>

      <RChart
        {...props}
        height={500}
        scale={scale}
        MetricColor={MetricColor}
        padding={isMultiChartsActive ? CHART_PADDING : CHART_WITH_BRUSH_PADDING}
      >
        {isMultiChartsActive || <Brush />}
        <Tooltip onPointClick={advancedView ? changeHoveredDate : undefined} />
        <Lines lines={props.lines} />
        <CartesianGrid />
      </RChart>

      <Chart
        {...options}
        {...settings}
        {...props}
        chartRef={chartRef}
        className={cx(styles.chart, isBlurred && styles.blur)}
        MetricColor={MetricColor}
        metrics={metrics}
        scale={scale}
        domainGroups={isDomainGroupingActive ? domainGroups : undefined}
        isMultiChartsActive={isMultiChartsActive}
        syncedTooltipDate={isBlurred || syncedTooltipDate}
        onPointClick={advancedView ? changeHoveredDate : undefined}
        onRangeSelect={
          advancedView === 'Spent Coin Cost' ? changeDatesRange : undefined
        }
        resizeDependencies={[
          MetricColor,
          isMultiChartsActive,
          advancedView,
          chartSidepane,
          isSidebarClosed,
        ]}
      >
        <IcoPrice
          {...settings}
          {...options}
          metrics={metrics}
          className={styles.ico}
          onResult={(price) => setIsICOPriceDisabled(!price)}
        />
        <LastDayPrice settings={settings} metrics={metrics} />
        <Signals {...settings} metrics={metrics} />
      </Chart>

      {isBlurred && (
        <div className={styles.restriction}>
          <Link to='/login' className={styles.restriction__link}>
            Sign in
          </Link>{' '}
          to unlock all Santiment Chart features
        </div>
      )}

      {chartSidepane && (
        <div className={styles.explanation}>
          <ChartSidepane
            {...props}
            {...settings}
            chartSidepane={chartSidepane}
            metrics={metrics}
            MetricColor={MetricColor}
            toggleMetric={toggleMetric}
            toggleChartSidepane={toggleChartSidepane}
          />
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  isAnon: !checkIsLoggedIn(state),
})

export default connect(mapStateToProps)(
  ({ options, events, activeMetrics, ...rest }) => {
    return (
      <Synchronizer {...options} metrics={activeMetrics} events={events}>
        <Canvas
          options={options}
          events={events}
          activeMetrics={activeMetrics}
          {...rest}
        />
      </Synchronizer>
    )
  },
)
