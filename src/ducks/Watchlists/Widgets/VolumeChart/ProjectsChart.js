import React, { useState, useEffect } from 'react'
import memoize from 'lodash.memoize'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import PageLoader from '../../../../components/Loader/PageLoader'
import ChartTooltip from '../../../SANCharts/tooltip/CommonChartTooltip'
import Range from '../WatchlistOverview/Range'
import styles from './ProjectsChart.module.scss'
import { useProjectPriceChanges } from '../../../../hooks/project'

export const getSorter = memoize(key => (a, b) => +b[key] - +a[key])

export const useProjectRanges = ({
  assets,
  ranges,
  limit,
  sortByKey = 'marketcapUsd'
}) => {
  const [mapAssets, setMapAssets] = useState({})
  const [intervalIndex, setIntervalIndex] = useState(
    Math.min(ranges.length - 1, 1)
  )

  useEffect(
    () => {
      const newMap = {}

      assets.forEach(({ slug }) => {
        newMap[slug] = true
      })

      setMapAssets(newMap)
    },
    [assets]
  )

  const { label, key } = ranges[intervalIndex]

  const sorter = getSorter(sortByKey)

  const [data, loading] = useProjectPriceChanges({
    mapAssets,
    key,
    limit,
    sorter
  })

  return [data, loading, { intervalIndex, setIntervalIndex, label, key }]
}

export const RANGES = [
  {
    label: '1h',
    key: 'percentChange1h'
  },
  {
    label: '24h',
    key: 'percentChange24h'
  },
  {
    label: '7d',
    key: 'percentChange7d'
  }
]

const ProjectsChart = ({ assets }) => {
  const [
    data,
    loading,
    { intervalIndex, setIntervalIndex, label, key }
  ] = useProjectRanges({
    assets,
    limit: 100,
    ranges: RANGES,
    sortByKey: 'marketcapUsd'
  })
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div>Bar chart: Price changes, %</div>
        <div className={styles.selector}>
          <Range
            range={label}
            changeRange={() => {
              setIntervalIndex((intervalIndex + 1) % RANGES.length)
            }}
          />
        </div>
      </div>

      <div className={styles.chartWrapper}>
        {loading ? (
          <PageLoader />
        ) : (
          <div className={styles.chart}>
            <ResponsiveContainer width='100%' height='100%'>
              <ComposedChart
                data={data}
                margin={{ top: 8, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke='var(--athens)' />

                <YAxis
                  dataKey={key}
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  fontWeight={500}
                  stroke={'var(--casper)'}
                  tickCount={8}
                />

                <Bar dataKey={key} fill='var(--dodger-blue)' />

                <XAxis
                  dataKey='slug'
                  minTickGap={0}
                  interval={0}
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                  angle={-90}
                  height={135}
                  fontSize={12}
                  fontWeight={500}
                  textAnchor='end'
                  verticalAnchor='end'
                  stroke={'var(--fiord)'}
                />

                <Tooltip
                  content={
                    <ChartTooltip
                      labelFormatter={data => {
                        return data
                      }}
                      valueFormatter={({ value }) => {
                        return value + ' %'
                      }}
                      showValueLabel={false}
                    />
                  }
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsChart