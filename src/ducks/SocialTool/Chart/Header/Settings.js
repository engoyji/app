import React from 'react'
import cx from 'classnames'
import AdvancedCalendar from '../../../../components/AdvancedCalendar'
import ContextMenu from '../../../Studio/Chart/ContextMenu'
import PricePairsDropdown from '../PricePairsDropdown'
import { getIntervalByTimeRange } from '../../../../utils/dates'
import styles from './Settings.module.scss'

const TIMERANGE_OPTIONS = [
  {
    index: '1w',
    label: 'Last week'
  },
  {
    index: '1m',
    label: 'Last month'
  },
  {
    index: '3m',
    label: 'Last 3 months'
  },
  {
    index: '6m',
    label: 'Last 6 months'
  },
  {
    index: '1y',
    label: 'Last year'
  },
  {
    index: 'all',
    label: 'All time'
  }
]

export default ({
  settings,
  options,
  setOptions,
  setSettings,
  changeTimePeriod,
  className,
  ...rest
}) => {
  const { timeRange = '', from, to, title } = settings

  function onTimerangeChange (timeRange) {
    const { from, to } = getIntervalByTimeRange(timeRange.toLowerCase())
    changeTimePeriod(from, to, timeRange)
  }

  function onCalendarChange ([from, to]) {
    changeTimePeriod(from, to)
  }

  return (
    <div className={cx(styles.wrapper, className)}>
      <AdvancedCalendar
        className={styles.calendar}
        from={new Date(from)}
        to={new Date(to)}
        timeRange={timeRange}
        options={TIMERANGE_OPTIONS}
        onCalendarChange={onCalendarChange}
        onTimerangeChange={onTimerangeChange}
      />
      <PricePairsDropdown
        {...rest}
        settings={settings}
        setSettings={setSettings}
      />
      <ContextMenu
        title={title}
        showMulti={false}
        showNightModeToggle={false}
        showDownload
        setOptions={setOptions}
        {...options}
        {...rest}
      />
    </div>
  )
}
