import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { Button, Icon } from '@santiment-network/ui'
import GetHypedTrends from './../../components/Trends/GetHypedTrends'
import InsightsTrends from '../../components/Insight/InsightsTrends'
import Devider from '../../components/Navbar/DropdownDevider'
import TrendsSearch from '../../components/Trends/TrendsSearch'
import TotalSocialVolume from './TotalSocialVolume'
import TrendsTables from '../../components/Trends/TrendsTable/TrendsTables'
import styles from './LabsTrendsPage.module.scss'

const LabsTrendsPage = () => (
  <div className={styles.wrapper + ' page'}>
    <Helmet>
      <title>Today’s Top Social Gainers in Crypto - SANbase</title>
      <meta
        property='og:title'
        content='Today’s Top Social Gainers in Crypto - SANbase'
      />
      <meta
        property='og:description'
        content='Top 10 words with the biggest spike on crypto social media (compared to their previous 2-week average). These are the biggest developing stories in crypto.'
      />
    </Helmet>
    <div className={styles.header}>
      <h1 className={styles.title}>Trending Words</h1>
      <Button border as={Link} to='/insights/new?currentTrends'>
        <Icon className={styles.icon} type='plus-round' /> Write insight
      </Button>
    </div>
    <TrendsSearch />
    <TotalSocialVolume />
    <GetHypedTrends
      render={({ isLoading, items }) => (
        <TrendsTables trends={items} isLoading={isLoading} />
      )}
    />
    <Devider style={{ margin: '40px 0' }} />
    <InsightsTrends className={styles.insights} />
  </div>
)

export default LabsTrendsPage
