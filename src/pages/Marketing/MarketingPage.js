import React from 'react'
import cx from "classnames";
import ProMetricsFooter from "../ProMetrics/ProMetricsFooter/ProMetricsFooter";
import StoriesList from "../../components/Stories/StoriesList";
import WatchlistCards from "../../components/Watchlists/WatchlistCards";
import {CATEGORIES} from "../assets/assets-overview-constants";
import styles from './MarketingPage.module.scss'
import FeaturedInsightsGrid from "../../components/FeaturedInsights/FeaturedInsightsGrid";
import FundamentalReports from "./FundamentalReports/FundamentalReports";
import PublicTemplates from "./PublicTemplates/PublicTemplates";

const MarketingPage = () => {
  return <div className={cx('page', styles.container)}>

    <StoriesList classes={styles} showScrollBtns showShadows />

    <div className={styles.inner}>
      <div className={styles.block}>
        <div className={styles.subTitle}>Indices</div>
        <WatchlistCards watchlists={CATEGORIES}/>
      </div>

      <div className={styles.block}>
        <div className={styles.subTitle}>Explore Templates</div>

        <PublicTemplates/>
      </div>

      <div className={cx(styles.block, styles.insightsReports)}>

        <div>
          <div className={styles.subTitle}>Weekly Insights</div>
          <FeaturedInsightsGrid classes={styles} withAuthorPic limit={3} />
        </div>

        <div className={styles.reports}>
          <div className={styles.subTitle}>Fundamental Reports</div>

          <FundamentalReports />
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.subTitle}>Insights Signals Leaderboard</div>
        <iframe title='insights' className="airtable-embed"
                src="https://airtable.com/embed/shrCwTMKbFLiRn3Eq?backgroundColor=gray&viewControls=on" frameBorder="0"
                onmousewheel="" width="100%" height="533"
                style={{
                  background: "transparent",
                  border: "1px solid #ccc"
                }}></iframe>
      </div>
    </div>

    <ProMetricsFooter />
  </div>
}

export default MarketingPage
