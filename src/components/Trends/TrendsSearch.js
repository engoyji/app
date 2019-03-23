import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import styles from './TrendsSearch.module.scss'
import TrendsExploreSearch from './Explore/TrendsExploreSearch'

const SAMPLES = ['IEO OR IEOs OR launchpad']

const TrendsSearch = ({ topic }) => (
  <div className={styles.TrendsSearch}>
    <TrendsExploreSearch topic={topic} />
    <div className={styles.examples}>
      <span>Try searching for...</span>
      {SAMPLES.map((keyword, index, arr) => (
        <Fragment key={keyword}>
          <TrendsExampleLink keyword={keyword} />
          {index !== arr.length - 1 && ','}
        </Fragment>
      ))}
    </div>
  </div>
)

const TrendsExampleLink = ({ keyword }) => (
  <Link to={`/labs/trends/explore/${keyword}`}>
    &nbsp;
    {keyword}
  </Link>
)

export default TrendsSearch
