import React, { useState } from 'react'
import cx from 'classnames'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { DailyActiveAddressesGQL } from '../gqlWrappers/DetailedGQL'
import { SOCIAL_VOLUME_QUERY } from '../../../ducks/GetTimeSeries/queries/social_volume_query'
import { NEWS_QUERY } from '../../../components/News/NewsGQL'
import { calcPercentageChange } from '../../../utils/utils'
import {
  DAY,
  getTimeIntervalFromToday,
  getIntervalByTimeRange
} from '../../../utils/dates'
import { getInterval } from './utils'
import { Metrics, compatabilityMap } from '../../../ducks/SANCharts/data'
import MobileHeader from '../../../components/MobileHeader/MobileHeader'
import NewsSmall from '../../../components/News/NewsSmall'
import PageLoader from '../../../components/Loader/PageLoader'
import MobileMetricCard from '../../../components/MobileMetricCard/MobileMetricCard'
import GetAsset from '../gqlWrappers/GetAsset'
import GetTimeSeries from '../../../ducks/GetTimeSeries/GetTimeSeries'
import MobileAssetChart from './MobileAssetChart'
import Title from './MobileAssetTitle'
import PriceBlock from './MobileAssetPriceInfo'
import MobileAssetChartSelector from './MobileAssetChartSelector'
import MobileFullscreenChart from './MobileFullscreenChart'
import ShowIf from '../../../components/ShowIf'
import GetWatchlists from '../../../ducks/Watchlists/GetWatchlists'
import WatchlistsPopup from '../../../components/WatchlistPopup/WatchlistsPopup'
import { addRecentAssets } from '../../../utils/recent'
import styles from './MobileDetailedPage.module.scss'

const MobileDetailedPage = props => {
  const slug = props.match.params.slug
  const [timeRange, setTimeRange] = useState('6m')
  const [icoPricePos, setIcoPricePos] = useState(null)
  const [extraMetric, setExtraMetric] = useState()
  const [fullscreen, toggleFullscreen] = useState(false)

  addRecentAssets(slug)

  const toggleExtraMetric = toggledMetric => {
    if (extraMetric && toggledMetric.name === extraMetric.name) {
      setExtraMetric(undefined)
    } else {
      setExtraMetric(toggledMetric)
    }
  }

  const { from, to } = getIntervalByTimeRange(timeRange, { isMobile: true })

  const metrics = [
    {
      name: 'historyPrice',
      slug,
      from: from.toISOString(),
      to: to.toISOString(),
      interval: getInterval(timeRange)
    }
  ]

  const lastTwoDaysMetrics = [
    {
      name: 'transaction_volume',
      slug,
      timeRange: '2d',
      interval: '1d'
    }
  ]

  if (extraMetric) {
    const { alias } =
      Metrics[extraMetric.name] || compatabilityMap[extraMetric.name]
    const metric = { name: alias || extraMetric.name }
    if (extraMetric.name === 'devActivity') {
      metric.transform = 'movingAverage'
      metric.movingAverageIntervalBase = 7
    }
    metrics.push(Object.assign({}, metrics[0], metric))
  }

  return (
    <div className={cx('page', styles.wrapper)}>
      <GetAsset
        slug={slug}
        render={({ isLoading, slug, project }) => {
          if (isLoading) {
            return (
              <>
                <MobileHeader
                  showBack
                  title={<Title slug={slug} />}
                  goBack={props.history.goBack}
                />
                <PageLoader />
              </>
            )
          }

          return (
            <>
              <MobileHeader
                showBack
                title={<Title slug={project.name} ticker={project.ticker} />}
                goBack={props.history.goBack}
              />
              <div className={styles.main}>
                <GetTimeSeries
                  metrics={metrics}
                  render={({ historyPrice = {}, timeseries }) =>
                    historyPrice.isLoading ? (
                      'Loading...'
                    ) : (
                      <>
                        <PriceBlock {...project} />
                        {!fullscreen && (
                          <MobileAssetChart
                            data={timeseries}
                            slug={slug}
                            icoPrice={project.icoPrice}
                            icoPricePos={icoPricePos}
                            setIcoPricePos={setIcoPricePos}
                            extraMetric={extraMetric}
                          />
                        )}
                        <div className={styles.bottom}>
                          {!fullscreen && (
                            <MobileAssetChartSelector
                              onChangeTimeRange={value => {
                                setTimeRange(value)
                                setIcoPricePos(null)
                              }}
                              timeRange={timeRange}
                            />
                          )}
                          <MobileFullscreenChart
                            isOpen={fullscreen}
                            toggleOpen={toggleFullscreen}
                            project={project}
                            onChangeTimeRange={setTimeRange}
                            timeRange={timeRange}
                            data={timeseries}
                            slug={slug}
                            extraMetric={extraMetric}
                          />
                        </div>
                      </>
                    )
                  }
                />
                <GetTimeSeries
                  metrics={lastTwoDaysMetrics}
                  render={({ isLoading, timeseries = [] }) => {
                    let devActivityInfo
                    const { devActivity30, devActivity60 } = project
                    if (devActivity30 && devActivity60) {
                      const DADiff = calcPercentageChange(
                        devActivity60 * 2 - devActivity30,
                        devActivity30
                      )
                      devActivityInfo = {
                        metric: 'devActivity',
                        name: 'Development Activity',
                        value: devActivity30,
                        period: '30d',
                        changes: DADiff
                      }
                    }

                    let socialVolumeInfo
                    const { socialVolume } = props
                    if (socialVolume[0] && socialVolume[1]) {
                      const yesterdaySocialVolume = socialVolume[0]
                      const todaySocialVolume = socialVolume[1]
                      const SVDiff = calcPercentageChange(
                        yesterdaySocialVolume,
                        todaySocialVolume
                      )
                      socialVolumeInfo = {
                        name: 'Social Volume',
                        metric: 'socialVolume',
                        value: todaySocialVolume,
                        period: '24h',
                        changes: SVDiff
                      }
                    }

                    let activeAddressesInfo
                    const { dailyActiveAddresses } = props
                    if (
                      dailyActiveAddresses &&
                      dailyActiveAddresses.length === 2
                    ) {
                      const [
                        { activeAddresses: yesterdayActiveAddresses },
                        { activeAddresses: todayActiveAddresses }
                      ] = dailyActiveAddresses
                      const DAADiff = calcPercentageChange(
                        yesterdayActiveAddresses,
                        todayActiveAddresses
                      )
                      activeAddressesInfo = {
                        metric: 'daily_active_addresses',
                        name: 'Daily Active Addresses',
                        value: todayActiveAddresses,
                        period: '24h',
                        changes: DAADiff
                      }
                    }

                    let transactionVolumeInfo
                    if (timeseries.length > 1) {
                      const { transaction_volume: yesterdayTV } = timeseries[
                        timeseries.length - 2
                      ]
                      const { transaction_volume: todayTV } = timeseries[
                        timeseries.length - 1
                      ]
                      if (yesterdayTV && todayTV) {
                        const TVDiff = calcPercentageChange(
                          yesterdayTV,
                          todayTV
                        )
                        transactionVolumeInfo = {
                          metric: 'transaction_volume',
                          name: 'Transaction Volume',
                          value: todayTV,
                          period: '24h',
                          changes: TVDiff
                        }
                      }
                    }

                    const rest = {
                      slug,
                      from,
                      to,
                      onClick: toggleExtraMetric,
                      activeMetric: extraMetric
                    }
                    return (
                      <div className={styles.metrics}>
                        {activeAddressesInfo && (
                          <MobileMetricCard
                            {...activeAddressesInfo}
                            {...rest}
                          />
                        )}
                        {devActivityInfo && (
                          <MobileMetricCard {...devActivityInfo} {...rest} />
                        )}
                        {transactionVolumeInfo && (
                          <MobileMetricCard
                            {...transactionVolumeInfo}
                            measure={project.ticker}
                            {...rest}
                          />
                        )}
                        {socialVolumeInfo && (
                          <MobileMetricCard {...socialVolumeInfo} {...rest} />
                        )}
                      </div>
                    )
                  }}
                />
                <ShowIf news>
                  {props.news && props.news.length > 0 && (
                    <>
                      <h3 className={styles.news__heading}>News</h3>
                      <NewsSmall data={props.news} />
                    </>
                  )}
                </ShowIf>
              </div>
              <GetWatchlists
                render={({ isLoggedIn }) => (
                  <WatchlistsPopup
                    projectId={project.id}
                    slug={project.slug}
                    isLoggedIn={isLoggedIn}
                  />
                )}
              />
            </>
          )
        }}
      />
    </div>
  )
}

