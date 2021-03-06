import React, { useEffect, useState } from 'react'
import { ResponsiveContainer, Tooltip, Treemap } from 'recharts'
import Range from '../WatchlistOverview/Range'
import { getSorter, useProjectRanges } from './ProjectsChart'
import { formatNumber } from '../../../../utils/formatting'
import Skeleton from '../../../../components/Skeleton/Skeleton'
import ChartTooltip from '../../../SANCharts/tooltip/CommonChartTooltip'
import ColorsExplanation, {
  COLOR_MAPS,
  getTreeMapColor
} from './ColorsExplanation'
import NoDataCharts from './NoDataCharts'
import ScreenerChartTitle from './ScreenerChartTitle'
import styles from './ProjectsChart.module.scss'

const RANGES = [
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

const getWordLength = (fontSize, word) => (fontSize - 3) * word.length + 8

export const formatProjectTreeMapValue = val =>
  val
    ? formatNumber(val, {
      maximumFractionDigits: 2,
      directionSymbol: true
    }) + '%'
    : null

const getFontSize = (index, length) => {
  if (index < length * 0.05) {
    return 16
  } else if (index < length * 0.1) {
    return 12
  } else if (index < length * 0.2) {
    return 10
  } else {
    return 8
  }
}

const mapToColors = (data, key) => {
  return data.map(item => {
    const value = +item[key]
    const color = getTreeMapColor(value)
    return {
      ...item,
      color
    }
  })
}

const useWithColors = (data, key) => {
  const [result, setResult] = useState([])

  useEffect(
    () => {
      const sorted = data.sort(getSorter(key))
      setResult(mapToColors(sorted, key))
    },
    [data.length, key]
  )

  return result
}

const MARKETCAP_USD_SORTER = getSorter('marketcapUsd')

const ProjectsTreeMap = ({
  assets,
  loading: assetsLoading,
  ranges,
  className
}) => {
  const [
    data,
    loading,
    { intervalIndex, setIntervalIndex, label, key }
  ] = useProjectRanges({
    assets,
    ranges,
    limit: 100,
    sortByKey: 'marketcapUsd'
  })

  const sortedByChange = useWithColors(data, key)
  const sortedByMarketcap = sortedByChange.sort(MARKETCAP_USD_SORTER)

  const noData = !assetsLoading && assets.length === 0
  const isLoading = loading || assetsLoading

  return (
    <div className={className}>
      <div className={styles.title}>
        <ScreenerChartTitle type='Treemap' title='Price Changes, %' />
        <Range
          className={styles.selector}
          range={label}
          changeRange={() => {
            setIntervalIndex(
              ranges.length === 1 ? 0 : (intervalIndex + 1) % RANGES.length
            )
          }}
        />
      </div>
      <Skeleton
        className={styles.treeMap__skeletonTop}
        show={isLoading}
        repeat={1}
      />
      <Skeleton
        className={styles.treeMap__skeletonBottom}
        show={isLoading}
        repeat={1}
      />
      {noData ? (
        <div className={styles.noDataTreeMap}>
          <NoDataCharts />
        </div>
      ) : !isLoading ? (
        <div className={styles.treeMap}>
          <ResponsiveContainer width='100%' height='100%'>
            <Treemap
              data={sortedByMarketcap}
              dataKey={'marketcapUsd'}
              fill='var(--jungle-green)'
              isAnimationActive={false}
              content={<CustomizedContent dataKey={key} />}
            >
              <Tooltip
                content={
                  <ChartTooltip
                    labelFormatter={(value, payload) => {
                      const data = payload[0]
                      if (data.payload) {
                        return data.payload.ticker
                      }
                    }}
                    showValueLabel={false}
                    valueFormatter={({ payload }) => {
                      const data = payload[0]
                      if (data.payload) {
                        return data.payload[key] + '%'
                      }
                    }}
                  />
                }
              />
            </Treemap>
          </ResponsiveContainer>

          <ColorsExplanation colorMaps={COLOR_MAPS} range={label} />
        </div>
      ) : null}
    </div>
  )
}

const CustomizedContent = props => {
  const {
    x,
    y,
    width,
    height,
    index,
    dataKey,
    root: { children }
  } = props

  if (!children) {
    return null
  }

  const item = children[index]
  const { ticker = '', color } = item
  const value = formatProjectTreeMapValue(item[dataKey])

  const fontSize = getFontSize(index, children.length)

  const tickerLength = getWordLength(fontSize, ticker)

  const showTicker = tickerLength < width
  const showChange = showTicker && fontSize * 2 + 5 < height

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: 'var(--white)',
          strokeWidth: 2
        }}
      />
      {showTicker && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (showChange ? 2 : -2)}
          textAnchor='middle'
          fill='var(--fiord)'
          fontSize={fontSize}
          fontWeight={500}
        >
          {ticker}
        </text>
      )}
      {showChange && (
        <text
          x={x + width / 2}
          y={y + height / 2 + fontSize - 1}
          textAnchor='middle'
          fill='var(--fiord)'
          fontSize={fontSize}
          fontWeight={500}
        >
          {value}
        </text>
      )}
    </g>
  )
}

export default ProjectsTreeMap
