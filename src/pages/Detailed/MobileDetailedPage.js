import React, { useState } from 'react'
import cx from 'classnames'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { Label, Selector } from '@santiment-network/ui'
import { DailyActiveAddressesGQL } from './DetailedGQL'
import { TRANSACTION_VOLUME_QUERY } from '../../ducks/GetTimeSeries/queries/transaction_volume_query'
import { NEWS_QUERY } from '../../components/News/NewsGQL'
import { calcPercentageChange, capitalizeStr } from './../../utils/utils'
import { DAY, getTimeIntervalFromToday } from '../../utils/dates'
import { formatNumber } from './../../utils/formatting'
import MobileHeader from './../../components/MobileHeader/MobileHeader'
import PercentChanges from './../../components/PercentChanges'
import NewsSmall from '../../components/News/NewsSmall'
import PageLoader from '../../components/Loader/PageLoader'
import MobileMetricCard from '../../components/MobileMetricCard/MobileMetricCard'
import GetAsset from './GetAsset'
import GetTimeSeries from '../../ducks/GetTimeSeries/GetTimeSeries'
import MobileAssetChart from './MobileAssetChart'
import ShowIf from '../../components/ShowIf'
import GetWatchlists from '../../ducks/Watchlists/GetWatchlists'
import WatchlistsPopup from '../../components/WatchlistPopup/WatchlistsPopup'
import styles from './MobileDetailedPage.module.scss'

const MobileDetailedPage = props => {
  const slug = props.match.params.slug
  const [timeRange, setTimeRange] = useState('all')

  const timeRangeBlock = (
    <div className={styles.timeRangeBlock}>
      <Selector
        options={['1w', '1m', '3m', '6m', 'all']}
        onSelectOption={setTimeRange}
        defaultSelected={timeRange}
      />
    </div>
  )

  let transactionVolumeInfo
  const { transactionVolume } = props
  if (transactionVolume && transactionVolume.length === 48) {
    const yesterdayTransactionVolume = transactionVolume
      .slice(0, 24)
      .reduce((acc, { transactionVolume }) => acc + transactionVolume, 0)
    const todayTransactionVolume = transactionVolume
      .slice(-24)
      .reduce((acc, { transactionVolume }) => acc + transactionVolume, 0)
    const TVDiff = calcPercentageChange(
      yesterdayTransactionVolume,
      todayTransactionVolume
    )
    transactionVolumeInfo = {
      name: 'Transaction Volume',
      value: todayTransactionVolume,
      period: '24h',
      changes: TVDiff
    }
  }

  let activeAddressesInfo
  const { dailyActiveAddresses } = props
  if (dailyActiveAddresses && dailyActiveAddresses.length === 2) {
    const [
      { activeAddresses: yesterdayActiveAddresses },
      { activeAddresses: todayActiveAddresses }
    ] = dailyActiveAddresses
    const DAADiff = calcPercentageChange(
      yesterdayActiveAddresses,
      todayActiveAddresses
    )
    activeAddressesInfo = {
      metric: 'DAILY_ACTIVE_ADDRESSES',
      name: 'Daily Active Addresses',
      value: todayActiveAddresses,
      period: '24h',
      changes: DAADiff
    }
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

          const {
            ticker,
            percentChange24h,
            percentChange7d,
            devActivity30,
            devActivity60,
            priceUsd,
            icoPrice
          } = project

          let devActivityInfo
          if (devActivity30 && devActivity60) {
            const DADiff = calcPercentageChange(
              devActivity60 * 2 - devActivity30,
              devActivity30
            )
            devActivityInfo = {
              metric: 'DEV_ACTIVITY',
              name: 'Development Activity',
              value: devActivity30,
              period: '30d',
              changes: DADiff
            }
          }

          return (
            <>
              <MobileHeader
                showBack
                title={<Title slug={slug} ticker={ticker} />}
                goBack={props.history.goBack}
              />
              <GetWatchlists
                render={({ isLoggedIn }) => (
                  <WatchlistsPopup
                    projectId={project.id}
                    slug={project.slug}
                    isLoggedIn={isLoggedIn}
                  />
                )}
              />
              <div className={styles.main}>
                <PriceBlock
                  changes24h={percentChange24h}
                  changes7d={percentChange7d}
                  priceUsd={priceUsd}
                />
                {timeRangeBlock}
                <GetTimeSeries
                  historyPrice={{
                    slug,
                    timeRange,
                    interval:
                      timeRange === '1w' || timeRange === '1m' ? '1h' : '1d'
                  }}
                  render={({ historyPrice = {} }) => {
                    if (historyPrice.isLoading) {
                      return 'Loading...'
                    }
                    return (
                      <>
                        <MobileAssetChart
                          data={historyPrice.items}
                          slug={slug}
                          icoPrice={icoPrice}
                        />
                        <div className={styles.metrics}>
                          {activeAddressesInfo && (
                            <MobileMetricCard
                              {...activeAddressesInfo}
                              slug={slug}
                              onClick={console.log}
                            />
                          )}
                          {devActivityInfo && (
                            <MobileMetricCard
                              {...devActivityInfo}
                              slug={slug}
                              onClick={console.log}
                            />
                          )}
                          {transactionVolumeInfo && (
                            <MobileMetricCard
                              {...transactionVolumeInfo}
                              measure={ticker}
                            />
                          )}
                        </div>
                        <ShowIf beta>
                          {props.news && props.news.length > 0 && (
                            <>
                              <h3 className={styles.news__heading}>News</h3>
                              <NewsSmall data={props.news} />
                            </>
                          )}
                        </ShowIf>
                      </>
                    )
                  }}
                />
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

const Title = ({ slug, ticker }) => (
  <>
    {capitalizeStr(slug)}{' '}
    {ticker && <span className={styles.ticker}>({ticker.toUpperCase()})</span>}
  </>
)

const PriceBlock = ({ changes24h, changes7d, priceUsd }) => (
  <div>
    <div className={styles.priceUsd}>
      {priceUsd && formatNumber(priceUsd, { currency: 'USD' })}
    </div>
    <PercentChanges className={styles.changes} changes={changes24h} />
    <Label className={styles.label} accent='waterloo'>
      24h
    </Label>
    <PercentChanges className={styles.changes} changes={changes7d} />
    <Label className={styles.label} accent='waterloo'>
      7d
    </Label>
  </div>
)

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
  graphql(TRANSACTION_VOLUME_QUERY, {
    options: ({ match }) => {
      const to = new Date()
      const from = new Date()
      to.setUTCHours(to.getUTCHours() - 1, 0, 0, 0)
      from.setUTCHours(from.getUTCHours() - 48, 0, 0, 0)
      const { slug } = match.params
      return {
        variables: {
          slug,
          from: from.toISOString(),
          to: to.toISOString(),
          interval: '1h'
        }
      }
    },
    props: ({ data: { transactionVolume = [] } }) => ({ transactionVolume })
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
