import React, { useState, useEffect } from 'react'
import Sidebar from '../Studio/Sidebar'
import { Metric } from '../dataHub/metrics'
import { newChartWidget } from './Widget/ChartWidget'
import { newHolderDistributionWidget } from './Widget/HolderDistributionWidget'
import SelectionOverview from './SelectionOverview'
import Main from './Main'
import { getNewInterval, INTERVAL_ALIAS } from '../SANCharts/IntervalSelector'
import styles from './index.module.scss'
import { DEFAULT_SETTINGS } from '../Studio/defaults'

export const DEFAULT_WIDGETS = [newChartWidget()]

export const Studio = ({
  defaultWidgets,
  defaultSidepanel,
  defaultSettings = DEFAULT_SETTINGS,
  extensions,
}) => {
  const [widgets, setWidgets] = useState(defaultWidgets)
  const [settings, setSettings] = useState(defaultSettings)
  const [sidepanel, setSidepanel] = useState(defaultSidepanel)
  const [selectedMetrics, setSelectedMetrics] = useState([])

  function toggleSidepanel(key) {
    setSidepanel(sidepanel === key ? undefined : key)
  }

  function deleteWidget(widget) {
    console.log(widget)
    setWidgets(widgets.filter((w) => w !== widget))
  }

  function toggleWidgetMetric(widget, metric) {
    const metrics = deduceMetrics(widget.metrics, metric)

    if (metrics.length === 0) {
      deleteWidget(widget)
    } else {
      widget.metrics = metrics
      setWidgets([...widgets])
    }
  }

  function toggleSelectionMetric(metric) {
    setSelectedMetrics(deduceMetrics(selectedMetrics, metric))
  }

  function deduceMetrics(metrics, metric) {
    const newMetrics = new Set(metrics)

    if (newMetrics.has(metric)) {
      newMetrics.delete(metric)
    } else {
      newMetrics.add(metric)
    }

    return [...newMetrics]
  }

  function changeTimePeriod(from, to, timeRange) {
    const interval = getNewInterval(from, to)

    setSettings((state) => ({
      ...state,
      timeRange,
      interval: INTERVAL_ALIAS[interval] || interval,
      from: from.toISOString(),
      to: to.toISOString(),
    }))
  }

  function onSidebarItemClick(item) {
    const { type, key } = item

    if (type === 'sidepanel') {
      toggleSidepanel(key)
    } else if (type === 'widget') {
      console.log('this is widget')

      if (key === 'holder_distribution') {
        setWidgets([
          ...widgets,
          newHolderDistributionWidget({
            scrollIntoViewOnMount: true,
          }),
        ])
      }
    } else {
      toggleSelectionMetric(item)
    }
  }

  function onWidgetClick(widget) {
    const newMetrics = new Set([...widget.metrics, ...selectedMetrics])

    widget.metrics = [...newMetrics]

    setWidgets([...widgets])
  }

  function onNewChartClick() {
    setWidgets([...widgets, newChartWidget({ metrics: selectedMetrics })])
  }

  function onOverviewClose() {
    setSelectedMetrics([])
  }

  return (
    <div className={styles.wrapper}>
      <Sidebar
        slug='bitcoin'
        options={{}}
        activeMetrics={selectedMetrics}
        toggleMetric={onSidebarItemClick}
      />
      <main className={styles.main}>
        <Main
          widgets={widgets}
          settings={settings}
          options={{}}
          sidepanel={sidepanel}
          // fn
          setSettings={setSettings}
          changeTimePeriod={changeTimePeriod}
          toggleWidgetMetric={toggleWidgetMetric}
          toggleSidepanel={toggleSidepanel}
          deleteWidget={deleteWidget}
        />

        {selectedMetrics.length ? (
          <SelectionOverview
            widgets={widgets}
            selectedMetrics={selectedMetrics}
            toggleMetric={toggleSelectionMetric}
            onClose={onOverviewClose}
            onWidgetClick={onWidgetClick}
            onNewChartClick={onNewChartClick}
          />
        ) : null}
      </main>
      {React.Children.map(extensions, (extension) =>
        React.cloneElement(extension, { widgets, settings, sidepanel }),
      )}
    </div>
  )
}

export default Studio