const enhance = compose(
  graphql(NEWS_QUERY, {
    options: ({ match }) => {
      const tag = match.params.slug
      const { from, to } = getTimeIntervalFromToday(-3, DAY)
      return {
        variables: { from, to, tag, size: 6 }
      }
    },
    props: ({ data: { news = [] } }) => ({ news: news.reverse() })
  }),
  graphql(SOCIAL_VOLUME_QUERY, {
    options: ({ match }) => {
      const { from, to } = getTimeIntervalFromToday(-2, DAY)
      const { slug } = match.params
      return {
        variables: {
          slug,
          from,
          to,
          interval: '1d'
        }
      }
    },
    props: ({
      data: {
        discordDiscussionSocialVolume: discord = [],
        proffesionalSocialVolume: prof = [],
        telegramChatsSocialVolume: telChats = [],
        telegramDiscussionSocialVolume: telDisscuss = []
      }
    }) => {
      const defaultVolume = { socialVolume: 0 }
      const socialVolume = [0, 0].map(
        (item, i) =>
          item +
          (discord[i] || defaultVolume).socialVolume +
          (prof[i] || defaultVolume).socialVolume +
          (telChats[i] || defaultVolume).socialVolume +
          (telDisscuss[i] || defaultVolume).socialVolume
      )
      return { socialVolume }
    }
  }),
  graphql(DailyActiveAddressesGQL, {
    options: ({ match }) => {
      const { slug } = match.params
      const { from, to } = getTimeIntervalFromToday(-1, DAY)
      return { variables: { from, to, slug } }
    },
    props: ({ data: { dailyActiveAddresses = [] } }) => ({
      dailyActiveAddresses
    })
  })
)

export default enhance(MobileDetailedPage)
